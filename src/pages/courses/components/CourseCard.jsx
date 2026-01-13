import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Color from "@/constants/Color";
import { CloudinaryImage } from "@/components/common";

const CourseCard = ({
  name,
  courseImagePublicId,
  courseImageUrl,

  trainingPartner,
  trainingPartnerLogo,
  trainingPartnerLogoPublicId,

  limitStudent,

  sx = [],
  certificated,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={[
        {
          height: "100%",
          borderRadius: 4,
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0px 12px 28px rgba(0,0,0,0.25)",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* ===== Image ===== */}
      <Box sx={{ position: "relative" }}>
        <CloudinaryImage
          publicId={courseImagePublicId}
          src={courseImageUrl}
          height={200}
          alt={name}
          style={{ objectFit: "cover" }}
        />

        {/* Certificate badge */}
        <Chip
          icon={
            certificated ? <CheckCircleRoundedIcon /> : <MenuBookRoundedIcon />
          }
          label={certificated ? "Chứng chỉ" : "Khóa học"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 600,
            bgcolor: certificated ? Color.PrimaryGreen : Color.PrimaryBlue,
            color: "#fff",
            "& .MuiChip-icon": { color: "#fff" },
          }}
        />
      </Box>

      {/* ===== Content ===== */}
      <CardContent sx={{ p: 2 }}>
        {/* Partner */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            gap: 1,
          }}
        >
          <CloudinaryImage
            publicId={trainingPartnerLogoPublicId}
            src={trainingPartnerLogo}
            alt={trainingPartner}
            width="32px"
            height="32px"
            style={{ borderRadius: "50%" }}
          />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: Color.SecondaryBlack,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {trainingPartner}
          </Typography>
        </Box>

        {/* Course name */}
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: Color.PrimaryBlack,
            lineHeight: 1.3,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {name}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonRoundedIcon
              sx={{ width: 18, height: 18, color: Color.PrimaryGray }}
            />
            <Typography sx={{ fontSize: 14, color: Color.PrimaryGray }}>
              {limitStudent} học viên
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
