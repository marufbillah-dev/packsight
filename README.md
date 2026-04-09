# PackSight – Visual Package Manager

Visually explore, manage, and audit npm dependencies directly inside VS Code.

## Features

- **Dependency tree** — browse `dependencies` and `devDependencies` in a sidebar
- **Unused detection** — AST-based scan flags packages not imported anywhere (⚠️)
- **Outdated packages** — highlights packages with newer versions available (🔼)
- **Uninstall** — right-click any package to uninstall it
- **Update** — right-click to update a package to `@latest`
- **Auto-refresh** — tree updates automatically when `package.json` changes
- **Copy name** — right-click to copy a package name to clipboard

## Requirements

- Node.js 18+
- npm

## Usage

Open any folder containing a `package.json`. The PackSight icon appears in the Activity Bar.
