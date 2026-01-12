import React, { useMemo, useState } from "react";
import { GridActionsCellItem, GridRowModes, Toolbar } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  EditableGridProvider,
  useEditableGridContext,
} from "@/components/common/datagrid/editable/EditableGridContext";
import { BaseDataGrid, ErrorTooltip, InfoTextField } from "@components/common";

const DefaultEditableCell = ({ id, field, value, error, api, type }) => {
  return (
    <ErrorTooltip error={error}>
      <InfoTextField
        size="small"
        type={type}
        value={value ?? ""}
        error={!!error}
        onChange={(e) => {
          const nextValue =
            type === "date" || type === "datetime-local"
              ? new Date(e.target.value)
              : e.target.value;

          api.setEditCellValue(
            { id, field, value: nextValue },
            { debounceMs: 120 },
          );
        }}
      />
    </ErrorTooltip>
  );
};

const EditableGridToolbar = ({ onAdd, addDisabled, addButtonText }) => {
  return (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        disabled={addDisabled}
        onClick={onAdd}
      >
        {addButtonText}
      </Button>
    </Toolbar>
  );
};

const EditableDataGridCoreInner = ({
  title,
  titleProps,

  columns,

  headerAlign,
  slotProps,
  addButtonText = "Thêm dòng",
  editMode = "row",
  onProcessRowUpdateError = () => {},
  ...props
}) => {
  const {
    rows,
    rowErrors,
    rowModesModel,
    updaingRowIds,
    setRowModesModel,
    addRow,
    removeRow,
    processRowUpdate,
  } = useEditableGridContext();
  const [showErrors, setShowErrors] = useState({});

  /* ================= ACTION COLUMN ================= */
  const actionColumn = useMemo(
    () => ({
      field: "__actions",
      type: "actions",
      headerName: "Hành động",
      width: 120,
      align: "center",
      headerAlign: "center",
      getActions: ({ id }) => {
        const editing = rowModesModel[id]?.mode === GridRowModes.Edit;
        return [
          editing ? (
            <GridActionsCellItem
              icon={<SaveIcon color="success" />}
              label="Lưu"
              onClick={() => {
                setShowErrors((prev) => ({ ...prev, [id]: true }));
                setRowModesModel((prev) => ({
                  ...prev,
                  [id]: { mode: GridRowModes.View },
                }));
              }}
            />
          ) : (
            <GridActionsCellItem
              icon={<EditIcon color="primary" />}
              label="Sửa"
              onClick={() => {
                setShowErrors((prev) => ({ ...prev, [id]: false }));
                setRowModesModel((prev) => ({
                  ...prev,
                  [id]: { mode: GridRowModes.Edit },
                }));
              }}
            />
          ),
          <GridActionsCellItem
            icon={<DeleteIcon color="error" />}
            label="Xoá"
            onClick={() => removeRow(id)}
          />,
        ];
      },
    }),
    [rowModesModel, setRowModesModel, removeRow],
  );

  /* ================= FINAL COLUMNS ================= */
  const finalColumns = useMemo(() => {
    return columns.map((col) => {
      const colType = col.type;
      const isDateType = colType === "datetime" || colType === "date";

      return {
        editable: true,
        flex: isDateType ? 1.5 : 1,
        ...col,
        renderEditCell: (params) => {
          const allowShowError = showErrors[params.id];
          const error = allowShowError
            ? params.error || rowErrors[params.id]?.[params.field]
            : undefined;

          if (col.renderEditCell) {
            return col.renderEditCell({ ...params, error });
          }
          return (
            <DefaultEditableCell
              {...params}
              type={colType === "datetime" ? "datetime-local" : colType}
              error={error}
            />
          );
        },
      };
    });
  }, [columns, rowErrors, showErrors]);

  return (
    <BaseDataGrid
      showToolbar
      slots={{ toolbar: EditableGridToolbar }}
      {...props}
      rows={rows}
      editMode={editMode}
      onRowEditStop={(params, event) => {
        // Ignore focus move inside same row
        if (event?.reason === "cellFocusOut") return;
        setShowErrors((prev) => ({
          ...prev,
          [params.id]: true,
        }));
      }}
      headerAlign={headerAlign}
      columns={[...finalColumns, actionColumn]}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
      experimentalFeatures={{ newEditingApi: true }}
      slotProps={{
        ...slotProps,
        toolbar: {
          onAdd: addRow,
          addButtonText,
          addDisabled: Object.keys(rowErrors).length > 0,
        },
        cell: {
          ...slotProps?.cell,
          onFocus: (event, ...params) => {
            slotProps?.cell?.onFocus?.(event, ...params);
            const rowId = event.currentTarget.parentElement?.dataset?.id;
            if (!rowId) return;

            //  KEY LINE: hide error when user starts editing
            setShowErrors((prev) => ({
              ...prev,
              [rowId]: false,
            }));
          },
        },
      }}
    />
  );
};

export const EditableDataGridCore = ({
  adapter,
  createEmptyRow,
  fieldToFocus,
  ...props
}) => {
  return (
    <EditableGridProvider
      createEmptyRow={createEmptyRow}
      fieldToFocus={fieldToFocus}
      adapter={adapter}
      {...props}
    >
      <EditableDataGridCoreInner {...props} />
    </EditableGridProvider>
  );
};
export default EditableDataGridCore;
