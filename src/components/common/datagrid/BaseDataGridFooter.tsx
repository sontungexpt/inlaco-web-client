import Color from "@/constants/Color";
import { Pagination, PaginationProps } from "@mui/material";
import { ReactNode } from "react";
import { BaseDataGridBar, BaseDataGridBarProps } from "./BaseDataGridBar";

export type BaseTableFooterProps = BaseDataGridBarProps & {
  pagination?: PaginationProps;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  leftCompoent?: ReactNode;
};

export default function BaseDataGridFooter({
  pagination,
  leftCompoent,
  ...props
}: BaseTableFooterProps) {
  return (
    <BaseDataGridBar {...props}>
      {leftCompoent}

      {pagination?.count && (
        <Pagination
          size="small"
          {...pagination}
          sx={[
            {
              mx: 1,
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
    </BaseDataGridBar>
  );
}
