import * as fs from 'fs';
import * as path from 'path';

/** Shape of a parsed package entry */
export interface PackageEntry {
  name: string;
  version: string;
}

/** Result returned by parseDependencies */
export interface DependencyMap {
  dependencies: PackageEntry[];
  devDependencies: PackageEntry[];
}

/** Raw shape we expect from package.json (partial) */
interface RawPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Reads and parses the workspace package.json.
 * Returns empty arrays if the file is missing or malformed.
 *
 * @param workspaceRoot - Absolute path to the workspace root folder
 */
export function parseDependencies(workspaceRoot: string): DependencyMap {
  const pkgPath = path.join(workspaceRoot, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return { dependencies: [], devDependencies: [] };
  }

  let raw: unknown;
  try {
    const content = fs.readFileSync(pkgPath, 'utf-8');
    raw = JSON.parse(content);
  } catch {
    // Malformed JSON — treat as empty
    return { dependencies: [], devDependencies: [] };
  }

  if (!isRawPackageJson(raw)) {
    return { dependencies: [], devDependencies: [] };
  }

  return {
    dependencies: recordToEntries(raw.dependencies),
    devDependencies: recordToEntries(raw.devDependencies),
  };
}

/** Type guard for the raw package.json shape */
function isRawPackageJson(value: unknown): value is RawPackageJson {
  return typeof value === 'object' && value !== null;
}

/** Converts a Record<string, string> to PackageEntry[] */
function recordToEntries(
  record: Record<string, string> | undefined
): PackageEntry[] {
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([name, version]) => ({ name, version }));
}
