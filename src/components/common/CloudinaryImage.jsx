import { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import AppProperty from "@/constants/AppProperty";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: AppProperty.CLOUDINARY_CLOUD_NAME,
  },
});

const NO_AVATAR_URL =
  "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png";

const CloudinaryImage = ({
  publicId,
  src,
  width,
  height,
  fallback,
  avatar,
  sx = {},
  imgSx = {},
  alt = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  /* reset error when source changes*/
  useEffect(() => {
    setHasError(false);
  }, [publicId, src]);

  const handleError = () => {
    setHasError(true);
  };

  const cldImg = useMemo(() => {
    if (!publicId || hasError) return null;

    const image = cld.image(publicId);

    if (width && height) {
      image.resize(fill().width(width).height(height));
    }

    image.quality("auto").format("auto");
    return image;
  }, [publicId, width, height, hasError]);

  const sharedStyle = [
    {
      width: width ?? "100%",
      height: height ?? "100%",
      objectFit: width && height ? "cover" : "contain",
      display: "block",
    },
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  /* ===== Fallback ===== */
  if (hasError || (!cldImg && !src)) {
    return (
      <Box
        {...props}
        component="img"
        src={
          fallback ||
          (avatar ? NO_AVATAR_URL : require("@assets/images/no-ship-photo.png"))
        }
        loading="lazy"
        alt="fallback"
        sx={sharedStyle}
      />
    );
  }

  /* ===== Cloudinary ===== */
  if (cldImg) {
    return (
      <Box
        {...props}
        component={AdvancedImage}
        cldImg={cldImg}
        onError={handleError}
        sx={sharedStyle}
      />
    );
  }

  /* ===== URL thường ===== */
  return (
    <Box
      {...props}
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      sx={sharedStyle}
    />
  );
};

export default CloudinaryImage;
