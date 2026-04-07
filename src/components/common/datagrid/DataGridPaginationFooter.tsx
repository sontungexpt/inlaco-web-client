import Color from "@/constants/Color";
import { Box, Pagination, BoxProps, PaginationProps } from "@mui/material";
import { ReactNode } from "react";

export type BaseTableFooterProps = BoxProps & {
  pagination?: PaginationProps;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  leftCompoent?: ReactNode;
};

export default function DataGridPaginationFooter({
  pagination,
  height,
  leftCompoent,
  ...props
}: BaseTableFooterProps) {
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
      {leftCompoent}

      {pagination?.count && (
        <Pagination
          size="small"
          {...pagination}
          sx={[
            {
              "&& .MuiPagination-ul": {
                gap: 1.2,
              },
              "&& .MuiPaginationItem-root": {
                color: Color.PrimaryWhite,
                fontWeight: 500,
                borderRadius: "6px",
                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                fontSize: 16,

                "&:hover": {
                  backgroundColor: Color.PrimaryHoverBlue,
                },
              },

              "&& .Mui-selected": {
                backgroundColor: Color.PrimaryWhite,
                color: Color.PrimaryBlue,
                fontWeight: 600,
                textShadow: "none",

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              },

              "&& .MuiPaginationItem-previousNext, && .MuiPaginationItem-previousNext svg":
                {
                  fontSize: 30,
                  fontWeight: 700,
                },
            },
            ...(Array.isArray(pagination?.sx)
              ? pagination.sx
              : [pagination?.sx]),
          ]}
        />
      )}
    </Box>
  );
}
