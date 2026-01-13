import React, { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import MarkdownPreview from "./MarkdownPreview";
import { InfoTextField } from "../fields";

export default function SimpleMarkdownEditor({
  value,
  name,
  placeholder = "Nhập nội dung markdown...",
  label,
  input: TextFieldComponent = InfoTextField,
  markdown: MarkdownPreviewComponent = MarkdownPreview,
  ...props
}) {
  const [mode, setMode] = useState("edit");

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#fafafa",
      }}
    >
      {/* Header */}
      <Box
        px={2}
        py={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="divider"
        bgcolor="#fff"
      >
        {label && (
          <Typography fontWeight={600}>{label || "Markdown Editor"}</Typography>
        )}

        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: 1,
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
      <Box p={2}>
        {mode === "edit" ? (
          <Fade in={mode === "edit"} unmountOnExit>
            {typeof TextFieldComponent === "function" ? (
              <TextFieldComponent
                multiline
                minRows={8}
                {...props}
                name={name}
                value={value}
                placeholder={placeholder}
              />
            ) : (
              TextFieldComponent
            )}
          </Fade>
        ) : (
          <Fade in={mode === "preview"} unmountOnExit>
            {typeof MarkdownPreviewComponent === "function" ? (
              <MarkdownPreviewComponent name={name} value={value} />
            ) : (
              MarkdownPreviewComponent
            )}
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
