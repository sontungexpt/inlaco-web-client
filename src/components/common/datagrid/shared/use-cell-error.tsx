import { Key, useSyncExternalStore } from "react";
import { ErrorStoreType } from "./error-store";
import { Column } from "react-data-grid";

export type useCellErrorProps<R, SR, K extends Key = Key> = {
  row: R;
  rowIdx: number;
  column: Column<R, SR>;
  store: ErrorStoreType<R, SR>;
  rowKeyGetter?: ((row: R) => K) | null;
};

export function useCellError<R, SR>({
  row,
  rowIdx,
  column,
  store,
  rowKeyGetter,
}: useCellErrorProps<R, SR>) {
  return useSyncExternalStore(
    (listener) => {
      const rowKey = rowKeyGetter?.(row) ?? rowIdx;
      return store.subscribe(rowKey, column.key, listener);
    },
    () => store.getCellError(row, rowIdx, column),
  );
}
