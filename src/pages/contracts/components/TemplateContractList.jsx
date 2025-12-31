import { Grid, Box, Pagination, Typography } from "@mui/material";
import { TemplateContractCard } from "@components/contract";
import { useState } from "react";
import Color from "@/constants/Color";

const TemplateContractList = ({
  data = [],
  totalPages,
  onSelect, // optional: dùng khi ở dialog
  initialPage = 0,
  emptyText = "Không có template nào",
}) => {
  const [page, setPage] = useState(initialPage);

  if (!data.length) {
    return (
      <Typography textAlign="center" color="text.secondary">
        {emptyText}
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item) => (
          <TemplateContractCard
            key={item.id}
            image={item.image}
            title={item.title}
            type={item.type}
            onClick={() => onSelect?.(item)} // dialog có thể dùng
          />
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color={Color.PrimaryBlue}
          />
        </Box>
      )}
    </Box>
  );
};

export default TemplateContractList;
