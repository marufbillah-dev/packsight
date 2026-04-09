import * as vscode from 'vscode';

/**
 * Shared event bus for dependency data changes.
 *
 * Fired by DependencyTreeProvider after every completed scan so that any
 * other subscriber (e.g. the dashboard panel) can react without the tree
 * provider needing to know about the dashboard.
 *
 * Usage:
 *   // fire:
 *   dependencyChanged.fire();
 *
 *   // subscribe:
 *   dependencyChanged.event(() => panel.loadData());
 */
export const dependencyChanged = new vscode.EventEmitter<void>();
