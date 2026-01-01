import {
  Card,
  CardMedia,
  IconButton,
  Box,
  Fade,
  Typography,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { styled } from "@mui/system";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useRef, useMemo } from "react";

/* ---------- styled ---------- */

const Input = styled("input")({
  display: "none",
});

const Overlay = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.45)",
  opacity: 0,
  transition: "opacity 0.25s",
  "&:hover": {
    opacity: 1,
  },
});

/* ---------- helpers ---------- */

const getPreviewUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof File) return URL.createObjectURL(value);
  return null;
};

/* ---------- component ---------- */

const ImageUploadField = ({
  name,
  label,
  required = false,
  helperText,
  disabled,
  sx = [],
  placeholderImage = require("@assets/images/no-ship-photo.png"),
  ...props
}) => {
  const inputRef = useRef(null);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  const previewUrl = useMemo(() => getPreviewUrl(field.value), [field.value]);

  const showError = meta.touched && meta.error;

  const handleOpenDialog = () => {
    if (disabled) return;
    setFieldTouched(name, true, false);
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFieldTouched(name, true, false);
    setFieldValue(name, file, true);
    e.target.value = "";
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setFieldTouched(name, true, false);
    setFieldValue(name, null, true);
  };

  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Label */}
      {label && (
        <Typography fontSize={14} fontWeight={600}>
          {label}
          {required && (
            <Box component="span" color="error.main" ml={0.5}>
              *
            </Box>
          )}
        </Typography>
      )}

      <Card
        onClick={handleOpenDialog}
        sx={{
          flex: 1,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          cursor: disabled ? "default" : "pointer",
          border: "2px solid",
          borderColor: showError ? "error.main" : "divider",
          width: "100%",
        }}
      >
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />

        <CardMedia
          component="img"
          image={previewUrl || placeholderImage}
          alt="Preview"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {!disabled && (
          <Overlay>
            <Fade in>
              <Box display="flex" gap={1}>
                <IconButton color="primary">
                  <AddCircleRoundedIcon sx={{ fontSize: 36 }} />
                </IconButton>

                {field.value && (
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                )}
              </Box>
            </Fade>
          </Overlay>
        )}
      </Card>

      {/* Helper / Error */}
      {(helperText || showError) && (
        <Typography
          variant="caption"
          color={showError ? "error" : "text.secondary"}
        >
          {showError ? meta.error : helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadField;
