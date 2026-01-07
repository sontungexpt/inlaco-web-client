import React, { useState, useCallback } from "react";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Button, Stack, Typography, TextField, Box } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import BaseDataGrid from "./BaseDataGrid";

/* ================= HELPERS ================= */

const validateRowByColumns = (row, columns) => {
  const errors = {};

  columns.forEach((col) => {
    if (col.required && !row[col.field]) {
      errors[col.field] = `${col.headerName} không được để trống`;
    }

    if (col.validate) {
      const msg = col.validate(row[col.field], row);
      if (msg) errors[col.field] = msg;
    }
  });

  return Object.keys(errors).length ? errors : null;
};

const EditableCell = ({ id, field, value, error, api, ...params }) => {
  return (
    <TextField
      fullWidth
      value={value ?? ""}
      error={!!error}
      helperText={error}
      size="small"
      onChange={(e) =>
        api.setEditCellValue({
          id,
          field,
          value: e.target.value,
        })
      }
      autoFocus={!!error}
    />
  );
};

/* ================= COMPONENT ================= */

const EditableDataGrid = ({
  initialRows = [],
  columns = [],
  createEmptyRow,
  title,
  buttonText = "Thêm dòng",
  titleProps,
  ...props
}) => {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowErrors, setRowErrors] = useState({});

  /* ================= ADD ROW ================= */
  const handleAddRow = useCallback(() => {
    const id = crypto.randomUUID();

    setRows((prev) => [{ id, isNew: true, ...createEmptyRow() }, ...prev]);

    setRowModesModel((prev) => ({
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: columns[0]?.field,
      },
      ...prev,
    }));
  }, [columns, createEmptyRow]);

  /* ================= ACTIONS ================= */
  const handleEditClick = (id) => () =>
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));

  const handleSaveClick = (id) => () =>
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    setRows((prev) => prev.filter((r) => !(r.id === id && r.isNew)));
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleDeleteClick = (id) => () =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  /* ================= SAVE ================= */
  const processRowUpdate = async (newRow) => {
    const errors = validateRowByColumns(newRow, columns);

    if (errors) {
      setRowErrors((prev) => ({
        ...prev,
        [newRow.id]: errors,
      }));
      throw new Error("VALIDATION_ERROR");
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
  };

  /* ================= ACTION COLUMN ================= */
  const actionColumn = {
    field: "actions",
    type: "actions",
    headerName: "Hành động",
    width: 120,
    align: "center",
    headerAlign: "center",
    getActions: ({ id }) => {
      const editing = rowModesModel[id]?.mode === GridRowModes.Edit;

      return editing
        ? [
            <GridActionsCellItem
              icon={<SaveIcon color="success" />}
              label="Lưu"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Huỷ"
              onClick={handleCancelClick(id)}
            />,
          ]
        : [
            <GridActionsCellItem
              icon={<EditIcon color="primary" />}
              label="Sửa"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon color="error" />}
              label="Xoá"
              onClick={handleDeleteClick(id)}
            />,
          ];
    },
  };

  /* ================= FINAL COLUMNS ================= */
  const finalColumns = columns.map((col) => ({
    ...col,
    editable: true,
    renderEditCell: (params) => (
      <EditableCell {...params} error={rowErrors[params.id]?.[params.field]} />
    ),
  }));

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRow}
        >
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

export default EditableDataGrid;
// import React, { useState } from "react";
// import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
// import { Box, Button, Stack, Typography } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";

// import BaseDataGrid from "./BaseDataGrid";

// const EditableDataGrid = ({
//   initialRows = [],
//   columns,
//   createEmptyRow,
//   title,
//   buttonProps,
//   buttonText = "Thêm dòng",
//   titleProps,
//   wrapperProps,
//   ...props
// }) => {
//   const [rows, setRows] = useState(initialRows);
//   const [rowModesModel, setRowModesModel] = useState({});

//   /* ================= ADD ROW ================= */
//   const handleAddRow = () => {
//     const id = crypto.randomUUID();

//     setRows((prev) => [
//       {
//         id,
//         isNew: true,
//         ...createEmptyRow(),
//       },
//       ...prev,
//     ]);

//     setRowModesModel((prev) => ({
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
//       ...prev,
//     }));
//   };

//   /* ================= ACTION HANDLERS ================= */
//   const handleEditClick = (id) => () =>
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: { mode: GridRowModes.Edit },
//     });

//   const handleSaveClick = (id) => () =>
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: { mode: GridRowModes.View },
//     });

//   const handleCancelClick = (id) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: {
//         mode: GridRowModes.View,
//         ignoreModifications: true,
//       },
//     });

//     const row = rows.find((r) => r.id === id);
//     if (row?.isNew) {
//       setRows((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const handleDeleteClick = (id) => () =>
//     setRows((prev) => prev.filter((row) => row.id !== id));

//   /* ================= SAVE ROW ================= */
//   const processRowUpdate = (newRow) => {
//     const updatedRow = { ...newRow, isNew: false };

//     setRows((prev) =>
//       prev.map((row) => (row.id === newRow.id ? updatedRow : row)),
//     );

//     return updatedRow;
//   };

//   /* ================= ACTION COLUMN ================= */
//   const actionColumn = {
//     field: "actions",
//     type: "actions",
//     headerName: "Hành động",
//     headerAlign: "center",
//     width: 120,
//     align: "center",
//     getActions: ({ id }) => {
//       const isEdit = rowModesModel[id]?.mode === GridRowModes.Edit;

//       if (isEdit) {
//         return [
//           <GridActionsCellItem
//             icon={<SaveIcon color="success" />}
//             label="Save"
//             onClick={handleSaveClick(id)}
//           />,
//           <GridActionsCellItem
//             icon={<CancelIcon color="inherit" />}
//             label="Cancel"
//             onClick={handleCancelClick(id)}
//           />,
//         ];
//       }

//       return [
//         <GridActionsCellItem
//           icon={<EditIcon color="primary" />}
//           label="Edit"
//           onClick={handleEditClick(id)}
//         />,
//         <GridActionsCellItem
//           icon={<DeleteIcon color="error" />}
//           label="Delete"
//           onClick={handleDeleteClick(id)}
//         />,
//       ];
//     },
//   };

//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         {title && (
//           <Typography variant="h6" fontWeight={700} {...titleProps}>
//             {title}
//           </Typography>
//         )}

//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAddRow}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             fontWeight: 600,
//           }}
//           {...buttonProps}
//         >
//           {buttonText}
//         </Button>
//       </Stack>

//       {/* ===== DATAGRID ===== */}
//       <BaseDataGrid
//         {...props}
//         rows={rows}
//         columns={[...columns, actionColumn]}
//         editMode="row"
//         rowModesModel={rowModesModel}
//         onRowModesModelChange={setRowModesModel}
//         processRowUpdate={processRowUpdate}
//         experimentalFeatures={{ newEditingApi: true }}
//         getRowClassName={(params) => {
//           if (params.row.isNew) return "row--new";
//           if (rowModesModel[params.id]?.mode === GridRowModes.Edit)
//             return "row--editing";
//           return "";
//         }}
//       />
//     </Box>
//   );
// };

// export default EditableDataGrid;
