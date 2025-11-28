import { createPost } from "@/services/postServices";
import PostForm from "./PostForm";
import { useMutation } from "@tanstack/react-query";
import { PageTitle } from "@/components/global";
import { Box } from "@mui/material";
import Color from "@/constants/Color";

export default function CreatePost() {
  const { mutateAsync: createPostAsync, isPending: isCreating } = useMutation({
    mutationFn: createPost, // endpoint API
    onSuccess: (response) => {
      console.log("Post created:", response.data);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  const handleSubmit = async (postInfo, { resetForm }) => {
    await createPostAsync({
      type: postInfo.type,
      title: postInfo.title,
      content: postInfo.content,
      company: postInfo.company,
      description: postInfo.description,
      // image: postInfo.image,
      // attachments: postInfo.attachments,
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
      <PostForm isSubmitting={isCreating} onSubmit={handleSubmit} />
    </Box>
  );
}
