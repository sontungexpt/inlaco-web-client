let retryQueue = [];

const network = {
  isOnline: () => navigator.onLine,

  /**
   * Đăng ký callback chạy khi mạng on → dành cho các logic khác cần lắng nghe
   */
  onReconnect(callback) {
    window.addEventListener("online", callback);
  },

  /**
   * Queue function để retry khi có mạng trở lại
   */
  retryWhenOnline(fn) {
    retryQueue.push(fn);
  },
};

// Khi mạng trở lại → chạy toàn bộ queue
network.onReconnect(() => {
  const queue = [...retryQueue];
  retryQueue = [];

  for (const fn of queue) {
    fn();
  }
});

export default network;
