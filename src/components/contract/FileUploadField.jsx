import { Button, IconButton, Box, Typography } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useField, useFormikContext } from "formik";
import Color from "@constants/Color";

const FileUploadField = ({
  name,
  label = "File hợp đồng",
  disabled,
  sx = [],
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleFileChange = (event) => {
    setFieldValue(name, event.target.files[0]);
  };

  const handleDelete = () => {
    setFieldValue(name, null);
  };

  return (
    <Box
      {...props}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          width: "50%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Row upload */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <p
          style={{
            marginRight: 4,
            fontSize: 16,
            color: Color.PrimaryBlackPlaceHolder,
          }}
        >
          {label}:{" "}
        </p>

        {!field.value ? (
          <label>
            <input
              id={`file-upload-${name}`}
              disabled={disabled}
              type="file"
              accept=".doc,.docx,.pdf,.xlsx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              disabled={disabled}
              onClick={() =>
                document.getElementById(`file-upload-${name}`).click()
              }
              variant="contained"
            >
              Tải lên tệp
            </Button>
          </label>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <a
              href={URL.createObjectURL(field.value)}
              download={field.value.name}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "300px",
                display: "inline-block",
                marginLeft: 2,
              }}
            >
              {field.value.name}
            </a>
            <IconButton
              onClick={handleDelete}
              sx={{ color: Color.PrimaryOrgange }}
            >
              {!disabled && (
                <DeleteForeverRoundedIcon sx={{ width: 24, height: 24 }} />
              )}
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Error text */}
      {meta.touched && meta.error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {meta.error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadField;
