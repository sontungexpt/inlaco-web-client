import { useEffect, useState, useCallback } from "react";
import { GridRowModes } from "@mui/x-data-grid";
import { useFormikContext } from "formik";

/**
 * Validate a single row based on column definitions.
 *
 * Validation order:
 * 1. required
 * 2. sync validate
 * 3. async validate
 *
 * @param {object} row - Row data
 * @param {Array} columns - DataGrid column definitions
 * @returns {Promise<object|null>} field error map or null if valid
 */
const validateRow = async (row, columns) => {
  const errors = {};

  for (const col of columns) {
    const value = row[col.field];

    // Required
    if (col.required && !value) {
      errors[col.field] = `${col.headerName} is required`;
      continue;
    }

    // Sync validate
    if (col.validate) {
      const msg = col.validate(value, row);
      if (msg) {
        errors[col.field] = msg;
        continue;
      }
    }

    // Async validate
    if (col.asyncValidate) {
      const msg = await col.asyncValidate(value, row);
      if (msg) {
        errors[col.field] = msg;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
};

/**
 * Core editable grid logic.
 *
 * Responsibilities:
 * - Manage rows
 * - Manage edit modes
 * - Perform row-level validation (sync + async)
 *
 * This hook does NOT know about Formik.
 *
 * --------------------------------------------------------------------------
 * Columns definition
 * --------------------------------------------------------------------------
 *
 * Each column extends MUI DataGrid column with extra validation capabilities.
 *
 * Supported column properties:
 *
 * @property {string} field
 *   Field name in row object (required).
 *
 * @property {string} headerName
 *   Column title displayed in the grid.
 *   Used in validation error messages.
 *
 * @property {boolean} [required]
 *   If true, value must not be empty.
 *
 * @property {(value:any, row:object) => string | null} [validate]
 *   Synchronous validation function.
 *   Return:
 *   - string  → validation error message
 *   - null    → valid
 *
 * @property {(value:any, row:object) => Promise<string | null>} [asyncValidate]
 *   Asynchronous validation function (API calls, uniqueness checks, etc.).
 *   Return:
 *   - string  → validation error message
 *   - null    → valid
 *
 * @property {(params) => ReactNode} [renderEditCell]
 *   Custom edit cell renderer.
 *   Will receive extra `error` prop injected by EditableGrid.
 *
 * --------------------------------------------------------------------------
 * Validation execution order:
 * 1. required
 * 2. validate (sync)
 * 3. asyncValidate
 *
 * Stops at the first failing rule per field.
 *
 * --------------------------------------------------------------------------
 * Column Example
 * --------------------------------------------------------------------------
 *
 * const columns = [
 *   {
 *     field: "email",
 *     headerName: "Email",
 *     required: true,
 *     validate: (value) =>
 *       !value.includes("@") ? "Invalid email format" : null,
 *     asyncValidate: async (value) => {
 *       const exists = await api.checkEmailExists(value);
 *       return exists ? "Email already exists" : null;
 *     },
 *   },
 *   {
 *     field: "role",
 *     headerName: "Role",
 *     required: true,
 *     renderEditCell: ({ value, error, api, id, field }) => (
 *       <RoleSelect
 *         value={value}
 *         error={error}
 *         onChange={(newValue) =>
 *           api.setEditCellValue({ id, field, value: newValue })
 *         }
 *       />
 *     ),
 *   },
 * ];
 *
 * --------------------------------------------------------------------------
 * Notes:
 * - Throwing an error inside `processRowUpdate` is REQUIRED by MUI DataGrid
 *   to cancel saving when validation fails.
 * - `asyncValidate` is executed sequentially per column.
 * - This hook is UI-agnostic and can be reused without Formik.
 */
export const useEditableGrid = ({ initialRows, columns, createEmptyRow }) => {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  /**
   * Add a new editable row
   */
  const addRow = useCallback(() => {
    const id = crypto.randomUUID();

    setRows((prev) => [{ id, isNew: true, ...createEmptyRow?.() }, ...prev]);
    setRowModesModel((prev) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0]?.field },
      ...prev,
    }));
  }, [columns, createEmptyRow]);

  /**
   * Remove row and clear its errors
   */
  const removeRow = useCallback((id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  /**
   * Called by MUI DataGrid when saving a row.
   *
   * IMPORTANT:
   * - Returning a row => save succeeds
   * - Throwing an error => save is rejected
   */
  const processRowUpdate = useCallback(
    async (newRow) => {
      const errors = await validateRow(newRow, columns);

      if (errors) {
        setRowErrors((prev) => ({
          ...prev,
          [newRow.id]: errors,
        }));

        throw new Error("ASYNC_VALIDATION_ERROR");
      }

      setRowErrors((prev) => {
        const copy = { ...prev };
        delete copy[newRow.id];
        return copy;
      });

      const updatedRow = { ...newRow, isNew: false };

      setRows((prev) =>
        prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
      );

      return updatedRow;
    },
    [columns],
  );

  return {
    rows,
    rowErrors,
    rowModesModel,
    setRowModesModel,
    addRow,
    removeRow,
    processRowUpdate,
  };
};

/* ============================================================================
 * Formik Wrapper Hook
 * ============================================================================
 */

/**
 * Formik wrapper for Editable DataGrid.
 *
 * This hook connects:
 * - DataGrid rows        <-> Formik form values
 * - Grid row errors      <-> Formik validation errors
 *
 * It allows EditableDataGrid to be used seamlessly inside a Formik form,
 * while still keeping the core grid logic independent from Formik.
 *
 * --------------------------------------------------------------------------
 * Responsibilities
 * --------------------------------------------------------------------------
 * - Sync grid rows into Formik field values
 * - Sync row-level validation errors into Formik errors
 * - Prevent form submission when grid validation fails
 * - Expose grid APIs for the UI layer
 *
 * --------------------------------------------------------------------------
 * Parameters
 * --------------------------------------------------------------------------
 *
 * @param {string} name
 *   Formik field name used to store grid rows.
 *   Default: `"rows"`
 *
 *   Example Formik shape:
 *   {
 *     rows: [
 *       { id: "1", name: "Item A", price: 10 },
 *       { id: "2", name: "Item B", price: 20 }
 *     ]
 *   }
 *
 * @param {Array} columns
 *   Column definitions used by the Editable Grid.
 *   Must match the same column structure passed to EditableDataGrid.
 *
 *   Supports:
 *   - required
 *   - validate
 *   - asyncValidate
 *   - renderEditCell
 *
 * @param {Function} createEmptyRow
 *   Factory function that returns a new empty row object.
 *   Must return all required fields for a row.
 *
 * --------------------------------------------------------------------------
 * Validation Behavior
 * --------------------------------------------------------------------------
 *
 * - Validation runs when a row is saved.
 * - Row-level validation errors are:
 *   - Stored internally by the grid
 *   - Propagated to Formik errors under the same field name
 *
 * Example Formik errors structure:
 *
 * {
 *   items: {
 *     "row-id-1": {
 *       name: "Name is required",
 *       price: "Price must be greater than 0"
 *     }
 *   }
 * }
 *
 * - If validation fails, `processRowUpdate` throws an error.
 * - Throwing is REQUIRED so MUI DataGrid cancels row save.
 * - Formik submission will be blocked while errors exist.
 *
 * --------------------------------------------------------------------------
 * Returned API
 * --------------------------------------------------------------------------
 *
 * @returns {{
 *   rows: Array,
 *   rowErrors: Record<string, Record<string, string>>,
 *   rowModesModel: object,
 *   setRowModesModel: Function,
 *   addRow: Function,
 *   removeRow: Function,
 *   processRowUpdate: Function
 * }}
 *
 * --------------------------------------------------------------------------
 * Usage Example
 * --------------------------------------------------------------------------
 *
 * const formik = useFormik({
 *   initialValues: {
 *     items: []
 *   },
 *   onSubmit: (values) => {
 *     console.log(values.items);
 *   }
 * });
 *
 * const grid = useFormikEditableGrid({
 *   name: "items",
 *   columns,
 *   createEmptyRow: () => ({
 *     name: "",
 *     price: 0,
 *   }),
 * });
 *
 * <Form>
 *   <EditableDataGrid
 *     rows={grid.rows}
 *     columns={columns}
 *     processRowUpdate={grid.processRowUpdate}
 *   />
 * </Form>
 *
 * --------------------------------------------------------------------------
 * Notes
 * --------------------------------------------------------------------------
 * - This hook depends on Formik context and MUST be used inside <Formik />.
 * - The core grid logic remains reusable without Formik.
 * - Async validation errors are fully supported.
 * - Recommended for complex editable tables inside forms.
 */
export const useFormikEditableGrid = ({
  name = "rows",
  columns,
  createEmptyRow,
}) => {
  const { values, setFieldValue, setFieldError, setErrors } =
    useFormikContext();

  const grid = useEditableGrid({
    initialRows: values[name] || [],
    columns,
    createEmptyRow,
  });
  /**
   * Sync grid rows -> Formik values
   */
  useEffect(() => {
    setFieldValue(name, grid.rows, false);
  }, [grid.rows]);

  /**
   * Sync row-level errors -> Formik errors
   *
   * Error shape:
   * {
   *   rows: {
   *     [rowId]: {
   *       field: "error message"
   *     }
   *   }
   * }
   */
  useEffect(() => {
    if (!grid.rowErrors) return;

    const formikRowErrors = {};

    Object.entries(grid.rowErrors).forEach(([rowId, fields]) => {
      formikRowErrors[rowId] = fields;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: formikRowErrors,
    }));
  }, [grid.rowErrors]);

  /* ================= OVERRIDE processRowUpdate ================= */
  const processRowUpdate = async (row) => {
    try {
      const updated = await grid.processRowUpdate(row);
      return updated;
    } catch (e) {
      // Prevent Formik submit
      throw e;
    }
  };

  return {
    ...grid,
    processRowUpdate,
  };
};
