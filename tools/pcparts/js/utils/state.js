// State management using Proxy pattern
class AppState {
  constructor(initialState = {}) {
    this.state = new Proxy(initialState, {
      set: (target, key, value) => {
        const old = target[key];
        target[key] = value;
        this.notify(key, value, old);
        return true;
      }
    });

    this.listeners = {};
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  subscribeAll(callback) {
    this._allCallback = callback;
  }

  notify(key, value, old) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(cb => cb(value, old));
    }
    if (this._allCallback) {
      this._allCallback(key, value, old);
    }
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
  }

  setState(newState) {
    Object.entries(newState).forEach(([key, value]) => {
      this.state[key] = value;
      this.notify(key, value);
    });
  }
}

const appState = new AppState({
  selectedComponent: null,
  activeTab: 'specs',
  viewMode: 'exploded',
  difficulty: 'beginner',
  visibleComponents: { cpu: true, gpu: true, ram: true, storage: true, mobo: true, psu: true }
});

export { AppState, appState };
