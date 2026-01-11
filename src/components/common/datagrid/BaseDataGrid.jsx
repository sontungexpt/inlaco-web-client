import React, { useMemo, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Color from "@constants/Color";
import { NoValuesOverlay } from "@components/common";

const BaseDataGrid = ({
  rows,
  columns,
  rowCount,
  slots,
  paginationModel,
  header,
  pageSizeOptions = [],
  onPaginationModelChange,
  loading,
  sx = {},
  ...props
}) => {
  const pageSize = paginationModel?.pageSize ?? 10;
  const paginationMode = paginationModel ? "server" : "client";

  // Fix rowCount undefined → avoid reset page
  const rowCountRef = useRef(rowCount ?? 0);
  const stableRowCount = useMemo(() => {
    if (paginationMode === "client") return undefined;
    if (typeof rowCount === "number") {
      rowCountRef.current = rowCount;
    }
    return rowCountRef.current;
  }, [paginationMode, rowCount]);

  return (
    <DataGrid
      disableRowSelectionOnClick
      disableColumnMenu
      disableColumnResize
      showColumnVerticalBorder
      showCellVerticalBorder
      getRowHeight={() => "auto"}
      {...props}
      rowCount={stableRowCount}
      pageSizeOptions={[...pageSizeOptions, pageSize]}
      paginationMode={paginationMode}
      paginationModel={paginationModel ?? { page: 0, pageSize }}
      rows={rows}
      columns={columns}
      loading={loading}
      slots={{ noRowsOverlay: NoValuesOverlay, ...slots }}
      onPaginationModelChange={onPaginationModelChange}
      sx={[
        {
          /* ===== CARD ===== */
          bgcolor: "#fff",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",

          /* ===== HEADER ===== */
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
            fontWeight: 700,
            fontSize: 14,
          },

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
            borderColor: "divider",
            borderBottom: "none",
          },

          /* ===== BODY ===== */
          "& .MuiDataGrid-cell": {
            px: 2,
            py: 1.25,
            borderColor: "divider",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnSeparator": {
            borderColor: "divider",
            color: "#000000",
          },

          /* Zebra rows */
          "& .MuiDataGrid-row:nth-of-type(even)": {
            bgcolor: "rgba(0,0,0,0.015)",
          },

          "& .MuiDataGrid-row:hover": {
            bgcolor: "rgba(0,0,0,0.04)",
          },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          /* ===== FOOTER ===== */
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
            borderTop: "none",
          },

          "& .MuiTablePagination-root": {
            backgroundColor: Color.SecondaryBlue,
            color: Color.PrimaryWhite,
            fontSize: 13,
          },

          "& .MuiTablePagination-actions svg": {
            color: Color.PrimaryWhite,
          },

          "& .MuiTablePagination-selectIcon": {
            color: Color.PrimaryWhite,
          },

          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: 13,
            },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default BaseDataGrid;
