import { Card, IconButton, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useRef, useMemo, useEffect } from "react";
import { CloudinaryImage } from "..";
import { formatSize, isValidFileType, normalize } from "./helper";

/* ================= styled ================= */

const Input = styled("input")({ display: "none" });

const Overlay = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "inherit",
  backgroundColor: "rgba(0,0,0,0.45)",
  opacity: 0,
  transition: "opacity 0.25s ease",
});

const normalizeImage = (item) => {
  if (item instanceof File) {
    return {
      file: item,
      name: item.name,
      size: item.size,
      type: item.type,
      url: URL.createObjectURL(item),
    };
  }
  if (typeof item === "string")
    return {
      url: item,
    };

  return {
    file: item,
    name: item.name,
    size: item.size,
    type: item.format || item.type,
    url: item.url,
    publicId: item.publicId,
  };
};

/* ================= component ================= */

const ImageUploadField = ({
  value,
  onChange,
  label,
  required,
  disabled,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  error,
  helperText,
  invalidFormatText,
  invalidSizeText,
  variant = "rect",
  size,
  width,
  height,
  borderRadius = 2,
  placeholderImage,
  sx = [],
}) => {
  const isCircle = variant === "circle";
  const resolvedWidth = isCircle ? size : width;
  const resolvedHeight = isCircle ? size : height;
  const resolvedRadius = isCircle ? "50%" : borderRadius;

  const inputRef = useRef(null);
  const images = useMemo(() => normalize(value).map(normalizeImage), [value]);

  const openDialog = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  /* cleanup blob urls */
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  const handleChange = (fileList) => {
    if (disabled || !fileList) return;
    const files = Array.from(fileList);
    if (!files.length) return;

    let err;
    for (const file of files) {
      if (!isValidFileType(file, accept)) {
        err = invalidFormatText || `${file.name} không đúng định dạng`;
        break;
      } else if (file.size > maxSize) {
        err = invalidSizeText || `${file.name} vượt quá ${formatSize(maxSize)}`;
        break;
      }
    }

    if (err) {
      onChange?.(null, { error: err });
      return;
    }

    const nextValue = multiple ? files : files[0];
    onChange?.(nextValue, {});
  };

  const handleRemove = (index) => {
    if (!multiple) {
      onChange?.(null, {});
      return;
    }

    const next = [...images];
    next.splice(index, 1);
    onChange?.(next.length ? next : null, {});
  };

  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          width: resolvedWidth,
          gap: 0.5,
        },
        ...[].concat(sx),
      ]}
    >
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

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleChange(e.target.files);
          e.target.value = "";
        }}
      />

      <Box display="flex" gap={1} flexWrap="wrap">
        {(images.length ? images : [{}]).map((img, idx) => (
          <Card
            key={img.publicId || img.url || img.id || idx}
            onClick={openDialog}
            sx={{
              position: "relative",
              cursor: disabled ? "default" : "pointer",
              border: "2px solid",
              borderColor: error ? "error.main" : "divider",
              borderRadius: resolvedRadius,
              width: resolvedWidth,
              height: resolvedHeight,

              "&:hover .image-overlay": {
                opacity: 1,
              },
            }}
          >
            <CloudinaryImage
              publicId={img.publicId}
              src={
                img.url ||
                placeholderImage ||
                require("@assets/images/no-ship-photo.png")
              }
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {!disabled && (
              <Overlay className="image-overlay">
                <Box display="flex" gap={1}>
                  {/* Upload */}
                  <IconButton color="primary" onClick={openDialog}>
                    <AddCircleRoundedIcon />
                  </IconButton>

                  {/* Delete */}
                  {img.url && (
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                    >
                      <DeleteForeverRoundedIcon />
                    </IconButton>
                  )}
                </Box>
              </Overlay>
            )}
          </Card>
        ))}
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadField;
