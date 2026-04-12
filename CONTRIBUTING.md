# Contributing to PackSight

Thank you for taking the time to contribute! PackSight is an open-source project and all contributions are welcome — bug fixes, new features, documentation improvements, and more.

Please read this guide before opening a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Commit Convention](#commit-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- VS Code 1.85+

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/imarufbillah/packsight.git
cd packsight

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Open in VS Code
code .
```

Press `F5` to launch the **Extension Development Host** — a separate VS Code window with PackSight loaded.

### Watch Mode

During development, run the TypeScript compiler in watch mode so changes compile automatically:

```bash
npm run watch
```

After saving a `.ts` file, reload the Extension Development Host with `Ctrl+R` to pick up the changes.

---

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** in `src/`

3. **Compile** to verify no TypeScript errors:
   ```bash
   npm run compile
   ```

4. **Lint** your code:
   ```bash
   npm run lint
   ```

5. **Test manually** by pressing `F5` and exercising the changed functionality

6. **Commit** following the [commit convention](#commit-convention)

7. **Push** and open a pull request

---

## Project Structure

```
src/
├── commands/          # VS Code command handlers (refresh, uninstall, update, toggle)
├── events/            # Shared event emitters (dependencyChanged)
├── services/
│   ├── dependencyService.ts   # package.json parsing
│   ├── npmService.ts          # Registry fetching, audit, search, run commands
│   └── scanService.ts         # AST-based import scanning with caching
├── types/
│   └── dashboard.ts           # Shared TypeScript interfaces and message types
├── utils/
│   ├── fileScanner.ts         # Source file collection
│   └── packageNameExtractor.ts
├── webview/
│   ├── dashboardHtml.ts       # Full dashboard HTML/CSS/JS (inline)
│   ├── dashboardPanel.ts      # Dashboard panel lifecycle, caching, optimistic updates
│   ├── messageHandler.ts      # Webview ↔ extension message routing
│   ├── sidebarWebview.ts      # Unified sidebar webview provider
│   ├── viewSwitchWebview.ts   # Toggle button webview
│   └── quickLinksWebview.ts   # Quick links webview
└── extension.ts       # Activation entry point, command registration
```

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```
type(scope): short description

- bullet explaining what was added/changed
- bullet explaining why or what problem it solves
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (no logic change) |
| `chore` | Build process, dependencies, tooling |
| `docs` | Documentation only |
| `test` | Adding or updating tests |

**Rules:**
- Subject line under 72 characters
- Present tense: `'add toggle button'` not `'added toggle button'`
- Use single quotes in commit messages

**Examples:**
```
feat(dashboard): add per-package changelog viewer
fix(sidebar): fix tooltip not hiding on install button click
perf(npm): batch registry calls to reduce child process count
chore(assets): replace extension icons
```

---

## Pull Request Guidelines

- **Open an issue first** for large features or breaking changes so the approach can be discussed
- Keep PRs focused — one feature or fix per PR
- Fill out the pull request template completely
- Ensure `npm run compile` and `npm run lint` pass with no errors
- Test your changes manually in the Extension Development Host
- Update the README if you add or change user-facing behaviour

---

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) when opening an issue. Include:

- VS Code version
- Node.js and npm versions
- Steps to reproduce
- Expected vs actual behaviour
- Any error messages from the Developer Tools console (`Help → Toggle Developer Tools`)

---

## Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Describe the problem you're trying to solve, not just the solution — this helps find the best approach together.

---

## Questions?

Open a [GitHub Discussion](https://github.com/imarufbillah/packsight/discussions) for questions that aren't bugs or feature requests.
