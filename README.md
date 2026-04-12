# PackSight – Visual Package Manager

> A fully-featured npm dependency manager built right into VS Code. Browse, audit, update, and install packages without ever leaving your editor.

[![Version](https://img.shields.io/visual-studio-marketplace/v/bytronlabs.packsight?style=flat-square&label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=bytronlabs.packsight)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/bytronlabs.packsight?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=bytronlabs.packsight)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [The Sidebar](#the-sidebar)
- [The Dashboard](#the-dashboard)
- [Browse & Install Packages](#browse--install-packages)
- [Security & Vulnerability Detection](#security--vulnerability-detection)
- [Keyboard Shortcuts & Quick Access](#keyboard-shortcuts--quick-access)
- [Configuration](#configuration)
- [Requirements](#requirements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PackSight replaces the tedious cycle of switching between your terminal, browser, and editor to manage npm packages. Everything — from checking for outdated dependencies to browsing and installing new ones — happens inside a single, purpose-built interface in VS Code.

It works automatically when you open any project that contains a `package.json`. No setup required.

---

## Features

### Sidebar — Always Visible

- **Package list** grouped into Dependencies and Dev Dependencies
- **Status icons** at a glance: ✅ healthy, ⚠️ unused, 🔵 outdated, 🔴 outdated + unused
- **Inline action buttons** (Update, Copy, Uninstall) that appear on row hover
- **Collapsible groups** with package counts and unused badges
- **Rotating tips** that surface hidden features and keyboard shortcuts
- **Quick links** to the GitHub repo: star, docs, issues, changelog, contribute
- **Toggle button** to switch between the sidebar list and the full dashboard

### Dashboard — Full Visual Interface

- **Stats bar** showing total packages, dev deps, unused count, outdated count, and security status
- **Sortable table** with columns for name, version, latest, last update, size, and status
- **Status badges** — Major / Minor / Patch update classification with colour coding
- **Bulk update** — select multiple packages and update them all at once
- **Search & filter** — search by name, filter by All / Unused / Outdated / Dev tabs
- **UI scale control** — `−` / `100%` / `+` buttons in the header, or `Ctrl + scroll`
- **Node.js & npm version badges** showing your current runtime versions
- **Changelog button** — opens the package's GitHub releases page directly
- **Package name link** — click any package name to open it on npmjs.com

### Security

- **Vulnerability detection** via `npm audit` — runs automatically on every load
- **Shield icon** next to every package name: green ✓ for clean, coloured ⚠ for vulnerabilities
- **Severity levels**: 🔴 Critical, 🟠 High, 🟡 Moderate, 🟢 Low
- **Security stat card** in the dashboard showing total vulnerability count

### Unused Package Detection

- **AST-based import scanning** — parses every `.js`, `.ts`, `.jsx`, `.tsx` file in your project
- Detects `import`, `import type` (excluded), `require()`, and side-effect imports
- Results are **cached by file modification time** — re-scans only when files actually change

### Browse & Install

- **Search any npm package** by name directly from the sidebar panel
- Results show name, version, and description
- **Install** as a regular or dev dependency with a single click
- Already-installed packages are marked with a ✓ badge

### Performance

- **Stale-while-revalidate caching** — the dashboard renders instantly from cache on re-open, then refreshes in the background
- **Batched registry calls** — fetches version, publish date, size, and repository URL in a single `npm view` call per package instead of four
- **In-flight deduplication** — if the sidebar and dashboard both load at the same time, they share one set of registry requests
- **Audit result caching** — `npm audit` only re-runs when `package.json` actually changes
- **Optimistic UI updates** — after install/update/uninstall, the UI reflects the change instantly without waiting for a full refresh

---

## Getting Started

1. Install **PackSight** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=bytronlabs.packsight)
2. Open any folder that contains a `package.json`
3. Click the **PackSight icon** in the Activity Bar (left sidebar)

That's it. PackSight activates automatically whenever a `package.json` is detected in your workspace.

---

## The Sidebar

The sidebar is always visible in the PackSight panel. It gives you a compact, real-time view of your project's dependencies without leaving your current file.

### Package Status Icons

| Icon | Meaning |
|------|---------|
| 🟢 Circle (green) | Healthy — up to date and used |
| 🟡 Warning (yellow) | Unused — not imported in any source file |
| 🔵 Arrow up (blue) | Outdated — a newer version is available |
| 🔴 Circle-slash (red) | Outdated **and** unused |

### Row Actions

Hover over any package row to reveal three action buttons:

| Button | Action |
|--------|--------|
| ↑ Arrow | Update to latest version (with confirmation) |
| Copy | Copy the package name to clipboard |
| Trash | Uninstall the package (with confirmation) |

### Refreshing

Click the **↺ refresh icon** in the Packages section header to manually re-scan and re-fetch registry data.

---

## The Dashboard

Open the dashboard by clicking **Open Package Manager** in the sidebar toggle button, or via any of the [quick access methods](#keyboard-shortcuts--quick-access).

### Stats Bar

Five cards at the top give you an instant project health summary:

| Card | Shows |
|------|-------|
| Total Deps | Total number of dependencies |
| Dev Deps | Number of devDependencies |
| Unused | Packages not imported anywhere |
| Outdated | Packages with newer versions available |
| Security | Vulnerability count (or ✓ if clean) |

### Package Table

The main table lists every package with full details. Click any column header to sort.

| Column | Description |
|--------|-------------|
| Name | Package name — click to open on npmjs.com |
| Version | Currently installed version |
| Latest | Latest available version (green if update exists) |
| Last Update | When the installed version was published |
| Size | Unpacked size from the npm registry |
| Status | OK / Unused / Major / Minor / Patch Update badge |
| Actions | Update and Uninstall buttons |

### Filtering & Search

- **Search bar** — filters the table in real time by package name
- **Tabs** — All / Unused / Outdated / Dev

### Bulk Update

1. Check the boxes next to packages you want to update (only shown when updates are available)
2. Click **↑ Update Selected** in the bulk action bar
3. Confirm in the modal — it shows each package's current → latest version with bump type

### UI Scale

Adjust the dashboard zoom level using:
- The **− / 100% / +** control in the header
- **Ctrl + scroll wheel** anywhere on the dashboard

Your preferred scale is saved and restored automatically.

---

## Browse & Install Packages

1. Click **Browse & Install Packages** in the sidebar toggle area (or the button in the dashboard header)
2. Type a package name in the search box — results appear as you type (400ms debounce)
3. Each result shows the package name, version, and description
4. Click **+ Install** to add as a regular dependency, or **+ Dev** to add as a devDependency
5. Hover an install button to see the exact `npm install` command that will run
6. Click a package name to open it on npmjs.com

---

## Security & Vulnerability Detection

PackSight runs `npm audit` automatically when you open the dashboard. Results are cached and only re-run when `package.json` changes, so there's no performance penalty on repeated opens.

### Reading the Results

- Every package row shows a **shield icon** immediately after the package name
- **Green shield with ✓** — no known vulnerabilities
- **Coloured shield with !** — vulnerability detected at the shown severity

### Severity Levels

| Colour | Severity | Description |
|--------|----------|-------------|
| 🔴 Red | Critical | Immediate action required |
| 🟠 Orange | High | Should be addressed soon |
| 🟡 Amber | Moderate | Review and plan to fix |
| 🟢 Lime | Low | Low risk, fix when convenient |

> **Note:** Vulnerability detection requires a `package-lock.json` in your project. Run `npm install` first if you don't have one.

---

## Keyboard Shortcuts & Quick Access

| Method | Action |
|--------|--------|
| `Ctrl+Shift+P` → **PackSight: Open Package Manager** | Open the dashboard from the Command Palette |
| Right-click `package.json` → **Open Package Manager** | Open the dashboard from the Explorer |
| Click the PackSight icon in the Activity Bar | Open the sidebar panel |
| `Ctrl + scroll` on the dashboard | Zoom in / out |

---

## Configuration

PackSight adds two settings under **PackSight** in VS Code's settings (`Ctrl+,`).

### `packSight.updateFlags`

Extra flags appended to `npm install <pkg>@latest` when updating a package.

| Value | Effect |
|-------|--------|
| `--legacy-peer-deps` *(default)* | Bypasses peer-dependency conflicts |
| *(empty string)* | Strict resolution — fails on peer conflicts |

### `packSight.uninstallFlags`

Extra flags appended to `npm uninstall` when removing a package.

| Value | Effect |
|-------|--------|
| `--legacy-peer-deps` *(default)* | Bypasses peer-dependency conflicts |
| *(empty string)* | Strict resolution |

**Example** — set in `settings.json`:

```json
{
  "packSight.updateFlags": "",
  "packSight.uninstallFlags": "--legacy-peer-deps"
}
```

---

## Requirements

| Requirement | Version |
|-------------|---------|
| VS Code | 1.85.0 or later |
| Node.js | 18.0.0 or later |
| npm | Any version that ships with Node 18+ |

PackSight uses `npm` CLI commands internally (`npm view`, `npm audit`, `npm install`, `npm uninstall`). Make sure `npm` is available in your system `PATH`.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, commit conventions, and pull request guidelines.

---

## License

MIT © [Maruf Billah](https://github.com/imarufbillah)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/imarufbillah">Maruf Billah</a></sub>
</div>
