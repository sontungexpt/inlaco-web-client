import Color from "@/constants/Color";
import { Box, Pagination, Select, MenuItem, BoxProps } from "@mui/material";

export type TablePagination = {
  page: number; // 0-based
  pageSize: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
};

type BaseTableFooterProps = BoxProps & {
  pagination?: TablePagination;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
};

export default function BaseDataGridFooter({
  pagination,
  height,
  ...props
}: BaseTableFooterProps) {
  const { page = 0, pageSize = 10, total = 0, onChange } = pagination ?? {};

  const totalPages = total ? Math.ceil(total / pageSize) : page + 1;

  return (
    <Box
      {...props}
      sx={[
        {
          width: "100%",

          backgroundColor: "var(--rdg-header-background-color)",

          borderWidth: "var(--rdg-border-width)",
          borderColor: "var(--rdg-border-color)",

          px: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",

          color: "var(--rdg-color)",
          fontSize: "var(--rdg-font-size)",

          height: height,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Pagination
        page={page + 1}
        count={totalPages}
        onChange={(_, value) => onChange?.(value - 1, pageSize)}
        size="small"
        sx={{
          "& .MuiPagination-ul": {
            gap: 1.2,
          },

          "& .MuiPaginationItem-root": {
            color: Color.PrimaryWhite,
            fontWeight: 500,
            borderRadius: "6px",
            textShadow: "0 1px 2px rgba(0,0,0,0.25)",
            fontSize: 16,

            "&:hover": {
              backgroundColor: Color.PrimaryHoverBlue,
            },
          },

          "& .MuiPaginationItem-previousNext": {
            fontSize: 30,
            fontWeight: 700,
          },

          "& .MuiPaginationItem-previousNext svg": {
            fontSize: 30,
            color: Color.PrimaryWhite,
          },

          "& .Mui-selected": {
            backgroundColor: "#fff",
            color: "#4D85D8",
            fontWeight: 600,
            textShadow: "none",

            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          },
        }}
      />
    </Box>
  );
}
