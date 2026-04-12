import * as vscode from 'vscode';

/**
 * Provides the "View" section at the top of the sidebar with two
 * toggle buttons: Switch to Dashboard / Switch to Tree View.
 */
export class ViewSwitchItem extends vscode.TreeItem {
  constructor(
    label: string,
    command: string,
    iconId: string,
    tooltip: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = { command, title: label, arguments: [] };
    this.iconPath = new vscode.ThemeIcon(iconId);
    this.tooltip = tooltip;
    this.contextValue = 'viewSwitch';
  }
}

export class ViewSwitchProvider implements vscode.TreeDataProvider<ViewSwitchItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private dashboardOpen = false;

  public setDashboardOpen(open: boolean): void {
    this.dashboardOpen = open;
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: ViewSwitchItem): vscode.TreeItem {
    return element;
  }

  public getChildren(): ViewSwitchItem[] {
    if (this.dashboardOpen) {
      return [
        new ViewSwitchItem(
          'Switch to Tree View',
          'packSight.switchToTreeView',
          'list-tree',
          'Switch back to the dependency tree view',
        ),
      ];
    }
    return [
      new ViewSwitchItem(
        'Open Package Manager Dashboard',
        'packSight.switchToDashboard',
        'layout-panel',
        'Open the visual Package Manager dashboard',
      ),
    ];
  }
}
