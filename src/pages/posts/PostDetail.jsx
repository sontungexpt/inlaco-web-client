import React from "react";
import { Paper, Typography, Button, Chip, Stack, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router";

import { usePost } from "@/hooks/services/post";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";
import Color from "@/constants/Color";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CloudinaryImage, MarkdownPreview } from "@/components/common";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id);

  if (isLoading) return <CenterCircularProgress />;
  if (!post) return <Typography>Not found</Typography>;

  return (
    <Paper
      sx={{
        borderRadius: 4,
        m: 3,
        px: { xs: 3, sm: 6 },
        py: { xs: 12, sm: 12 },
      }}
    >
      {/* ===== Top Actions ===== */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/posts/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Stack>

      {/* ===== Meta ===== */}
      <Stack direction="row" spacing={2} mb={2}>
        <Chip label={post.type} size="small" />
        {post.company && (
          <Typography variant="body2" color="text.secondary">
            {post.company}
          </Typography>
        )}
      </Stack>

      {/* ===== Title ===== */}
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: 28, sm: 36 },
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {post.title}
      </Typography>

      {/* ===== Description ===== */}
      {post.description && (
        <Typography
          sx={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "text.secondary",
            mb: 4,
          }}
        >
          {post.description}
        </Typography>
      )}

      <CloudinaryImage
        url={post.image.url}
        publicId={post.image.publicId}
        name={post.image.displayName}
        height={300}
        mb={4}
      />

      <Divider color={Color.PrimaryBlackPlaceHolder} />

      <MarkdownPreview>{post.content}</MarkdownPreview>
    </Paper>
  );
}
