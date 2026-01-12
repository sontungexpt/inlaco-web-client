import React, { useCallback, useMemo, useState } from "react";
import { GridActionsCellItem, GridRowModes, Toolbar } from "@mui/x-data-grid";
import { Button, CircularProgress } from "@mui/material";
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
  getRowClassName,
  sx,
  slots,
  ...props
}) => {
  const {
    rows,
    rowErrors,
    rowModesModel,
    updatingRowIdMap,
    setRowModesModel,
    addRow,
    removeRow,
    processRowUpdate,
  } = useEditableGridContext();
  const [showErrors, setShowErrors] = useState({});

  const showRowError = useCallback((rowId, showed) => {
    setShowErrors((prev) => {
      const next = { ...prev };
      if (showed) next[rowId] = true;
      else delete next[rowId];
      return next;
    });
  }, []);

  /* ================= ACTION COLUMN ================= */
  const actionColumn = useMemo(
    () => ({
      field: "__actions",
      type: "actions",
      headerName: "Hành động",
      width: 120,
      align: "center",
      headerAlign: "center",
      getActions: ({ id: rowId }) => {
        const editing = rowModesModel[rowId]?.mode === GridRowModes.Edit;
        const isRowUpdating = updatingRowIdMap[rowId];
        return [
          editing || isRowUpdating ? (
            <GridActionsCellItem
              disabled={isRowUpdating}
              icon={
                isRowUpdating ? (
                  <CircularProgress size={18} />
                ) : (
                  <SaveIcon color={isRowUpdating ? "disabled" : "success"} />
                )
              }
              label="Lưu"
              onClick={() => {
                showRowError(rowId, true);
                setRowModesModel((prev) => ({
                  ...prev,
                  [rowId]: { mode: GridRowModes.View },
                }));
              }}
            />
          ) : (
            <GridActionsCellItem
              disabled={isRowUpdating}
              icon={<EditIcon color={isRowUpdating ? "disabled" : "primary"} />}
              label="Sửa"
              onClick={() => {
                showRowError(rowId, false);
                setRowModesModel((prev) => ({
                  ...prev,
                  [rowId]: { mode: GridRowModes.Edit },
                }));
              }}
            />
          ),
          <GridActionsCellItem
            disabled={isRowUpdating}
            icon={<DeleteIcon color={isRowUpdating ? "disabled" : "error"} />}
            label="Xoá"
            onClick={() => removeRow(rowId)}
          />,
        ];
      },
    }),
    [
      rowModesModel,
      updatingRowIdMap,
      setRowModesModel,
      showRowError,
      removeRow,
    ],
  );

  /* ================= FINAL COLUMNS ================= */
  const finalColumns = useMemo(() => {
    return columns.map((col) => {
      const colType = col.type;

      return {
        editable: true,
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
      {...props}
      slots={{ toolbar: EditableGridToolbar, ...slots }}
      rows={rows}
      editMode={editMode}
      onRowEditStop={(params, event) => {
        // Ignore focus move inside same row
        if (event?.reason === "cellFocusOut") return;
        showRowError(params.id, true);
      }}
      headerAlign={headerAlign}
      columns={[...finalColumns, actionColumn]}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      processRowUpdate={processRowUpdate}
      getRowClassName={(params, ...args) => {
        const internal = updatingRowIdMap[params.id] && "editable-row--loading";
        const external = getRowClassName?.(params, ...args);
        return [internal, external].filter(Boolean).join(" ");
      }}
      onProcessRowUpdateError={onProcessRowUpdateError}
      experimentalFeatures={{ newEditingApi: true }}
      sx={[
        {
          "& .editable-row--loading::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            padding: "2px",
            background:
              "linear-gradient(90deg, transparent, #1976d2, transparent)",
            backgroundSize: "200% 100%",
            animation: "row-border-loading 20s linear infinite",
            pointerEvents: "none",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          },
          "@keyframes row-border-loading": {
            from: { backgroundPosition: "200% 0" },
            to: { backgroundPosition: "-200% 0" },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
            showRowError(rowId, false);
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
