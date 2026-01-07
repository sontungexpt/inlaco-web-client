import { useMemo, useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import AppProperty from "@/constants/AppProperty";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

import NoImage from "@assets/images/no-ship-photo.png";

const cld = new Cloudinary({
  cloud: {
    cloudName: AppProperty.CLOUDINARY_CLOUD_NAME,
  },
});

const CloudinaryImage = ({
  publicId,
  src,
  width,
  height,
  fallback = NoImage,
  sx = {},
  imgSx = {},
  alt = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  /* reset error khi đổi source */
  useEffect(() => {
    setHasError(false);
  }, [publicId, src]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

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
        component="img"
        src={fallback}
        alt="fallback"
        sx={sharedStyle}
        {...props}
      />
    );
  }

  /* ===== Cloudinary ===== */
  if (cldImg) {
    return (
      <Box
        component={AdvancedImage}
        cldImg={cldImg}
        onError={handleError}
        sx={sharedStyle}
        {...props}
      />
    );
  }

  /* ===== URL thường ===== */
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      sx={sharedStyle}
      {...props}
    />
  );
};

export default CloudinaryImage;
