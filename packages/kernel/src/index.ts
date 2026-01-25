/**
 * CONSTRUCTION DNA KERNEL
 *
 * 20-Tier Material DNA Taxonomy System
 *
 * The kernel provides:
 * - Type definitions for all 20 tiers
 * - Predefined data (chemistries, failure modes, compatibility rules)
 * - Utility functions (taxonomy codes, validation)
 * - Zod schemas for runtime validation
 *
 * @packageDocumentation
 * @module @construction-dna/kernel
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

// Re-export all types
export * from './types';

// ============================================
// PREDEFINED DATA
// ============================================

// Re-export all predefined data
export * from './data';

// ============================================
// UTILITIES
// ============================================

// Re-export all utilities
export * from './utils';

// ============================================
// VERSION
// ============================================

export const VERSION = '1.0.0';
export const SCHEMA_VERSION = '2026.1';
