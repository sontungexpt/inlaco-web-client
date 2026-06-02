import { Box, Typography, Chip } from "@mui/material";
import { CenterCircularProgress, SectionWrapper } from "@/components/common";

const ContractDetailLayout = ({
  title,
  contractId,
  signed,
  loading,
  children,
  footer,
}) => {
  if (loading) {
    return <CenterCircularProgress />;
  }

  return (
    <Box>
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
