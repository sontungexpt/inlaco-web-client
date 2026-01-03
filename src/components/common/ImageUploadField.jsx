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
import { useRef, useMemo, useEffect } from "react";

/* ---------- styled ---------- */

const Input = styled("input")({
  display: "none",
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "inherit",
  backgroundColor: "rgba(0,0,0,0.45)",
  opacity: 0,
  transition: "opacity 0.25s",
  pointerEvents: "none",
  "&:hover": {
    opacity: 1,
    pointerEvents: "auto",
  },
}));

/* ---------- helpers ---------- */

const isValidFileType = (file, accept) => {
  if (!accept || accept === "*") return true;

  return accept.split(",").some((rule) => {
    rule = rule.trim().toLowerCase();

    // image/*
    if (rule.endsWith("/*")) {
      return file.type.startsWith(rule.replace("/*", ""));
    }

    // .png .jpg
    if (rule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(rule);
    }

    // image/png
    return file.type === rule;
  });
};

/* ---------- component ---------- */

const formatAcceptText = (accept) => {
  if (!accept || accept === "*") return "mọi định dạng";
  return accept
    .split(",")
    .map((t) => t.replace("image/", "").replace(".", "").toUpperCase())
    .join(", ");
};

const formatFileSizeMB = (bytes) => `${Math.round(bytes / 1024 / 1024)}MB`;

const defaultInvalidFormatText = (accept) =>
  `Chỉ chấp nhận file định dạng ${formatAcceptText(accept)}`;

const defaultInvalidSizeText = (maxSize) =>
  `Dung lượng file tối đa ${formatFileSizeMB(maxSize)}`;

const ImageUploadField = ({
  name,
  label,
  required = false,
  borderRadius,
  maxSize = 5 * 1024 * 1024,
  helperText,
  disabled,
  variant = "rect",
  size,
  width,
  height,
  accept = "image/*",
  invalidFormatText = `Chỉ chấp nhận file có định dạng ${accept}`,
  invalidSizeText = `Chỉ chấp nhận file có kích thước nhỏ hơn ${maxSize}`,
  sx = [],
  placeholderImage,
  ...props
}) => {
  const isCircle = variant === "circle";

  const resolvedWidth = isCircle ? size : width;
  const resolvedHeight = isCircle ? size : height;

  const resolvedRadius = isCircle ? "50%" : borderRadius || 2;
  const inputRef = useRef(null);
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
  const [field, meta] = useField(name);

  const previewUrl = useMemo(() => {
    if (!field.value) return null;
    else if (typeof field.value === "string") return field.value;
    else if (field.value instanceof File)
      return URL.createObjectURL(field.value);
  }, [field.value]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    if (!isValidFileType(file, accept)) {
      setFieldError(
        name,
        invalidFormatText || defaultInvalidFormatText(accept),
      );
      setFieldValue(name, null, false);
      return;
    }

    if (file.size > maxSize) {
      setFieldError(name, invalidSizeText || defaultInvalidSizeText(maxSize));
      setFieldValue(name, null, false);
      return;
    }

    // clear error nếu trước đó có lỗi
    setFieldError(name, undefined);
    setFieldValue(name, file, true);
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
          justifyContent: "center",
          borderRadius: borderRadius,
          width: resolvedWidth,
          height: resolvedHeight,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Label */}
      {label && (
        <Typography fontSize={14}>
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
          overflow: "hidden",
          cursor: disabled ? "default" : "pointer",
          border: "2px solid",
          borderColor: showError ? "error.main" : "divider",
          borderRadius: resolvedRadius,
          width: "100%",
          height: "100%",
        }}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          borderRadius={borderRadius}
          onChange={(e, ...props) => {
            handleChange(e, ...props);
            e.target.value = "";
          }}
          {...props}
        />

        <CardMedia
          component="img"
          image={
            previewUrl ||
            placeholderImage ||
            require("@assets/images/no-ship-photo.png")
          }
          alt="Preview"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: resolvedRadius,
          }}
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
