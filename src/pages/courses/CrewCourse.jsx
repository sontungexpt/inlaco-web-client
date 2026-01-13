import { PageTitle, SectionWrapper } from "@components/common";
import {
  Grid,
  Box,
  Button,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { useState } from "react";
import Color from "@constants/Color";
import UserRole from "@/constants/UserRole";
import CourseCard from "./components/CourseCard";
import { useCourses } from "@/hooks/services/course";
import useAllowedRole from "@/hooks/useAllowedRole";

const CrewCourse = () => {
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

  return (
    <Box m="20px">
      <SectionWrapper
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 2,
          mb: 3,
        }}
      >
        <PageTitle title="ĐÀO TẠO" subtitle="Danh sách các Khóa học hiện có" />

        {isAdmin && (
          <Box
            sx={{
              mt: 3,
            }}
          >
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

        {/* LOADING */}
        {isLoading && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress size={50} thickness={4} />
          </Box>
        )}
      </SectionWrapper>

      {/* COURSE LIST */}
      {!isLoading && (
        <>
          <Grid container spacing={4}>
            {courses.map((item) => (
              <Grid item size={4}>
                <CourseCard
                  key={item?.id}
                  name={item?.name}
                  description={item?.description}
                  courseImagePublicId={item?.wallpaper?.publicId}
                  courseImage={item?.wallpaper?.url}
                  trainingPartner={item?.trainingProviderName}
                  trainingPartnerLogoPublicId={
                    item?.trainingProviderLogo?.publicId
                  }
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
        </>
      )}
    </Box>
  );
};

export default CrewCourse;
