import * as vscode from 'vscode';

const REPO = 'https://github.com/imarufbillah/packsight';

interface LinkDef {
  label: string;
  icon: string;
  url: string;
  tooltip: string;
}

const LINKS: LinkDef[] = [
  {
    label: '⭐ Give a Star',
    icon: 'star-full',
    url: REPO,
    tooltip: 'Star PackSight on GitHub — it helps a lot!',
  },
  {
    label: '📖 Documentation',
    icon: 'book',
    url: `${REPO}#readme`,
    tooltip: 'Read the PackSight README and documentation',
  },
  {
    label: '🐛 Report an Issue',
    icon: 'bug',
    url: `${REPO}/issues/new`,
    tooltip: 'Open a bug report or feature request on GitHub',
  },
  {
    label: '💡 Feature Request',
    icon: 'lightbulb',
    url: `${REPO}/issues/new?labels=enhancement`,
    tooltip: 'Suggest a new feature for PackSight',
  },
  {
    label: '📋 Changelog',
    icon: 'history',
    url: `${REPO}/releases`,
    tooltip: 'View the full release history and changelog',
  },
  {
    label: '🤝 Contribute',
    icon: 'git-pull-request',
    url: `${REPO}/blob/main/CONTRIBUTING.md`,
    tooltip: 'Learn how to contribute to PackSight',
  },
  {
    label: '👤 Maruf Billah',
    icon: 'account',
    url: 'https://github.com/imarufbillah',
    tooltip: 'PackSight is made by Maruf Billah — visit his GitHub profile',
  },
];

export class QuickLinkItem extends vscode.TreeItem {
  public readonly url: string;

  constructor(def: LinkDef) {
    super(def.label, vscode.TreeItemCollapsibleState.None);
    this.url = def.url;
    this.iconPath = new vscode.ThemeIcon(def.icon);
    this.tooltip = def.tooltip;
    this.command = {
      command: 'packSight.openLink',
      title: def.label,
      arguments: [def.url],
    };
    this.contextValue = 'quickLink';
  }
}

export class QuickLinksProvider implements vscode.TreeDataProvider<QuickLinkItem> {
  public getTreeItem(element: QuickLinkItem): vscode.TreeItem {
    return element;
  }

  public getChildren(): QuickLinkItem[] {
    return LINKS.map(def => new QuickLinkItem(def));
  }
}
