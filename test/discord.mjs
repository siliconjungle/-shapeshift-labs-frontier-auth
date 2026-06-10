import assert from 'node:assert';
import {
  FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT,
  FRONTIER_DISCORD_PROVIDER_ID,
  createDiscordAuthAdapter,
  createDiscordAuthProvider,
  createDiscordAvatarUrl
} from '../dist/discord.js';

const requests = [];
const fetch = async (url, init = {}) => {
  const body = new URLSearchParams(init.body || '');
  requests.push({ url, init, body });

  if (url.endsWith('/oauth2/token/revoke')) {
    assert.strictEqual(body.get('token_type_hint'), 'access_token');
    return jsonResponse({});
  }

  if (url.endsWith('/oauth2/token')) {
    if (body.get('grant_type') === 'refresh_token') {
      assert.strictEqual(body.get('refresh_token'), 'refresh-1');
      return jsonResponse({
        access_token: 'token-refreshed',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'refresh-2',
        scope: 'identify email'
      });
    }
    assert.strictEqual(body.get('grant_type'), 'authorization_code');
    assert.strictEqual(body.get('code'), 'code-1');
    assert.strictEqual(body.get('redirect_uri'), 'https://app.example/auth/discord/callback');
    return jsonResponse({
      access_token: 'token-1',
      token_type: 'Bearer',
      expires_in: 604800,
      refresh_token: 'refresh-1',
      scope: 'identify email'
    });
  }

  if (url.endsWith('/users/@me')) {
    assert.strictEqual(init.headers.Authorization, 'Bearer token-1');
    return jsonResponse({
      id: 'discord-1',
      username: 'jungle',
      global_name: 'Jungle',
      email: 'person@example.test',
      avatar: 'avatar-hash',
      verified: true
    });
  }

  throw new Error('unexpected fetch ' + url);
};

let linked = 0;
const adapter = createDiscordAuthAdapter({
  clientId: 'client-1',
  clientSecret: () => 'secret-1',
  redirectUri: 'https://app.example/auth/discord/callback',
  baseUrl: 'https://app.example',
  defaultReturnTo: '/home',
  errorRedirectTo: '/login',
  fetch,
  identityStore: {
    async findByProvider(provider, providerAccountId) {
      assert.strictEqual(provider, FRONTIER_DISCORD_PROVIDER_ID);
      assert.strictEqual(providerAccountId, 'discord-1');
      return {
        id: 'user-1',
        provider,
        providerAccountId,
        email: 'person@example.test',
        username: 'jungle',
        source: 'test'
      };
    },
    async findByEmail(email) {
      assert.strictEqual(email, 'person@example.test');
      return null;
    },
    async linkProvider() {
      linked++;
    }
  }
});

const provider = createDiscordAuthProvider({ scopes: ['identify', 'email', 'guilds'] });
assert.strictEqual(provider.id, FRONTIER_DISCORD_PROVIDER_ID);
assert.strictEqual(provider.kind, 'oauth');
assert.strictEqual(provider.authorizationEndpoint, FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT);
assert.strictEqual(provider.pkce, false);
assert.ok(provider.state);
assert.deepStrictEqual(provider.scopes, ['identify', 'email', 'guilds']);

const start = await adapter.start({
  state: 'state-1',
  returnTo: '/rooms/1',
  prompt: 'consent',
  metadata: { source: 'smoke' }
});
assert.strictEqual(start.redirect.status, 302);
assert.strictEqual(start.redirect.headers.Location, start.url);
assert.strictEqual(start.flow.state, 'state-1');
assert.strictEqual(start.flow.returnTo, '/rooms/1');
const authorizeUrl = new URL(start.url);
assert.strictEqual(authorizeUrl.origin + authorizeUrl.pathname, FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT);
assert.strictEqual(authorizeUrl.searchParams.get('response_type'), 'code');
assert.strictEqual(authorizeUrl.searchParams.get('client_id'), 'client-1');
assert.strictEqual(authorizeUrl.searchParams.get('redirect_uri'), 'https://app.example/auth/discord/callback');
assert.strictEqual(authorizeUrl.searchParams.get('scope'), 'identify email');
assert.strictEqual(authorizeUrl.searchParams.get('state'), 'state-1');
assert.strictEqual(authorizeUrl.searchParams.get('prompt'), 'consent');

const result = await adapter.handleCallback({
  url: 'https://app.example/auth/discord/callback?code=code-1&state=state-1',
  stateRecord: start.flow
});
assert.strictEqual(result.ok, true);
assert.strictEqual(result.reason, 'discord-callback-complete');
assert.strictEqual(result.providerIdentity.providerAccountId, 'discord-1');
assert.strictEqual(result.identityResolution.kind, 'provider-match');
assert.strictEqual(result.session.subject, 'user-1');
assert.strictEqual(result.session.provider, FRONTIER_DISCORD_PROVIDER_ID);
assert.strictEqual(result.session.providerAccountId, 'discord-1');
assert.strictEqual(result.session.username, 'jungle');
assert.strictEqual(result.tokenSummary.hasRefreshToken, true);
assert.strictEqual(result.redirect.url, 'https://app.example/rooms/1');
assert.strictEqual(result.redirect.allowed, true);
assert.strictEqual(linked, 0);

const tokenRequest = requests.find((request) => request.url.endsWith('/oauth2/token') && request.body.get('grant_type') === 'authorization_code');
assert.strictEqual(tokenRequest.init.headers.Authorization, 'Basic Y2xpZW50LTE6c2VjcmV0LTE=');
const userRequest = requests.find((request) => request.url.endsWith('/users/@me'));
assert.ok(userRequest);

const requestCountAfterSuccess = requests.length;
const mismatch = await adapter.handleCallback({
  url: 'https://app.example/auth/discord/callback?code=code-1&state=wrong',
  expectedState: 'state-1'
});
assert.strictEqual(mismatch.ok, false);
assert.strictEqual(mismatch.reason, 'discord-state-mismatch');
assert.strictEqual(requests.length, requestCountAfterSuccess);

const unsafe = await adapter.handleCallback({
  url: 'https://app.example/auth/discord/callback?code=code-1&state=state-1',
  stateRecord: { ...start.flow, returnTo: 'https://evil.example/steal' }
});
assert.strictEqual(unsafe.ok, true);
assert.strictEqual(unsafe.redirect.allowed, false);
assert.strictEqual(unsafe.redirect.reason, 'blocked-origin');
assert.strictEqual(unsafe.redirect.url, 'https://app.example/home');

let createdIdentities = 0;
const newIdentityAdapter = createDiscordAuthAdapter({
  clientId: 'client-1',
  redirectUri: 'https://app.example/auth/discord/callback',
  baseUrl: 'https://app.example',
  requireState: false,
  callbacks: {
    async createIdentity({ resolution }) {
      createdIdentities++;
      assert.strictEqual(resolution.kind, 'new-identity');
      return { id: 'created-1', source: 'test' };
    }
  }
});
const newIdentity = await newIdentityAdapter.handleCallback({
  params: { code: 'code-new' },
  tokens: {
    access_token: 'token-new',
    token_type: 'Bearer',
    scope: 'identify email'
  },
  user: {
    id: 'discord-new',
    username: 'newbie',
    email: 'new@example.test'
  }
});
assert.strictEqual(newIdentity.ok, true);
assert.strictEqual(newIdentity.identityResolution.kind, 'new-identity');
assert.strictEqual(newIdentity.session.subject, 'created-1');
assert.strictEqual(createdIdentities, 1);

const blockedAdapter = createDiscordAuthAdapter({
  clientId: 'client-1',
  redirectUri: 'https://app.example/auth/discord/callback',
  baseUrl: 'https://app.example',
  errorRedirectTo: '/login',
  requireState: false,
  linking: { reservedEmails: ['blocked@example.test'] },
  identityStore: {
    async findByProvider() {
      return null;
    },
    async findByEmail() {
      return {
        id: 'reserved-1',
        email: 'blocked@example.test',
        reserved: true,
        source: 'test'
      };
    }
  }
});
const blocked = await blockedAdapter.handleCallback({
  params: { code: 'code-blocked' },
  tokens: {
    access_token: 'token-blocked',
    token_type: 'Bearer',
    scope: 'identify email'
  },
  user: {
    id: 'discord-blocked',
    username: 'blocked',
    email: 'blocked@example.test'
  }
});
assert.strictEqual(blocked.ok, false);
assert.strictEqual(blocked.reason, 'blocked-reserved');
assert.strictEqual(blocked.identityResolution.kind, 'blocked-reserved');
assert.strictEqual(blocked.session, undefined);
assert.strictEqual(blocked.redirect.url, 'https://app.example/login');

const refreshed = await adapter.refreshToken({ refreshToken: 'refresh-1' });
assert.strictEqual(refreshed.access_token, 'token-refreshed');
await adapter.revokeToken({ token: 'token-1', tokenTypeHint: 'access_token' });

assert.strictEqual(
  createDiscordAvatarUrl({ id: 'discord-1', avatar: 'avatar-hash' }, { size: 256 }),
  'https://cdn.discordapp.com/avatars/discord-1/avatar-hash.png?size=256'
);

console.log('frontier-auth discord ok');

function jsonResponse(value) {
  return {
    ok: true,
    status: 200,
    async json() {
      return value;
    },
    async text() {
      return JSON.stringify(value);
    }
  };
}
