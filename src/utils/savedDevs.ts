/**
 * LocalStorage service for managing saved developers
 */

const STORAGE_KEY = 'artemis_saved_devs';

export const savedDevsService = {
  /**
   * Get all saved developers
   * @returns {Array} Array of saved developer objects
   */
  getSavedDevs: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting saved devs:', error);
      return [];
    }
  },

  /**
   * Save a developer
   * @param {Object} dev - Developer object to save
   * @returns {boolean} Success status
   */
  saveDev: (dev) => {
    try {
      const saved = savedDevsService.getSavedDevs();
      
      // Check if already saved
      const exists = saved.some(d => d.username === dev.username);
      if (exists) {
        return false;
      }

      // Add timestamp
      const devWithTimestamp = {
        ...dev,
        savedAt: new Date().toISOString()
      };

      saved.unshift(devWithTimestamp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      return true;
    } catch (error) {
      console.error('Error saving dev:', error);
      return false;
    }
  },

  /**
   * Remove a saved developer
   * @param {string} username - GitHub username
   * @returns {boolean} Success status
   */
  removeDev: (username) => {
    try {
      const saved = savedDevsService.getSavedDevs();
      const filtered = saved.filter(d => d.username !== username);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing dev:', error);
      return false;
    }
  },

  /**
   * Check if a developer is already saved
   * @param {string} username - GitHub username
   * @returns {boolean} True if saved
   */
  isDevSaved: (username) => {
    const saved = savedDevsService.getSavedDevs();
    return saved.some(d => d.username === username);
  },

  /**
   * Get count of saved developers
   * @returns {number} Count
   */
  getSavedCount: () => {
    return savedDevsService.getSavedDevs().length;
  },

  /**
   * Clear all saved developers
   * @returns {boolean} Success status
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing saved devs:', error);
      return false;
    }
  }
};
