import * as fs from 'fs';
import * as path from 'path';
import { SCAN_EXCLUDE_DIRS, SCAN_EXTENSIONS } from '../constants';

/**
 * Recursively walks `dir` and collects all source files whose extension
 * is in `SCAN_EXTENSIONS`, skipping any directory in `SCAN_EXCLUDE_DIRS`.
 *
 * @param dir - Absolute path to start walking from
 * @returns Absolute paths of all matching source files
 */
export function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  walkDir(dir, results);
  return results;
}

function walkDir(dir: string, results: string[]): void {
  let entries: fs.Dirent[];

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    // Unreadable directory — skip silently
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SCAN_EXCLUDE_DIRS.includes(entry.name as typeof SCAN_EXCLUDE_DIRS[number])) {
        continue;
      }
      walkDir(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext as typeof SCAN_EXTENSIONS[number])) {
        results.push(fullPath);
      }
    }
  }
}
