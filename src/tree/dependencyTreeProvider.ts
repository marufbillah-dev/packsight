import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { DependencyItem } from './dependencyItem';
import {
  parseDependencies,
  type DependencyMap,
  type PackageEntry,
} from '../services/dependencyService';
import { scanUsedPackages } from '../services/scanService';
import { getOutdatedPackages, type OutdatedEntry } from '../services/npmService';
import { dependencyChanged } from '../events/dependencyEventEmitter';

/**
 * Drives the NPM UI sidebar tree view.
 *
 * States:
 *  - No package.json  → single error node
 *  - Scanning         → spinner node at root while data loads
 *  - Ready            → two group nodes with annotated package leaves
 */
export class DependencyTreeProvider
  implements vscode.TreeDataProvider<DependencyItem>
{
  private readonly _onDidChangeTreeData =
    new vscode.EventEmitter<DependencyItem | undefined | void>();

  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private dependencyMap: DependencyMap = { dependencies: [], devDependencies: [] };
  private usedPackages: Set<string> = new Set();
  private outdatedMap: Map<string, OutdatedEntry> = new Map();

  /** True while the background scan is running — shows spinner */
  private scanning = false;

  /** True when this is the very first load (no data yet) */
  private initialLoad = true;

  /** True when package.json was missing or unreadable on last load */
  private hasError = false;

  constructor(private readonly workspaceRoot: string) {
    this.loadAndScan();
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /** Reloads package.json and re-scans source files, then re-renders the tree. */
  public refresh(): void {
    this.loadAndScan();
  }

  /**
   * Total number of packages across both groups.
   * Used by extension.ts to update the tree view title badge.
   */
  public getTotalCount(): number {
    return (
      this.dependencyMap.dependencies.length +
      this.dependencyMap.devDependencies.length
    );
  }

  // ─── TreeDataProvider ────────────────────────────────────────────────────────

  public getTreeItem(element: DependencyItem): vscode.TreeItem {
    return element;
  }

  public getChildren(element?: DependencyItem): DependencyItem[] {
    // Root level
    if (!element) {
      if (this.hasError) {
        return [DependencyItem.createError('No package.json found in workspace')];
      }
      if (this.scanning) {
        return [DependencyItem.createLoading()];
      }
      return this.buildGroupNodes();
    }

    // Group children
    if (element.kind === 'group') {
      return this.buildPackageNodes(element.isDev);
    }

    return [];
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Loads package.json synchronously (fast), fires an immediate render,
   * then runs the heavier AST scan + npm outdated off the call stack.
   * Fires a second render when the scan completes.
   */
  private loadAndScan(): void {
    const pkgPath = path.join(this.workspaceRoot, 'package.json');
    this.hasError = !fs.existsSync(pkgPath);

    if (!this.hasError) {
      this.dependencyMap = parseDependencies(this.workspaceRoot);
    }

    // Show immediately — either error node or current (possibly stale) data
    this._onDidChangeTreeData.fire();

    if (this.hasError || this.scanning) {
      return;
    }

    this.scanning = true;
    // Only show the spinner on the very first load when there's no data yet.
    // On subsequent refreshes, keep showing the existing data silently.
    if (this.initialLoad) {
      this._onDidChangeTreeData.fire();
    }

    setImmediate(() => {
      void (async () => {
        try {
          const { dependencies, devDependencies } = parseDependencies(this.workspaceRoot);
          const allEntries = [
            ...dependencies.map(p => ({ name: p.name, version: p.version })),
            ...devDependencies.map(p => ({ name: p.name, version: p.version })),
          ];
          this.usedPackages = scanUsedPackages(this.workspaceRoot);
          this.outdatedMap  = await getOutdatedPackages(allEntries);
        } catch {
          this.usedPackages = new Set();
          this.outdatedMap  = new Map();
        } finally {
          this.scanning = false;
          this.initialLoad = false;
          this._onDidChangeTreeData.fire();
          dependencyChanged.fire();
        }
      })();
    });
  }

  private countUnused(entries: PackageEntry[]): number {
    return entries.filter((p) => !this.usedPackages.has(p.name)).length;
  }

  private buildGroupNodes(): DependencyItem[] {
    const deps = this.dependencyMap.dependencies;
    const devDeps = this.dependencyMap.devDependencies;

    const depUnused = this.countUnused(deps);
    const devUnused = this.countUnused(devDeps);

    const depBadge =
      depUnused > 0 ? `${deps.length} (${depUnused} unused)` : String(deps.length);
    const devBadge =
      devUnused > 0 ? `${devDeps.length} (${devUnused} unused)` : String(devDeps.length);

    const depsGroup = new DependencyItem({
      kind: 'group',
      label: 'Dependencies',
      packageName: '',
      packageVersion: '',
      isDev: false,
      badge: depBadge,
      collapsibleState:
        deps.length > 0
          ? vscode.TreeItemCollapsibleState.Expanded
          : vscode.TreeItemCollapsibleState.Collapsed,
    });

    const devGroup = new DependencyItem({
      kind: 'group',
      label: 'Dev Dependencies',
      packageName: '',
      packageVersion: '',
      isDev: true,
      badge: devBadge,
      collapsibleState:
        devDeps.length > 0
          ? vscode.TreeItemCollapsibleState.Expanded
          : vscode.TreeItemCollapsibleState.Collapsed,
    });

    return [depsGroup, devGroup];
  }

  private buildPackageNodes(isDev: boolean): DependencyItem[] {
    const entries: PackageEntry[] = isDev
      ? this.dependencyMap.devDependencies
      : this.dependencyMap.dependencies;

    return entries.map((pkg) => {
      const outdated = this.outdatedMap.get(pkg.name);
      return new DependencyItem({
        kind: 'package',
        label: pkg.name,
        packageName: pkg.name,
        packageVersion: pkg.version,
        isDev,
        isUnused: !this.usedPackages.has(pkg.name),
        latestVersion: outdated?.latest,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
      });
    });
  }
}
