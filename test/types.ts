import {
  createAuthManifest,
  createAuthSession,
  evaluateAuthGate,
  type FrontierAuthManifest,
  type FrontierAuthSession,
  type FrontierAuthTokenPlan
} from '../src/index.ts';
import {
  createDiscordAuthAdapter,
  createDiscordAuthProvider,
  type FrontierDiscordAuthAdapter,
  type FrontierDiscordCallbackResult
} from '../src/discord.ts';

const manifest: FrontierAuthManifest = createAuthManifest({
  id: 'typed.auth',
  providers: [{ id: 'oidc', kind: 'oidc', issuer: 'https://issuer.example.test' }],
  gates: [{ id: 'admin', resource: '/admin', roles: ['admin'] }],
  tokenContracts: [{ id: 'session', audience: 'typed-api' }]
});

const session: FrontierAuthSession = createAuthSession({
  subject: 'user-1',
  role: 'admin',
  claims: { sub: 'user-1' }
});

const decision = evaluateAuthGate(manifest, session, 'admin');
const plan: FrontierAuthTokenPlan = {
  kind: 'frontier.auth.token.plan',
  version: 1,
  id: 'session.verify',
  operation: 'verify',
  contract: manifest.tokenContracts[0],
  claims: {},
  checks: [],
  sensitiveClaims: [],
  implementation: 'host-owned-crypto-adapter',
  metadata: {}
};

decision.allow satisfies boolean;
plan.contract.audience satisfies string;

const discordProvider = createDiscordAuthProvider({ scopes: ['identify', 'email'] });
discordProvider.id satisfies string | undefined;

const discordAdapter: FrontierDiscordAuthAdapter = createDiscordAuthAdapter({
  clientId: 'typed-client',
  redirectUri: 'https://app.example/auth/discord/callback',
  requireState: false,
  async fetch(url, init) {
    url satisfies string;
    init.method satisfies string | undefined;
    return {
      ok: true,
      status: 200,
      async json() {
        return {};
      }
    };
  }
});

const callbackResult: Promise<FrontierDiscordCallbackResult> = discordAdapter.handleCallback({
  params: { code: 'code-1' },
  tokens: { access_token: 'token-1', token_type: 'Bearer' },
  user: { id: 'discord-1', username: 'typed' }
});
callbackResult satisfies Promise<FrontierDiscordCallbackResult>;
