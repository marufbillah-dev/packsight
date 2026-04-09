import * as vscode from 'vscode';
import { DependencyItem } from '../tree/dependencyItem';
import { DependencyTreeProvider } from '../tree/dependencyTreeProvider';
import { runCommand } from '../services/npmService';

/**
 * Handles the `packSight.update` command (tree-view right-click).
 *
 * Uses runCommand (child_process.exec) instead of runInTerminal so that:
 *  - Exit code is actually checked — failure shows an error, not false success
 *  - Works cross-platform without shell-separator issues (no `; exit` needed)
 *  - Respects the packSight.updateFlags setting (default: --legacy-peer-deps)
 */
export async function updateCommand(
  item: DependencyItem,
  provider: DependencyTreeProvider,
  workspaceRoot: string
): Promise<void> {
  if (item.kind !== 'package') {
    return;
  }

  const { packageName, packageVersion, latestVersion } = item;

  // ── 1. Confirm ──────────────────────────────────────────────────────────────
  const versionHint = latestVersion
    ? ` (${packageVersion} → ${latestVersion})`
    : '';

  const answer = await vscode.window.showInformationMessage(
    `Update "${packageName}" to latest${versionHint}?`,
    { modal: true },
    'Update'
  );

  if (answer !== 'Update') {
    return;
  }

  // ── 2. Build command ────────────────────────────────────────────────────────
  const cfg = vscode.workspace.getConfiguration('packSight');
  const flags = cfg.get<string>('updateFlags', '--legacy-peer-deps').trim();
  const flagStr = flags.length > 0 ? ` ${flags}` : '';
  const command = `npm install ${packageName}@latest${flagStr}`;

  // ── 3. Run with progress notification ──────────────────────────────────────
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `PackSight: Updating "${packageName}"…`,
      cancellable: false,
    },
    async () => {
      try {
        await runCommand(command, workspaceRoot);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown error during update';
        vscode.window.showErrorMessage(`PackSight: Update failed — ${message}`);
        return;
      }

      // ── 4. Refresh tree ───────────────────────────────────────────────────
      provider.refresh();
      vscode.window.showInformationMessage(
        `PackSight: "${packageName}" updated successfully.`
      );
    }
  );
}
