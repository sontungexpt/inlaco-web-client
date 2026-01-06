import { useField, useFormikContext } from "formik";
import ImageUploadField from "./ImageUploadField";

const ImageUploadFieldFormik = ({ name, ...props }) => {
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <ImageUploadField
      {...props}
      value={field.value}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      onChange={(val, { error }) => {
        setFieldTouched(name, true, false);
        setFieldError(name, error);
        setFieldValue(name, val, !error);
      }}
    />
  );
};

export default ImageUploadFieldFormik;
// import { Card, IconButton, Box, Fade, Typography } from "@mui/material";
// import { useField, useFormikContext } from "formik";
// import { styled } from "@mui/system";
// import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// import { useRef, useMemo, useEffect } from "react";
// import { CloudinaryImage } from "..";

// const Input = styled("input")({
//   display: "none",
// });

// const Overlay = styled(Box)({
//   position: "absolute",
//   inset: 0,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "inherit",
//   backgroundColor: "rgba(0,0,0,0.45)",
//   opacity: 0,
//   transition: "opacity 0.25s",
//   pointerEvents: "none",
//   "&:hover": {
//     opacity: 1,
//     pointerEvents: "auto",
//   },
// });

// const normalizeToArray = (value) => {
//   if (!value) return [];
//   return Array.isArray(value) ? value : [value];
// };

// const normalizeImage = (item) => {
//   if (item instanceof File) {
//     return {
//       file: item,
//       name: item.name,
//       size: item.size,
//       type: item.type,
//       url: URL.createObjectURL(item),
//     };
//   }

//   if (typeof item === "string") {
//     return { url: item };
//   }

//   return item; // { url, publicId, ... }
// };

// const isValidFileType = (file, accept) => {
//   if (!accept || accept === "*") return true;
//   return accept.split(",").some((rule) => {
//     rule = rule.trim().toLowerCase();
//     if (rule.endsWith("/*")) {
//       return file.type.startsWith(rule.replace("/*", ""));
//     }
//     if (rule.startsWith(".")) {
//       return file.name.toLowerCase().endsWith(rule);
//     }
//     return file.type === rule;
//   });
// };

// const formatSizeMB = (bytes) => `${Math.round(bytes / 1024 / 1024)}MB`;

// /* ======================================================
//  * Component
//  * ====================================================== */

// const ImageUploadFieldFormik = ({
//   name,
//   label,
//   required = false,
//   disabled,
//   multiple = false,
//   maxSize = 5 * 1024 * 1024,
//   accept = "image/*",
//   helperText,
//   error,
//   invalidFormatText,
//   invalidSizeText,
//   variant = "rect",
//   size,
//   width,
//   height,
//   borderRadius = 2,
//   placeholderImage,
//   sx = [],
// }) => {
//   const isCircle = variant === "circle";
//   const resolvedWidth = isCircle ? size : width;
//   const resolvedHeight = isCircle ? size : height;
//   const resolvedRadius = isCircle ? "50%" : borderRadius;

//   const inputRef = useRef(null);
//   const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
//   const [field, meta] = useField(name);
//   const showFormikError = meta.touched && Boolean(meta.error);
//   const finalError = typeof error === "boolean" ? error : showFormikError;
//   const finalHelperText = helperText !== undefined ? helperText : meta.error;

//   const images = useMemo(
//     () => normalizeToArray(field.value).map(normalizeImage),
//     [field.value],
//   );

//   /* cleanup blob urls */
//   useEffect(() => {
//     return () => {
//       images.forEach((img) => {
//         if (img?.url?.startsWith("blob:")) {
//           URL.revokeObjectURL(img.url);
//         }
//       });
//     };
//   }, [images]);

//   /* ================= handlers ================= */

//   const openDialog = () => {
//     if (!disabled) {
//       setFieldTouched(name, true, false);
//       inputRef.current?.click();
//     }
//   };

//   const handleChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     setFieldTouched(name, true, false);
//     setFieldError(name, undefined);

//     const valid = [];

//     for (const file of files) {
//       if (!isValidFileType(file, accept)) {
//         setFieldError(
//           name,
//           invalidFormatText || `${file.name} không đúng định dạng`,
//         );
//         continue;
//       }

//       if (file.size > maxSize) {
//         setFieldError(
//           name,
//           invalidSizeText || `${file.name} vượt quá ${formatSizeMB(maxSize)}`,
//         );
//         continue;
//       }

//       valid.push({
//         file,
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         url: URL.createObjectURL(file),
//       });
//     }

//     if (!valid.length) return;

//     const nextValue = multiple ? [...images, ...valid] : valid[0];

//     setFieldValue(name, nextValue, true);
//     e.target.value = "";
//   };

//   const handleRemove = (index) => {
//     setFieldTouched(name, true, false);

//     if (!multiple) {
//       setFieldValue(name, null, true);
//       return;
//     }

//     const next = [...images];
//     next.splice(index, 1);
//     setFieldValue(name, next.length ? next : null, true);
//   };

//   /* ================= render ================= */

//   return (
//     <Box
//       sx={[
//         {
//           display: "flex",
//           flexDirection: "column",
//           width: resolvedWidth,
//           gap: 0.5,
//         },
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       {label && (
//         <Typography fontSize={14} fontWeight={600}>
//           {label}
//           {required && (
//             <Box component="span" color="error.main" ml={0.5}>
//               *
//             </Box>
//           )}
//         </Typography>
//       )}

//       <Input
//         ref={inputRef}
//         type="file"
//         accept={accept}
//         multiple={multiple}
//         disabled={disabled}
//         onChange={handleChange}
//       />

//       <Box display="flex" gap={1} flexWrap="wrap">
//         {(images.length ? images : [{}]).map((img, idx) => (
//           <Card
//             key={img.publicId || img.url || idx}
//             onClick={openDialog}
//             sx={{
//               position: "relative",
//               overflow: "hidden",
//               cursor: disabled ? "default" : "pointer",
//               border: "2px solid",
//               borderColor: finalError ? "error.main" : "divider",
//               borderRadius: resolvedRadius,
//               width: resolvedWidth,
//               height: resolvedHeight,
//             }}
//           >
//             <CloudinaryImage
//               publicId={img.publicId}
//               src={
//                 img.url ||
//                 placeholderImage ||
//                 require("@assets/images/no-ship-photo.png")
//               }
//               sx={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />

//             {!disabled && (
//               <Overlay>
//                 <Fade in>
//                   <Box display="flex" gap={1}>
//                     <IconButton color="primary">
//                       <AddCircleRoundedIcon />
//                     </IconButton>
//                     {img.url && (
//                       <IconButton
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemove(idx);
//                         }}
//                       >
//                         <DeleteForeverRoundedIcon />
//                       </IconButton>
//                     )}
//                   </Box>
//                 </Fade>
//               </Overlay>
//             )}
//           </Card>
//         ))}
//       </Box>

//       {finalError && (
//         <Typography
//           variant="caption"
//           color={finalError ? "error" : "text.secondary"}
//         >
//           {finalHelperText}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ImageUploadFieldFormik;
