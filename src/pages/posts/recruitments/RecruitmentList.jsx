import { Box, Grid, Pagination, Typography } from "@mui/material";
import RecruitmentCard from "./RecruitmentCard";

export default function RecruitmentList({
  posts,
  isAdmin,
  totalPages,
  page,
  onPageChange,
  onPostClick,
}) {
  if (posts.length === 0)
    return (
      <Typography sx={{ textAlign: "center", mt: 2, fontWeight: "bold" }}>
        Chưa có bài đăng tuyển dụng nào
      </Typography>
    );

  return (
    <>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <RecruitmentCard
            key={post.id}
            title={post.title}
            description={post.content}
            isAdmin={isAdmin}
            onClick={() => onPostClick(post.id)}
          />
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page} // MUI bắt đầu từ 1
          onChange={onPageChange}
          color="primary"
          size="large"
        />
      </Box>
    </>
  );
}
