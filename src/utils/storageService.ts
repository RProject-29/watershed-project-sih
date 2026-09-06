import type { Intervention } from '../types';
import { INITIAL_INTERVENTIONS } from '../data/mockData';

const STORAGE_KEY = 'jaldrishti_interventions_v3';
const DELETED_KEY = 'jaldrishti_deleted_ids_v3';

/**
 * Service to manage local persistent storage of interventions and field uploads.
 */
export const storageService = {
  /**
   * Get set of deleted IDs
   */
  getDeletedIds: (): Set<string> => {
    try {
      const saved = localStorage.getItem(DELETED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set<string>(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load deleted IDs from localStorage:', e);
    }
    return new Set<string>();
  },

  /**
   * Save deleted IDs
   */
  saveDeletedIds: (deletedSet: Set<string>): void => {
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deletedSet)));
    } catch (e) {
      console.warn('Failed to save deleted IDs to localStorage:', e);
    }
  },

  /**
   * Load saved interventions from localStorage, falling back to INITIAL_INTERVENTIONS
   */
  loadInterventions: (): Intervention[] => {
    const deleted = storageService.getDeletedIds();

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate strictly by ID and exclude deleted items
          const seen = new Set<string>();
          const unique: Intervention[] = [];
          for (const item of parsed) {
            if (item && item.id && !seen.has(item.id) && !deleted.has(item.id)) {
              seen.add(item.id);
              unique.push(item);
            }
          }
          if (unique.length > 0) return unique;
        }
      }
    } catch (e) {
      console.warn('Failed to load interventions from localStorage:', e);
    }

    // Default fallback: Initial records that have not been explicitly deleted
    const filteredInitial = INITIAL_INTERVENTIONS.filter(i => !deleted.has(i.id));
    storageService.saveInterventions(filteredInitial);
    return filteredInitial;
  },

  /**
   * Save current interventions list to localStorage
   */
  saveInterventions: (interventions: Intervention[]): void => {
    try {
      const deleted = storageService.getDeletedIds();
      // Ensure only unique IDs and non-deleted items are saved
      const seen = new Set<string>();
      const unique = interventions.filter(i => {
        if (!i || !i.id || seen.has(i.id) || deleted.has(i.id)) return false;
        seen.add(i.id);
        return true;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    } catch (e) {
      console.warn('Failed to save interventions to localStorage:', e);
    }
  },

  /**
   * Add a single new intervention to persistent storage
   */
  addIntervention: (newIntervention: Intervention): Intervention[] => {
    // If it was in deleted set, un-delete it
    const deleted = storageService.getDeletedIds();
    if (deleted.has(newIntervention.id)) {
      deleted.delete(newIntervention.id);
      storageService.saveDeletedIds(deleted);
    }

    const current = storageService.loadInterventions();
    const withoutDuplicate = current.filter(item => item.id !== newIntervention.id);
    const updated = [newIntervention, ...withoutDuplicate];
    storageService.saveInterventions(updated);
    return updated;
  },

  /**
   * Delete an intervention from persistent storage
   */
  deleteIntervention: (id: string): Intervention[] => {
    const deleted = storageService.getDeletedIds();
    deleted.add(id);
    storageService.saveDeletedIds(deleted);

    const current = storageService.loadInterventions();
    const updated = current.filter(item => item.id !== id);
    storageService.saveInterventions(updated);
    return updated;
  },

  /**
   * Update an existing intervention in persistent storage
   */
  updateIntervention: (id: string, updateFn: (record: Intervention) => Intervention): Intervention[] => {
    const current = storageService.loadInterventions();
    const updated = current.map(item => item.id === id ? updateFn(item) : item);
    storageService.saveInterventions(updated);
    return updated;
  },

  /**
   * Reset local storage back to initial mock data
   */
  resetToDefaults: (): Intervention[] => {
    try {
      localStorage.removeItem(DELETED_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INTERVENTIONS));
    } catch (e) {
      console.warn('Failed to reset storage:', e);
    }
    return INITIAL_INTERVENTIONS;
  }
};
