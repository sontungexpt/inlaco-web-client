import { useMemo } from "react";
import AppProperty from "@/constants/AppProperty";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: AppProperty.CLOUDINARY_CLOUD_NAME,
  },
});

const CloudinaryImage = ({ publicId, width, height, style = {}, ...props }) => {
  const img = useMemo(() => {
    if (!publicId) return null;

    const image = cld.image(publicId);

    if (width && height) {
      image.resize(fill().width(width).height(height));
    }

    image.quality("auto").format("auto");
    return image;
  }, [publicId, width, height]);

  if (!img) return null;

  return (
    <AdvancedImage
      cldImg={img}
      style={{
        objectFit: width && height ? "cover" : "contain",
        display: "block",
        ...style,
      }}
      {...props}
    />
  );
};

export default CloudinaryImage;
