import type { JsonObject, JsonValue } from '@shapeshift-labs/frontier';

export const FRONTIER_AUTH_MANIFEST_KIND = 'frontier.auth.manifest';
export const FRONTIER_AUTH_MANIFEST_VERSION = 1;
export const FRONTIER_AUTH_SESSION_KIND = 'frontier.auth.session';
export const FRONTIER_AUTH_SESSION_VERSION = 1;
export const FRONTIER_AUTH_DECISION_KIND = 'frontier.auth.decision';
export const FRONTIER_AUTH_DECISION_VERSION = 1;
export const FRONTIER_AUTH_AUDIT_KIND = 'frontier.auth.audit';
export const FRONTIER_AUTH_AUDIT_VERSION = 1;
export const FRONTIER_AUTH_REGISTRY_KIND = 'frontier.auth.registry';
export const FRONTIER_AUTH_REGISTRY_VERSION = 1;
export const FRONTIER_AUTH_TOKEN_PLAN_KIND = 'frontier.auth.token.plan';
export const FRONTIER_AUTH_TOKEN_PLAN_VERSION = 1;

export type FrontierAuthProviderKind =
  | 'oauth'
  | 'oidc'
  | 'credentials'
  | 'magic-link'
  | 'otp'
  | 'passkey'
  | 'webauthn'
  | 'api-key'
  | 'bearer'
  | 'service-token'
  | 'anonymous'
  | 'custom'
  | string;

export type FrontierAuthSessionStrategy = 'jwt' | 'database' | 'opaque' | 'cookie' | 'hybrid' | 'custom' | string;
export type FrontierAuthRuntime = 'browser' | 'node' | 'edge' | 'serverless' | 'worker' | 'cli' | 'game-runtime' | 'custom' | string;
export type FrontierAuthTokenAlgorithm = 'HS256' | 'RS256' | 'ES256' | 'EdDSA' | 'opaque' | 'custom' | string;
export type FrontierAuthDecisionStatus = 'allow' | 'deny';
export type FrontierAuthIdentityResolutionKind =
  | 'provider-match'
  | 'email-fallback'
  | 'new-identity'
  | 'blocked-reserved'
  | 'blocked-relink'
  | 'unresolved';

export interface FrontierAuthProviderInput {
  id?: string;
  kind?: FrontierAuthProviderKind;
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  jwksEndpoint?: string;
  scopes?: readonly string[];
  pkce?: boolean;
  state?: boolean;
  nonce?: boolean;
  enabled?: boolean;
  runtime?: readonly FrontierAuthRuntime[];
  claims?: readonly string[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthProvider {
  id: string;
  kind: FrontierAuthProviderKind;
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  jwksEndpoint?: string;
  scopes: string[];
  pkce: boolean;
  state: boolean;
  nonce: boolean;
  enabled: boolean;
  runtime: FrontierAuthRuntime[];
  claims: string[];
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthSessionConfigInput {
  strategy?: FrontierAuthSessionStrategy;
  cookieName?: string;
  ttlSeconds?: number;
  refreshSeconds?: number;
  csrfProtection?: boolean;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | string;
  subjectPath?: string;
  providerPath?: string;
  rolePath?: string;
  profileCompletePath?: string;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthSessionConfig {
  strategy: FrontierAuthSessionStrategy;
  cookieName: string;
  ttlSeconds: number;
  refreshSeconds: number;
  csrfProtection: boolean;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
  subjectPath: string;
  providerPath: string;
  rolePath: string;
  profileCompletePath: string;
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthClaimRequirementInput {
  claim: string;
  source?: 'session' | 'claims' | 'access' | 'legal' | 'metadata' | string;
  equals?: JsonValue;
  oneOf?: readonly JsonValue[];
  truthy?: boolean;
  exists?: boolean;
  code?: string;
  reason?: string;
}

export interface FrontierAuthClaimRequirement {
  claim: string;
  source: string;
  equals?: JsonValue;
  oneOf: JsonValue[];
  truthy: boolean;
  exists: boolean;
  code: string;
  reason: string;
}

export interface FrontierAuthProfileRequirementInput {
  requireSubject?: boolean;
  requireEmail?: boolean;
  requireProvider?: boolean;
  fields?: readonly string[];
  access?: readonly string[];
  legal?: readonly string[];
  claims?: readonly FrontierAuthClaimRequirementInput[];
  mode?: 'all' | 'any' | string;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthProfileRequirement {
  requireSubject: boolean;
  requireEmail: boolean;
  requireProvider: boolean;
  fields: string[];
  access: string[];
  legal: string[];
  claims: FrontierAuthClaimRequirement[];
  mode: string;
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthSessionInput {
  id?: string;
  subject?: string;
  provider?: string;
  providerAccountId?: string;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  roles?: readonly string[];
  authenticated?: boolean;
  access?: Record<string, unknown> | readonly string[];
  legal?: Record<string, unknown> | readonly string[];
  claims?: unknown;
  profileComplete?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  metadata?: unknown;
}

export interface FrontierAuthSession {
  kind: typeof FRONTIER_AUTH_SESSION_KIND;
  version: typeof FRONTIER_AUTH_SESSION_VERSION;
  id: string;
  subject: string;
  provider?: string;
  providerAccountId?: string;
  email?: string;
  username?: string;
  name?: string;
  image?: string;
  role?: string;
  roles: string[];
  authenticated: boolean;
  access: JsonObject;
  legal: JsonObject;
  claims: JsonObject;
  profileComplete: boolean;
  issuedAt?: string;
  expiresAt?: string;
  metadata: JsonObject;
}

export interface FrontierAuthGateInput {
  id?: string;
  resource?: string;
  route?: string;
  effect?: string;
  required?: boolean;
  roles?: readonly string[];
  access?: readonly string[];
  legal?: readonly string[];
  claims?: readonly FrontierAuthClaimRequirementInput[];
  profile?: boolean;
  redirectTo?: string;
  status?: number;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthGate {
  id: string;
  resource: string;
  route?: string;
  effect?: string;
  required: boolean;
  roles: string[];
  access: string[];
  legal: string[];
  claims: FrontierAuthClaimRequirement[];
  profile: boolean;
  redirectTo?: string;
  status: number;
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthCapabilityInput {
  id?: string;
  action?: string;
  resource?: string;
  gate?: string;
  roles?: readonly string[];
  claims?: readonly FrontierAuthClaimRequirementInput[];
  effects?: readonly string[];
  tools?: readonly string[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthCapability {
  id: string;
  action: string;
  resource: string;
  gate?: string;
  roles: string[];
  claims: FrontierAuthClaimRequirement[];
  effects: string[];
  tools: string[];
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthTokenContractInput {
  id?: string;
  kind?: string;
  issuer?: string;
  audience?: string;
  subjectPath?: string;
  algorithm?: FrontierAuthTokenAlgorithm;
  expiresInSeconds?: number;
  requiredClaims?: readonly string[];
  sensitiveClaims?: readonly string[];
  replayProtection?: boolean;
  runtime?: readonly FrontierAuthRuntime[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthTokenContract {
  id: string;
  kind: string;
  issuer: string;
  audience: string;
  subjectPath: string;
  algorithm: FrontierAuthTokenAlgorithm;
  expiresInSeconds: number;
  requiredClaims: string[];
  sensitiveClaims: string[];
  replayProtection: boolean;
  runtime: FrontierAuthRuntime[];
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthRuntimeGrantInput {
  id?: string;
  contract?: string;
  resource?: string;
  audience?: string;
  subject?: string;
  requiredClaims?: readonly string[];
  ttlSeconds?: number;
  runtime?: FrontierAuthRuntime;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthRuntimeGrant {
  id: string;
  contract: string;
  resource: string;
  audience: string;
  subject?: string;
  requiredClaims: string[];
  ttlSeconds: number;
  runtime: FrontierAuthRuntime;
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthLinkingPolicyInput {
  providerFirst?: boolean;
  allowEmailFallback?: boolean;
  allowRelink?: boolean;
  attachProviderAccount?: boolean;
  identityKeys?: readonly string[];
  fallbackKeys?: readonly string[];
  reservedEmails?: readonly string[];
  reservedUsernames?: readonly string[];
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAuthLinkingPolicy {
  providerFirst: boolean;
  allowEmailFallback: boolean;
  allowRelink: boolean;
  attachProviderAccount: boolean;
  identityKeys: string[];
  fallbackKeys: string[];
  reservedEmails: string[];
  reservedUsernames: string[];
  tags: string[];
  metadata: JsonObject;
}

export interface FrontierAuthManifestInput {
  id?: string;
  name?: string;
  package?: string;
  owner?: string;
  providers?: readonly FrontierAuthProviderInput[];
  session?: FrontierAuthSessionConfigInput;
  profile?: FrontierAuthProfileRequirementInput;
  linking?: FrontierAuthLinkingPolicyInput;
  gates?: readonly FrontierAuthGateInput[];
  routeGuards?: readonly FrontierAuthGateInput[];
  capabilities?: readonly FrontierAuthCapabilityInput[];
  tokenContracts?: readonly FrontierAuthTokenContractInput[];
  runtimeGrants?: readonly FrontierAuthRuntimeGrantInput[];
  tags?: readonly string[];
  source?: FrontierAuthSource;
  metadata?: unknown;
}

export interface FrontierAuthManifest {
  kind: typeof FRONTIER_AUTH_MANIFEST_KIND;
  version: typeof FRONTIER_AUTH_MANIFEST_VERSION;
  id: string;
  name: string;
  package?: string;
  owner?: string;
  providers: FrontierAuthProvider[];
  session: FrontierAuthSessionConfig;
  profile: FrontierAuthProfileRequirement;
  linking: FrontierAuthLinkingPolicy;
  gates: FrontierAuthGate[];
  capabilities: FrontierAuthCapability[];
  tokenContracts: FrontierAuthTokenContract[];
  runtimeGrants: FrontierAuthRuntimeGrant[];
  tags: string[];
  source?: FrontierAuthSource;
  metadata: JsonObject;
  summary: FrontierAuthSummary;
}

export interface FrontierAuthSummary {
  providerCount: number;
  gateCount: number;
  capabilityCount: number;
  tokenContractCount: number;
  runtimeGrantCount: number;
  requiredGateCount: number;
  enabledProviderCount: number;
}

export interface FrontierAuthSource {
  file?: string;
  line?: number;
  column?: number;
  package?: string;
  symbol?: string;
}

export interface FrontierAuthDecision {
  kind: typeof FRONTIER_AUTH_DECISION_KIND;
  version: typeof FRONTIER_AUTH_DECISION_VERSION;
  id: string;
  status: FrontierAuthDecisionStatus;
  allow: boolean;
  gate: string;
  subject?: string;
  provider?: string;
  resource: string;
  reasons: string[];
  missing: string[];
  requiredRoles: string[];
  matchedRoles: string[];
  generatedAt?: string;
  metadata: JsonObject;
}

export interface FrontierAuthAuditEventInput {
  id?: string;
  type: string;
  subject?: string;
  provider?: string;
  resource?: string;
  decision?: FrontierAuthDecision;
  session?: FrontierAuthSessionInput | FrontierAuthSession;
  claims?: unknown;
  tags?: readonly string[];
  metadata?: unknown;
  timestamp?: string;
}

export interface FrontierAuthAuditEvent {
  kind: typeof FRONTIER_AUTH_AUDIT_KIND;
  version: typeof FRONTIER_AUTH_AUDIT_VERSION;
  id: string;
  type: string;
  subject?: string;
  provider?: string;
  resource?: string;
  decision?: FrontierAuthDecisionStatus;
  claims: JsonObject;
  tags: string[];
  metadata: JsonObject;
  timestamp: string;
}

export interface FrontierAuthIdentityCandidateInput {
  id?: string;
  provider?: string;
  providerAccountId?: string;
  email?: string | null;
  username?: string | null;
  linkedProviderAccountId?: string | null;
  source?: string;
  reserved?: boolean;
  metadata?: unknown;
}

export interface FrontierAuthIdentityCandidate {
  id: string;
  provider?: string;
  providerAccountId?: string;
  email?: string;
  username?: string;
  linkedProviderAccountId?: string;
  source: string;
  reserved: boolean;
  metadata: JsonObject;
}

export interface FrontierAuthIdentityResolutionInput {
  providerIdentity: FrontierAuthIdentityCandidateInput;
  candidates?: readonly FrontierAuthIdentityCandidateInput[];
  policy?: FrontierAuthLinkingPolicyInput | FrontierAuthLinkingPolicy;
}

export interface FrontierAuthIdentityResolution {
  kind: FrontierAuthIdentityResolutionKind;
  selected?: FrontierAuthIdentityCandidate;
  attachProviderAccount: boolean;
  reasons: string[];
  providerIdentity: FrontierAuthIdentityCandidate;
}

export interface FrontierAuthTokenPlanInput {
  contract: FrontierAuthTokenContractInput | FrontierAuthTokenContract;
  subject?: string;
  claims?: unknown;
  issuedAt?: number | string;
  tokenRef?: string;
  metadata?: unknown;
}

export interface FrontierAuthTokenPlan {
  kind: typeof FRONTIER_AUTH_TOKEN_PLAN_KIND;
  version: typeof FRONTIER_AUTH_TOKEN_PLAN_VERSION;
  id: string;
  operation: 'issue' | 'verify';
  contract: FrontierAuthTokenContract;
  header?: JsonObject;
  claims: JsonObject;
  checks: string[];
  sensitiveClaims: string[];
  tokenRef?: string;
  implementation: 'host-owned-crypto-adapter';
  metadata: JsonObject;
}

export interface FrontierAuthRegistryEntry {
  id: string;
  kind: string;
  title?: string;
  package?: string;
  resource?: string;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierAuthRegistryEdge {
  from: string;
  to: string;
  kind: string;
  metadata?: JsonObject;
}

export interface FrontierAuthRegistryGraph {
  kind: typeof FRONTIER_AUTH_REGISTRY_KIND;
  version: typeof FRONTIER_AUTH_REGISTRY_VERSION;
  id: string;
  entries: FrontierAuthRegistryEntry[];
  edges: FrontierAuthRegistryEdge[];
  summary: {
    entries: number;
    edges: number;
  };
}

export interface FrontierAuthLintResource {
  id: string;
  kind: string;
  package?: string;
  feature?: string;
  owner?: string;
  files?: string[];
  effects?: string[];
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierAuthEvidence {
  kind: 'frontier.auth.evidence';
  appId: string;
  generatedAt?: string;
  manifest: FrontierAuthManifest;
  registry: FrontierAuthRegistryGraph;
  lintResources: FrontierAuthLintResource[];
  decisions?: FrontierAuthDecision[];
  audit?: FrontierAuthAuditEvent[];
}

export interface FrontierAuthSessionAdapter {
  getSession(request: unknown): FrontierAuthMaybePromise<FrontierAuthSessionInput | FrontierAuthSession | null | undefined>;
  refreshSession?(request: unknown, session: FrontierAuthSession): FrontierAuthMaybePromise<FrontierAuthSessionInput | FrontierAuthSession | null | undefined>;
  signOut?(request: unknown, session: FrontierAuthSession): FrontierAuthMaybePromise<void>;
}

export interface FrontierAuthTokenAdapter {
  issue(plan: FrontierAuthTokenPlan): FrontierAuthMaybePromise<string>;
  verify(token: string, plan: FrontierAuthTokenPlan): FrontierAuthMaybePromise<FrontierAuthSessionInput | JsonObject>;
}

export interface FrontierAuthIdentityStoreAdapter {
  findByProvider?(provider: string, providerAccountId: string): FrontierAuthMaybePromise<FrontierAuthIdentityCandidateInput | null | undefined>;
  findByEmail?(email: string): FrontierAuthMaybePromise<FrontierAuthIdentityCandidateInput | null | undefined>;
  linkProvider?(identity: FrontierAuthIdentityCandidate, providerIdentity: FrontierAuthIdentityCandidate): FrontierAuthMaybePromise<FrontierAuthIdentityCandidateInput | void>;
}

export type FrontierAuthMaybePromise<T> = T | Promise<T>;

export function defineAuthManifest<T extends FrontierAuthManifestInput>(input: T): T {
  return input;
}

export function createAuthManifest(input: FrontierAuthManifestInput = {}): FrontierAuthManifest {
  const id = normalizeString(input.id) || 'frontier.auth';
  const providers = (input.providers ?? []).map(normalizeProvider);
  const gates = [...(input.gates ?? []), ...(input.routeGuards ?? [])].map(normalizeGate);
  const capabilities = (input.capabilities ?? []).map(normalizeCapability);
  const tokenContracts = (input.tokenContracts ?? []).map(normalizeTokenContract);
  const runtimeGrants = (input.runtimeGrants ?? []).map((grant) => normalizeRuntimeGrant(grant, tokenContracts));
  const manifest: FrontierAuthManifest = {
    kind: FRONTIER_AUTH_MANIFEST_KIND,
    version: FRONTIER_AUTH_MANIFEST_VERSION,
    id,
    name: normalizeString(input.name) || id,
    package: normalizeOptionalString(input.package),
    owner: normalizeOptionalString(input.owner),
    providers,
    session: normalizeSessionConfig(input.session),
    profile: normalizeProfileRequirement(input.profile),
    linking: normalizeLinkingPolicy(input.linking),
    gates,
    capabilities,
    tokenContracts,
    runtimeGrants,
    tags: uniqueStrings(input.tags ?? []),
    source: input.source,
    metadata: toJsonObject(input.metadata),
    summary: {
      providerCount: providers.length,
      gateCount: gates.length,
      capabilityCount: capabilities.length,
      tokenContractCount: tokenContracts.length,
      runtimeGrantCount: runtimeGrants.length,
      requiredGateCount: gates.filter((gate) => gate.required).length,
      enabledProviderCount: providers.filter((provider) => provider.enabled).length
    }
  };
  return manifest;
}

export function createAuthSession(input: FrontierAuthSessionInput = {}, profile?: FrontierAuthProfileRequirementInput | FrontierAuthProfileRequirement): FrontierAuthSession {
  const claims = toJsonObject(input.claims);
  const subject = normalizeString(input.subject) || readString(claims, 'sub') || readString(claims, 'subject') || '';
  const provider = normalizeOptionalString(input.provider) ?? readString(claims, 'provider');
  const roles = uniqueStrings([...(input.roles ?? []), ...(input.role ? [input.role] : []), ...(readString(claims, 'role') ? [readString(claims, 'role') as string] : [])]);
  const session: FrontierAuthSession = {
    kind: FRONTIER_AUTH_SESSION_KIND,
    version: FRONTIER_AUTH_SESSION_VERSION,
    id: normalizeString(input.id) || subject || 'anonymous',
    subject,
    provider,
    providerAccountId: normalizeOptionalString(input.providerAccountId) ?? readString(claims, 'providerAccountId'),
    email: normalizeOptionalString(input.email) ?? readString(claims, 'email'),
    username: normalizeOptionalString(input.username) ?? readString(claims, 'username'),
    name: normalizeOptionalString(input.name) ?? readString(claims, 'name'),
    image: normalizeOptionalString(input.image) ?? readString(claims, 'picture'),
    role: normalizeOptionalString(input.role) ?? readString(claims, 'role'),
    roles,
    authenticated: input.authenticated ?? Boolean(subject),
    access: normalizeFlagRecord(input.access),
    legal: normalizeFlagRecord(input.legal),
    claims,
    profileComplete: input.profileComplete ?? false,
    issuedAt: normalizeOptionalString(input.issuedAt),
    expiresAt: normalizeOptionalString(input.expiresAt),
    metadata: toJsonObject(input.metadata)
  };
  const requirement = profile ? normalizeProfileRequirement(profile) : undefined;
  if (requirement) {
    session.profileComplete = isAuthSessionComplete(session, requirement);
  }
  return session;
}

export function evaluateAuthGate(
  manifestOrGate: FrontierAuthManifest | FrontierAuthGateInput | FrontierAuthGate,
  sessionInput?: FrontierAuthSessionInput | FrontierAuthSession | null,
  gateIdOrInput?: string | FrontierAuthGateInput | FrontierAuthGate
): FrontierAuthDecision {
  const manifest = isAuthManifest(manifestOrGate) ? manifestOrGate : undefined;
  const gate = resolveGate(manifestOrGate, gateIdOrInput);
  const session = sessionInput ? (isAuthSession(sessionInput) ? sessionInput : createAuthSession(sessionInput, manifest?.profile)) : undefined;
  const reasons: string[] = [];
  const missing: string[] = [];
  const matchedRoles: string[] = [];

  if (!gate.required) {
    reasons.push('gate-not-required');
    return createDecision(gate, session, true, reasons, missing, matchedRoles);
  }

  if (!session || !session.authenticated || !session.subject) {
    reasons.push('unauthenticated');
    missing.push('session');
    return createDecision(gate, session, false, reasons, missing, matchedRoles);
  }

  if (gate.roles.length > 0) {
    for (const role of gate.roles) {
      if (session.roles.includes(role) || session.role === role) matchedRoles.push(role);
    }
    if (matchedRoles.length === 0) {
      reasons.push('role-missing');
      missing.push(...gate.roles.map((role) => 'role:' + role));
    }
  }

  for (const access of gate.access) {
    if (!truthyValue(readSessionValue(session, access, 'access'))) {
      reasons.push('access-missing');
      missing.push('access:' + access);
    }
  }
  for (const legal of gate.legal) {
    if (!truthyValue(readSessionValue(session, legal, 'legal'))) {
      reasons.push('legal-missing');
      missing.push('legal:' + legal);
    }
  }
  for (const claim of gate.claims) {
    if (!checkClaimRequirement(session, claim)) {
      reasons.push(claim.code);
      missing.push('claim:' + claim.claim);
    }
  }
  if (gate.profile) {
    const profile = manifest?.profile ?? normalizeProfileRequirement();
    if (!isAuthSessionComplete(session, profile)) {
      reasons.push('profile-incomplete');
      missing.push('profile');
    }
  }
  if (reasons.length === 0) reasons.push('authenticated');
  return createDecision(gate, session, missing.length === 0, reasons, missing, matchedRoles);
}

export function isAuthSessionComplete(
  sessionInput: FrontierAuthSessionInput | FrontierAuthSession,
  requirementInput: FrontierAuthProfileRequirementInput | FrontierAuthProfileRequirement = {}
): boolean {
  const session = isAuthSession(sessionInput) ? sessionInput : createAuthSession(sessionInput);
  const requirement = normalizeProfileRequirement(requirementInput);
  const checks: boolean[] = [];
  if (requirement.requireSubject) checks.push(Boolean(session.subject));
  if (requirement.requireEmail) checks.push(Boolean(session.email));
  if (requirement.requireProvider) checks.push(Boolean(session.provider));
  for (const field of requirement.fields) checks.push(truthyValue(readSessionValue(session, field, 'session')));
  for (const access of requirement.access) checks.push(truthyValue(readSessionValue(session, access, 'access')));
  for (const legal of requirement.legal) checks.push(truthyValue(readSessionValue(session, legal, 'legal')));
  for (const claim of requirement.claims) checks.push(checkClaimRequirement(session, claim));
  if (checks.length === 0) return session.profileComplete === true;
  return requirement.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean);
}

export function resolveLinkedIdentity(input: FrontierAuthIdentityResolutionInput): FrontierAuthIdentityResolution {
  const policy = normalizeLinkingPolicy(input.policy);
  const providerIdentity = normalizeIdentityCandidate(input.providerIdentity, 'provider');
  const candidates = (input.candidates ?? []).map((candidate, index) => normalizeIdentityCandidate(candidate, 'candidate-' + index));
  const providerMatch = candidates.find((candidate) => (
    normalizeComparable(candidate.provider) === normalizeComparable(providerIdentity.provider)
    && normalizeComparable(candidate.providerAccountId) === normalizeComparable(providerIdentity.providerAccountId)
    && Boolean(candidate.providerAccountId)
  ));
  if (providerMatch) {
    return {
      kind: 'provider-match',
      selected: providerMatch,
      attachProviderAccount: false,
      reasons: ['provider-account-match'],
      providerIdentity
    };
  }

  if (policy.allowEmailFallback && providerIdentity.email) {
    const emailMatch = candidates.find((candidate) => normalizeComparable(candidate.email) === normalizeComparable(providerIdentity.email));
    if (emailMatch) {
      if (isReservedIdentity(emailMatch, policy) || isReservedIdentity(providerIdentity, policy)) {
        return {
          kind: 'blocked-reserved',
          selected: emailMatch,
          attachProviderAccount: false,
          reasons: ['reserved-identity'],
          providerIdentity
        };
      }
      if (
        emailMatch.linkedProviderAccountId
        && providerIdentity.providerAccountId
        && normalizeComparable(emailMatch.linkedProviderAccountId) !== normalizeComparable(providerIdentity.providerAccountId)
        && !policy.allowRelink
      ) {
        return {
          kind: 'blocked-relink',
          selected: emailMatch,
          attachProviderAccount: false,
          reasons: ['provider-account-relink-blocked'],
          providerIdentity
        };
      }
      return {
        kind: 'email-fallback',
        selected: emailMatch,
        attachProviderAccount: policy.attachProviderAccount,
        reasons: ['email-fallback-match'],
        providerIdentity
      };
    }
  }

  return {
    kind: providerIdentity.providerAccountId || providerIdentity.email ? 'new-identity' : 'unresolved',
    attachProviderAccount: policy.attachProviderAccount,
    reasons: providerIdentity.providerAccountId || providerIdentity.email ? ['no-existing-identity'] : ['missing-provider-identity'],
    providerIdentity
  };
}

export function createAuthTokenIssuePlan(input: FrontierAuthTokenPlanInput): FrontierAuthTokenPlan {
  const contract = normalizeTokenContract(input.contract);
  const issuedAt = normalizeIssuedAt(input.issuedAt);
  const claims = {
    ...toJsonObject(input.claims),
    iss: contract.issuer,
    aud: contract.audience,
    sub: normalizeString(input.subject) || readString(toJsonObject(input.claims), 'sub') || '<subject>',
    kind: contract.kind,
    iat: issuedAt,
    exp: issuedAt + contract.expiresInSeconds
  } satisfies JsonObject;
  return {
    kind: FRONTIER_AUTH_TOKEN_PLAN_KIND,
    version: FRONTIER_AUTH_TOKEN_PLAN_VERSION,
    id: contract.id + '.issue',
    operation: 'issue',
    contract,
    header: contract.algorithm === 'opaque' ? undefined : { alg: contract.algorithm, typ: 'JWT' },
    claims: redactByClaimNames(claims, contract.sensitiveClaims),
    checks: [...contract.requiredClaims],
    sensitiveClaims: [...contract.sensitiveClaims],
    implementation: 'host-owned-crypto-adapter',
    metadata: toJsonObject(input.metadata)
  };
}

export function createAuthTokenVerifyPlan(input: FrontierAuthTokenPlanInput): FrontierAuthTokenPlan {
  const contract = normalizeTokenContract(input.contract);
  return {
    kind: FRONTIER_AUTH_TOKEN_PLAN_KIND,
    version: FRONTIER_AUTH_TOKEN_PLAN_VERSION,
    id: contract.id + '.verify',
    operation: 'verify',
    contract,
    claims: {
      iss: contract.issuer,
      aud: contract.audience,
      sub: contract.subjectPath,
      kind: contract.kind
    },
    checks: ['signature', 'issuer', 'audience', 'expiry', 'subject', ...contract.requiredClaims, ...(contract.replayProtection ? ['replay-protection'] : [])],
    sensitiveClaims: [...contract.sensitiveClaims],
    tokenRef: normalizeOptionalString(input.tokenRef),
    implementation: 'host-owned-crypto-adapter',
    metadata: toJsonObject(input.metadata)
  };
}

export function createRuntimeAuthGrant(input: FrontierAuthRuntimeGrantInput = {}): FrontierAuthRuntimeGrant {
  return normalizeRuntimeGrant(input, []);
}

export function createAuthAuditEvent(input: FrontierAuthAuditEventInput): FrontierAuthAuditEvent {
  const session = input.session ? (isAuthSession(input.session) ? input.session : createAuthSession(input.session)) : undefined;
  return {
    kind: FRONTIER_AUTH_AUDIT_KIND,
    version: FRONTIER_AUTH_AUDIT_VERSION,
    id: normalizeString(input.id) || slugify([input.type, input.subject ?? session?.subject ?? input.resource ?? 'auth'].join('-')),
    type: normalizeString(input.type) || 'auth.event',
    subject: normalizeOptionalString(input.subject) ?? session?.subject,
    provider: normalizeOptionalString(input.provider) ?? session?.provider,
    resource: normalizeOptionalString(input.resource),
    decision: input.decision?.status,
    claims: redactAuthRecord(toJsonObject(input.claims ?? session?.claims)),
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata),
    timestamp: normalizeString(input.timestamp) || new Date(0).toISOString()
  };
}

export function createAuthRegistryGraph(manifestInput: FrontierAuthManifestInput | FrontierAuthManifest): FrontierAuthRegistryGraph {
  const manifest = isAuthManifest(manifestInput) ? manifestInput : createAuthManifest(manifestInput);
  const entries: FrontierAuthRegistryEntry[] = [
    {
      id: 'auth:' + manifest.id,
      kind: 'auth-manifest',
      title: manifest.name,
      package: manifest.package,
      tags: ['auth', ...manifest.tags],
      metadata: { providers: manifest.providers.length, gates: manifest.gates.length }
    },
    ...manifest.providers.map((provider) => ({
      id: 'auth-provider:' + provider.id,
      kind: 'auth-provider',
      title: provider.id,
      package: manifest.package,
      tags: ['auth', 'provider', provider.kind, ...(provider.tags ?? [])],
      metadata: { enabled: provider.enabled, scopes: provider.scopes, runtime: provider.runtime }
    })),
    ...manifest.gates.map((gate) => ({
      id: 'auth-gate:' + gate.id,
      kind: 'auth-gate',
      title: gate.id,
      package: manifest.package,
      resource: gate.resource,
      tags: ['auth', 'gate', gate.required ? 'required' : 'optional', ...gate.tags],
      metadata: { route: gate.route ?? '', roles: gate.roles, access: gate.access, legal: gate.legal }
    })),
    ...manifest.capabilities.map((capability) => ({
      id: 'auth-capability:' + capability.id,
      kind: 'auth-capability',
      title: capability.action,
      package: manifest.package,
      resource: capability.resource,
      tags: ['auth', 'capability', ...capability.tags],
      metadata: { gate: capability.gate ?? '', effects: capability.effects, tools: capability.tools }
    })),
    ...manifest.tokenContracts.map((contract) => ({
      id: 'auth-token:' + contract.id,
      kind: 'auth-token-contract',
      title: contract.kind,
      package: manifest.package,
      resource: contract.audience,
      tags: ['auth', 'token', contract.algorithm, ...contract.tags],
      metadata: { issuer: contract.issuer, expiresInSeconds: contract.expiresInSeconds, runtime: contract.runtime }
    })),
    ...manifest.runtimeGrants.map((grant) => ({
      id: 'auth-runtime-grant:' + grant.id,
      kind: 'auth-runtime-grant',
      title: grant.resource,
      package: manifest.package,
      resource: grant.resource,
      tags: ['auth', 'runtime-grant', grant.runtime, ...grant.tags],
      metadata: { contract: grant.contract, audience: grant.audience, ttlSeconds: grant.ttlSeconds }
    }))
  ];
  const edges: FrontierAuthRegistryEdge[] = [
    ...manifest.providers.map((provider) => ({ from: 'auth:' + manifest.id, to: 'auth-provider:' + provider.id, kind: 'declares' })),
    ...manifest.gates.map((gate) => ({ from: 'auth:' + manifest.id, to: 'auth-gate:' + gate.id, kind: 'protects' })),
    ...manifest.capabilities.flatMap((capability) => [
      { from: 'auth:' + manifest.id, to: 'auth-capability:' + capability.id, kind: 'declares' },
      ...(capability.gate ? [{ from: 'auth-capability:' + capability.id, to: 'auth-gate:' + capability.gate, kind: 'requires' }] : [])
    ]),
    ...manifest.runtimeGrants.map((grant) => ({ from: 'auth-runtime-grant:' + grant.id, to: 'auth-token:' + grant.contract, kind: 'issues' }))
  ];
  return {
    kind: FRONTIER_AUTH_REGISTRY_KIND,
    version: FRONTIER_AUTH_REGISTRY_VERSION,
    id: manifest.id + '.auth.registry',
    entries,
    edges,
    summary: {
      entries: entries.length,
      edges: edges.length
    }
  };
}

export function createAuthLintResources(manifestInput: FrontierAuthManifestInput | FrontierAuthManifest): FrontierAuthLintResource[] {
  const manifest = isAuthManifest(manifestInput) ? manifestInput : createAuthManifest(manifestInput);
  return [
    {
      id: 'auth:' + manifest.id,
      kind: 'auth',
      package: manifest.package,
      owner: manifest.owner,
      tags: ['auth', ...manifest.tags],
      metadata: manifest.summary as unknown as JsonObject
    },
    ...manifest.gates.map((gate) => ({
      id: 'auth-gate:' + gate.id,
      kind: gate.route ? 'route' : 'resource',
      package: manifest.package,
      effects: gate.effect ? [gate.effect] : [],
      tags: ['auth', 'gate', gate.required ? 'required' : 'optional', ...gate.tags],
      metadata: {
        resource: gate.resource,
        route: gate.route ?? '',
        roles: gate.roles,
        access: gate.access,
        legal: gate.legal,
        profile: gate.profile
      }
    })),
    ...manifest.tokenContracts.map((contract) => ({
      id: 'auth-token:' + contract.id,
      kind: 'resource',
      package: manifest.package,
      tags: ['auth', 'token', ...contract.tags],
      metadata: {
        kind: contract.kind,
        audience: contract.audience,
        issuer: contract.issuer,
        runtime: contract.runtime
      }
    }))
  ];
}

export function createAuthEvidence(input: {
  appId?: string;
  manifest: FrontierAuthManifestInput | FrontierAuthManifest;
  decisions?: readonly FrontierAuthDecision[];
  audit?: readonly FrontierAuthAuditEvent[];
  generatedAt?: string;
}): FrontierAuthEvidence {
  const manifest = isAuthManifest(input.manifest) ? input.manifest : createAuthManifest(input.manifest);
  return {
    kind: 'frontier.auth.evidence',
    appId: normalizeString(input.appId) || manifest.id,
    generatedAt: normalizeString(input.generatedAt) || new Date(0).toISOString(),
    manifest,
    registry: createAuthRegistryGraph(manifest),
    lintResources: createAuthLintResources(manifest),
    decisions: input.decisions ? [...input.decisions] : undefined,
    audit: input.audit ? [...input.audit] : undefined
  };
}

export function redactAuthRecord<T extends JsonValue>(value: T, sensitiveClaims: readonly string[] = []): T {
  const sensitive = new Set(sensitiveClaims.map(normalizeComparable));
  return redactValue(value, sensitive) as T;
}

function normalizeProvider(input: FrontierAuthProviderInput, index: number): FrontierAuthProvider {
  const kind = normalizeString(input.kind) || 'custom';
  const id = normalizeString(input.id) || slugify([kind, input.issuer ?? index].join('-'));
  return {
    id,
    kind,
    issuer: normalizeOptionalString(input.issuer),
    authorizationEndpoint: normalizeOptionalString(input.authorizationEndpoint),
    tokenEndpoint: normalizeOptionalString(input.tokenEndpoint),
    jwksEndpoint: normalizeOptionalString(input.jwksEndpoint),
    scopes: uniqueStrings(input.scopes ?? []),
    pkce: input.pkce ?? (kind === 'oauth' || kind === 'oidc'),
    state: input.state ?? (kind === 'oauth' || kind === 'oidc'),
    nonce: input.nonce ?? kind === 'oidc',
    enabled: input.enabled ?? true,
    runtime: uniqueStrings(input.runtime ?? ['browser', 'node']),
    claims: uniqueStrings(input.claims ?? ['sub', 'email', 'name', 'picture']),
    tags: uniqueStrings([kind, ...(input.tags ?? [])]),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeSessionConfig(input: FrontierAuthSessionConfigInput = {}): FrontierAuthSessionConfig {
  return {
    strategy: input.strategy ?? 'jwt',
    cookieName: normalizeString(input.cookieName) || 'frontier_session',
    ttlSeconds: normalizePositiveInteger(input.ttlSeconds, 60 * 60 * 24 * 7),
    refreshSeconds: normalizePositiveInteger(input.refreshSeconds, 60 * 60),
    csrfProtection: input.csrfProtection ?? true,
    httpOnly: input.httpOnly ?? true,
    secure: input.secure ?? true,
    sameSite: normalizeString(input.sameSite) || 'lax',
    subjectPath: normalizeString(input.subjectPath) || '/sub',
    providerPath: normalizeString(input.providerPath) || '/provider',
    rolePath: normalizeString(input.rolePath) || '/role',
    profileCompletePath: normalizeString(input.profileCompletePath) || '/profileComplete',
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeProfileRequirement(input: FrontierAuthProfileRequirementInput | FrontierAuthProfileRequirement = {}): FrontierAuthProfileRequirement {
  return {
    requireSubject: input.requireSubject ?? true,
    requireEmail: input.requireEmail ?? false,
    requireProvider: input.requireProvider ?? false,
    fields: uniqueStrings(input.fields ?? []),
    access: uniqueStrings(input.access ?? []),
    legal: uniqueStrings(input.legal ?? []),
    claims: (input.claims ?? []).map(normalizeClaimRequirement),
    mode: normalizeString(input.mode) || 'all',
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeClaimRequirement(input: FrontierAuthClaimRequirementInput): FrontierAuthClaimRequirement {
  const claim = normalizeString(input.claim);
  return {
    claim,
    source: normalizeString(input.source) || 'claims',
    equals: input.equals,
    oneOf: [...(input.oneOf ?? [])],
    truthy: input.truthy ?? (input.equals === undefined && input.oneOf === undefined),
    exists: input.exists ?? true,
    code: normalizeString(input.code) || 'claim-required',
    reason: normalizeString(input.reason) || claim + ' claim is required'
  };
}

function normalizeGate(input: FrontierAuthGateInput | FrontierAuthGate, index = 0): FrontierAuthGate {
  const resource = normalizeString(input.resource ?? input.route ?? input.effect) || 'auth-resource-' + index;
  return {
    id: normalizeString(input.id) || slugify(resource),
    resource,
    route: normalizeOptionalString(input.route),
    effect: normalizeOptionalString(input.effect),
    required: input.required ?? true,
    roles: uniqueStrings(input.roles ?? []),
    access: uniqueStrings(input.access ?? []),
    legal: uniqueStrings(input.legal ?? []),
    claims: (input.claims ?? []).map(normalizeClaimRequirement),
    profile: input.profile ?? false,
    redirectTo: normalizeOptionalString(input.redirectTo),
    status: normalizePositiveInteger(input.status, 403),
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeCapability(input: FrontierAuthCapabilityInput, index: number): FrontierAuthCapability {
  const action = normalizeString(input.action) || 'auth.capability.' + index;
  return {
    id: normalizeString(input.id) || slugify(action),
    action,
    resource: normalizeString(input.resource) || action,
    gate: normalizeOptionalString(input.gate),
    roles: uniqueStrings(input.roles ?? []),
    claims: (input.claims ?? []).map(normalizeClaimRequirement),
    effects: uniqueStrings(input.effects ?? []),
    tools: uniqueStrings(input.tools ?? []),
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeTokenContract(input: FrontierAuthTokenContractInput | FrontierAuthTokenContract, index = 0): FrontierAuthTokenContract {
  const kind = normalizeString(input.kind) || 'session';
  return {
    id: normalizeString(input.id) || slugify([kind, input.audience ?? index].join('-')),
    kind,
    issuer: normalizeString(input.issuer) || 'frontier.app',
    audience: normalizeString(input.audience) || 'frontier-api',
    subjectPath: normalizeString(input.subjectPath) || '/sub',
    algorithm: input.algorithm ?? 'HS256',
    expiresInSeconds: normalizePositiveInteger(input.expiresInSeconds, 15 * 60),
    requiredClaims: uniqueStrings(input.requiredClaims ?? ['sub']),
    sensitiveClaims: uniqueStrings(input.sensitiveClaims ?? ['token', 'secret', 'password', 'authorization', 'cookie', 'refresh_token', 'access_token']),
    replayProtection: input.replayProtection ?? true,
    runtime: uniqueStrings(input.runtime ?? ['node', 'edge']),
    tags: uniqueStrings([kind, ...(input.tags ?? [])]),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeRuntimeGrant(input: FrontierAuthRuntimeGrantInput, contracts: readonly FrontierAuthTokenContract[]): FrontierAuthRuntimeGrant {
  const contract = normalizeString(input.contract) || contracts[0]?.id || 'session-token';
  const resource = normalizeString(input.resource) || 'runtime';
  return {
    id: normalizeString(input.id) || slugify([resource, contract].join('-')),
    contract,
    resource,
    audience: normalizeString(input.audience) || contracts.find((item) => item.id === contract)?.audience || resource,
    subject: normalizeOptionalString(input.subject),
    requiredClaims: uniqueStrings(input.requiredClaims ?? []),
    ttlSeconds: normalizePositiveInteger(input.ttlSeconds, contracts.find((item) => item.id === contract)?.expiresInSeconds ?? 15 * 60),
    runtime: input.runtime ?? 'node',
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeLinkingPolicy(input: FrontierAuthLinkingPolicyInput | FrontierAuthLinkingPolicy = {}): FrontierAuthLinkingPolicy {
  return {
    providerFirst: input.providerFirst ?? true,
    allowEmailFallback: input.allowEmailFallback ?? true,
    allowRelink: input.allowRelink ?? false,
    attachProviderAccount: input.attachProviderAccount ?? true,
    identityKeys: uniqueStrings(input.identityKeys ?? ['provider', 'providerAccountId']),
    fallbackKeys: uniqueStrings(input.fallbackKeys ?? ['email']),
    reservedEmails: uniqueStrings(input.reservedEmails ?? []).map(normalizeComparable),
    reservedUsernames: uniqueStrings(input.reservedUsernames ?? []).map(normalizeComparable),
    tags: uniqueStrings(input.tags ?? []),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeIdentityCandidate(input: FrontierAuthIdentityCandidateInput, fallbackId: string): FrontierAuthIdentityCandidate {
  const provider = normalizeOptionalString(input.provider);
  const providerAccountId = normalizeOptionalString(input.providerAccountId);
  const email = normalizeOptionalString(input.email);
  const username = normalizeOptionalString(input.username);
  return {
    id: normalizeString(input.id) || slugify([provider, providerAccountId, email, username, fallbackId].filter(Boolean).join('-')),
    provider,
    providerAccountId,
    email,
    username,
    linkedProviderAccountId: normalizeOptionalString(input.linkedProviderAccountId),
    source: normalizeString(input.source) || fallbackId,
    reserved: input.reserved ?? false,
    metadata: toJsonObject(input.metadata)
  };
}

function resolveGate(
  manifestOrGate: FrontierAuthManifest | FrontierAuthGateInput | FrontierAuthGate,
  gateIdOrInput?: string | FrontierAuthGateInput | FrontierAuthGate
): FrontierAuthGate {
  if (isAuthManifest(manifestOrGate)) {
    if (typeof gateIdOrInput === 'string') {
      const found = manifestOrGate.gates.find((gate) => gate.id === gateIdOrInput || gate.resource === gateIdOrInput || gate.route === gateIdOrInput);
      if (found) return found;
      return normalizeGate({ id: gateIdOrInput, resource: gateIdOrInput });
    }
    if (gateIdOrInput) return normalizeGate(gateIdOrInput);
    return manifestOrGate.gates[0] ?? normalizeGate({ id: 'default', resource: 'default', required: false });
  }
  return normalizeGate(manifestOrGate);
}

function createDecision(
  gate: FrontierAuthGate,
  session: FrontierAuthSession | undefined,
  allow: boolean,
  reasons: string[],
  missing: string[],
  matchedRoles: string[]
): FrontierAuthDecision {
  return {
    kind: FRONTIER_AUTH_DECISION_KIND,
    version: FRONTIER_AUTH_DECISION_VERSION,
    id: slugify([gate.id, session?.subject ?? 'anonymous', allow ? 'allow' : 'deny'].join('-')),
    status: allow ? 'allow' : 'deny',
    allow,
    gate: gate.id,
    subject: session?.subject,
    provider: session?.provider,
    resource: gate.resource,
    reasons: uniqueStrings(reasons),
    missing: uniqueStrings(missing),
    requiredRoles: [...gate.roles],
    matchedRoles: uniqueStrings(matchedRoles),
    metadata: {
      route: gate.route ?? '',
      effect: gate.effect ?? '',
      status: gate.status,
      redirectTo: gate.redirectTo ?? ''
    }
  };
}

function checkClaimRequirement(session: FrontierAuthSession, requirement: FrontierAuthClaimRequirement): boolean {
  const value = readSessionValue(session, requirement.claim, requirement.source);
  if (requirement.exists && value === undefined) return false;
  if (requirement.equals !== undefined && !jsonValueEquals(value, requirement.equals)) return false;
  if (requirement.oneOf.length > 0 && !requirement.oneOf.some((item) => jsonValueEquals(value, item))) return false;
  if (requirement.truthy && !truthyValue(value)) return false;
  return true;
}

function readSessionValue(session: FrontierAuthSession, path: string, source: string): JsonValue | undefined {
  if (source === 'access') return readPath(session.access, path);
  if (source === 'legal') return readPath(session.legal, path);
  if (source === 'metadata') return readPath(session.metadata, path);
  if (source === 'session') return readPath(session as unknown as JsonObject, path);
  const direct = readPath(session.claims, path);
  if (direct !== undefined) return direct;
  return readPath(session as unknown as JsonObject, path);
}

function readPath(value: JsonValue | undefined, path: string): JsonValue | undefined {
  if (value === undefined) return undefined;
  const segments = path.startsWith('/')
    ? path.slice(1).split('/').map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
    : path.split('.');
  let current: JsonValue | undefined = value;
  for (const segment of segments) {
    if (!segment) continue;
    if (current === null || typeof current !== 'object') return undefined;
    if (Array.isArray(current)) {
      const index = Number(segment);
      current = Number.isInteger(index) ? current[index] : undefined;
    } else {
      current = current[segment];
    }
  }
  return current;
}

function normalizeFlagRecord(input: Record<string, unknown> | readonly string[] | undefined): JsonObject {
  const out: JsonObject = {};
  if (!input) return out;
  if (Array.isArray(input)) {
    for (const key of input) {
      const normalized = normalizeString(key);
      if (normalized) out[normalized] = true;
    }
    return out;
  }
  for (const [key, value] of Object.entries(input)) {
    if (!key) continue;
    out[key] = Boolean(value);
  }
  return out;
}

function redactByClaimNames(value: JsonObject, sensitiveClaims: readonly string[]): JsonObject {
  const out: JsonObject = {};
  const sensitive = new Set(sensitiveClaims.map(normalizeComparable));
  for (const [key, item] of Object.entries(value)) {
    out[key] = sensitive.has(normalizeComparable(key)) ? '[REDACTED]' : item;
  }
  return out;
}

function redactValue(value: JsonValue, sensitive: ReadonlySet<string>): JsonValue {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => redactValue(item, sensitive));
  const out: JsonObject = {};
  for (const [key, item] of Object.entries(value)) {
    const normalized = normalizeComparable(key);
    out[key] = sensitive.has(normalized) || /token|secret|password|authorization|cookie|credential/i.test(key)
      ? '[REDACTED]'
      : redactValue(item, sensitive);
  }
  return out;
}

function isReservedIdentity(candidate: FrontierAuthIdentityCandidate, policy: FrontierAuthLinkingPolicy): boolean {
  if (candidate.reserved) return true;
  if (candidate.email && policy.reservedEmails.includes(normalizeComparable(candidate.email))) return true;
  if (candidate.username && policy.reservedUsernames.includes(normalizeComparable(candidate.username))) return true;
  return false;
}

function normalizeIssuedAt(value: number | string | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return Math.floor(parsed / 1000);
  }
  return 0;
}

function toJsonObject(value: unknown): JsonObject {
  const json = toJsonValue(value);
  return json && typeof json === 'object' && !Array.isArray(json) ? json : {};
}

function toJsonValue(value: unknown): JsonValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (typeof value === 'object') {
    const out: JsonObject = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) out[key] = toJsonValue(item);
    return out;
  }
  return String(value);
}

function readString(value: JsonObject, key: string): string | undefined {
  const item = value[key];
  return typeof item === 'string' && item.trim() ? item.trim() : undefined;
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function normalizeComparable(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : fallback;
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

function truthyValue(value: JsonValue | undefined): boolean {
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.trim() !== '' && value !== 'false' && value !== '0';
  if (Array.isArray(value)) return value.length > 0;
  return Object.keys(value).length > 0;
}

function jsonValueEquals(a: JsonValue | undefined, b: JsonValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isAuthManifest(value: unknown): value is FrontierAuthManifest {
  return Boolean(value && typeof value === 'object' && (value as FrontierAuthManifest).kind === FRONTIER_AUTH_MANIFEST_KIND);
}

function isAuthSession(value: unknown): value is FrontierAuthSession {
  return Boolean(value && typeof value === 'object' && (value as FrontierAuthSession).kind === FRONTIER_AUTH_SESSION_KIND);
}

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'frontier-auth';
}
