/**
 * Centralized export for all type definitions
 */

export * from './waterBalance';
export * from './diagnostics';
export * from './scenarios';
export * from './education';

// Re-export education level from diagnostics for convenience
export type { EducationLevel } from './diagnostics';
