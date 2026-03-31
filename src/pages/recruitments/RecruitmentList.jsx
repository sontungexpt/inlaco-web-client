import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Button,
  Card,
  Typography,
} from "@mui/material";

import { isoToDatetime } from "@/utils/converter";
import Color from "@constants/Color";

import { useRecruitmentStatus } from "./useRecruitmentStatus";

const RecruitmentCard = ({
  post,
  isAdmin,
  gridSize = 12,
  sx = [],
  onClick,
  onApplyNow,
  onViewDetail,
  ...props
}) => {
  const status = useRecruitmentStatus(post);

  const recruitmentStartDate = isoToDatetime(post?.recruitmentStartDate);
  const recruitmentEndDate = isoToDatetime(post?.recruitmentEndDate);

  return (
    <Grid
      {...props}
      onClick={onClick}
      size={gridSize}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "background.paper",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transition: "all 0.25s ease",
          "&:hover": {
            cursor: "pointer",
            transform: "translateY(-6px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
          },
        }}
      >
        {/* ---------- Content ---------- */}
        <Box>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: Color.PrimaryBlack,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              mb: 0.5,
            }}
          >
            {post.title}
          </Typography>

          {/* Status badge */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Box
              sx={{
                px: 1.2,
                py: 0.3,
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor:
                  status.color === "success"
                    ? "rgba(46,125,50,0.1)"
                    : status.color === "error"
                      ? "rgba(211,47,47,0.1)"
                      : "rgba(255,152,0,0.1)",
                color:
                  status.color === "success"
                    ? "success.main"
                    : status.color === "error"
                      ? "error.main"
                      : "warning.main",
              }}
            >
              {status.label}
            </Box>
          </Box>

          {/* Date range */}
          {(recruitmentStartDate || recruitmentEndDate) && (
            <Typography
              variant="caption"
              sx={{
                color: Color.SecondaryBlack,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mb: 1,
              }}
            >
              <span style={{ fontSize: 14 }}>📅</span>
              <strong>
                {recruitmentStartDate} – {recruitmentEndDate}
              </strong>
            </Typography>
          )}

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: Color.SecondaryBlack,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {post.description}
          </Typography>
        </Box>

        {/* ---------- Action ---------- */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            disabled={!isAdmin && status.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (isAdmin) onViewDetail(e);
              else onApplyNow(e);
            }}
            variant="contained"
            sx={{
              backgroundColor:
                !isAdmin && status.isDisabled
                  ? "action.disabledBackground"
                  : Color.SecondaryBlue,
              color: !isAdmin && status.isDisabled ? "text.disabled" : "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor:
                  !isAdmin && status.isDisabled
                    ? "action.disabledBackground"
                    : Color.SecondaryBlue,
                opacity: !isAdmin && status.isDisabled ? 1 : 0.9,
              },
            }}
          >
            {isAdmin ? "Xem chi tiết" : "Ứng tuyển ngay"}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};
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

  if (!posts?.length)
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
            post={post}
            isAdmin={isAdmin}
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
