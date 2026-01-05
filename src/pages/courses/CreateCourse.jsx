import {
  PageTitle,
  SectionWrapper,
  InfoTextField,
  ImageUploadFieldFormik,
} from "@components/common";
import { Box, Button, MenuItem, Grid, CircularProgress } from "@mui/material";
import Color from "@constants/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as Yup from "yup";
import { createCourse } from "@/services/courseServices";
import { datetimeToISO } from "@/utils/converter";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";

const CreateCourse = () => {
  const navigate = useNavigate();
  const initialValues = {
    instructorName: "",
    institute: "",
    instituteLogo: null,
    courseName: "",
    courseWallpaper: null,
    description: "",
    startDate: "",
    endDate: "",
    startRegistrationAt: "",
    endRegistrationAt: "",
    isCertificatedCourse: "",
    limitStudent: "",
    archivedPosition: "",
  };

  const CERTIFICATED_COURSE_OPTIONS = ["Có", "Không"];

  const COURSE_SCHEMA = Yup.object().shape({
    instructorName: Yup.string(),
    institute: Yup.string().required("Tên đơn vị đào tạo không được để trống"),
    instituteLogo: Yup.mixed().required(
      "Logo đơn vị đào tạo không được để trống",
    ),
    courseWallpaper: Yup.mixed().required("Hình khóa học không được để trống"),
    courseName: Yup.string().required("Tên khóa học không được để trống"),
    startDate: Yup.date()
      .required("Ngày bắt đầu không được để trống")
      .test(
        "is-before-end-date",
        "Ngày bắt đầu phải trước ngày kết thúc",
        function (value) {
          const { endDate } = this.parent; // Access sibling field endDate
          return !endDate || value < endDate;
        },
      ),
    endDate: Yup.date()
      .required("Ngày kết thúc không được để trống")
      .test(
        "is-after-start-date",
        "Ngày kết thúc phải sau ngày bắt đầu",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value > startDate;
        },
      ),
    startRegistrationAt: Yup.date()
      .required("Ngày bắt đầu đăng kí khoá học không được để trống")
      .test(
        "is-before-registration-end-date",
        "Ngày bắt đầu đăng kí khoá học phải trước ngày kết thúc đăng kí khoá học",
        function (value) {
          const { endRegistrationAt } = this.parent; // Access sibling field endDate
          return !endRegistrationAt || value < endRegistrationAt;
        },
      )
      .test(
        "is-before-start-date",
        "Ngày bắt đầu đăng kí khoá học phải trước ngày bắt đầu khoá học",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value < startDate;
        },
      ),
    endRegistrationAt: Yup.date()
      .required("Ngày kết thúc đăng kí khoá học không được đễ trống")
      .test(
        "is-after-registration-start-date",
        "Ngày kết thúc đăng kí khoá học phải sau ngày bắt đầu đăng kí khoá học",
        function (value) {
          const { startRegistrationAt } = this.parent; // Access sibling field startDate
          return !startRegistrationAt || value > startRegistrationAt;
        },
      )
      .test(
        "is-before-start-date",
        "Ngày kết thúc đăng kí khoá học phải trước ngày bắt đầu khoá học",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value < startDate;
        },
      ),
    description: Yup.string().required("Mô tả khóa học không được để trống"),
    isCertificatedCourse: Yup.string().required("Vui lòng chọn một lựa chọn"),
    limitStudent: Yup.number().required("Vui lòng nhập số người học"),
    archivedPosition: Yup.string().required(
      "Vui lòng nhập vị trí đạt được sau khi hoàn thành khoá học",
    ),
  });

  const handleCreateCourseSubmit = async (values, { resetForm }) => {
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
        {
          // insitive infos
          teacherName: values.instructorName,
          trainingProviderName: values.institute,

          // course infos
          name: values.courseName,
          limitStudent: values.limitStudent,
          description: values.description,
          certified: values.isCertificatedCourse === "Có",
          startDate: datetimeToISO(values.startDate),
          endDate: datetimeToISO(values.endDate),
          startRegistrationAt: datetimeToISO(values.startRegistrationAt),
          endRegistrationAt: datetimeToISO(values.endRegistrationAt),
          achievedPosition: values.achievedPosition,
        },
        wallPaper.asset_id,
        trainingProviderLogo.asset_id,
      );
      toast.success("Tạo khóa học thành công!");
      navigate(`/courses/${newCourse.id}`);
      resetForm();
    } catch (err) {
      console.log(err);
      toast.error("Tạo khóa học thất bại!");
    }
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValues}
      validationSchema={COURSE_SCHEMA}
      onSubmit={handleCreateCourseSubmit}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => {
        return (
          <Box m="20px" component="form" onSubmit={handleSubmit}>
            <SectionWrapper>
              <PageTitle
                title="TẠO KHÓA ĐÀO TẠO THUYỀN VIÊN"
                subtitle="Tạo các khóa đào tạo thuyền viên mới"
              />
              <Box
                sx={{
                  display: "flex",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress
                        size={24}
                        mr={2}
                        color={Color.PrimaryBlack}
                      />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                  sx={{
                    color: Color.PrimaryBlack,
                    backgroundColor: Color.PrimaryGold,
                  }}
                >
                  Tạo
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)} // ⬅ QUAY LẠI
                  sx={{
                    color: Color.PrimaryWhite,
                    backgroundColor: Color.PrimaryBlue,
                  }}
                >
                  Quay lại
                </Button>
              </Box>
            </SectionWrapper>
            <SectionWrapper title="Thông tin cơ sở đào tạo*: ">
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Grid size={3}>
                  <ImageUploadFieldFormik
                    variant="circle"
                    size={120}
                    name="instituteLogo"
                    sx={{
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  />
                  {/* <LogoInput name="instituteLogo" /> */}
                </Grid>
                <Grid size={5}>
                  <InfoTextField
                    id="institute"
                    label="Đơn vị đào tạo"
                    margin="none"
                    required
                    fullWidth
                    name="institute"
                    value={values.institute}
                    error={!!touched.institute && !!errors.institute}
                    helperText={touched.institute && errors.institute}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ marginTop: 2 }}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="instructor-name"
                    label="Tên giảng viên"
                    margin="none"
                    fullWidth
                    name="instructorName"
                    value={values.instructorName}
                    error={!!touched.instructorName && !!errors.instructorName}
                    helperText={touched.instructorName && errors.instructorName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ marginTop: 2 }}
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
            <SectionWrapper title="Thông tin khóa đào tạo*: ">
              <Grid container spacing={2} rowSpacing={4} pt={2}>
                <Grid size={4}>
                  <InfoTextField
                    id="course-name"
                    label="Tên khóa học"
                    margin="none"
                    required
                    fullWidth
                    name="courseName"
                    value={values.courseName}
                    error={!!touched.courseName && !!errors.courseName}
                    helperText={touched.courseName && errors.courseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="start-date"
                    type="date"
                    label="Ngày bắt đầu"
                    margin="none"
                    required
                    fullWidth
                    name="startDate"
                    value={values.startDate}
                    error={!!touched.startDate && !!errors.startDate}
                    helperText={touched.startDate && errors.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="end-date"
                    type="date"
                    label="Ngày kết thúc"
                    margin="none"
                    required
                    fullWidth
                    name="endDate"
                    value={values.endDate}
                    error={!!touched.endDate && !!errors.endDate}
                    helperText={touched.endDate && errors.endDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="limit-student"
                    label="Số lượng học viên"
                    margin="none"
                    required
                    fullWidth
                    name="limitStudent"
                    value={values.limitStudent}
                    error={!!touched.limitStudent && !!errors.limitStudent}
                    helperText={touched.limitStudent && errors.limitStudent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="start-registration-date"
                    type="date"
                    label="Ngày bắt đầu đăng ký khoá học"
                    margin="none"
                    required
                    fullWidth
                    name="startRegistrationAt"
                    value={values.startRegistrationAt}
                    error={
                      !!touched.startRegistrationAt &&
                      !!errors.startRegistrationAt
                    }
                    helperText={
                      touched.startRegistrationAt && errors.startRegistrationAt
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="end-registration-date"
                    type="date"
                    label="Ngày kết thúc đăng ký khoá học"
                    margin="none"
                    required
                    fullWidth
                    name="endRegistrationAt"
                    value={values.endRegistrationAt}
                    error={
                      !!touched.endRegistrationAt && !!errors.endRegistrationAt
                    }
                    helperText={
                      touched.endRegistrationAt && errors.endRegistrationAt
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextField
                    id="archived-position"
                    label="Ví trị đạt đuợc"
                    margin="none"
                    required
                    fullWidth
                    name="archivedPosition"
                    value={values.archivedPosition}
                    error={
                      !!touched.archivedPosition && !!errors.archivedPosition
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextField
                    id="is-certificated-course"
                    select
                    label="Khóa học có cấp chứng chỉ?"
                    margin="none"
                    required
                    fullWidth
                    name="isCertificatedCourse"
                    value={values.isCertificatedCourse}
                    error={
                      !!touched.isCertificatedCourse &&
                      !!errors.isCertificatedCourse
                    }
                    helperText={
                      touched.isCertificatedCourse &&
                      errors.isCertificatedCourse
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {CERTIFICATED_COURSE_OPTIONS.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </InfoTextField>
                </Grid>

                <Grid size={8}>
                  <InfoTextField
                    id="description"
                    label="Mô tả khóa học"
                    rows={8}
                    multiline
                    margin="none"
                    required
                    fullWidth
                    name="description"
                    value={values.description}
                    error={!!touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={12}>
                  <ImageUploadFieldFormik
                    label="Hình ảnh khoá học"
                    name="courseWallpaper"
                    width="100%"
                    height={250}
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
          </Box>
        );
      }}
    </Formik>
  );
};

export default CreateCourse;
