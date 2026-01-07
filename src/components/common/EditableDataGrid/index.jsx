import React, { useMemo } from "react";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Button, Stack, Typography, Box } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import BaseDataGrid from "../BaseDataGrid";
import DefaultEditableCell from "./DefaultEditableCell";
import ErrorWrapper from "./ErrorWrapper";

/**
 * EditableDataGrid
 * =================
 *
 * A reusable editable table component built on top of MUI X DataGrid.
 * It supports:
 * - Row-based editing
 * - Client-side validation
 * - Add / Edit / Delete rows
 * - Custom editable cells
 * - Error handling & disabling save when validation fails
 *
 * This component is designed to be used with `useEditableGrid` hook
 * to keep logic clean and reusable.
 *
 * ------------------------------------------------------------
 * BASIC USAGE
 * ------------------------------------------------------------
 *
 * <EditableDataGrid
 *   title="Users"
 *   columns={columns}
 *   createEmptyRow={() => ({
 *     name: "",
 *     email: "",
 *     age: "",
 *   })}
 * />
 *
 * ------------------------------------------------------------
 * COLUMN DEFINITION
 * ------------------------------------------------------------
 *
 * const columns = [
 *   {
 *     field: "name",
 *     headerName: "Name",
 *     width: 200,
 *     required: true, // used for validation
 *   },
 *   {
 *     field: "email",
 *     headerName: "Email",
 *     width: 250,
 *     validate: (value) =>
 *       !value?.includes("@") ? "Invalid email address" : null,
 *   },
 *   {
 *     field: "age",
 *     headerName: "Age",
 *     width: 120,
 *   },
 * ];
 *
 * ------------------------------------------------------------
 * VALIDATION
 * ------------------------------------------------------------
 *
 * Validation is handled inside `useEditableGrid`.
 * Each column can define:
 *
 * - required: boolean
 * - validate: (value, row) => string | null
 *
 * If a row has any validation error:
 * - Save button will be disabled
 * - Error message will be shown under the cell
 *
 * ------------------------------------------------------------
 * CUSTOM EDIT CELL
 * ------------------------------------------------------------
 *
 * You can override edit UI per column:
 *
 * {
 *   field: "price",
 *   headerName: "Price",
 *   renderEditCell: (params) => (
 *     <MyCustomCell {...params} />
 *   )
 * }
 *
 * If not provided, DefaultEditableCell will be used.
 */
const EditableDataGrid = ({
  rows,
  rowErrors = {},
  rowModesModel,
  setRowModesModel,
  addRow,
  removeRow,
  processRowUpdate,
  columns = [],
  createEmptyRow,
  title,
  buttonText = "Thêm dòng",
  titleProps,
  ...props
}) => {
  /* ================= ACTION COLUMN ================= */
  const actionColumn = useMemo(
    () => ({
      field: "actions",
      type: "actions",
      headerName: "Hành động",
      width: 120,
      align: "center",
      headerAlign: "center",
      getActions: ({ id }) => {
        const editing = rowModesModel[id]?.mode === GridRowModes.Edit;
        const hasError = !!rowErrors[id];

        return editing
          ? [
              <GridActionsCellItem
                icon={<SaveIcon color={hasError ? "disabled" : "success"} />}
                label="Lưu"
                disabled={hasError}
                onClick={() =>
                  setRowModesModel((prev) => ({
                    ...prev,
                    [id]: { mode: GridRowModes.View },
                  }))
                }
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Huỷ"
                onClick={() => removeRow(id)}
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<EditIcon color="primary" />}
                label="Sửa"
                onClick={() =>
                  setRowModesModel((prev) => ({
                    ...prev,
                    [id]: { mode: GridRowModes.Edit },
                  }))
                }
              />,
              <GridActionsCellItem
                icon={<DeleteIcon color="error" />}
                label="Xoá"
                onClick={() => removeRow(id)}
              />,
            ];
      },
    }),
    [rowModesModel, rowErrors, removeRow],
  );

  /* ================= FINAL COLUMNS ================= */
  const finalColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        editable: true,
        renderEditCell: (params) => {
          const error = rowErrors[params.id]?.[params.field];

          if (col.renderEditCell) {
            return col.renderEditCell({ ...params, error });
          }

          return <DefaultEditableCell {...params} error={error} />;
        },
      })),
    [columns, rowErrors],
  );

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title && (
          <Typography variant="h6" fontWeight={700} {...titleProps}>
            {title}
          </Typography>
        )}
        <Button variant="contained" startIcon={<AddIcon />} onClick={addRow}>
          {buttonText}
        </Button>
      </Box>

      <BaseDataGrid
        {...props}
        rows={rows}
        columns={[...finalColumns, actionColumn]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={() => {}}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Stack>
  );
};

export { ErrorWrapper, DefaultEditableCell };
export default EditableDataGrid;
