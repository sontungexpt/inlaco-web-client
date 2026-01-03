import { Box, Typography, Stack } from "@mui/material";
import { CloudinaryImage } from "@components/common";

const ShipInfoCell = ({
  IMONumber,
  name,
  countryCode,
  type,
  description,
  imageUrl,
  imagePublicId,
  backgroundColor,
  sx = [],
}) => {
  return (
    <Box
      sx={[
        {
          display: "flex",
          gap: 2,
          backgroundColor,
          minWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Image */}
      <CloudinaryImage
        publicId={imagePublicId}
        src={imageUrl}
        variant="rounded"
        alt="Ship"
        sx={{
          width: 150,
          borderRadius: 2,
          border: "1px solid #0000005a",
        }}
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
