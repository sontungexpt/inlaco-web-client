import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
} from "@mui/material";
import { COLOR } from "../../assets/Color";
import { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

const CourseCard = ({
  name,
  description,
  courseImage,
  trainingPartner,
  trainingPartnerLogo,
  limitStudent,
  gridSize = 4,
  color = COLOR.primary_black,
  sx = [],
  isCertificateCourse,
  onClick,
}) => {
  const [courseImageError, setCourseImageError] = useState(false);
  const [logoImageError, setLogoImageError] = useState(false);

  return (
    <Grid
      onClick={onClick}
      size={gridSize}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Card
        sx={{
          position: "relative",
          borderRadius: 4,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            cursor: "pointer",
            transform: "scale(1.05)", // Slight zoom
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Darker shadow
          },
        }}
      >
        <Box sx={{ padding: 1 }}>
          <CardMedia
            component="img"
            height="180"
            image={
              courseImageError || courseImage === ""
                ? require("../../assets/images/no-ship-photo.png")
                : courseImage
            }
            alt={name}
            onError={() => {
              setCourseImageError(true);
            }}
            sx={{ borderRadius: 3 }}
          />
          <CardContent sx={{ marginTop: 1, padding: 0 }}>
            <Box sx={{ padding: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <img
                  alt="profile-user"
                  width="32px"
                  height="32px"
                  src={
                    logoImageError || trainingPartnerLogo === ""
                      ? require("../../assets/images/no-ship-photo.png")
                      : trainingPartnerLogo
                  }
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onError={() => {
                    setLogoImageError(true);
                  }}
                />
                <Typography
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1, // Set the number of lines to show
                    color: COLOR.secondary_black,
                    fontSize: 16,
                    fontWeight: 600,
                    marginLeft: "10px",
                  }}
                >
                  {trainingPartner}
                </Typography>
              </Box>
              <Typography
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1, // Set the number of lines to show
                  color: COLOR.primary_black,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {name}
              </Typography>
              <Box sx={{ display: "flex", marginTop: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    left: 8,
                  }}
                >
                  {isCertificateCourse ? (
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        height: 20,
                        color: isCertificateCourse
                          ? COLOR.primary_green
                          : COLOR.secondary_gold,
                      }}
                    />
                  ) : (
                    <MenuBookRoundedIcon
                      sx={{
                        width: 20,
                        height: 20,
                        color: isCertificateCourse
                          ? COLOR.primary_green
                          : COLOR.secondary_gold,
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: 14,
                      marginLeft: "4px",
                      color: isCertificateCourse
                        ? COLOR.primary_green
                        : COLOR.secondary_gold,
                    }}
                  >
                    {isCertificateCourse ? "Có cấp chứng chỉ" : "Khóa học"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    right: 8,
                  }}
                >
                  <PersonRoundedIcon
                    sx={{ width: 20, height: 20, color: COLOR.primary_gray }}
                  />
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: COLOR.primary_gray,
                    }}
                  >
                    {limitStudent}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
};

export default CourseCard;
