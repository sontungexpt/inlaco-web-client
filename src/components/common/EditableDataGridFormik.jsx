import React from "react";
import EditableDataGrid from "./EditableDataGrid";
import { useFormikEditableGrid } from "@/hooks/useEditableGrid";

/**
 * EditableDataGridFormik
 * ======================
 *
 * A Formik-connected wrapper for EditableDataGrid.
 *
 * Responsibilities:
 * - Bind DataGrid rows to Formik field
 * - Sync row validation errors into Formik
 *
 * This component does NOT contain UI logic.
 */
const EditableDataGridFormik = ({
  name,
  columns,
  createEmptyRow,
  ...props
}) => {
  const {
    rows,
    rowErrors,
    rowModesModel,
    setRowModesModel,
    addRow,
    removeRow,
    processRowUpdate,
  } = useFormikEditableGrid({
    name,
    columns,
    createEmptyRow,
  });

  return (
    <EditableDataGrid
      {...props}
      columns={columns}
      createEmptyRow={createEmptyRow}
      rows={rows}
      rowErrors={rowErrors}
      rowModesModel={rowModesModel}
      setRowModesModel={setRowModesModel}
      addRow={addRow}
      removeRow={removeRow}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default EditableDataGridFormik;
