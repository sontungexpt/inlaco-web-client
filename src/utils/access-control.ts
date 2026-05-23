export interface AccessHelpers {
  roles: string[];

  includesRole: (role: string) => boolean;

  includesAllRoles: (roles: string[]) => boolean;
}

export interface AccessControl {
  anyOf?: string[];

  allOf?: string[];

  exclude?: string[];

  exact?: string[];

  predicate?: (helpers: AccessHelpers) => boolean;
}

export const canAccess = (
  helpers: AccessHelpers,
  access?: AccessControl,
): boolean => {
  if (!access) {
    return true;
  }

  const {
    anyOf = [],
    allOf = [],
    exclude = [],
    exact = [],
    predicate,
  } = access;

  /* =========================================================================
   * EXCLUDE
   * ========================================================================= */

  if (exclude.some(helpers.includesRole)) {
    return false;
  }

  /* =========================================================================
   * EXACT
   * ========================================================================= */

  if (exact.length > 0) {
    return (
      exact.length === helpers.roles.length && exact.every(helpers.includesRole)
    );
  }

  /* =========================================================================
   * ANY OF
   * ========================================================================= */

  if (anyOf.length > 0 && !anyOf.some(helpers.includesRole)) {
    return false;
  }

  /* =========================================================================
   * ALL OF
   * ========================================================================= */

  if (allOf.length > 0 && !helpers.includesAllRoles(allOf)) {
    return false;
  }

  /* =========================================================================
   * PREDICATE
   * ========================================================================= */

  if (predicate) {
    return predicate(helpers);
  }

  return true;
};
