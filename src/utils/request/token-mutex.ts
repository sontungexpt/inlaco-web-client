export class TokenMutex<T = any> {
  private locked = false;
  private waiting: {
    resolve: (value: T) => void;
    reject: (err: any) => void;
  }[] = [];

  async run(fn: () => Promise<T>): Promise<T> {
    if (this.locked) {
      return new Promise((resolve, reject) =>
        this.waiting.push({ resolve, reject }),
      );
    }

    this.locked = true;

    try {
      const result = await fn();
      this.waiting.forEach((w) => w.resolve(result));
      return result;
    } catch (err) {
      this.waiting.forEach((w) => w.reject(err));
      throw err;
    } finally {
      this.locked = false;
      this.waiting = [];
    }
  }
}
