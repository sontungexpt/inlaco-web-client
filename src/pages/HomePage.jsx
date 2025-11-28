import React, { useState } from "react";
import { PageTitle } from "@components/global";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { usePosts } from "@hooks/services/posts";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 12;
  const { data, isLoading, isError, refetch } = usePosts({ page, size });
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

  if (isError) {
    return (
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Không thể tải dữ liệu bài viết. Vui lòng thử lại!
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  const newsList = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <Box m="20px">
        <PageTitle
          title="TRANG CHỦ"
          subtitle="Trang chủ website quản lý của công ty INLACO Hải Phòng"
        />
        <Box
          mt={3}
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Tin tức công ty
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/posts/create")}
          >
            Thêm bài viết
          </Button>
        </Box>
        <Grid container spacing={3}>
          {newsList.map((news) => (
            <Grid
              key={news.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={news.image}
                  alt={news.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {news.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {news.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {news.date}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/posts/${news.id}`)}
                    sx={{ mt: 2 }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page + 1} // MUI bắt đầu từ 1
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
            size="large"
          />
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
