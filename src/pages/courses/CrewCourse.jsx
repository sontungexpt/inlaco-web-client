import { PageTitle } from "../../components/global";
import { Grid, Box, Button, Typography } from "@mui/material";
import { COLOR } from "../../assets/Color";
import { CourseCard } from "../../components/other";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const CrewCourse = () => {
  const navigate = useNavigate();
  const isAdmin = true; //this should be replace by account actual role

  const [courses, setCourses] = useState([]);

  useEffect(() => {});

  return (
    <div>
      <Box m="20px">
        <Box>
          <PageTitle
            title="ĐÀO TẠO"
            subtitle="Danh sách các Khóa học hiện có"
          />
        </Box>
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
                backgroundColor: COLOR.primary_gold,
                color: COLOR.primary_black,
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
        <Grid container spacing={4}>
          {courses.map((item) => {
            return (
              <CourseCard
                key={item?.id}
                name={item?.name}
                description={item?.description}
                courseImage={item?.courseImage}
                trainingPartner={item?.trainingPartner}
                trainingPartnerLogo={item?.trainingPartnerLogo}
                limitStudent={item?.limitStudent}
                isCertificateCourse={item?.isCertificateCourse}
                onClick={() =>
                  navigate(`/courses/${item?.id}`, {
                    state: { isAdmin: isAdmin },
                  })
                }
              />
            );
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default CrewCourse;
