export class TokenMutex<T = any> {
  private _locked: boolean;
  private _waiting: Array<(value: T | null) => void>;

  constructor() {
    this._locked = false;
    this._waiting = [];
  }

  isLocked(): boolean {
    return this._locked;
  }

  private wait(): Promise<T | null> {
    return new Promise((resolve) => {
      this._waiting.push(resolve);
    });
  }

  async run(fn: () => Promise<T> | T): Promise<T | null> {
    if (this._locked) {
      return this.wait();
    }

    this._locked = true;

    const result = await fn();
    this._resolveAll(result);
    this._locked = false;
  }

  private _resolveAll(value: T | null) {
    for (const resolve of this._waiting) {
      resolve(value);
    }
    this._waiting = [];
  }
}
