/**
 * Extracts the root package name from an import specifier.
 *
 * Rules:
 *  - Relative imports (`./foo`, `../bar`) → returns null (not a package)
 *  - Scoped:   `@scope/pkg/sub/path`  → `@scope/pkg`
 *  - Normal:   `pkg/sub/path`         → `pkg`
 *  - Bare:     `pkg`                  → `pkg`
 *
 * @param specifier - The raw import string, e.g. `'lodash/merge'`
 * @returns The npm package name, or `null` for relative/built-in paths
 */
export function extractPackageName(specifier: string): string | null {
  // Relative imports are never npm packages
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return null;
  }

  // Node built-ins with the `node:` prefix
  if (specifier.startsWith('node:')) {
    return null;
  }

  if (specifier.startsWith('@')) {
    // Scoped: take the first two segments → `@scope/pkg`
    const parts = specifier.split('/');
    if (parts.length < 2) {
      return null; // malformed scoped specifier
    }
    return `${parts[0]}/${parts[1]}`;
  }

  // Normal: take everything up to the first `/`
  const slash = specifier.indexOf('/');
  return slash === -1 ? specifier : specifier.slice(0, slash);
}
