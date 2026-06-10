import assert from 'node:assert';
import {
  createAuthManifest,
  createAuthSession,
  evaluateAuthGate,
  resolveLinkedIdentity
} from '../dist/index.js';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}
const cases = Number(args.get('--cases') ?? 500);

let seed = 0x9e3779b9;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}

function pick(values) {
  return values[Math.floor(random() * values.length)];
}

for (let index = 0; index < cases; index++) {
  const required = random() > 0.25;
  const requiresAdmin = random() > 0.65;
  const requiresProfile = random() > 0.45;
  const hasAccess = random() > 0.3;
  const hasLegal = random() > 0.3;
  const hasUsername = random() > 0.3;
  const role = pick(['user', 'admin', 'demigod']);
  const provider = pick(['oauth', 'oidc', 'credentials']);
  const manifest = createAuthManifest({
    id: 'fuzz-' + index,
    providers: [{ id: provider, kind: provider }],
    profile: {
      fields: ['username'],
      access: ['granted_access'],
      legal: ['accepted_terms_of_use', 'accepted_privacy_policy']
    },
    gates: [{
      id: 'gate',
      resource: '/resource/' + index,
      required,
      profile: requiresProfile,
      roles: requiresAdmin ? ['admin'] : []
    }]
  });
  const session = createAuthSession({
    subject: random() > 0.1 ? 'user-' + index : '',
    provider,
    username: hasUsername ? 'user' + index : '',
    role,
    access: { granted_access: hasAccess },
    legal: { accepted_terms_of_use: hasLegal, accepted_privacy_policy: hasLegal },
    claims: { role }
  }, manifest.profile);
  const first = evaluateAuthGate(manifest, session, 'gate');
  const second = evaluateAuthGate(manifest, session, 'gate');
  assert.deepStrictEqual(first, second, 'gate decisions should be deterministic');
  if (!required) assert.strictEqual(first.allow, true);
  if (requiresAdmin && role !== 'admin' && required) assert.strictEqual(first.allow, false);
  if (requiresProfile && (!hasAccess || !hasLegal || !hasUsername) && required) assert.strictEqual(first.allow, false);

  const resolution = resolveLinkedIdentity({
    providerIdentity: {
      provider,
      providerAccountId: 'provider-' + index,
      email: random() > 0.2 ? 'user' + index + '@example.test' : ''
    },
    candidates: [
      {
        id: 'candidate-' + index,
        email: random() > 0.5 ? 'user' + index + '@example.test' : 'other@example.test',
        username: random() > 0.9 ? 'reserved' : 'plain',
        linkedProviderAccountId: random() > 0.7 ? 'different-provider' : ''
      }
    ],
    policy: {
      reservedUsernames: ['reserved'],
      allowRelink: false
    }
  });
  assert.ok(['provider-match', 'email-fallback', 'new-identity', 'blocked-reserved', 'blocked-relink', 'unresolved'].includes(resolution.kind));
}

console.log('frontier-auth fuzz ok', cases);
