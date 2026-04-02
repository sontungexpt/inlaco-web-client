import { Box, Pagination, Select, MenuItem } from "@mui/material";

export type TablePagination = {
  page: number; // 0-based
  pageSize: number;
  total?: number;
  onChange: (page: number, pageSize: number) => void;
};

type BaseTableFooterProps = {
  pagination: TablePagination;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
};

export default function BaseDataGridFooter({
  pagination,
  pageSizeOptions = [10, 20, 50],
  showPageSize = true,
}: BaseTableFooterProps) {
  const { page, pageSize, total, onChange } = pagination;

  const totalPages = total ? Math.ceil(total / pageSize) : page + 1;

  const from = total ? page * pageSize + 1 : 0;
  const to = total ? Math.min((page + 1) * pageSize, total) : 0;

  return (
    <Box
      sx={{
        mt: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: "primary.main",
        color: "#fff",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* <Box fontSize={13} fontWeight={500} opacity={0.9}> */}
      {/*   {total !== undefined ? `${from}–${to} / ${total}` : `Page ${page + 1}`} */}
      {/* </Box> */}

      {/* RIGHT */}
      <Box display="flex" alignItems="center" gap={2}>
        {showPageSize && (
          <Select
            size="small"
            value={pageSize}
            onChange={
              (e) => onChange(0, Number(e.target.value)) // reset về page 0
            }
            sx={{
              color: "#fff",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.4)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              ".MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size} / page
              </MenuItem>
            ))}
          </Select>
        )}

        <Pagination
          page={page + 1} // MUI = 1-based
          count={totalPages}
          onChange={(_, value) => onChange(value - 1, pageSize)}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#fff",
              borderRadius: 1.5,
            },
            "& .Mui-selected": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },
          }}
        />
      </Box>
    </Box>
  );
}
