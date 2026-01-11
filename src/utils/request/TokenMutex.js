export class TokenMutex {
  constructor() {
    this._locked = false;
    this._waiting = [];
  }

  isLocked() {
    return this._locked;
  }

  wait() {
    return new Promise((resolve) => {
      this._waiting.push(resolve);
    });
  }

  async run(fn) {
    if (this._locked) {
      return this.wait();
    }

    this._locked = true;

    try {
      const result = await fn();
      this._resolveAll(result);
      return result ?? null;
    } catch (error) {
      throw error;
    } finally {
      this._locked = false;
    }
  }

  _resolveAll(value) {
    for (const resolve of this._waiting) {
      resolve(value ?? null);
    }
    this._waiting = [];
  }
}
