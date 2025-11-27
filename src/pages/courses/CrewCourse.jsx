import { PageTitle } from "../../components/global";
import {
  Grid,
  Box,
  Button,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { CourseCard } from "../../components/other";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/services/courseServices";
import Color from "@constants/Color";
import { useAuthContext } from "@/contexts/AuthContext";
import UserRole from "@/constants/UserRole";

const CrewCourse = () => {
  const navigate = useNavigate();

  const { hasRole } = useAuthContext();
  const isAdmin = hasRole(UserRole.ADMIN);

  const [page, setPage] = useState(0);
  const size = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", page, size],
    queryFn: () => fetchCourses({ page, size }),
    staleTime: 1000 * 30,
  });

  const courses = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <Box m="20px">
        <PageTitle title="ĐÀO TẠO" subtitle="Danh sách các Khóa học hiện có" />

        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              paddingBottom: 4,
              justifyContent: "flex-end",
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

        {isError && <Typography>Lỗi khi tải dữ liệu</Typography>}

        {/* COURSE LIST */}
        {!isLoading && (
          <>
            <Grid container spacing={4}>
              {courses.map((item) => (
                <CourseCard
                  key={item?.id}
                  name={item?.name}
                  description={item?.description}
                  courseImage={item?.wallpaper?.url}
                  trainingPartner={item?.trainingProviderName}
                  trainingPartnerLogo={item?.trainingProviderLogo}
                  limitStudent={item?.limitStudent}
                  isCertificateCourse={item?.certified}
                  onClick={() =>
                    navigate(`/courses/${item?.id}`, {
                      state: { isAdmin: isAdmin },
                    })
                  }
                />
              ))}
            </Grid>

            {/* PAGINATION */}
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page + 1} // UI page = backend page + 1
                onChange={(e, value) => setPage(value - 1)}
                color="primary"
                size="large"
                shape="rounded"
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default CrewCourse;
