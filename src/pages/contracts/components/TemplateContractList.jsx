import { SearchBar } from "@/components/global";
import Color from "@/constants/Color";
import { useContractTemplates } from "@/hooks/services/contractTemplate";
import {
  Grid,
  Box,
  Pagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";

const TemplateContractList = ({
  type,
  render,
  pageSize,
  emptyText = "Không có template nào",
  ref,
  ...props
}) => {
  const [page, setPage] = useState(0);

  const {
    data: { content: templates = [], totalPages = 0 } = {},
    isLoading,
    refetch: refetchTemplates,
  } = useContractTemplates({
    page,
    pageSize: pageSize,
    type,
  });

  useImperativeHandle(ref, () => ({
    refetch: refetchTemplates,
  }));

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
          maxWidth: 1400,
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
