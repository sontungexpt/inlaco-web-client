import React from "react";
import { Typography, Stack } from "@mui/material";
import { FilePreviewCard } from "@/components/common";

const FilesSection = ({ title, files = [] }) => {
  return (
    <>
      <Typography fontWeight={600} mb={1}>
        {title}
      </Typography>

      {files.length > 0 ? (
        <Stack spacing={1}>
          {files.map((file, idx) => (
            <FilePreviewCard
              key={idx}
              url={file.url}
              label={`${title} ${idx + 1}`}
              name={file.displayName}
            />
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">Không có tài liệu</Typography>
      )}
    </>
  );
};

export default FilesSection;
