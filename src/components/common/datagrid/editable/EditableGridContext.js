import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";
import { GridRowModes } from "@mui/x-data-grid";

const EditableGridContext = createContext(null);

/* ---------- exports ---------- */
export const useEditableGridContext = () => {
  const context = useContext(EditableGridContext);
  if (!context) {
    throw new Error(
      "useEditableGridContext must be used within a EditableGridProvider",
    );
  }
  return context;
};

export const EditableGridProvider = ({
  children,
  adapter,
  createEmptyRow,
  fieldToFocus,
}) => {
  const {
    rows,
    setRows,
    setRowsOnUpdate,
    rowErrors = {},
    setRowErrors,
    validateRows,
  } = adapter;
  const [rowModesModel, setRowModesModel] = useState({});
  const [updatingRowIds, setUpdatingRowIds] = useState({});

  /* ---------- actions ---------- */

  const addRow = useCallback(() => {
    const id = crypto.randomUUID();
    const newRow = { id, isNew: true, ...createEmptyRow?.(rows) };
    setRows((prev) => [newRow, ...prev]);

    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit, fieldToFocus },
    }));
  }, [createEmptyRow, fieldToFocus, rows, setRows]);

  const updateRow = useCallback(
    (id, data) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    [setRows],
  );

  const removeRow = useCallback(
    (id) => setRows((prev) => prev.filter((r) => r.id !== id)),
    [setRows],
  );

  const markRowUpdating = useCallback((rowId, status) => {
    setUpdatingRowIds((prev) => {
      const next = { ...prev };
      if (status) next[rowId] = true;
      else delete next[rowId];
      return next;
    });
  }, []);

  const processRowUpdate = useCallback(
    async (row) => {
      markRowUpdating(row.id, true);
      const updated = { ...row, isNew: false };
      const nextRows = rows.map((r) => (r.id === row.id ? updated : r));

      if (setRowsOnUpdate) {
        await setRowsOnUpdate(nextRows);
      } else {
        await setRows(nextRows);
      }

      const ok = !validateRows || (await validateRows(nextRows));
      markRowUpdating(false);

      if (!ok) {
        throw new Error("VALIDATION_ERROR"); // not commit to prevent stop edit mode
      }
      return updated;
    },
    [markRowUpdating, rows, setRows, setRowsOnUpdate, validateRows],
  );

  const validateAllRows = useCallback(
    () => validateRows(rows),
    [validateRows, rows],
  );

  const value = useMemo(
    () => ({
      rows,
      rowErrors,
      rowModesModel,
      setRowModesModel,
      updatingRowIds,

      addRow,
      updateRow,
      removeRow,
      validateRows: validateAllRows,
      processRowUpdate,
    }),
    [
      rows,
      rowErrors,
      rowModesModel,
      updatingRowIds,

      addRow,
      updateRow,
      removeRow,
      validateAllRows,
      processRowUpdate,
    ],
  );

  return (
    <EditableGridContext.Provider value={value}>
      {children}
    </EditableGridContext.Provider>
  );
};
