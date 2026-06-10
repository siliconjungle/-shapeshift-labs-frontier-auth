import assert from 'node:assert';
import {
  FRONTIER_AUTH_MANIFEST_KIND,
  createAuthAuditEvent,
  createAuthEvidence,
  createAuthLintResources,
  createAuthManifest,
  createAuthRegistryGraph,
  createAuthSession,
  createAuthTokenIssuePlan,
  createAuthTokenVerifyPlan,
  createRuntimeAuthGrant,
  evaluateAuthGate,
  isAuthSessionComplete,
  redactAuthRecord,
  resolveLinkedIdentity
} from '../dist/index.js';

const manifest = createAuthManifest({
  id: 'inkwell-like.auth',
  name: 'Inkwell-like auth contracts',
  package: '@example/app',
  providers: [
    { id: 'discord', kind: 'oauth', scopes: ['identify', 'email', 'guilds'], pkce: true, state: true },
    { id: 'ai-dev', kind: 'credentials', runtime: ['node'], tags: ['dev-only'] }
  ],
  profile: {
    fields: ['username'],
    access: ['granted_access'],
    legal: ['accepted_terms_of_use', 'accepted_privacy_policy']
  },
  linking: {
    allowEmailFallback: true,
    allowRelink: false,
    reservedUsernames: ['inkwell']
  },
  gates: [
    { id: 'api.strict', resource: '/api/*', required: true, profile: true },
    { id: 'admin.tools', resource: '/admin/tools', required: true, roles: ['admin'], access: ['admin_tools'] },
    { id: 'legal.setup', resource: '/api/legal', required: true, profile: false }
  ],
  capabilities: [
    { id: 'runtime.join-room', action: 'runtime.join-room', resource: 'room', gate: 'api.strict', effects: ['realtime.connect'] }
  ],
  tokenContracts: [
    {
      id: 'runtime-room',
      kind: 'inkwell-runtime-room',
      issuer: 'inkwell.app',
      audience: 'inkwell-runtime-room',
      requiredClaims: ['roomId', 'userId', 'kind'],
      expiresInSeconds: 900
    },
    {
      id: 'server-user',
      kind: 'server-user',
      issuer: 'inkwell.app',
      audience: 'inkwell-api',
      requiredClaims: ['sub', 'email'],
      expiresInSeconds: 900
    }
  ],
  runtimeGrants: [
    { id: 'room-presence', contract: 'runtime-room', resource: 'runtime-room', requiredClaims: ['roomId', 'userId', 'clientInstanceId'] }
  ]
});

assert.strictEqual(manifest.kind, FRONTIER_AUTH_MANIFEST_KIND);
assert.strictEqual(manifest.summary.providerCount, 2);
assert.strictEqual(manifest.session.strategy, 'jwt');
assert.ok(manifest.providers.find((provider) => provider.id === 'discord').pkce);
assert.ok(manifest.gates.some((gate) => gate.id === 'api.strict' && gate.profile));

const incomplete = createAuthSession({
  subject: 'user-1',
  provider: 'discord',
  providerAccountId: 'discord-1',
  email: 'person@example.test',
  access: { granted_access: true },
  legal: { accepted_terms_of_use: true }
}, manifest.profile);
assert.strictEqual(incomplete.profileComplete, false);
assert.strictEqual(isAuthSessionComplete(incomplete, manifest.profile), false);
assert.strictEqual(evaluateAuthGate(manifest, incomplete, 'api.strict').allow, false);

const complete = createAuthSession({
  subject: 'user-1',
  provider: 'discord',
  providerAccountId: 'discord-1',
  email: 'person@example.test',
  username: 'jungle',
  role: 'admin',
  access: { granted_access: true, admin_tools: true },
  legal: { accepted_terms_of_use: true, accepted_privacy_policy: true },
  claims: {
    sub: 'user-1',
    role: 'admin',
    granted_access: true
  }
}, manifest.profile);
assert.strictEqual(complete.profileComplete, true);
assert.strictEqual(evaluateAuthGate(manifest, complete, 'api.strict').allow, true);
assert.strictEqual(evaluateAuthGate(manifest, complete, 'admin.tools').allow, true);

const deniedAdmin = evaluateAuthGate(manifest, {
  subject: 'user-2',
  role: 'user',
  access: { granted_access: true },
  legal: { accepted_terms_of_use: true, accepted_privacy_policy: true },
  username: 'player'
}, 'admin.tools');
assert.strictEqual(deniedAdmin.allow, false);
assert.ok(deniedAdmin.missing.includes('role:admin'));

const linkBlocked = resolveLinkedIdentity({
  providerIdentity: { provider: 'discord', providerAccountId: 'new-discord', email: 'ai-dev@localhost', username: 'inkwell' },
  candidates: [{ id: 'dev-user', email: 'ai-dev@localhost', username: 'inkwell' }],
  policy: manifest.linking
});
assert.strictEqual(linkBlocked.kind, 'blocked-reserved');

const linkAllowed = resolveLinkedIdentity({
  providerIdentity: { provider: 'discord', providerAccountId: 'discord-1', email: 'person@example.test' },
  candidates: [{ id: 'email-user', email: 'person@example.test', username: 'person' }],
  policy: manifest.linking
});
assert.strictEqual(linkAllowed.kind, 'email-fallback');
assert.strictEqual(linkAllowed.attachProviderAccount, true);

const issuePlan = createAuthTokenIssuePlan({
  contract: manifest.tokenContracts.find((contract) => contract.id === 'runtime-room'),
  subject: 'user-1',
  claims: { roomId: 'room-1', userId: 'user-1', kind: 'inkwell-runtime-room', access_token: 'secret' }
});
assert.strictEqual(issuePlan.operation, 'issue');
assert.strictEqual(issuePlan.contract.audience, 'inkwell-runtime-room');
assert.strictEqual(issuePlan.claims.access_token, '[REDACTED]');
assert.ok(issuePlan.checks.includes('roomId'));

const verifyPlan = createAuthTokenVerifyPlan({
  contract: manifest.tokenContracts.find((contract) => contract.id === 'server-user'),
  tokenRef: 'Authorization: Bearer <token>'
});
assert.strictEqual(verifyPlan.operation, 'verify');
assert.ok(verifyPlan.checks.includes('signature'));

const grant = createRuntimeAuthGrant({ contract: 'runtime-room', resource: 'runtime-room', audience: 'inkwell-runtime-room' });
assert.strictEqual(grant.contract, 'runtime-room');

const registry = createAuthRegistryGraph(manifest);
assert.ok(registry.entries.some((entry) => entry.id === 'auth-gate:api.strict'));
assert.ok(registry.edges.some((edge) => edge.kind === 'protects'));

const lintResources = createAuthLintResources(manifest);
assert.ok(lintResources.some((resource) => resource.id === 'auth-token:runtime-room'));

const audit = createAuthAuditEvent({
  type: 'auth.gate',
  decision: evaluateAuthGate(manifest, complete, 'api.strict'),
  session: complete,
  claims: { access_token: 'secret', visible: true }
});
assert.strictEqual(audit.claims.access_token, '[REDACTED]');

const evidence = createAuthEvidence({ manifest, decisions: [evaluateAuthGate(manifest, complete, 'api.strict')], audit: [audit] });
assert.strictEqual(evidence.kind, 'frontier.auth.evidence');
assert.strictEqual(evidence.registry.summary.entries, registry.summary.entries);

const redacted = redactAuthRecord({ nested: { password: 'secret' }, ok: true });
assert.strictEqual(redacted.nested.password, '[REDACTED]');

console.log('frontier-auth smoke ok');
