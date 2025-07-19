import { StoredState } from '../types.ts';

const STORAGE_KEY = 'hydroPalState';

// Saves the application state to localStorage
export const saveState = (state: StoredState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage", err);
  }
};

// Loads the application state from localStorage
export const loadState = (): StoredState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // No state saved yet
    }
    const state: StoredState = JSON.parse(serializedState);
    // Add some validation to prevent loading corrupted data
    if (state && typeof state.intake === 'number' && state.settings && typeof state.settings.goal === 'number') {
        return state;
    }
    return undefined;
  } catch (err) {
    console.error("Failed to load state from localStorage", err);
    return undefined;
  }
};
