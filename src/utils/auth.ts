import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js';
import type { User } from '../types';

/**
 * Map a Keycloak instance into the internal User representation.
 * Priority order to determine name: preferred_username > given_name + family_name > email username > 'User'.
 * Role determination:
 *  - Prefer realm_access.roles from Keycloak
 *  - If includes 'professor' -> role = 'professor'
 *  - Else if includes 'estudante' -> role = 'student'
 *  - Fallback: if any realm/client role contains 'prof' -> 'professor', otherwise 'student'
 */
export function mapKeycloakToUser(kc: Keycloak | null): { user: User | null; token: string | null } {
  if (!kc || !kc.authenticated || !kc.tokenParsed) return { user: null, token: null };

  const tp = kc.tokenParsed as KeycloakTokenParsed;
  // Use loose extraction with fallback to avoid over‑typing
  const raw: Record<string, unknown> = kc.tokenParsed as unknown as Record<string, unknown>;
  const preferredUsername = typeof raw.preferred_username === 'string' ? raw.preferred_username : '';
  const givenName = typeof raw.given_name === 'string' ? raw.given_name : '';
  const familyName = typeof raw.family_name === 'string' ? raw.family_name : '';
  const email = typeof raw.email === 'string' ? raw.email : '';
  type UnknownRecord = Record<string, unknown>;
  const realmAccess = raw.realm_access as UnknownRecord | undefined;
  const realmRoles: string[] = Array.isArray(realmAccess?.roles) ? realmAccess?.roles as string[] : [];
  const resourceAccess = (raw.resource_access as UnknownRecord | undefined) || {};
  const clientRoles: string[] = Object.values(resourceAccess).flatMap((val) => {
    const rec = val as UnknownRecord;
    if (Array.isArray(rec.roles)) return rec.roles as string[];
    return [];
  });
  let name = preferredUsername || `${givenName} ${familyName}`.trim() || (email ? email.split('@')[0] : 'User');
  name = name.trim();

  const allRoles = [...realmRoles, ...clientRoles].map(r => r.toLowerCase());
  // Explicit mapping first
  const isProfessorExplicit = allRoles.includes('professor');
  const isStudentExplicit = allRoles.includes('estudante');
  // Fallback heuristic
  const isProfessorHeuristic = allRoles.some(r => r.includes('prof'));
  const isProfessor = isProfessorExplicit || (!isStudentExplicit && isProfessorHeuristic);

  const user: User = {
    id: tp.sub || tp.sid || 'anonymous',
    name,
    givenName,
    familyName,
    email: email || `${preferredUsername}@example.com`,
    role: isProfessor ? 'professor' : 'student'
  };
  return { user, token: kc.token || null };
}
