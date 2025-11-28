import { createPost } from "@/services/postServices";
import PostForm from "./PostForm";
import { useMutation } from "@tanstack/react-query";
import { PageTitle } from "@/components/global";
import { Box } from "@mui/material";
import Color from "@/constants/Color";
import { useState } from "react";

export default function CreatePost() {
  const navigate = useMutation();
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
    navigate(`/posts/${id}`);
  };

  const { mutateAsync: createPostAsync, isPending: isCreating } = useMutation({
    mutationFn: createPost, // endpoint API
  });

  const handleSubmit = async (postInfo, { resetForm }) => {
    await createPostAsync(
      {
        type: postInfo.type,
        title: postInfo.title,
        content: postInfo.content,
        company: postInfo.company,
        description: postInfo.description,
        // image: postInfo.image,
        // attachments: postInfo.attachments,
      },
      {
        onSuccess: (post) => {
          resetForm();
          openSnackbar({
            message: "Tạo bài đăng thành công!",
            severity: "success",
            postId: post.id,
          });
        },
        onError: () => {
          openSnackbar({
            message: "Tạo bài đăng thất bại. Vui lòng thử lại.",
            severity: "error",
          });
        },
      },
    );
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
