import toast from "react-hot-toast";

type RetryTask = () => void | Promise<void>;

type NetworkListener = (isOnline: boolean) => void;

class NetworkManager {
  private retryQueue = new Set<RetryTask>();

  private listeners = new Set<NetworkListener>();

  private isRetrying = false;

  private isOffline = false;

  constructor() {
    if (typeof window === "undefined") {
      return;
    }

    this.isOffline = !navigator.onLine;

    window.addEventListener("online", this.handleOnline);

    window.addEventListener("offline", this.handleOffline);
  }

  /**
   * Current network status
   */
  isOnline(): boolean {
    if (typeof navigator === "undefined") {
      return true;
    }

    return navigator.onLine;
  }

  /**
   * Subscribe to network state changes
   */
  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Trigger all listeners
   */
  private notifyListeners(isOnline: boolean): void {
    for (const listener of this.listeners) {
      listener(isOnline);
    }
  }

  /**
   * Add retry task
   */
  retryWhenOnline(task: RetryTask): void {
    /**
     * Execute immediately if online
     */
    if (this.isOnline()) {
      void this.safeExecute(task);

      return;
    }

    this.retryQueue.add(task);

    /**
     * Prevent duplicate offline toasts
     */
    if (!this.isOffline) {
      this.isOffline = true;

      toast.error("No internet connection");
    }
  }

  /**
   * Execute task safely
   */
  private async safeExecute(task: RetryTask): Promise<void> {
    try {
      await task();
    } catch (error) {
      console.error("Retry task failed:", error);

      /**
       * Requeue task if offline again
       */
      if (!this.isOnline()) {
        this.retryQueue.add(task);
      }
    }
  }

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    if (this.isOffline) {
      return;
    }

    this.isOffline = true;

    this.notifyListeners(false);

    toast.error("No internet connection");
  };

  /**
   * Handle reconnect event
   */
  private handleOnline = async (): Promise<void> => {
    /**
     * Prevent duplicate retry execution
     */
    if (this.isRetrying) {
      return;
    }

    if (this.isOffline) {
      toast.success("Back online");
    }

    this.isOffline = false;

    this.notifyListeners(true);

    const tasks = Array.from(this.retryQueue);

    if (tasks.length === 0) {
      return;
    }

    this.retryQueue.clear();

    this.isRetrying = true;

    try {
      await Promise.allSettled(tasks.map((task) => this.safeExecute(task)));
    } finally {
      this.isRetrying = false;
    }
  };

  /**
   * Retry all queued tasks manually
   */
  async retryAll(): Promise<void> {
    if (!this.isOnline()) {
      return;
    }

    await this.handleOnline();
  }

  /**
   * Clear queued retry tasks
   */
  clearQueue(): void {
    this.retryQueue.clear();
  }

  /**
   * Number of queued tasks
   */
  getQueueSize(): number {
    return this.retryQueue.size;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);

      window.removeEventListener("offline", this.handleOffline);
    }

    this.retryQueue.clear();

    this.listeners.clear();
  }
}

const network = new NetworkManager();

export default network;
