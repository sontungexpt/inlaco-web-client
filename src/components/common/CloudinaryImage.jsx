import { useMemo } from "react";
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

const CloudinaryImage = ({
  publicId,
  url,
  width,
  height,
  sx = {},
  imgSx = {},
  alt = "",
  ...props
}) => {
  const cldImg = useMemo(() => {
    if (!publicId) return null;

    const image = cld.image(publicId);

    if (width && height) {
      image.resize(fill().width(width).height(height));
    }

    image.quality("auto").format("auto");
    return image;
  }, [publicId, width, height]);

  const sharedStyle = {
    width: width ?? "100%",
    height: height ?? "100%",
    objectFit: width && height ? "cover" : "contain",
    display: "block",
  };

  /** ===== Cloudinary ===== */
  if (cldImg) {
    return (
      <Box
        component={AdvancedImage}
        cldImg={cldImg}
        sx={[sharedStyle, ...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      />
    );
  }

  /** ===== URL normal ===== */
  if (url) {
    return (
      <Box
        component="img"
        src={url}
        alt={alt}
        loading="lazy"
        sx={[sharedStyle, ...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      />
    );
  }

  return null;
};

export default CloudinaryImage;
