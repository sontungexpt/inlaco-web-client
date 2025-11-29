import { createPost } from "@/services/postServices";
import PostForm from "./PostForm";
import { useMutation } from "@tanstack/react-query";
import { PageTitle } from "@/components/global";
import { Box } from "@mui/material";
import Color from "@/constants/Color";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePost() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    postId: null,
    payload: null,
  });
  const openSnackbar = ({ message, severity, postId, payload }) => {
    setSnackbar({
      open: true,
      message,
      severity,
      postId,
      payload,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const { mutateAsync: createPostAsync, isPending: isCreating } = useMutation({
    mutationFn: createPost, // endpoint API
  });

  const handleViewPost = (id, postInfo) => {
    if (postInfo.type === "RECRUITMENT") {
      navigate(`/recruitment/${id}`);
    } else {
      navigate(`/posts/${id}`);
    }
  };

  const handleSubmit = async (postInfo, { resetForm }) => {
    await createPostAsync(postInfo, {
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
    <Box
      m="20px"
      sx={{
        background: Color.PrimaryWhite,
      }}
    >
      <PageTitle title="ĐĂNG BÀI" subtitle="Tạo bài đăng mới" />
      <PostForm
        isSubmitting={isCreating}
        onSubmit={handleSubmit}
        snackbar={snackbar}
        onCloseSnackbar={closeSnackbar}
        onViewPost={handleViewPost}
      />
    </Box>
  );
}
