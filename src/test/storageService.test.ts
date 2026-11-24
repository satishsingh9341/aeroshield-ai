import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  safeGetJson,
  safeSetJson,
  clearMemoryFallback,
} from '../services/storageService';

describe('storageService', () => {
  beforeEach(() => {
    clearMemoryFallback();
    try {
      window.localStorage.clear();
    } catch {
      // In case localStorage is disabled or mocked
    }
  });

  it('stores and retrieves strings with safeSetItem and safeGetItem', () => {
    safeSetItem('test_key', 'test_value');
    expect(safeGetItem('test_key')).toBe('test_value');
  });

  it('returns default value when key does not exist', () => {
    expect(safeGetItem('non_existent', 'fallback')).toBe('fallback');
  });

  it('removes item with safeRemoveItem', () => {
    safeSetItem('to_remove', 'val');
    expect(safeGetItem('to_remove')).toBe('val');
    safeRemoveItem('to_remove');
    expect(safeGetItem('to_remove')).toBeNull();
  });

  it('stores and parses JSON objects correctly with safeSetJson and safeGetJson', () => {
    const data = { city: 'delhi', count: 4, enabled: true };
    safeSetJson('json_key', data);
    const retrieved = safeGetJson('json_key', { city: 'none', count: 0, enabled: false });
    expect(retrieved).toEqual(data);
  });

  it('returns fallback when JSON parse fails or item is corrupt', () => {
    safeSetItem('corrupt_json', '{not-valid-json}');
    const fallback = { status: 'fallback' };
    const result = safeGetJson('corrupt_json', fallback);
    expect(result).toEqual(fallback);
  });

  it('falls back to memoryStore when localStorage.setItem throws (QuotaExceeded or SecurityError)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
    });

    try {
      const success = safeSetItem('quota_key', 'quota_value');
      // safeSetItem returns false because localStorage failed, but stored in memory
      expect(success).toBe(false);
      // retrieval should still succeed from memory fallback
      expect(safeGetItem('quota_key')).toBe('quota_value');
    } finally {
      spy.mockRestore();
    }
  });

  it('falls back to memoryStore when localStorage.getItem throws', () => {
    safeSetItem('mem_key', 'mem_value');
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage access denied.', 'SecurityError');
    });

    try {
      expect(safeGetItem('mem_key')).toBe('mem_value');
    } finally {
      spy.mockRestore();
    }
  });
});
