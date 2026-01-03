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
import TemplateContractCard from "./TemplateContractCard";

const TemplateContractList = ({
  type,
  initialData,
  render = (item) => (
    <TemplateContractCard
      key={item.id}
      url={item.metadata?.url}
      title={item.name}
      initialData={initialData}
      dowloadFileName={item.name}
      type={item.type}
    />
  ),
  pageSize,
  emptyText = "Không có template nào",
  ref,
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
    <Box>
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
        <SearchBar
          placeholder="Nhập thông tin template hợp đồng"
          color={Color.PrimaryBlack}
          backgroundColor={Color.SecondaryWhite}
          sx={{
            width: "420px",
            borderRadius: 2,
          }}
        />
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
