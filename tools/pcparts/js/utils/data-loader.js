// Data loader utility
class DataLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadJSON(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
      const data = await response.json();
      this.cache.set(path, data);
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

const dataLoader = new DataLoader();
export { DataLoader, dataLoader };
