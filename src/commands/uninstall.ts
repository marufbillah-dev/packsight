import * as vscode from 'vscode';
import { DependencyItem } from '../tree/dependencyItem';
import { DependencyTreeProvider } from '../tree/dependencyTreeProvider';
import { runCommand } from '../services/npmService';

/**
 * Handles the `packSight.uninstall` command (tree-view right-click).
 *
 * Uses runCommand (child_process.exec) instead of runInTerminal so that:
 *  - Exit code is actually checked — failure shows an error, not false success
 *  - Works cross-platform without shell-separator issues (no `; exit` needed)
 *  - Respects the packSight.uninstallFlags setting (default: --legacy-peer-deps)
 */
export async function uninstallCommand(
  item: DependencyItem,
  provider: DependencyTreeProvider,
  workspaceRoot: string
): Promise<void> {
  if (item.kind !== 'package') {
    return;
  }

  const { packageName, isDev } = item;

  // ── 1. Confirm ──────────────────────────────────────────────────────────────
  const answer = await vscode.window.showWarningMessage(
    `Uninstall "${packageName}"?`,
    { modal: true },
    'Uninstall'
  );

  if (answer !== 'Uninstall') {
    return;
  }

  // ── 2. Build command ────────────────────────────────────────────────────────
  const cfg = vscode.workspace.getConfiguration('packSight');
  const flags = cfg.get<string>('uninstallFlags', '--legacy-peer-deps').trim();
  const flagStr = flags.length > 0 ? ` ${flags}` : '';
  const saveFlag = isDev ? '--save-dev' : '--save';
  const command = `npm uninstall ${saveFlag} ${packageName}${flagStr}`;

  // ── 3. Run with progress notification ──────────────────────────────────────
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `PackSight: Uninstalling "${packageName}"…`,
      cancellable: false,
    },
    async () => {
      try {
        await runCommand(command, workspaceRoot);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown error during uninstall';
        vscode.window.showErrorMessage(`PackSight: Uninstall failed — ${message}`);
        return;
      }

      // ── 4. Refresh tree ───────────────────────────────────────────────────
      provider.refresh();
      vscode.window.showInformationMessage(
        `PackSight: "${packageName}" uninstalled successfully.`
      );
    }
  );
}
