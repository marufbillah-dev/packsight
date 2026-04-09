import { DependencyTreeProvider } from '../tree/dependencyTreeProvider';

/**
 * Refreshes the dependency tree view.
 * Registered as the handler for the `packSight.refresh` command.
 */
export function refreshCommand(provider: DependencyTreeProvider): void {
  provider.refresh();
}
