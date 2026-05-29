import { useImperativeHandle, useState } from "react";
import { Box, Grid, Pagination, Typography, BoxProps } from "@mui/material";

import { CenterCircularProgress, SearchBar } from "@/components/common";

import { useContractTemplates } from "@/queries/contract-template.query";

import { ContractTemplate } from "@/types/api/contract-template.api";
import { ContractTemplateEnumType } from "@/constants/ContractTemplateType";
export type TemplateContractListProps = BoxProps & {
  type?: ContractTemplateEnumType;
  render: (template: ContractTemplate, index: number) => React.ReactNode;
  pageSize?: number;
  emptyText?: string;
  ref?: any;
};

const TemplateContractList = ({
  type,
  render,
  pageSize,
  emptyText = "Không có template nào",
  ref,
  ...props
}: TemplateContractListProps) => {
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: { content: templates = [], totalPages = 0 } = {},

    isLoading,

    refetch: refetchTemplates,
  } = useContractTemplates({
    page,
    pageSize,

    filter: {
      keyword: searchQuery,
      type,
    },
  });

  useImperativeHandle(ref, () => ({
    refetch: refetchTemplates,
  }));

  return (
    <Box {...props}>
      <Box
        sx={{
          mx: "auto",

          mt: 3,
          mb: 4,

          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar
          minQueryLength={0}
          loading={isLoading}
          searchAfterClear
          onSearch={(value) => {
            setPage(0);
            setSearchQuery(value);
          }}
          placeholder="Nhập thông tin template hợp đồng"
        />
      </Box>

      {/* =========================================================================
       * CONTENT
       * ========================================================================= */}

      <Box
        sx={{
          minHeight: 250,
        }}
      >
        {isLoading ? (
          <CenterCircularProgress />
        ) : !templates.length ? (
          <Typography textAlign="center" color="text.secondary">
            {emptyText}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {templates.map((item, index) => render(item, index))}
          </Grid>
        )}
      </Box>

      {/* =========================================================================
       * PAGINATION
       * ========================================================================= */}

      {!isLoading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => {
              setPage(value - 1);
            }}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default TemplateContractList;
