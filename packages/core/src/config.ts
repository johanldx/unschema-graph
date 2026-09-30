import type { SchemaGraphOptions } from './types/index.js';

let globalConfig: SchemaGraphOptions = {};

/**
 * Updates the global configuration for unschema-graph.
 *
 * @param config - Options to merge into the global configuration.
 */
export function setGlobalConfig(config: SchemaGraphOptions): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Returns a copy of the current global configuration.
 */
export function getGlobalConfig(): SchemaGraphOptions {
  return { ...globalConfig };
}

/**
 * Resets global configuration to empty default state.
 */
export function resetGlobalConfig(): void {
  globalConfig = {};
}
