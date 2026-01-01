import { Box, Typography, Stack, Avatar } from "@mui/material";
import { useState } from "react";

const ShipInfoCell = ({
  IMONumber,
  name,
  countryCode,
  type,
  description,
  imageUrl,
  backgroundColor,
  sx = [],
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1,
          backgroundColor,
          minWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Image */}
      <Avatar
        variant="rounded"
        src={
          imageError ? require("@assets/images/no-ship-photo.png") : imageUrl
        }
        alt="Ship"
        sx={{
          width: 120,
          height: 70,
          borderRadius: 2,
          bgcolor: "grey.100",
          flexShrink: 0,
        }}
        onError={() => setImageError(true)}
      />

      {/* Info */}
      <Stack spacing={0.3} minWidth={0}>
        <Typography variant="body2" fontWeight={600} noWrap>
          IMO: {IMONumber}
        </Typography>

        <Typography variant="body2" noWrap>
          <strong>Tên tàu:</strong> {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          Quốc tịch: {countryCode}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          Loại tàu: {type}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Mô tả: {description}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ShipInfoCell;
