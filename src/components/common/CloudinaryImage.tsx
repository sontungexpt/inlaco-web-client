import { useMemo, useState, useEffect, useCallback } from "react";
import { Box, BoxProps } from "@mui/material";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { dpr } from "@cloudinary/url-gen/actions/delivery";
import Env from "@/config/env.config";
import { ImageAssets } from "@/constants/Asset";

const cld = new Cloudinary({
  cloud: { cloudName: Env.CLOUDINARY_CLOUD_NAME },
});

const NO_AVATAR_URL =
  "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png";

export type CloudinaryImageProps = BoxProps & {
  publicId?: string;
  src?: string;
  fallback?: string;
  avatar?: boolean;
  alt?: string;
};

export default function CloudinaryImage({
  publicId,
  src,
  width,
  height,
  fallback,
  sx,
  alt = "",
  avatar = false,
  ...props
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when source changes
  useEffect(() => setHasError(false), [publicId, src]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const cldImg = useMemo(() => {
    if (!publicId) return null;
    const image = cld.image(publicId);

    const resize = fill().gravity(autoGravity());

    if (typeof width === "number") resize.width(width);
    if (typeof height === "number") resize.height(height);

    image
      .resize(resize)
      .quality("auto:eco")
      .format("auto")
      .delivery(dpr("auto")); // retina safe;

    return image;
  }, [publicId, width, height]);

  const imageStyle = useMemo(
    () => [
      {
        width: width ?? "100%",
        height: height ?? "100%",
        objectFit: width && height ? "cover" : "contain",
        display: "block",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [width, height, sx],
  );

  const shouldUseFallback = !publicId && !src;

  // Render fallback if error or no image
  if (hasError || shouldUseFallback) {
    const fallbackSrc =
      fallback || (avatar ? NO_AVATAR_URL : ImageAssets.NoImage);

    return (
      <Box
        {...props}
        component="img"
        src={fallbackSrc}
        alt={alt}
        loading="lazy"
        sx={imageStyle}
      />
    );
  }

  // Render Cloudinary image
  if (cldImg) {
    return (
      <Box
        {...props}
        component={AdvancedImage}
        cldImg={cldImg}
        onError={handleError}
        sx={imageStyle}
      />
    );
  }

  // Render plain URL image as last resort
  return (
    <Box
      {...props}
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      sx={imageStyle}
    />
  );
}
