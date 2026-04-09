import * as vscode from 'vscode';

/** Discriminates between group nodes and package leaf nodes */
export type DependencyItemKind = 'group' | 'package' | 'loading' | 'error';

/** All data needed to construct a DependencyItem */
export interface DependencyItemOptions {
  kind: DependencyItemKind;
  label: string;
  packageName: string;
  packageVersion: string;
  isDev: boolean;
  collapsibleState: vscode.TreeItemCollapsibleState;
  /** Optional badge text shown next to the group label (e.g. "3 unused") */
  badge?: string;
  /** Whether this package was not found in any scanned source file */
  isUnused?: boolean;
  /** Latest version available on the registry, if newer than installed */
  latestVersion?: string;
}

/**
 * A single node in the NPM UI tree view.
 *
 * Kinds:
 * - `group`   → top-level "Dependencies" / "Dev Dependencies" header
 * - `package` → individual npm package leaf node
 * - `loading` → spinner shown while scanning
 * - `error`   → shown when package.json is missing or unreadable
 */
export class DependencyItem extends vscode.TreeItem {
  public readonly kind: DependencyItemKind;
  public readonly packageName: string;
  public readonly packageVersion: string;
  public readonly isDev: boolean;
  public readonly isUnused: boolean;
  public readonly latestVersion: string | undefined;

  constructor(options: DependencyItemOptions) {
    const label =
      options.kind === 'package' && options.isUnused
        ? `⚠️ ${options.label}`
        : options.label;

    super(label, options.collapsibleState);

    this.kind = options.kind;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    this.isDev = options.isDev;
    this.isUnused = options.isUnused ?? false;
    this.latestVersion = options.latestVersion;

    if (options.kind === 'package') {
      this.description = options.packageVersion;
      this.contextValue = 'package';

      const isOutdated = Boolean(options.latestVersion);

      if (isOutdated) {
        this.iconPath = new vscode.ThemeIcon(
          'arrow-up',
          new vscode.ThemeColor('charts.green')
        );
      } else if (options.isUnused) {
        this.iconPath = new vscode.ThemeIcon('warning');
      } else {
        this.iconPath = new vscode.ThemeIcon('package');
      }

      const unusedNote = options.isUnused
        ? '\n\n⚠️ _Not found in any scanned source file_'
        : '';
      const outdatedNote = isOutdated
        ? `\n\n🔼 **Update available:** \`${options.packageVersion}\` → \`${options.latestVersion}\``
        : '';

      this.tooltip = new vscode.MarkdownString(
        `**${options.packageName}**\n\n` +
          `Version: \`${options.packageVersion}\`\n\n` +
          `${options.isDev ? '_Dev dependency_' : '_Dependency_'}` +
          outdatedNote +
          unusedNote
      );
    } else if (options.kind === 'loading') {
      this.iconPath = new vscode.ThemeIcon('loading~spin');
      this.contextValue = 'loading';
    } else if (options.kind === 'error') {
      this.iconPath = new vscode.ThemeIcon('error');
      this.contextValue = 'error';
    } else {
      // group
      this.contextValue = 'group';
      this.iconPath = new vscode.ThemeIcon(
        options.isDev ? 'tools' : 'library'
      );
      if (options.badge) {
        this.description = options.badge;
      }
    }
  }

  // ─── Static factories ──────────────────────────────────────────────────────

  /** Creates a spinner node shown while scanning is in progress */
  public static createLoading(): DependencyItem {
    return new DependencyItem({
      kind: 'loading',
      label: 'Scanning dependencies…',
      packageName: '',
      packageVersion: '',
      isDev: false,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    });
  }

  /** Creates an error node shown when package.json is missing or malformed */
  public static createError(message: string): DependencyItem {
    return new DependencyItem({
      kind: 'error',
      label: message,
      packageName: '',
      packageVersion: '',
      isDev: false,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    });
  }
}
