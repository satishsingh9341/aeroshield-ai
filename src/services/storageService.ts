/**
 * Bulletproof storage service with in-memory fallback.
 * Prevents DOMException / SecurityError / QuotaExceededError crashes
 * when localStorage is blocked, restricted, or unavailable.
 */

const memoryStore = new Map<string, string>();

let storageAvailable: boolean | null = null;

function checkStorageAvailability(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      storageAvailable = false;
      return false;
    }
    const testKey = '__aeroshield_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}

/**
 * Safely retrieves an item from localStorage, falling back to in-memory store.
 */
export function safeGetItem(key: string, defaultValue: string | null = null): string | null {
  if (checkStorageAvailability()) {
    try {
      const val = window.localStorage.getItem(key);
      if (val !== null) {
        return val;
      }
    } catch {
      // localStorage threw at runtime; fall through to memoryStore
    }
  }
  return memoryStore.has(key) ? (memoryStore.get(key) ?? defaultValue) : defaultValue;
}

/**
 * Safely stores an item into localStorage and the in-memory fallback.
 */
export function safeSetItem(key: string, value: string): boolean {
  memoryStore.set(key, value);
  if (checkStorageAvailability()) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      // Failed to write to localStorage, but in-memory store has it
    }
  }
  return false;
}

/**
 * Safely removes an item from localStorage and the in-memory fallback.
 */
export function safeRemoveItem(key: string): boolean {
  memoryStore.delete(key);
  if (checkStorageAvailability()) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      // Ignore error
    }
  }
  return false;
}

/**
 * Safely parses JSON from localStorage, returning fallback on null or parse failure.
 */
export function safeGetJson<T>(key: string, fallback: T): T {
  const raw = safeGetItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely serializes and stores JSON to localStorage.
 */
export function safeSetJson<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    return safeSetItem(key, serialized);
  } catch {
    return false;
  }
}

/**
 * Clear in-memory fallback (primarily for test resets).
 */
export function clearMemoryFallback(): void {
  memoryStore.clear();
}
