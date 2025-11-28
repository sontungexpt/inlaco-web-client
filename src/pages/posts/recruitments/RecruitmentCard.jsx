import React from "react";
import { Grid, Card, Box, Typography, Button } from "@mui/material";
import Color from "@constants/Color";

const RecruitmentCard = ({
  isAdmin,
  title,
  description,
  location,
  gridSize = 12,
  sx = [],
  onClick,
  ...props
}) => {
  return (
    <Grid
      {...props}
      onClick={onClick}
      size={gridSize}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Card
        sx={{
          borderRadius: 4,
          padding: 3,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.25s ease",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          "&:hover": {
            cursor: "pointer",
            transform: "translateY(-4px)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: Color.PrimaryBlack,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: Color.SecondaryBlack,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Button */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: Color.SecondaryBlue,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: Color.SecondaryBlue,
                opacity: 0.9,
              },
            }}
          >
            {isAdmin ? "Xem chi tiết" : "Ứng tuyển ngay"}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default RecruitmentCard;
// import React from "react";
// import { Grid, Card, Box, Typography, Button } from "@mui/material";
// import Color from "@constants/Color";

// const RecruitmentCard = ({
//   isAdmin,
//   title,
//   description,
//   location,
//   gridSize = 12,
//   sx = [],
//   onClick,
//   ...props
// }) => {
//   return (
//     <Grid
//       {...props}
//       onClick={onClick}
//       size={gridSize}
//       sx={[...(Array.isArray(sx) ? sx : [sx])]}
//     >
//       <Card
//         sx={{
//           borderRadius: 5,
//           transition: "transform 0.3s, box-shadow 0.3s",
//           "&:hover": {
//             cursor: "pointer",
//             transform: "scale(1.005)", // Slight zoom
//             boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Darker shadow
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", position: "relative", padding: 4 }}>
//           <Box
//             sx={{
//               display: "flex",
//               position: "absolute",
//               top: 20,
//               right: 32,
//               alignItems: "center",
//             }}
//           >
//             {/* <LocationOnRoundedIcon
//               sx={{
//                 width: 20,
//                 height: 20,
//                 marginRight: "4px",
//                 color: COLOR.primary_gray,
//               }}
//             />
//             <Typography sx={{ fontSize: 14, color: COLOR.primary_gray }}>
//               {location}
//             </Typography> */}
//           </Box>
//           <Box sx={{ width: "80%" }}>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: "600",
//                 color: Color.PrimaryBlack,
//                 display: "-webkit-box",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 WebkitBoxOrient: "vertical",
//                 WebkitLineClamp: 1,
//               }}
//               gutterBottom
//             >
//               {title}
//             </Typography>
//             <Typography
//               variant="body1"
//               color="textSecondary"
//               sx={{
//                 display: "-webkit-box",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 WebkitBoxOrient: "vertical",
//                 WebkitLineClamp: 3,
//                 color: Color.SecondaryBlack,
//               }}
//             >
//               {description}
//             </Typography>
//           </Box>
//           <Box
//             sx={{
//               display: "flex",
//               width: "20%",
//               justifyContent: "flex-end",
//               alignItems: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: Color.SecondaryBlue }}
//             >
//               {isAdmin ? "Xem chi tiết" : "Ứng tuyển ngay"}
//             </Button>
//           </Box>
//         </Box>
//       </Card>
//     </Grid>
//   );
// };

// export default RecruitmentCard;
