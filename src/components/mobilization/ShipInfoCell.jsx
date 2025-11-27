import { Box } from "@mui/material";
import { COLOR } from "../../assets/Color";
import { useState } from "react";

const ShipInfoCell = ({
  IMONumber,
  name,
  countryCode,
  type,
  imageUrl,
  backgroundColor,
  color = COLOR.PrimaryBlack,
  sx = [],
}) => {
  //   console.log(IMONumber);

  const [imageError, setImageError] = useState(false);

  return (
    <Box
      backgroundColor={backgroundColor}
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={
            imageError || !imageUrl
              ? require("../../assets/images/no-ship-photo.png")
              : imageUrl
          }
          alt="Ship"
          style={{
            width: 160,
            height: 90,
            alignSelf: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: COLOR.PrimaryBlack,
        }}
      >
        <p style={{ margin: 0, textAlign: "left", overflow: "hidden" }}>
          <strong>IMO:</strong> {IMONumber}
        </p>
        <p style={{ margin: 0, textAlign: "left", overflow: "hidden" }}>
          <strong>Tên tàu:</strong> {name}
        </p>
        <p style={{ margin: 0, textAlign: "left", overflow: "hidden" }}>
          <strong>Quốc tịch:</strong> {countryCode}
        </p>
        <p style={{ margin: 0, textAlign: "left", overflow: "hidden" }}>
          <strong>Loại tàu:</strong> {type}
        </p>
      </Box>
    </Box>
  );
};

export default ShipInfoCell;
