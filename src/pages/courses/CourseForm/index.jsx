import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
} from "@components/common";
import { Box, Button, MenuItem, Grid, CircularProgress } from "@mui/material";
import Color from "@constants/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import { createCourse } from "@/services/courseServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import { FORM_SCHEMA } from "./schema";
import { DEFAULT_INITIAL_VALUES } from "./defaults";
import { mapValuesToRequestBody } from "./mapper";

const CourseForm = () => {
  const navigate = useNavigate();

  const CERTIFICATED_COURSE_OPTIONS = ["Có", "Không"];

  const handleFormSubmission = async (values, { resetForm }) => {
    try {
      const [wallPaper, trainingProviderLogo] = await Promise.all([
        cloudinaryUpload(
          values.courseWallpaper,
          UploadStrategy.COURSE_WALLPAPER,
        ),
        cloudinaryUpload(
          values.instituteLogo,
          UploadStrategy.TRAINING_PROVIDER_LOGO,
        ),
      ]);

      const newCourse = await createCourse(
        mapValuesToRequestBody(values),
        wallPaper.asset_id,
        trainingProviderLogo.asset_id,
      );

      toast.success("Tạo khóa học thành công!");
      navigate(`/courses/${newCourse.id}`);
      resetForm();
    } catch (err) {
      toast.error("Tạo khóa học thất bại!");
    }
  };

  return (
    <Formik
      validateOnChange
      initialValues={DEFAULT_INITIAL_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleFormSubmission}
    >
      {({ isValid, dirty, isSubmitting, handleSubmit }) => (
        <Box component="form" m="20px" onSubmit={handleSubmit}>
          {/* ===== HEADER ===== */}
          <SectionWrapper>
            <PageTitle
              title="TẠO KHÓA ĐÀO TẠO THUYỀN VIÊN"
              subtitle="Tạo các khóa đào tạo thuyền viên mới"
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || !dirty || isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                sx={{
                  color: Color.PrimaryBlack,
                  backgroundColor: Color.PrimaryGold,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Tạo
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{
                  color: Color.PrimaryWhite,
                  backgroundColor: Color.PrimaryBlue,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Quay lại
              </Button>
            </Box>
          </SectionWrapper>

          {/* ===== TRAINING PROVIDER ===== */}
          <SectionWrapper title="Thông tin cơ sở đào tạo*:">
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <ImageUploadFieldFormik
                  variant="circle"
                  size={120}
                  name="instituteLogo"
                  sx={{ mx: { xs: "auto", sm: 0 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8, md: 5 }}>
                <InfoTextFieldFormik label="Đơn vị đào tạo" name="institute" />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <InfoTextFieldFormik
                  label="Tên giảng viên"
                  name="instructorName"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== COURSE INFO ===== */}
          <SectionWrapper title="Thông tin khóa đào tạo*:">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik label="Tên khóa học" name="courseName" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  type="date"
                  label="Ngày bắt đầu"
                  name="startDate"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  type="date"
                  label="Ngày kết thúc"
                  name="endDate"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  type="number"
                  label="Số lượng học viên"
                  name="limitStudent"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  type="date"
                  label="Ngày bắt đầu đăng ký"
                  name="startRegistrationAt"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  type="date"
                  label="Ngày kết thúc đăng ký"
                  name="endRegistrationAt"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InfoTextFieldFormik
                  label="Vị trí đạt được"
                  name="archivedPosition"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InfoTextFieldFormik
                  select
                  label="Khóa học có cấp chứng chỉ?"
                  name="isCertificatedCourse"
                >
                  {CERTIFICATED_COURSE_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </InfoTextFieldFormik>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InfoTextFieldFormik
                  label="Mô tả khóa học"
                  name="description"
                  multiline
                  minRows={6}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <ImageUploadFieldFormik
                  label="Hình ảnh khoá học"
                  name="courseWallpaper"
                  height={250}
                />
              </Grid>
            </Grid>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default CourseForm;
