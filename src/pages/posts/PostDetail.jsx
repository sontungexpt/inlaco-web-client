import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { usePost } from "@/hooks/services/post";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";
import Color from "@/constants/Color";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
        py: { xs: 4, sm: 6 },
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
          mb: 2,
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

      {/* ===== Divider ===== */}
      <Divider color={Color.PrimaryBlackPlaceHolder} />

      {/* ===== Markdown Content ===== */}
      <Box
        sx={{
          "& h1": {
            fontSize: 28,
            fontWeight: 700,
            mt: 5,
            mb: 2,
          },
          "& h2": {
            fontSize: 24,
            fontWeight: 700,
            mt: 5,
            mb: 2,
          },
          "& h3": {
            fontSize: 20,
            fontWeight: 700,
            mt: 4,
            mb: 1.5,
          },
          "& p": {
            fontSize: 16,
            lineHeight: 1.9,
            mb: 2,
          },
          "& ul": {
            pl: 3,
            mb: 2,
          },
          "& li": {
            mb: 1,
          },
          "& blockquote": {
            borderLeft: "4px solid #ddd",
            pl: 2,
            color: "text.secondary",
            fontStyle: "italic",
            my: 3,
          },
          "& img": {
            maxWidth: "100%",
            borderRadius: 2,
            my: 3,
          },
          "& code": {
            background: "#f2f2f2",
            padding: "2px 6px",
            borderRadius: 1,
            fontSize: 14,
          },
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </Box>
    </Paper>
  );
}
