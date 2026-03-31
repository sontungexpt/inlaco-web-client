import { CenterCircularProgress, SearchBar } from "@/components/common";
import { useContractTemplates } from "@/queries/contract-template.query";
import { ContractType } from "@/types/api/contract.api";
import { Grid, Box, Pagination, Typography, BoxProps } from "@mui/material";
import { useImperativeHandle, useState } from "react";

export type TemplateContractListProps = BoxProps & {
  type?: ContractType;
  render: (template: any) => React.ReactNode;
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

  const {
    data: { content: templates = [], totalPages = 0 } = {},
    isLoading,
    refetch: refetchTemplates,
  } = useContractTemplates({
    page,
    pageSize: pageSize,
    filter: {
      type,
    },
  });

  useImperativeHandle(ref, () => ({
    refetch: refetchTemplates,
  }));

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  if (!templates.length) {
    return (
      <Typography textAlign="center" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return (
    <Box {...props}>
      {/* ===== Search ===== */}
      <Box
        sx={{
          mx: "auto",
          mt: 3,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar placeholder="Nhập thông tin template hợp đồng" />
      </Box>

      <Grid container spacing={4}>
        {templates.map((item, ...params) => render(item, ...params))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default TemplateContractList;
