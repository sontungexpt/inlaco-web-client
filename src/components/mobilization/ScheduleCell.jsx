import { Box } from "@mui/material";
import Color from "@constants/Color";

const ScheduleCell = ({
  startDate,
  estimatedEndTime,
  startLocation,
  endLocation,
  backgroundColor,
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
            color: Color.PrimaryBlack,
          }}
        >
          {startLocation}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: Color.SecondaryBlack }}>
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
            color: Color.PrimaryBlack,
          }}
        >
          {endLocation}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: Color.SecondaryBlack }}>
          {estimatedEndTime}
        </p>
      </Box>
    </Box>
  );
};

export default ScheduleCell;
