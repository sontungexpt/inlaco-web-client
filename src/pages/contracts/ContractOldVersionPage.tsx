import { useParams, useNavigate } from "react-router";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { LoadErrorState, PageTitle, SectionWrapper } from "@components/common";
import Color from "@constants/Color";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";
import { useContractOldVersions } from "@/queries/contract.query";

const ContractOldVersionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: contracts = [],
    isLoading,
    isError,
    refetch,
  } = useContractOldVersions(id as string);

  if (isLoading) return <CenterCircularProgress />;

  if (isError) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xoa"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <SectionWrapper>
        <PageTitle
          title="Phiên bản hợp đồng"
          subtitle="Xem tất cả các phiên bản cũ của hợp đồng"
        />
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: Color.PrimaryBlue,
            color: Color.PrimaryWhite,
            mt: 2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            ":hover": { opacity: 0.9 },
          }}
        >
          Quay lại
        </Button>
      </SectionWrapper>

      {/* List */}
      <SectionWrapper title="Danh sách phiên bản">
        {contracts.length === 0 ? (
          <Typography align="center" color={Color.PrimaryGray} sx={{ mt: 2 }}>
            Không có phiên bản nào được tìm thấy.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {contracts.map((v) => (
              <Grid
                key={v.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.2s",
                    ":hover": { transform: "scale(1.03)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      Phiên bản {v.version.num}
                    </Typography>

                    <Typography variant="body2" color={Color.PrimaryGray}>
                      Ngày tạo: {new Date(v.version.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        navigate(
                          `/crew-contracts/${v.id}?version=${v.version.num}`,
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: Color.PrimaryBlue,
                        ":hover": { bgcolor: Color.PrimaryBlue },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default ContractOldVersionPage;
