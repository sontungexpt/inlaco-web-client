import React, { useMemo, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Color from "@constants/Color";
import { NoValuesOverlay } from "../global";

const BaseDataGrid = ({
  rows,
  columns,
  rowCount,
  slots,
  paginationModel,
  pageSizeOptions = [paginationModel?.pageSize],
  onPaginationModelChange,
  loading,
  sx = {},
  ...props
}) => {
  // Fix the data grid row count is undefined when fetching and auto reset to page 0
  const rowCountRef = useRef(rowCount ?? 0);
  const stableRowCount = useMemo(() => {
    if (typeof rowCount === "number") {
      rowCountRef.current = rowCount;
    }
    return rowCountRef.current;
  }, [rowCount]);

  return (
    <DataGrid
      disableRowSelectionOnClick
      disableColumnMenu
      disableColumnResize
      showColumnVerticalBorder
      showCellVerticalBorder
      getRowHeight={() => "auto"}
      pageSizeOptions={pageSizeOptions}
      rows={rows}
      columns={columns}
      rowCount={stableRowCount}
      loading={loading}
      slots={{ noRowsOverlay: NoValuesOverlay, ...slots }}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sx={[
        {
          bgcolor: "#FFF",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",

          "& .MuiDataGrid-cell": {
            borderColor: "divider",
            px: 2,
            py: 1.5,
            alignItems: "center",
          },

          "& .MuiDataGrid-columnHeaders": {
            borderColor: "divider",
          },

          "& .MuiDataGrid-columnSeparator": {
            color: "divider",
          },

          "& .MuiDataGrid-columnHeader": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
            fontWeight: 700,
          },

          "& .MuiTablePagination-root": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export default BaseDataGrid;
