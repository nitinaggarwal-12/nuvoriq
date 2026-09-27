'use client';

import { FamilyStoreState } from '@/types/domain';
import { INITIAL_FAMILY_STORE } from '@/lib/seedData';

const STORAGE_KEY = 'nuvoriq_family_executive_store_v1';
const IDB_NAME = 'NuvoriqFamilyExecutiveDB';
const IDB_STORE = 'family_state';

// Dual LocalStorage + IndexedDB persistence with a Supabase-compatible query stub
export const supabaseMockClient = {
  async loadState(): Promise<FamilyStoreState> {
    if (typeof window === 'undefined') return INITIAL_FAMILY_STORE;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as FamilyStoreState;
      }
    } catch {
      // Fallback to seed
    }
    return INITIAL_FAMILY_STORE;
  },

  async saveState(state: FamilyStoreState): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, serialized);

      // Mirror to IndexedDB asynchronously for high-capacity artifact storage
      if ('indexedDB' in window) {
        const req = window.indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(state, 'root');
        };
      }
    } catch {
      // Ignore quota errors in restricted frames
    }
  },

  async resetToSeed(): Promise<FamilyStoreState> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    await this.saveState(INITIAL_FAMILY_STORE);
    return INITIAL_FAMILY_STORE;
  },
};
