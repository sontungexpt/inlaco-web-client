import React from "react";
import { Typography, Divider, Box } from "@mui/material";
import { CloudinaryImage } from "@/components/common";

const ShipInfoSection = ({ shipInfo }) => {
  if (!shipInfo) return null;

  return (
    <>
      <Typography fontWeight={700}>ĐIỀU 3. THÔNG TIN TÀU</Typography>
      <Typography>Tên tàu: {shipInfo.name}</Typography>
      <Typography>IMO: {shipInfo.imoNumber}</Typography>
      <Typography>Quốc gia treo cờ: {shipInfo.countryISO}</Typography>
      <Typography>Mô tả: {shipInfo.description}</Typography>

      {shipInfo.image && (
        <Box mt={1}>
          <CloudinaryImage
            url={shipInfo.image.url}
            publicId={shipInfo.image.publicId}
            label="Ảnh tàu"
            name={shipInfo.image.displayName}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
    </>
  );
};

export default ShipInfoSection;
