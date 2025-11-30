import { useMutation } from "@tanstack/react-query";
import { PageTitle } from "@/components/global";
import { Box, CircularProgress } from "@mui/material";
import Color from "@/constants/Color";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePost } from "@/hooks/services/posts";
import { isoStringToMUIDateTime } from "@/utils/converter";
import { updatePost } from "@/services/postServices";
import PostForm from "./PostForm";

export default function UpdatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isLoading } = usePost(id);

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
      payload,
      postId,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const { mutateAsync: updatePostAsync, isPending: isUpdating } = useMutation({
    mutationFn: (data) => updatePost(id, data), // endpoint API
  });

  const handleSubmit = async (postInfo, { resetForm }) => {
    console.log("postInfo", postInfo);
    await updatePostAsync(postInfo, {
      onSuccess: (post) => {
        if (post.type === "RECRUITMENT") {
          navigate(`/recruitment/${id}`);
        } else {
          navigate(`/posts/${id}`);
        }
      },
      onError: () => {
        openSnackbar({
          message: "Cập nhật bài đăng thất bại. Vui lòng thử lại.",
          severity: "error",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.1)",
          zIndex: 9999,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      m="20px"
      sx={{
        background: Color.PrimaryWhite,
      }}
    >
      <PageTitle title="CẬP NHẬT" subtitle="Cập nhật bài viết" />
      <PostForm
        mode="edit"
        isSubmitting={isUpdating}
        fixedType={post?.type}
        initialValues={{
          ...post,
          recruitmentStartDate:
            post?.recruitmentStartDate &&
            isoStringToMUIDateTime(post.recruitmentStartDate),
          recruitmentEndDate:
            post?.recruitmentEndDate &&
            isoStringToMUIDateTime(post.recruitmentEndDate),
        }}
        onSubmit={handleSubmit}
        snackbar={snackbar}
        onCloseSnackbar={closeSnackbar}
      />
    </Box>
  );
}
