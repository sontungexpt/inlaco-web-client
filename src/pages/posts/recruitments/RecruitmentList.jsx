import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import RecruitmentCard from "./RecruitmentCard";
import { isoToLocalDatetime } from "@/utils/converter";

export default function RecruitmentList({
  posts,
  loading,
  isAdmin,
  totalPages,
  page,
  onPageChange,
  onPostClick,
  onApplyNow,
  onViewDetail,
}) {
  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );

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
            isExpired={!post.active}
            startDate={isoToLocalDatetime(post.recruitmentStartDate)}
            endDate={isoToLocalDatetime(post.recruitmentEndDate)}
            onClick={() => onPostClick(post)}
            onApplyNow={() => onApplyNow(post)}
            onViewDetail={() => onViewDetail(post)}
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
