/**
 * STORAGE ADAPTERS
 *
 * Pluggable storage backends for DNA records
 */

export { StorageAdapter, BaseStorageAdapter } from './interface';
export { MemoryStorage } from './memory';
export { JSONFileStorage } from './json-file';
