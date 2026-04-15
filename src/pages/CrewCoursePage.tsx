import {
  CenterCircularProgress,
  PageTitle,
  SectionWrapper,
  CloudinaryImage,
} from "@components/common";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import {
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  Pagination,
} from "@mui/material";
import { useCourses } from "@/queries/course.query";
import { useNavigate } from "react-router";
import { useState } from "react";
import Color from "@constants/Color";
import UserRole from "@/constants/UserRole";
import useAllowedRole from "@/hooks/useAllowedRole";

type CourseCardProps = {
  name: string;
  courseImagePublicId?: string;
  courseImageUrl?: string;
  trainingPartner?: string;
  trainingPartnerLogo?: string;
  trainingPartnerLogoPublicId?: string;
  limitStudent?: number;
  certificated?: boolean;
  onClick: () => void;
  sx?: any;
};

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
}: CourseCardProps) => {
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

export default function CrewCoursePage() {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const [page, setPage] = useState(0);

  const {
    data: {
      content: courses = [],
      totalElements: totalCourses = 0,
      totalPages,
    } = {},
    isLoading,
    isError,
  } = useCourses({ page, pageSize: 12 });

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  return (
    <Box m="20px">
      <SectionWrapper>
        <PageTitle
          mb={3}
          title="ĐÀO TẠO"
          subtitle="Danh sách các khóa học hiện có"
        />

        {isAdmin && (
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                borderRadius: 2,
              }}
              onClick={() => navigate("/courses/create")}
            >
              <AddCircleRoundedIcon />
              <Typography
                sx={{
                  fontWeight: 700,
                  marginLeft: "4px",
                  textTransform: "capitalize",
                }}
              >
                Tạo khóa học
              </Typography>
            </Button>
          </Box>
        )}
      </SectionWrapper>

      {/* COURSE LIST */}
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              key={course.id}
              name={course?.name}
              courseImagePublicId={course?.wallpaper?.publicId}
              courseImageUrl={course?.wallpaper?.url}
              trainingPartner={course?.trainingProviderName}
              trainingPartnerLogoPublicId={
                course?.trainingProviderLogo?.publicId
              }
              trainingPartnerLogo={course?.trainingProviderLogo?.url}
              limitStudent={course?.limitStudent}
              certificated={course?.certified}
              onClick={() =>
                navigate(`/courses/${course?.id}`, {
                  state: { isAdmin: isAdmin },
                })
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* PAGINATION */}
      <Box mt={4} display="flex" justifyContent="center">
        {totalCourses > 0 ? (
          <Pagination
            count={totalPages}
            page={page + 1} // UI page = backend page + 1
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
            size="large"
            shape="rounded"
          />
        ) : (
          <Typography>
            {isError ? "Lỗi khi tải khoá học" : "Chưa có khoá học nào"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
