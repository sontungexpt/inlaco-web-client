import React from "react";
import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import { SectionWrapper } from "@/components/common";

const ContractDetailLayout = ({
  title,
  contractId,
  signed,
  loading,
  children,
  footer,
}) => {
  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ===== HEADER ===== */}
      <Box position="sticky" top={0} zIndex={10}>
        <SectionWrapper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize={18}>
              {title}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Mã hợp đồng: {contractId}
            </Typography>
          </Box>

          <Chip
            label={signed ? "Đã ký" : "Chưa ký"}
            color={signed ? "success" : "warning"}
          />
        </SectionWrapper>
      </Box>

      {/* ===== BODY ===== */}
      {children}

      {/* ===== FOOTER ===== */}
      {footer && (
        <Box position="sticky" bottom={0}>
          {footer}
        </Box>
      )}
    </Box>
  );
};

export default ContractDetailLayout;
