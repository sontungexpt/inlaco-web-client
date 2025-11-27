import { Box } from "@mui/material";
import { COLOR } from "../../assets/Color";

const ScheduleCell = ({
  startDate,
  estimatedEndTime,
  startLocation,
  endLocation,
  backgroundColor,
  color = COLOR.PrimaryBlack,
  sx = [],
}) => {
  return (
    <Box
      display="flex"
      backgroundColor={backgroundColor}
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Box>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: COLOR.PrimaryBlack,
          }}
        >
          {startLocation}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: COLOR.SecondaryBlack }}>
          {startDate}
        </p>
      </Box>
      <strong style={{ marginLeft: 20, marginRight: 20, fontSize: 24 }}>
        -
      </strong>
      <Box>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: COLOR.PrimaryBlack,
          }}
        >
          {endLocation}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: COLOR.SecondaryBlack }}>
          {estimatedEndTime}
        </p>
      </Box>
    </Box>
  );
};

export default ScheduleCell;
