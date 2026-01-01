import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  ImageUploadField,
} from "@components/global";
import { LogoInput } from "@components/other";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import Color from "@constants/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { createCourse } from "@/services/courseServices";
import { dateStringToISOString } from "@/utils/converter";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CreateCourse = () => {
  const navigate = useNavigate();
  const initialValues = {
    instructorName: "",
    institute: "",
    instituteLogo: "",
    courseName: "",
    courseWallpaper: "",
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

  const courseSchema = Yup.object().shape({
    instructorName: Yup.string(),
    institute: Yup.string().required("Tên đơn vị đào tạo không được để trống"),
    instituteLogo: Yup.string(),
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
          return startRegistrationAt ? value > startRegistrationAt : true;
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

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: createCourse,
  });

  const handleCreateCourseSubmit = async (values, { resetForm }) => {
    try {
      await mutateAsync({
        // insitive infos
        teacherName: values.instructorName,
        trainingProviderName: values.institute,
        trainingProviderLogo: values.instituteLogo,

        // course infos
        name: values.courseName,
        wallpaper: values.courseWallpaper,
        limitStudent: values.limitStudent,
        description: values.description,
        certified: values.isCertificatedCourse === "Có",
        startDate: dateStringToISOString(values.startDate),
        endDate: dateStringToISOString(values.endDate),
        startRegistrationAt: dateStringToISOString(values.startRegistrationAt),
        endRegistrationAt: dateStringToISOString(values.endRegistrationAt),
        achievedPosition: values.achievedPosition,
      });
      toast.success("Tạo khóa học thành công!");
      console.debug("Tạo khóa học thành công");
      resetForm();
    } catch (err) {
      toast.error("Tạo khóa học thất bại!");
      console.debug("Tạo khóa học thất bại:", err);
    }
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValues}
      validationSchema={courseSchema}
      onSubmit={handleCreateCourseSubmit}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => {
        return (
          <Box m="20px" component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <PageTitle
                  title="TẠO KHÓA ĐÀO TẠO THUYỀN VIÊN"
                  subtitle="Tạo các khóa đào tạo thuyền viên mới"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty || isCreating}
                    sx={{
                      width: "10%",
                      padding: 1,
                      color: Color.PrimaryBlack,
                      backgroundColor: Color.PrimaryGold,
                      minWidth: 130,
                    }}
                  >
                    {isCreating ? (
                      <CircularProgress size={24} color={Color.PrimaryBlack} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <SaveIcon sx={{ mr: 1, marginBottom: "1px" }} />
                        <Typography fontWeight={700}>Tạo</Typography>
                      </Box>
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(-1)} // ⬅ QUAY LẠI
                    sx={{
                      width: "10%",
                      padding: 1,
                      color: Color.PrimaryWhite,
                      backgroundColor: Color.PrimaryBlue,
                      minWidth: 130,
                      mr: 2,
                    }}
                  >
                    <Typography fontWeight={700}>Quay lại</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin cơ sở đào tạo*: " />
            <Grid
              container
              sx={{
                horizontalAlign: "center",
                justifyContent: "center",
              }}
            >
              <Grid mr={8} size={1}>
                <LogoInput
                  id="institute-logo"
                  name="instituteLogo"
                  onClick={() =>
                    document.getElementById("institute-logo").click()
                  }
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="institute"
                  label="Đơn vị đào tạo"
                  size="small"
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
                  size="small"
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
            <SectionDivider sectionName="Thông tin khóa đào tạo*: " />
            <Grid container spacing={2} rowSpacing={4} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="course-name"
                  label="Tên khóa học"
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
                    touched.isCertificatedCourse && errors.isCertificatedCourse
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
                  size="small"
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
                <ImageUploadField
                  id="course-wallpaper"
                  name="courseWallpaper"
                  width="100%"
                  height={250}
                  onClick={() =>
                    document.getElementById("course-wallpaper").click()
                  }
                />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    </Formik>
  );
};

export default CreateCourse;
