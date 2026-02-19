import React, { useState } from "react";
import { CloudinaryImage, PageTitle, SectionWrapper } from "@components/common";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Pagination,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { usePosts } from "@/hooks/services/post";
import { useNavigate } from "react-router";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";

const NewsCard = ({
  title,
  description,
  imagePublicId,
  imageSrc,
  date,
  onClick,
  onDetailClick,
  ...props
}) => {
  return (
    <Card
      {...props}
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
          "& img": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      {/* IMAGE */}
      <Box
        position="relative"
        sx={{
          overflow: "hidden",
        }}
      >
        <CloudinaryImage
          height="180"
          publicId={imagePublicId}
          src={imageSrc}
          alt={title}
          sx={{
            transition: "transform 0.4s ease",
          }}
        />

        {/* Gradient + blur */}
        <Box
          position="absolute"
          inset={0}
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            backdropFilter: "blur(1px)",
          }}
        />

        {/* Date badge */}
        <Box
          position="absolute"
          top={12}
          left={12}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#fff", fontWeight: 500 }}>
            {date}
          </Typography>
        </Box>
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 3,
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          lineHeight={1.3}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            mt: 1.2,
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        {/* CTA */}
        <Button
          variant="contained"
          size="small"
          sx={{
            mt: "auto",
            alignSelf: "flex-start",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick?.(e);
          }}
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HomePage({ pageSize = 12 }) {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const [page, setPage] = useState(0);

  const {
    data: { content: posts = [], totalPages = 0 } = {},
    isLoading,
    isError,
    refetch: refetchNews,
  } = usePosts({
    page,
    pageSize: pageSize,
    filter: {},
  });

  if (isLoading) {
    return <CenterCircularProgress />;
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
        <Button variant="contained" onClick={() => refetchNews()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <SectionWrapper>
        <PageTitle
          title="TRANG CHỦ"
          subtitle="Trang chủ website quản lý của công ty INLACO Hải Phòng"
          mb={isAdmin ? 2 : 0}
        />
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/posts/create")}
          >
            Thêm bài viết
          </Button>
        )}
      </SectionWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {posts.map((post) => (
          <Grid
            key={post.id}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <NewsCard
              id={post.id}
              title={post.title}
              description={post.description}
              imageSrc={post.image.url}
              imagePublicId={post.image.publicId}
              date={post.date}
              onClick={() => navigate(`/posts/${post.id}`)}
              onDetailClick={() => navigate(`/posts/${post.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page + 1} // MUI start from 1
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
}
