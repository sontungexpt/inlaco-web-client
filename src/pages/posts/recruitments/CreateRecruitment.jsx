import React, { useState } from "react";
import { PageTitle } from "@components/common";
import { Box } from "@mui/material";
import { createPost } from "@/services/postServices";
import { useNavigate } from "react-router";
import PostForm from "../PostForm";
import { useMutation } from "@tanstack/react-query";

const CreateRecruitment = () => {
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    postId: null,
  });

  const openSnackbar = ({ message, severity, postId }) => {
    setSnackbar({
      open: true,
      message,
      severity,
      postId,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewPost = (id) => {
    navigate(`/recruitment/${id}`);
  };

  const { mutateAsync: createRecruitmentAsync, isPending: isCreating } =
    useMutation({
      mutationFn: createPost, // endpoint API
    });

  const handleSubmit = async (postInfo, { resetForm }) => {
    await createRecruitmentAsync(postInfo, {
      onSuccess: (post) => {
        openSnackbar({
          message: "Tạo bài đăng thành công!",
          severity: "success",
          postId: post.id,
          payload: post,
        });
        resetForm();
      },
      onError: () => {
        openSnackbar({
          message: "Tạo bài đăng thất bại. Vui lòng thử lại.",
          severity: "error",
        });
      },
    });
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
        snackbar={snackbar}
        onCloseSnackbar={closeSnackbar}
        onViewPost={handleViewPost}
      />
    </Box>
  );
};

export default CreateRecruitment;
