import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  createAuthEvidence,
  createAuthManifest,
  createAuthSession,
  evaluateAuthGate
} from '../dist/index.js';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}
const out = args.get('--out');
const runs = Number(args.get('--runs') ?? 4000);

const manifest = createAuthManifest({
  id: 'bench.auth',
  providers: [
    { id: 'oauth', kind: 'oauth', scopes: ['openid', 'email', 'profile'] },
    { id: 'passkey', kind: 'webauthn' }
  ],
  profile: {
    fields: ['username'],
    access: ['granted_access'],
    legal: ['accepted_terms_of_use', 'accepted_privacy_policy']
  },
  gates: [
    { id: 'api', resource: '/api/*', profile: true },
    { id: 'admin', resource: '/admin', roles: ['admin'], access: ['admin_tools'] }
  ],
  tokenContracts: [
    { id: 'runtime', kind: 'runtime-room', audience: 'runtime', requiredClaims: ['roomId', 'userId'] }
  ]
});
const session = createAuthSession({
  subject: 'user-1',
  username: 'jungle',
  role: 'admin',
  access: { granted_access: true, admin_tools: true },
  legal: { accepted_terms_of_use: true, accepted_privacy_policy: true }
}, manifest.profile);

const start = performance.now();
let allowed = 0;
for (let index = 0; index < runs; index++) {
  if (evaluateAuthGate(manifest, session, index % 2 === 0 ? 'api' : 'admin').allow) allowed++;
}
const decisionsMs = performance.now() - start;

const evidenceStart = performance.now();
const evidence = createAuthEvidence({ manifest });
const evidenceMs = performance.now() - evidenceStart;

const payload = {
  name: 'frontier-auth-package-bench',
  generatedAt: new Date().toISOString(),
  runs,
  allowed,
  metrics: {
    decisionOpsPerSecond: Math.round((runs / decisionsMs) * 1000),
    decisionMs: decisionsMs,
    evidenceMs,
    evidenceEntries: evidence.registry.summary.entries
  }
};

if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
}

console.log(JSON.stringify(payload, null, 2));
