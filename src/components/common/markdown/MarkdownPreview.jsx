import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box } from "@mui/material";
import "./markdown.css";

const normalizeMarkdown = (input) => {
  if (typeof input === "string") return input;
  if (input == null) return "";
  if (typeof input === "number") return String(input);
  if (typeof input === "object") {
    return input.value ?? "";
  }
  return "";
};
export default function MarkdownPreview({
  children,
  value,

  name,
  ...props
}) {
  const content = normalizeMarkdown(children ?? value);
  if (!content) {
    return (
      <Box
        {...props}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="text.secondary"
        fontStyle="italic"
        sx={{
          border: "1px dashed #e5e7eb",
          borderRadius: 2,
        }}
      >
        Chưa có nội dung để xem trước
      </Box>
    );
  }

  return (
    <Box className="markdown-preview" {...props}>
      <ReactMarkdown
        {...props}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter style={oneDark} language={match[1]}>
                {String(children)}
              </SyntaxHighlighter>
            ) : (
              <code>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
