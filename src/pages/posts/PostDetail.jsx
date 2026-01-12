import React from "react";
import {
  Box,
  Stack,
  Button,
  Chip,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { InfoTextField, SectionDivider } from "@/components/common";

import { useNavigate, useParams } from "react-router";
import { usePost } from "@/hooks/services/post";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = usePost(id);
  const isRecruitment = post.type === "RECRUITMENT";

  if (isLoading) return <CenterCircularProgress />;
  if (!post) return <Typography>Không tìm thấy bài đăng.</Typography>;

  return (
    <Box m="20px">
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Chi tiết bài đăng
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/posts/${id}/edit`)}
        >
          Sửa bài đăng
        </Button>
      </Stack>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {/* ===== Thông tin chung ===== */}
        <SectionDivider sectionName="Thông tin bài đăng" sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <InfoTextField
              label="Loại bài viết"
              value={post.type}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={4}>
            <InfoTextField
              label="Tiêu đề"
              value={post.title}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={4}>
            <InfoTextField
              label="Công ty"
              value={post.company || ""}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <InfoTextField
              label="Mô tả"
              value={post.description || ""}
              fullWidth
              disabled
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>

        {/* ===== RECRUITMENT ONLY ===== */}
        {isRecruitment && (
          <>
            <SectionDivider
              sectionName="Thông tin tuyển dụng"
              sx={{ mt: 4, mb: 3 }}
            />

            <Grid container spacing={3}>
              <Grid item xs={4}>
                <InfoTextField
                  label="Vị trí"
                  value={post.position}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={4}>
                <InfoTextField
                  label="Địa điểm làm việc"
                  value={post.workLocation}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={4}>
                <InfoTextField
                  label="Mức lương dự kiến"
                  value={post.expectedSalary}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={4}>
                <InfoTextField
                  label="Ngày bắt đầu"
                  value={post.recruitmentStartDate}
                  fullWidth
                  disabled
                />
              </Grid>

              <Grid item xs={4}>
                <InfoTextField
                  label="Ngày kết thúc"
                  value={post.recruitmentEndDate}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* ===== Attachments ===== */}
        <SectionDivider sectionName="Tệp đính kèm" sx={{ mt: 4, mb: 3 }} />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {post.attachments?.length ? (
            post.attachments.map((file, i) => (
              <Chip key={i} label={file.name} variant="outlined" />
            ))
          ) : (
            <Typography>Không có tệp đính kèm</Typography>
          )}
        </Stack>

        {/* ===== Content ===== */}
        <SectionDivider sectionName="Nội dung bài viết" sx={{ mt: 4, mb: 2 }} />
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            background: "#fafafa",
            whiteSpace: "pre-line",
            lineHeight: 1.6,
          }}
        >
          <Typography>{post.content}</Typography>
        </Paper>
      </Paper>
    </Box>
  );
}
