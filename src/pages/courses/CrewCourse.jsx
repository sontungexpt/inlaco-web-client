import {
  CenterCircularProgress,
  PageTitle,
  SectionWrapper,
} from "@components/common";
import { Grid, Box, Button, Typography, Pagination } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { useState } from "react";
import Color from "@constants/Color";
import UserRole from "@/constants/UserRole";
import CourseCard from "./components/CourseCard";
import { useCourses } from "@/hooks/services/course";
import useAllowedRole from "@/hooks/useAllowedRole";

export default function CrewCourse() {
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const [page, setPage] = useState(0);

  const {
    data: {
      content: courses = [],
      totalElements: totalCourses,
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
        {courses.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              key={item?.id}
              name={item?.name}
              description={item?.description}
              courseImagePublicId={item?.wallpaper?.publicId}
              courseImageUrl={item?.wallpaper?.url}
              trainingPartner={item?.trainingProviderName}
              trainingPartnerLogoPublicId={item?.trainingProviderLogo?.publicId}
              trainingPartnerLogo={item?.trainingProviderLogo}
              limitStudent={item?.limitStudent}
              certified={item?.certified}
              onClick={() =>
                navigate(`/courses/${item?.id}`, {
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
