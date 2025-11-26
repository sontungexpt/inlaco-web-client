import React, { useState } from "react";
import { Button, IconButton, Box } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { COLOR } from "../../assets/Color";
import { useField, useFormikContext } from "formik";
import { Grid } from "@mui/material";

const MultilineFileUploadField = ({
  name,
  label = "Tải lên các tệp đính kèm",
  disabled,
  isUploadButtonVisible = true,
  sx = [],
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // const fileUrls = files.map((file) => URL.createObjectURL(file));
    setFieldValue(name, files);
  };

  const handleDelete = (index) => {
    const newFiles = field.value.filter((_, i) => i !== index);
    setFieldValue(name, newFiles);
  };

  return (
    <Box
      {...props}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {field.value.length == 0 ? (
        <label style={{ alignSelf: "center" }}>
          <input
            id="file-upload"
            disabled={disabled}
            type="file"
            accept=".doc,.docx,.pdf,.xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple
          />
          <Button
            disabled={disabled}
            onClick={() => document.getElementById("file-upload").click()}
            variant="contained"
          >
            {label}
          </Button>
        </label>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {field.value &&
            field.value.map((file, index) => (
              <Grid size={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a
                    href={URL.createObjectURL(file)}
                    download={file.name}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "300px",
                      display: "inline-block",
                      marginLeft: 2,
                    }}
                  >
                    {file.name}
                  </a>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    sx={{ color: COLOR.primary_orange }}
                  >
                    {!disabled && (
                      <DeleteForeverRoundedIcon
                        sx={{ width: 24, height: 24 }}
                      />
                    )}
                  </IconButton>
                </Box>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default MultilineFileUploadField;
