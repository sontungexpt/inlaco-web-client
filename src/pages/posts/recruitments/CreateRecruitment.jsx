import React, { useState } from "react";
import { PageTitle } from "@components/global";
import { Alert, Box, Snackbar, Stack, Button } from "@mui/material";
import { createPost } from "@/services/postServices";
import { dateStringToISOString } from "@utils/converter";
import { useNavigate } from "react-router";
import PostForm from "../PostForm";
import { useMutation } from "@tanstack/react-query";

const CreateRecruitment = () => {
  const navigate = useNavigate();
  const [snackbarOpened, setSnackbarOpened] = useState(false);
  const [createdPostId, setCreatedPostId] = useState(null);

  const openSnackbar = (postId) => {
    setCreatedPostId(postId);
    setSnackbarOpened(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpened(false);
    setCreatedPostId(null);
  };

  const {
    mutateAsync: createRecruitmentAsync,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createPost, // endpoint API
  });

  const handleSubmit = async (postInfo, { resetForm }) => {
    await createRecruitmentAsync(
      {
        type: postInfo.type,
        title: postInfo.title,
        content: postInfo.content,
        company: postInfo.company,
        description: postInfo.description,
        recruitmentStartDate: dateStringToISOString(
          postInfo.recruitmentStartDate,
        ),
        recruitmentEndDate: dateStringToISOString(postInfo.recruitmentEndDate),
        position: postInfo.position,
        expectedSalary: postInfo.expectedSalary, // Changed to double[2] which is the salary range
        workLocation: postInfo.workLocation,
      },
      {
        onSuccess: (post) => {
          resetForm();
          openSnackbar(post?.id);
        },
      },
    );
  };

  return (
    <Box m="20px">
      <PageTitle
        title="TẠO BÀI ĐĂNG TUYỂN DỤNG"
        subtitle="Tạo bài đăng tuyển dụng Thuyền viên mới"
      />

      <PostForm
        fixedType="RECRUITMENT"
        contentSectionLabel="Mô tả công việc*"
        isSubmitting={isCreating}
        onSubmit={handleSubmit}
      />

      {/* ERROR Snackbar */}
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          Tạo bài đăng thất bại! Vui lòng thử lại.
        </Alert>
      </Snackbar>

      {/* Notification snackbar */}
      <Snackbar
        open={snackbarOpened}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ display: "flex", alignItems: "center" }}
          onClose={closeSnackbar}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <span>Tạo bài đăng thành công!</span>
            {createdPostId && (
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate(`/posts/${createdPostId}`)}
                sx={{ fontWeight: 600 }}
              >
                Xem bài đăng
              </Button>
            )}
          </Stack>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateRecruitment;
