import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
} from "@mui/material";
import MarkdownPreview from "./MarkdownPreview";
import { InfoTextField } from "../fields";
import { resolveComponent } from "@/utils/component";

export default function SimpleMarkdownEditor({
  value,
  name,
  placeholder = "Nhập nội dung markdown...",
  label = "Markdown Editor",
  multiline = true,
  minRows = 4,
  input = InfoTextField,
  markdown = MarkdownPreview,
  ...props
}) {
  const [mode, setMode] = useState("edit");

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #000",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid #000"
      >
        <Typography ml={2} fontWeight={600}>
          {label}
        </Typography>

        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          sx={{
            "& .MuiToggleButton-root": {
              px: 2,
              textTransform: "none",
              fontSize: 13,
            },
          }}
        >
          <ToggleButton value="edit">Soạn thảo</ToggleButton>
          <ToggleButton value="preview">Xem trước</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Body */}
      {mode === "edit" ? (
        resolveComponent(input, {
          ...props,
          multiline,
          minRows,
          name,
          value,
          placeholder,
        })
      ) : (
        <Box px={2}>
          {resolveComponent(markdown, {
            name,
            value,
          })}
        </Box>
      )}
    </Paper>
  );
}
