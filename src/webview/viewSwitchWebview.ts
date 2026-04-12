import * as vscode from 'vscode';

/**
 * Sidebar webview that renders a single styled toggle button:
 * 'Open Package Manager' or 'Switch to Tree View' depending on state.
 *
 * setDashboardOpen() must be called whenever the dashboard opens or closes
 * (including when the user manually closes the panel tab).
 */
export class ViewSwitchWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'packSight.viewSwitch';

  private view?: vscode.WebviewView;
  private dashboardOpen = false;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext,
    private readonly workspaceRoot: string,
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.render();

    webviewView.webview.onDidReceiveMessage((msg: { command: string }) => {
      if (msg.command === 'switchToDashboard') {
        void vscode.commands.executeCommand('packSight.switchToDashboard');
      } else if (msg.command === 'switchToTreeView') {
        void vscode.commands.executeCommand('packSight.switchToTreeView');
      }
    });
  }

  public setDashboardOpen(open: boolean): void {
    this.dashboardOpen = open;
    this.render();
  }

  private render(): void {
    if (!this.view) { return; }
    this.view.webview.html = this.getHtml();
  }

  private getHtml(): string {
    const isDash = this.dashboardOpen;
    const btnLabel = isDash ? '🌲  Switch to Tree View' : '⚡  Open Dashboard View';
    const btnCmd   = isDash ? 'switchToTreeView' : 'switchToDashboard';

    return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      padding: 6px 10px 8px;
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      background: transparent;
    }
    button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 10px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      font-size: 0.88em;
      font-family: var(--vscode-font-family);
      font-weight: 600;
      cursor: pointer;
      transition: background 120ms ease;
      letter-spacing: 0.01em;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button:active { opacity: 0.85; }
  </style>
</head>
<body>
  <button onclick="go()">${btnLabel}</button>
  <script>
    const vscode = acquireVsCodeApi();
    function go() { vscode.postMessage({ command: '${btnCmd}' }); }
  </script>
</body>
</html>`;
  }
}
