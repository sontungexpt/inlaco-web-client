import React, {
  createContext,
  Key,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { createErrorStore, ErrorStoreType, GetCellError } from "./error-store";

export type DataGridContextValue<R, SR, K extends Key = Key> = {
  errorStore: ErrorStoreType<R, SR>;
  globalTooltip?: any;
  rowKeyGetter?: null | ((row: R) => K);
};

const DataGridContext = createContext<DataGridContextValue<any, any> | null>(
  null,
);

export type DataGridContextProviderProps<R, SR, K extends Key = Key> = {
  children: React.ReactNode;
  getCellError?: GetCellError<R, SR>;
  globalTooltip?: any;
  rowKeyGetter?: ((row: R) => K) | null;
};

export function DataGridContextProvider<R, SR, K extends Key = Key>({
  getCellError,
  globalTooltip,
  rowKeyGetter,
  children,
}: DataGridContextProviderProps<R, SR, K>) {
  const errorStoreRef = useRef(createErrorStore<R, SR, K>());
  const errorStore = errorStoreRef.current;

  useEffect(() => {
    errorStore.setGetCellError(getCellError);
  }, [getCellError]);

  const value = useMemo(
    () => ({
      errorStore,
      globalTooltip,
      rowKeyGetter,
    }),
    [globalTooltip],
  );

  return (
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  );
}

export function useDataGridContext() {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error("useErrorStore must be used within ErrorStoreProvider");
  }
  return context;
}
