import type { JsonObject } from '@shapeshift-labs/frontier';
import {
  createAuthSession,
  resolveLinkedIdentity,
  type FrontierAuthIdentityCandidate,
  type FrontierAuthIdentityCandidateInput,
  type FrontierAuthIdentityResolution,
  type FrontierAuthIdentityStoreAdapter,
  type FrontierAuthLinkingPolicyInput,
  type FrontierAuthMaybePromise,
  type FrontierAuthProviderInput,
  type FrontierAuthSession,
  type FrontierAuthSessionInput
} from './index.ts';

export const FRONTIER_DISCORD_AUTH_ADAPTER_KIND = 'frontier.auth.discord.adapter';
export const FRONTIER_DISCORD_AUTH_ADAPTER_VERSION = 1;
export const FRONTIER_DISCORD_STATE_KIND = 'frontier.auth.discord.state';
export const FRONTIER_DISCORD_CALLBACK_KIND = 'frontier.auth.discord.callback';
export const FRONTIER_DISCORD_PROVIDER_ID = 'discord';
export const FRONTIER_DISCORD_ISSUER = 'https://discord.com';
export const FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT = 'https://discord.com/oauth2/authorize';
export const FRONTIER_DISCORD_TOKEN_ENDPOINT = 'https://discord.com/api/oauth2/token';
export const FRONTIER_DISCORD_TOKEN_REVOCATION_ENDPOINT = 'https://discord.com/api/oauth2/token/revoke';
export const FRONTIER_DISCORD_USER_ENDPOINT = 'https://discord.com/api/users/@me';

export type FrontierDiscordTokenTypeHint = 'access_token' | 'refresh_token' | string;
export type FrontierDiscordClientAuthentication = 'basic' | 'body' | 'none';
export type FrontierDiscordPrompt = 'consent' | 'none' | string;
export type FrontierDiscordMaybePromise<T> = FrontierAuthMaybePromise<T>;

export interface FrontierDiscordHttpRedirect {
  status: number;
  url: string;
  headers: Record<string, string>;
}

export interface FrontierDiscordRedirectDecision extends FrontierDiscordHttpRedirect {
  allowed: boolean;
  reason: string;
}

export interface FrontierDiscordFetchInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface FrontierDiscordFetchResponse {
  ok: boolean;
  status: number;
  json(): FrontierDiscordMaybePromise<unknown>;
  text?(): FrontierDiscordMaybePromise<string>;
}

export type FrontierDiscordFetch = (
  url: string,
  init: FrontierDiscordFetchInit
) => FrontierDiscordMaybePromise<FrontierDiscordFetchResponse>;

export interface FrontierDiscordAuthProviderInput extends Omit<FrontierAuthProviderInput, 'id' | 'kind'> {
  id?: string;
}

export interface FrontierDiscordUser {
  id: string;
  username?: string;
  discriminator?: string;
  global_name?: string | null;
  avatar?: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  [key: string]: unknown;
}

export interface FrontierDiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  [key: string]: unknown;
}

export interface FrontierDiscordTokenSummary {
  tokenType: string;
  expiresIn?: number;
  scope: string[];
  hasRefreshToken: boolean;
}

export interface FrontierDiscordAuthStateRecord {
  kind: typeof FRONTIER_DISCORD_STATE_KIND;
  version: typeof FRONTIER_DISCORD_AUTH_ADAPTER_VERSION;
  provider: typeof FRONTIER_DISCORD_PROVIDER_ID | string;
  state: string;
  redirectUri: string;
  returnTo?: string;
  codeVerifier?: string;
  createdAt?: string;
  expiresAt?: string;
  metadata: JsonObject;
}

export interface FrontierDiscordAuthorizationInput {
  redirectUri?: string;
  returnTo?: string;
  state?: string;
  codeVerifier?: string;
  scopes?: readonly string[];
  prompt?: FrontierDiscordPrompt;
  guildId?: string;
  disableGuildSelect?: boolean;
  integrationType?: number | string;
  permissions?: string | number;
  pkce?: boolean;
  metadata?: unknown;
}

export interface FrontierDiscordAuthorizationPlan {
  kind: 'frontier.auth.discord.authorization';
  provider: FrontierAuthProviderInput;
  url: string;
  redirect: FrontierDiscordHttpRedirect;
  flow: FrontierDiscordAuthStateRecord;
  scopes: string[];
  prompt?: string;
  pkce: boolean;
  metadata: JsonObject;
}

export interface FrontierDiscordCallbackParameters {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

export interface FrontierDiscordCallbackInput {
  url?: string | URL;
  params?: URLSearchParams | Record<string, string | undefined | null>;
  request?: unknown;
  redirectUri?: string;
  returnTo?: string;
  expectedState?: string;
  stateRecord?: FrontierDiscordAuthStateRecord | null;
  codeVerifier?: string;
  tokens?: FrontierDiscordTokenResponse;
  user?: FrontierDiscordUser;
  metadata?: unknown;
}

export interface FrontierDiscordTokenExchangeInput {
  code: string;
  redirectUri: string;
  codeVerifier?: string;
  metadata?: unknown;
}

export interface FrontierDiscordRefreshInput {
  refreshToken: string;
  scopes?: readonly string[];
  metadata?: unknown;
}

export interface FrontierDiscordRevokeInput {
  token: string;
  tokenTypeHint?: FrontierDiscordTokenTypeHint;
  metadata?: unknown;
}

export interface FrontierDiscordUserInput {
  accessToken: string;
  tokenType?: string;
  metadata?: unknown;
}

export interface FrontierDiscordStateVerification {
  ok: boolean;
  reason?: string;
  metadata?: unknown;
}

export interface FrontierDiscordStateContext {
  adapter: FrontierDiscordAuthAdapter;
  input?: FrontierDiscordAuthorizationInput;
}

export interface FrontierDiscordStateStoreContext {
  adapter: FrontierDiscordAuthAdapter;
  flow: FrontierDiscordAuthStateRecord;
  input?: FrontierDiscordAuthorizationInput;
}

export interface FrontierDiscordStateLoadContext {
  adapter: FrontierDiscordAuthAdapter;
  state: string;
  input: FrontierDiscordCallbackInput;
}

export interface FrontierDiscordStateVerifyContext extends FrontierDiscordStateLoadContext {
  flow?: FrontierDiscordAuthStateRecord | null;
}

export interface FrontierDiscordTokenExchangeContext {
  adapter: FrontierDiscordAuthAdapter;
  input: FrontierDiscordTokenExchangeInput;
}

export interface FrontierDiscordRefreshContext {
  adapter: FrontierDiscordAuthAdapter;
  input: FrontierDiscordRefreshInput;
}

export interface FrontierDiscordRevokeContext {
  adapter: FrontierDiscordAuthAdapter;
  input: FrontierDiscordRevokeInput;
}

export interface FrontierDiscordUserContext {
  adapter: FrontierDiscordAuthAdapter;
  input: FrontierDiscordUserInput;
  tokens?: FrontierDiscordTokenResponse;
}

export interface FrontierDiscordIdentityCreateContext {
  adapter: FrontierDiscordAuthAdapter;
  providerIdentity: FrontierAuthIdentityCandidateInput;
  user: FrontierDiscordUser;
  tokens: FrontierDiscordTokenResponse;
  resolution: FrontierAuthIdentityResolution;
}

export interface FrontierDiscordSessionContext {
  adapter: FrontierDiscordAuthAdapter;
  providerIdentity: FrontierAuthIdentityCandidateInput;
  selectedIdentity?: FrontierAuthIdentityCandidateInput | FrontierAuthIdentityCandidate;
  resolution: FrontierAuthIdentityResolution;
  user: FrontierDiscordUser;
  tokens: FrontierDiscordTokenResponse;
  tokenSummary: FrontierDiscordTokenSummary;
  input: FrontierDiscordCallbackInput;
}

export interface FrontierDiscordCallbackResult {
  kind: typeof FRONTIER_DISCORD_CALLBACK_KIND;
  version: typeof FRONTIER_DISCORD_AUTH_ADAPTER_VERSION;
  ok: boolean;
  provider: typeof FRONTIER_DISCORD_PROVIDER_ID | string;
  code?: string;
  state?: string;
  error?: string;
  reason: string;
  redirect: FrontierDiscordRedirectDecision;
  tokens?: FrontierDiscordTokenResponse;
  tokenSummary?: FrontierDiscordTokenSummary;
  user?: FrontierDiscordUser;
  providerIdentity?: FrontierAuthIdentityCandidateInput;
  identityResolution?: FrontierAuthIdentityResolution;
  session?: FrontierAuthSession;
  metadata: JsonObject;
}

export interface FrontierDiscordAuthCallbacks {
  createState?(context: FrontierDiscordStateContext): FrontierDiscordMaybePromise<string>;
  createCodeVerifier?(context: FrontierDiscordStateContext): FrontierDiscordMaybePromise<string>;
  saveState?(context: FrontierDiscordStateStoreContext): FrontierDiscordMaybePromise<void>;
  loadState?(context: FrontierDiscordStateLoadContext): FrontierDiscordMaybePromise<FrontierDiscordAuthStateRecord | null | undefined>;
  verifyState?(context: FrontierDiscordStateVerifyContext): FrontierDiscordMaybePromise<boolean | FrontierDiscordStateVerification>;
  deleteState?(context: FrontierDiscordStateLoadContext): FrontierDiscordMaybePromise<void>;
  exchangeCode?(context: FrontierDiscordTokenExchangeContext): FrontierDiscordMaybePromise<FrontierDiscordTokenResponse>;
  refreshToken?(context: FrontierDiscordRefreshContext): FrontierDiscordMaybePromise<FrontierDiscordTokenResponse>;
  revokeToken?(context: FrontierDiscordRevokeContext): FrontierDiscordMaybePromise<void>;
  fetchUser?(context: FrontierDiscordUserContext): FrontierDiscordMaybePromise<FrontierDiscordUser>;
  createIdentity?(context: FrontierDiscordIdentityCreateContext): FrontierDiscordMaybePromise<FrontierAuthIdentityCandidateInput | null | undefined>;
  createSession?(context: FrontierDiscordSessionContext): FrontierDiscordMaybePromise<FrontierAuthSessionInput | FrontierAuthSession | null | undefined>;
  resolveRedirect?(context: { adapter: FrontierDiscordAuthAdapter; url?: string; input?: FrontierDiscordCallbackInput; ok: boolean }): FrontierDiscordMaybePromise<string | undefined | null>;
  onSuccess?(result: FrontierDiscordCallbackResult): FrontierDiscordMaybePromise<void>;
  onError?(result: FrontierDiscordCallbackResult): FrontierDiscordMaybePromise<void>;
}

export interface FrontierDiscordAuthAdapterConfig {
  clientId: string;
  clientSecret?: string | (() => FrontierDiscordMaybePromise<string | undefined | null>);
  clientAuthentication?: FrontierDiscordClientAuthentication;
  redirectUri?: string;
  baseUrl?: string;
  defaultReturnTo?: string;
  errorRedirectTo?: string;
  allowedRedirectOrigins?: readonly string[];
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  tokenRevocationEndpoint?: string;
  userEndpoint?: string;
  provider?: FrontierDiscordAuthProviderInput;
  scopes?: readonly string[];
  prompt?: FrontierDiscordPrompt;
  pkce?: boolean;
  stateTtlSeconds?: number;
  requireState?: boolean;
  fetch?: FrontierDiscordFetch;
  identityStore?: FrontierAuthIdentityStoreAdapter;
  linking?: FrontierAuthLinkingPolicyInput;
  callbacks?: FrontierDiscordAuthCallbacks;
  metadata?: unknown;
}

export interface FrontierDiscordAuthAdapter {
  kind: typeof FRONTIER_DISCORD_AUTH_ADAPTER_KIND;
  version: typeof FRONTIER_DISCORD_AUTH_ADAPTER_VERSION;
  provider: FrontierAuthProviderInput;
  config: FrontierDiscordAuthAdapterConfig;
  createAuthorizationUrl(input?: FrontierDiscordAuthorizationInput): Promise<FrontierDiscordAuthorizationPlan>;
  start(input?: FrontierDiscordAuthorizationInput): Promise<FrontierDiscordAuthorizationPlan>;
  handleCallback(input: FrontierDiscordCallbackInput): Promise<FrontierDiscordCallbackResult>;
  exchangeCode(input: FrontierDiscordTokenExchangeInput): Promise<FrontierDiscordTokenResponse>;
  refreshToken(input: FrontierDiscordRefreshInput): Promise<FrontierDiscordTokenResponse>;
  revokeToken(input: FrontierDiscordRevokeInput): Promise<void>;
  fetchUser(input: FrontierDiscordUserInput): Promise<FrontierDiscordUser>;
  resolveRedirect(url: string | undefined, ok?: boolean): FrontierDiscordRedirectDecision;
}

export class FrontierDiscordAuthError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;

  constructor(code: string, message: string, options: { status?: number; details?: unknown } = {}) {
    super(message);
    this.name = 'FrontierDiscordAuthError';
    this.code = code;
    this.status = options.status;
    this.details = options.details;
  }
}

export function createDiscordAuthProvider(input: FrontierDiscordAuthProviderInput = {}): FrontierAuthProviderInput {
  return {
    ...input,
    id: normalizeString(input.id) || FRONTIER_DISCORD_PROVIDER_ID,
    kind: 'oauth',
    issuer: normalizeString(input.issuer) || FRONTIER_DISCORD_ISSUER,
    authorizationEndpoint: normalizeString(input.authorizationEndpoint) || FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT,
    tokenEndpoint: normalizeString(input.tokenEndpoint) || FRONTIER_DISCORD_TOKEN_ENDPOINT,
    scopes: uniqueStrings(input.scopes ?? ['identify', 'email']),
    pkce: input.pkce ?? false,
    state: input.state ?? true,
    nonce: input.nonce ?? false,
    claims: uniqueStrings(input.claims ?? ['sub', 'email', 'username', 'name', 'picture']),
    tags: uniqueStrings(['discord', ...(input.tags ?? [])]),
    metadata: toJsonObject(input.metadata)
  };
}

export function createDiscordAuthAdapter(config: FrontierDiscordAuthAdapterConfig): FrontierDiscordAuthAdapter {
  if (!normalizeString(config.clientId)) throw new FrontierDiscordAuthError('discord-client-id-required', 'Discord clientId is required.');
  const provider = createDiscordAuthProvider({
    ...config.provider,
    scopes: config.scopes ?? config.provider?.scopes,
    authorizationEndpoint: config.authorizationEndpoint ?? config.provider?.authorizationEndpoint,
    tokenEndpoint: config.tokenEndpoint ?? config.provider?.tokenEndpoint,
    pkce: config.pkce ?? config.provider?.pkce
  });
  let adapter: FrontierDiscordAuthAdapter;
  adapter = {
    kind: FRONTIER_DISCORD_AUTH_ADAPTER_KIND,
    version: FRONTIER_DISCORD_AUTH_ADAPTER_VERSION,
    provider,
    config,
    createAuthorizationUrl(input?: FrontierDiscordAuthorizationInput): Promise<FrontierDiscordAuthorizationPlan> {
      return createAuthorizationUrl(adapter, input ?? {});
    },
    start(input?: FrontierDiscordAuthorizationInput): Promise<FrontierDiscordAuthorizationPlan> {
      return createAuthorizationUrl(adapter, input ?? {});
    },
    handleCallback(input: FrontierDiscordCallbackInput): Promise<FrontierDiscordCallbackResult> {
      return handleCallback(adapter, input);
    },
    exchangeCode(input: FrontierDiscordTokenExchangeInput): Promise<FrontierDiscordTokenResponse> {
      return exchangeCode(adapter, input);
    },
    refreshToken(input: FrontierDiscordRefreshInput): Promise<FrontierDiscordTokenResponse> {
      return refreshToken(adapter, input);
    },
    revokeToken(input: FrontierDiscordRevokeInput): Promise<void> {
      return revokeToken(adapter, input);
    },
    fetchUser(input: FrontierDiscordUserInput): Promise<FrontierDiscordUser> {
      return fetchUser(adapter, input);
    },
    resolveRedirect(url: string | undefined, ok = true): FrontierDiscordRedirectDecision {
      return resolveFinalRedirect(adapter, url, ok);
    }
  };
  return adapter;
}

export function createDiscordRedirect(url: string, status = 302): FrontierDiscordHttpRedirect {
  return {
    status,
    url,
    headers: { Location: url }
  };
}

export function summarizeDiscordToken(tokens: FrontierDiscordTokenResponse): FrontierDiscordTokenSummary {
  return {
    tokenType: normalizeString(tokens.token_type) || 'Bearer',
    expiresIn: typeof tokens.expires_in === 'number' ? tokens.expires_in : undefined,
    scope: splitScopes(tokens.scope),
    hasRefreshToken: Boolean(normalizeString(tokens.refresh_token))
  };
}

export function createDiscordProviderIdentity(user: FrontierDiscordUser): FrontierAuthIdentityCandidateInput {
  const providerAccountId = normalizeString(user.id);
  if (!providerAccountId) throw new FrontierDiscordAuthError('discord-user-id-missing', 'Discord user id is missing.');
  return {
    provider: FRONTIER_DISCORD_PROVIDER_ID,
    providerAccountId,
    email: normalizeOptionalString(user.email),
    username: normalizeOptionalString(user.global_name) ?? normalizeOptionalString(user.username),
    source: FRONTIER_DISCORD_PROVIDER_ID,
    metadata: {
      discord: sanitizeDiscordUser(user)
    }
  };
}

export function createDiscordAvatarUrl(user: Pick<FrontierDiscordUser, 'id' | 'avatar'>, options: { size?: number; extension?: 'png' | 'jpg' | 'webp' | 'gif' | string } = {}): string | undefined {
  const id = normalizeString(user.id);
  const avatar = normalizeString(user.avatar);
  if (!id || !avatar) return undefined;
  const size = normalizePositiveInteger(options.size, 128);
  const extension = normalizeString(options.extension) || (avatar.startsWith('a_') ? 'gif' : 'png');
  return 'https://cdn.discordapp.com/avatars/' + encodeURIComponent(id) + '/' + encodeURIComponent(avatar) + '.' + encodeURIComponent(extension) + '?size=' + size;
}

async function createAuthorizationUrl(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordAuthorizationInput): Promise<FrontierDiscordAuthorizationPlan> {
  const redirectUri = normalizeString(input.redirectUri) || normalizeString(adapter.config.redirectUri);
  if (!redirectUri) throw new FrontierDiscordAuthError('discord-redirect-uri-required', 'Discord redirectUri is required.');
  const scopes = uniqueStrings(input.scopes ?? adapter.provider.scopes ?? ['identify', 'email']);
  const state = normalizeString(input.state)
    || normalizeString(await adapter.config.callbacks?.createState?.({ adapter, input }))
    || randomToken();
  const pkce = input.pkce ?? adapter.config.pkce ?? adapter.provider.pkce === true;
  const codeVerifier = normalizeOptionalString(input.codeVerifier)
    ?? (pkce ? normalizeString(await adapter.config.callbacks?.createCodeVerifier?.({ adapter, input })) || randomCodeVerifier() : undefined);
  const params = new URLSearchParams();
  params.set('response_type', 'code');
  params.set('client_id', adapter.config.clientId);
  params.set('redirect_uri', redirectUri);
  params.set('scope', scopes.join(' '));
  if (state) params.set('state', state);
  const prompt = normalizeOptionalString(input.prompt) ?? normalizeOptionalString(adapter.config.prompt);
  if (prompt) params.set('prompt', prompt);
  if (input.guildId !== undefined) params.set('guild_id', String(input.guildId));
  if (input.disableGuildSelect !== undefined) params.set('disable_guild_select', input.disableGuildSelect ? 'true' : 'false');
  if (input.integrationType !== undefined) params.set('integration_type', String(input.integrationType));
  if (input.permissions !== undefined) params.set('permissions', String(input.permissions));
  if (pkce && codeVerifier) {
    params.set('code_challenge', await codeChallengeS256(codeVerifier));
    params.set('code_challenge_method', 'S256');
  }
  const url = (normalizeString(adapter.config.authorizationEndpoint) || FRONTIER_DISCORD_AUTHORIZATION_ENDPOINT) + '?' + params.toString();
  const now = new Date();
  const flow: FrontierDiscordAuthStateRecord = {
    kind: FRONTIER_DISCORD_STATE_KIND,
    version: FRONTIER_DISCORD_AUTH_ADAPTER_VERSION,
    provider: adapter.provider.id ?? FRONTIER_DISCORD_PROVIDER_ID,
    state,
    redirectUri,
    returnTo: normalizeOptionalString(input.returnTo),
    codeVerifier,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + normalizePositiveInteger(adapter.config.stateTtlSeconds, 600) * 1000).toISOString(),
    metadata: toJsonObject(input.metadata)
  };
  await adapter.config.callbacks?.saveState?.({ adapter, flow, input });
  return {
    kind: 'frontier.auth.discord.authorization',
    provider: adapter.provider,
    url,
    redirect: createDiscordRedirect(url),
    flow,
    scopes,
    prompt,
    pkce,
    metadata: toJsonObject(input.metadata)
  };
}

async function handleCallback(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordCallbackInput): Promise<FrontierDiscordCallbackResult> {
  const params = parseCallbackParameters(input);
  try {
    if (params.error) {
      return await failCallback(adapter, input, params, 'discord-callback-error', params.errorDescription || params.error);
    }
    if (!params.code) {
      return await failCallback(adapter, input, params, 'discord-code-missing', 'Discord callback did not include an authorization code.');
    }
    const stateResult = await verifyCallbackState(adapter, input, params);
    if (!stateResult.ok) {
      return await failCallback(adapter, input, params, stateResult.reason || 'discord-state-invalid', 'Discord callback state could not be verified.');
    }
    const flow = stateResult.flow;
    const redirectUri = normalizeString(input.redirectUri) || normalizeString(flow?.redirectUri) || normalizeString(adapter.config.redirectUri);
    if (!redirectUri) {
      return await failCallback(adapter, input, params, 'discord-redirect-uri-required', 'Discord callback needs the same redirectUri used to start the flow.');
    }
    const tokens = input.tokens ?? await adapter.exchangeCode({
      code: params.code,
      redirectUri,
      codeVerifier: normalizeOptionalString(input.codeVerifier) ?? flow?.codeVerifier,
      metadata: input.metadata
    });
    const user = input.user ?? await adapter.fetchUser({
      accessToken: tokens.access_token,
      tokenType: tokens.token_type,
      metadata: input.metadata
    });
    const providerIdentity = createDiscordProviderIdentity(user);
    const resolution = await resolveIdentity(adapter, providerIdentity, user, tokens);
    if (isBlockedIdentityResolution(resolution)) {
      return await failCallback(
        adapter,
        input,
        params,
        resolution.kind,
        'Discord identity could not be resolved for this sign-in.',
        undefined,
        {
          tokens,
          tokenSummary: summarizeDiscordToken(tokens),
          user,
          providerIdentity,
          identityResolution: resolution
        }
      );
    }
    const selectedIdentity = await applyIdentityResolution(adapter, providerIdentity, user, tokens, resolution);
    const tokenSummary = summarizeDiscordToken(tokens);
    const sessionInput = await adapter.config.callbacks?.createSession?.({
      adapter,
      providerIdentity,
      selectedIdentity,
      resolution,
      user,
      tokens,
      tokenSummary,
      input
    });
    const session = createSession(sessionInput, providerIdentity, selectedIdentity, user, tokenSummary);
    const redirectUrl = normalizeOptionalString(await adapter.config.callbacks?.resolveRedirect?.({ adapter, url: input.returnTo ?? flow?.returnTo, input, ok: true }))
      ?? input.returnTo
      ?? flow?.returnTo
      ?? adapter.config.defaultReturnTo
      ?? '/';
    const result: FrontierDiscordCallbackResult = {
      kind: FRONTIER_DISCORD_CALLBACK_KIND,
      version: FRONTIER_DISCORD_AUTH_ADAPTER_VERSION,
      ok: true,
      provider: adapter.provider.id ?? FRONTIER_DISCORD_PROVIDER_ID,
      code: params.code,
      state: params.state,
      reason: 'discord-callback-complete',
      redirect: resolveFinalRedirect(adapter, redirectUrl, true),
      tokens,
      tokenSummary,
      user,
      providerIdentity,
      identityResolution: resolution,
      session,
      metadata: toJsonObject(input.metadata)
    };
    if (params.state) await adapter.config.callbacks?.deleteState?.({ adapter, state: params.state, input });
    await adapter.config.callbacks?.onSuccess?.(result);
    return result;
  } catch (error) {
    return await failCallback(adapter, input, params, errorCode(error), errorMessage(error), error);
  }
}

async function exchangeCode(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordTokenExchangeInput): Promise<FrontierDiscordTokenResponse> {
  const override = await adapter.config.callbacks?.exchangeCode?.({ adapter, input });
  if (override) return normalizeTokenResponse(override);
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', input.code);
  body.set('redirect_uri', input.redirectUri);
  if (input.codeVerifier) body.set('code_verifier', input.codeVerifier);
  await applyClientAuthentication(adapter, body);
  const token = await postForm(adapter, normalizeString(adapter.config.tokenEndpoint) || FRONTIER_DISCORD_TOKEN_ENDPOINT, body);
  return normalizeTokenResponse(token);
}

async function refreshToken(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordRefreshInput): Promise<FrontierDiscordTokenResponse> {
  const override = await adapter.config.callbacks?.refreshToken?.({ adapter, input });
  if (override) return normalizeTokenResponse(override);
  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', input.refreshToken);
  if (input.scopes && input.scopes.length > 0) body.set('scope', uniqueStrings(input.scopes).join(' '));
  await applyClientAuthentication(adapter, body);
  const token = await postForm(adapter, normalizeString(adapter.config.tokenEndpoint) || FRONTIER_DISCORD_TOKEN_ENDPOINT, body);
  return normalizeTokenResponse(token);
}

async function revokeToken(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordRevokeInput): Promise<void> {
  const override = await adapter.config.callbacks?.revokeToken?.({ adapter, input });
  if (override !== undefined) return;
  const body = new URLSearchParams();
  body.set('token', input.token);
  if (input.tokenTypeHint) body.set('token_type_hint', input.tokenTypeHint);
  await applyClientAuthentication(adapter, body);
  await postForm(adapter, normalizeString(adapter.config.tokenRevocationEndpoint) || FRONTIER_DISCORD_TOKEN_REVOCATION_ENDPOINT, body, false);
}

async function fetchUser(adapter: FrontierDiscordAuthAdapter, input: FrontierDiscordUserInput): Promise<FrontierDiscordUser> {
  const override = await adapter.config.callbacks?.fetchUser?.({ adapter, input });
  if (override) return normalizeDiscordUser(override);
  const tokenType = normalizeString(input.tokenType) || 'Bearer';
  const payload = await fetchJson(adapter, normalizeString(adapter.config.userEndpoint) || FRONTIER_DISCORD_USER_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: tokenType + ' ' + input.accessToken,
      Accept: 'application/json'
    }
  });
  return normalizeDiscordUser(payload);
}

async function resolveIdentity(
  adapter: FrontierDiscordAuthAdapter,
  providerIdentity: FrontierAuthIdentityCandidateInput,
  _user: FrontierDiscordUser,
  _tokens: FrontierDiscordTokenResponse
): Promise<FrontierAuthIdentityResolution> {
  const candidates: FrontierAuthIdentityCandidateInput[] = [];
  const providerAccountId = normalizeString(providerIdentity.providerAccountId);
  if (adapter.config.identityStore?.findByProvider && providerAccountId) {
    const found = await adapter.config.identityStore.findByProvider(FRONTIER_DISCORD_PROVIDER_ID, providerAccountId);
    if (found) candidates.push(found);
  }
  const email = normalizeOptionalString(providerIdentity.email);
  if (adapter.config.identityStore?.findByEmail && email) {
    const found = await adapter.config.identityStore.findByEmail(email);
    if (found) candidates.push(found);
  }
  return resolveLinkedIdentity({
    providerIdentity,
    candidates,
    policy: adapter.config.linking
  });
}

async function applyIdentityResolution(
  adapter: FrontierDiscordAuthAdapter,
  providerIdentity: FrontierAuthIdentityCandidateInput,
  user: FrontierDiscordUser,
  tokens: FrontierDiscordTokenResponse,
  resolution: FrontierAuthIdentityResolution
): Promise<FrontierAuthIdentityCandidateInput | FrontierAuthIdentityCandidate | undefined> {
  let selected: FrontierAuthIdentityCandidateInput | FrontierAuthIdentityCandidate | undefined = resolution.selected;
  if (resolution.attachProviderAccount && resolution.selected && adapter.config.identityStore?.linkProvider) {
    const linked = await adapter.config.identityStore.linkProvider(resolution.selected, normalizeIdentityCandidate(providerIdentity));
    if (linked) selected = linked;
  }
  if (!selected && resolution.kind === 'new-identity' && adapter.config.callbacks?.createIdentity) {
    selected = await adapter.config.callbacks.createIdentity({ adapter, providerIdentity, user, tokens, resolution }) ?? undefined;
  }
  return selected;
}

function createSession(
  input: FrontierAuthSessionInput | FrontierAuthSession | null | undefined,
  providerIdentity: FrontierAuthIdentityCandidateInput,
  selectedIdentity: FrontierAuthIdentityCandidateInput | FrontierAuthIdentityCandidate | undefined,
  user: FrontierDiscordUser,
  tokenSummary: FrontierDiscordTokenSummary
): FrontierAuthSession {
  if (isAuthSession(input)) return input;
  if (input) return createAuthSession(input);
  const selectedId = normalizeOptionalString(selectedIdentity?.id);
  const providerAccountId = normalizeString(providerIdentity.providerAccountId) || normalizeString(user.id);
  const email = normalizeOptionalString(providerIdentity.email);
  const username = normalizeOptionalString(selectedIdentity?.username)
    ?? normalizeOptionalString(providerIdentity.username)
    ?? normalizeOptionalString(user.global_name)
    ?? normalizeOptionalString(user.username);
  const image = createDiscordAvatarUrl(user);
  return createAuthSession({
    subject: selectedId ?? providerAccountId,
    provider: FRONTIER_DISCORD_PROVIDER_ID,
    providerAccountId,
    email,
    username,
    name: username,
    image,
    authenticated: true,
    claims: {
      sub: selectedId ?? providerAccountId,
      provider: FRONTIER_DISCORD_PROVIDER_ID,
      providerAccountId,
      email: email ?? '',
      username: username ?? ''
    },
    metadata: {
      discord: sanitizeDiscordUser(user),
      token: tokenSummary as unknown as JsonObject
    }
  });
}

async function verifyCallbackState(
  adapter: FrontierDiscordAuthAdapter,
  input: FrontierDiscordCallbackInput,
  params: FrontierDiscordCallbackParameters
): Promise<{ ok: boolean; reason?: string; flow?: FrontierDiscordAuthStateRecord | null }> {
  const requireState = adapter.config.requireState ?? true;
  const state = normalizeString(params.state);
  if (!requireState) return { ok: true, flow: input.stateRecord };
  if (!state) return { ok: false, reason: 'discord-state-missing' };
  const loaded = input.stateRecord
    ?? (adapter.config.callbacks?.loadState ? await adapter.config.callbacks.loadState({ adapter, state, input }) : undefined);
  if (input.expectedState && input.expectedState !== state) return { ok: false, reason: 'discord-state-mismatch' };
  if (loaded && loaded.state !== state) return { ok: false, reason: 'discord-state-mismatch' };
  if (loaded?.expiresAt && Date.parse(loaded.expiresAt) < Date.now()) return { ok: false, reason: 'discord-state-expired' };
  const verified = await adapter.config.callbacks?.verifyState?.({ adapter, state, input, flow: loaded });
  if (typeof verified === 'boolean') return { ok: verified, reason: verified ? undefined : 'discord-state-rejected', flow: loaded };
  if (verified && !verified.ok) return { ok: false, reason: verified.reason || 'discord-state-rejected', flow: loaded };
  if (!loaded && !input.expectedState && !adapter.config.callbacks?.verifyState) return { ok: false, reason: 'discord-state-unverified' };
  return { ok: true, flow: loaded };
}

async function failCallback(
  adapter: FrontierDiscordAuthAdapter,
  input: FrontierDiscordCallbackInput,
  params: FrontierDiscordCallbackParameters,
  reason: string,
  message: string,
  details?: unknown,
  extra: Partial<Pick<FrontierDiscordCallbackResult, 'tokens' | 'tokenSummary' | 'user' | 'providerIdentity' | 'identityResolution' | 'session'>> = {}
): Promise<FrontierDiscordCallbackResult> {
  const redirectUrl = normalizeOptionalString(await adapter.config.callbacks?.resolveRedirect?.({ adapter, url: adapter.config.errorRedirectTo, input, ok: false }))
    ?? adapter.config.errorRedirectTo
    ?? adapter.config.defaultReturnTo
    ?? '/';
  const result: FrontierDiscordCallbackResult = {
    kind: FRONTIER_DISCORD_CALLBACK_KIND,
    version: FRONTIER_DISCORD_AUTH_ADAPTER_VERSION,
    ok: false,
    provider: adapter.provider.id ?? FRONTIER_DISCORD_PROVIDER_ID,
    code: params.code,
    state: params.state,
    error: message,
    reason,
    redirect: resolveFinalRedirect(adapter, redirectUrl, false),
    ...extra,
    metadata: {
      ...toJsonObject(input.metadata),
      details: sanitizeErrorDetails(details)
    }
  };
  await adapter.config.callbacks?.onError?.(result);
  return result;
}

function resolveFinalRedirect(adapter: FrontierDiscordAuthAdapter, url: string | undefined, ok: boolean): FrontierDiscordRedirectDecision {
  const fallback = ok ? (adapter.config.defaultReturnTo ?? '/') : (adapter.config.errorRedirectTo ?? adapter.config.defaultReturnTo ?? '/');
  const target = normalizeString(url) || fallback;
  const baseUrl = normalizeOptionalString(adapter.config.baseUrl);
  if (target.startsWith('/')) {
    const resolved = baseUrl ? new URL(target, baseUrl).toString() : target;
    return { ...createDiscordRedirect(resolved), allowed: true, reason: 'relative-redirect' };
  }
  try {
    const parsed = new URL(target);
    const allowedOrigins = new Set(uniqueStrings([...(adapter.config.allowedRedirectOrigins ?? []), ...(baseUrl ? [new URL(baseUrl).origin] : [])]));
    if (allowedOrigins.has(parsed.origin)) {
      return { ...createDiscordRedirect(parsed.toString()), allowed: true, reason: 'allowed-origin' };
    }
  } catch {
    return { ...createDiscordRedirect(fallback), allowed: false, reason: 'invalid-redirect' };
  }
  const fallbackUrl = fallback.startsWith('/') && baseUrl ? new URL(fallback, baseUrl).toString() : fallback;
  return { ...createDiscordRedirect(fallbackUrl), allowed: false, reason: 'blocked-origin' };
}

function parseCallbackParameters(input: FrontierDiscordCallbackInput): FrontierDiscordCallbackParameters {
  const params = new URLSearchParams();
  if (input.url) {
    const parsed = typeof input.url === 'string'
      ? new URL(input.url, 'http://frontier.local')
      : input.url;
    parsed.searchParams.forEach((value, key) => params.set(key, value));
    const hash = parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash;
    if (hash) new URLSearchParams(hash).forEach((value, key) => params.set(key, value));
  }
  if (input.params instanceof URLSearchParams) {
    input.params.forEach((value, key) => params.set(key, value));
  } else if (input.params && typeof input.params === 'object') {
    for (const [key, value] of Object.entries(input.params)) {
      if (value !== undefined && value !== null) params.set(key, value);
    }
  }
  return {
    code: normalizeOptionalString(params.get('code')),
    state: normalizeOptionalString(params.get('state')),
    error: normalizeOptionalString(params.get('error')),
    errorDescription: normalizeOptionalString(params.get('error_description'))
  };
}

async function postForm(adapter: FrontierDiscordAuthAdapter, url: string, body: URLSearchParams, expectJson = true): Promise<unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json'
  };
  const secret = await readClientSecret(adapter);
  if (clientAuthentication(adapter) === 'basic') {
    if (!secret) throw new FrontierDiscordAuthError('discord-client-secret-required', 'Discord clientSecret is required for basic client authentication.');
    headers.Authorization = 'Basic ' + base64Encode(adapter.config.clientId + ':' + secret);
  }
  return await fetchJson(adapter, url, { method: 'POST', headers, body: body.toString() }, expectJson);
}

async function fetchJson(adapter: FrontierDiscordAuthAdapter, url: string, init: FrontierDiscordFetchInit, expectJson = true): Promise<unknown> {
  const fetcher = adapter.config.fetch ?? defaultFetch();
  const response = await fetcher(url, init);
  if (!response.ok) {
    throw new FrontierDiscordAuthError('discord-http-error', 'Discord HTTP request failed with status ' + response.status + '.', {
      status: response.status,
      details: await readResponseBody(response)
    });
  }
  if (!expectJson) return {};
  return await response.json();
}

async function applyClientAuthentication(adapter: FrontierDiscordAuthAdapter, body: URLSearchParams): Promise<void> {
  const mode = clientAuthentication(adapter);
  if (mode === 'none') {
    body.set('client_id', adapter.config.clientId);
    return;
  }
  if (mode === 'body') {
    body.set('client_id', adapter.config.clientId);
    const secret = await readClientSecret(adapter);
    if (secret) body.set('client_secret', secret);
    return;
  }
}

async function readClientSecret(adapter: FrontierDiscordAuthAdapter): Promise<string | undefined> {
  const secret = adapter.config.clientSecret;
  return normalizeOptionalString(typeof secret === 'function' ? await secret() : secret);
}

function clientAuthentication(adapter: FrontierDiscordAuthAdapter): FrontierDiscordClientAuthentication {
  if (adapter.config.clientAuthentication) return adapter.config.clientAuthentication;
  return adapter.config.clientSecret ? 'basic' : 'none';
}

function defaultFetch(): FrontierDiscordFetch {
  const fetcher = (globalThis as { fetch?: FrontierDiscordFetch }).fetch;
  if (!fetcher) throw new FrontierDiscordAuthError('discord-fetch-required', 'A fetch implementation is required for Discord HTTP requests.');
  return fetcher.bind(globalThis);
}

async function readResponseBody(response: FrontierDiscordFetchResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return response.text ? await response.text() : '';
  }
}

function normalizeTokenResponse(value: unknown): FrontierDiscordTokenResponse {
  if (!isRecord(value)) throw new FrontierDiscordAuthError('discord-token-invalid', 'Discord token response must be an object.');
  const accessToken = normalizeString(value.access_token);
  const tokenType = normalizeString(value.token_type) || 'Bearer';
  if (!accessToken) throw new FrontierDiscordAuthError('discord-token-missing', 'Discord token response did not include access_token.');
  return {
    ...value,
    access_token: accessToken,
    token_type: tokenType,
    expires_in: typeof value.expires_in === 'number' ? value.expires_in : undefined,
    refresh_token: normalizeOptionalString(value.refresh_token),
    scope: normalizeOptionalString(value.scope)
  };
}

function normalizeDiscordUser(value: unknown): FrontierDiscordUser {
  if (!isRecord(value)) throw new FrontierDiscordAuthError('discord-user-invalid', 'Discord user response must be an object.');
  const id = normalizeString(value.id);
  if (!id) throw new FrontierDiscordAuthError('discord-user-id-missing', 'Discord user response did not include id.');
  return value as unknown as FrontierDiscordUser;
}

function normalizeIdentityCandidate(input: FrontierAuthIdentityCandidateInput): FrontierAuthIdentityCandidate {
  return {
    id: normalizeString(input.id) || slugify([input.provider, input.providerAccountId, input.email, input.username].filter(Boolean).join('-')),
    provider: normalizeOptionalString(input.provider),
    providerAccountId: normalizeOptionalString(input.providerAccountId),
    email: normalizeOptionalString(input.email),
    username: normalizeOptionalString(input.username),
    linkedProviderAccountId: normalizeOptionalString(input.linkedProviderAccountId),
    source: normalizeString(input.source) || FRONTIER_DISCORD_PROVIDER_ID,
    reserved: input.reserved ?? false,
    metadata: toJsonObject(input.metadata)
  };
}

function sanitizeDiscordUser(user: FrontierDiscordUser): JsonObject {
  return {
    id: user.id,
    username: normalizeOptionalString(user.username) ?? '',
    global_name: normalizeOptionalString(user.global_name) ?? '',
    avatar: normalizeOptionalString(user.avatar) ?? '',
    email: normalizeOptionalString(user.email) ?? '',
    verified: user.verified === true
  };
}

function sanitizeErrorDetails(value: unknown): JsonObject {
  if (value instanceof FrontierDiscordAuthError) {
    return {
      code: value.code,
      status: value.status ?? 0,
      message: value.message
    };
  }
  if (value instanceof Error) return { name: value.name, message: value.message };
  return toJsonObject(value);
}

function isAuthSession(value: unknown): value is FrontierAuthSession {
  return isRecord(value) && value.kind === 'frontier.auth.session' && value.version === 1;
}

function isBlockedIdentityResolution(resolution: FrontierAuthIdentityResolution): boolean {
  return resolution.kind === 'blocked-reserved' || resolution.kind === 'blocked-relink' || resolution.kind === 'unresolved';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toJsonObject(value: unknown): JsonObject {
  return isRecord(value) ? value as JsonObject : {};
}

function uniqueStrings(values: readonly unknown[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalizeString(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function splitScopes(value: unknown): string[] {
  return uniqueStrings(String(value ?? '').split(/\s+/));
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'discord-identity';
}

function randomToken(bytes = 32): string {
  const array = new Uint8Array(bytes);
  const crypto = (globalThis as { crypto?: { getRandomValues?(array: Uint8Array): Uint8Array } }).crypto;
  if (!crypto?.getRandomValues) throw new FrontierDiscordAuthError('discord-crypto-required', 'crypto.getRandomValues is required to generate Discord auth state.');
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomCodeVerifier(): string {
  return randomToken(48);
}

async function codeChallengeS256(codeVerifier: string): Promise<string> {
  const crypto = (globalThis as { crypto?: { subtle?: { digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer> } } }).crypto;
  if (!crypto?.subtle) throw new FrontierDiscordAuthError('discord-crypto-required', 'crypto.subtle is required to create a Discord PKCE code challenge.');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array): string {
  return base64Encode(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64Encode(value: string): string {
  const btoaFn = (globalThis as { btoa?: (input: string) => string }).btoa;
  if (btoaFn) return btoaFn(value);
  const buffer = (globalThis as { Buffer?: { from(input: string, encoding: string): { toString(encoding: string): string } } }).Buffer;
  if (buffer) return buffer.from(value, 'utf8').toString('base64');
  throw new FrontierDiscordAuthError('discord-base64-required', 'A base64 encoder is required for Discord client authentication.');
}

function errorCode(error: unknown): string {
  return error instanceof FrontierDiscordAuthError ? error.code : 'discord-callback-failed';
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
