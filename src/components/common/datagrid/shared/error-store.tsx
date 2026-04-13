import { Key } from "react";
import { Column } from "react-data-grid";

export type GetCellError<R, SR = unknown> = (params: {
  row: R;
  rowIdx: number;
  column: Column<R, SR>;
}) => string | undefined;

export type Listener = () => void;

function getCellKey<K>(rowKey: K, columnKey: K) {
  return `${rowKey}-${columnKey}`;
}

export function createErrorStore<R, SR, K extends Key = Key>() {
  let getCellError: GetCellError<R, SR> | undefined;

  const listenerMap = new Map<string, Set<Listener>>();

  return {
    subscribe(rowKey: K, columnKey: K, listener: Listener) {
      const key = getCellKey<K>(rowKey, columnKey);

      let set = listenerMap.get(key);
      if (!set) {
        set = new Set();
        listenerMap.set(key, set);
      }

      set.add(listener);

      return () => {
        set!.delete(listener);
        if (set!.size === 0) {
          listenerMap.delete(key);
        }
      };
    },

    // fallback (logic đổi toàn bộ)
    setGetCellError(fn?: GetCellError<R, SR>) {
      getCellError = fn;

      // notify ALL (rare)
      listenerMap.forEach((set) => {
        set.forEach((l) => l());
      });
    },

    getCellError(row: R, rowIdx: number, column: Column<R, SR>) {
      return getCellError?.({ row, rowIdx, column });
    },

    //  notify đúng cell
    notifyCell(rowKey: K, columnKey: K) {
      const key = getCellKey(rowKey, columnKey);
      const set = listenerMap.get(key);
      if (!set) return;

      set.forEach((l) => l());
    },

    // notify cả row
    notifyRow(rowKey: K) {
      listenerMap.forEach((set, key) => {
        if (key.startsWith(`${rowKey}-`)) {
          set.forEach((l) => l());
        }
      });
    },
  };
}

export type ErrorStoreType<R, SR, K extends Key = Key> = ReturnType<
  typeof createErrorStore<R, SR, K>
>;
