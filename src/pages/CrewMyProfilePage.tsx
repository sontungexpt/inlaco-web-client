import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { Formik } from "formik";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import * as Yup from "yup";
import {
  PageTitle,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  SectionWrapper,
  CenterCircularProgress,
  CloudinaryImage,
} from "@/components/common";
import Color from "@/constants/Color";
import { useCrewProfile } from "@/queries/crew-profile.query";
import {
  requiredString,
  dateMax,
  requiredVnPhoneNumber,
  requiredEmail,
} from "@/utils/validation/yupHelpers";

const GENDERS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

const FORM_SCHEMA = Yup.object().shape({
  fullName: requiredString("Họ và tên không được để trống"),
  dob: dateMax(new Date(), "Ngày sinh không hợp lệ"),
  gender: requiredString("Vui lòng chọn giới tính"),
  address: requiredString("Vui lòng nhập địa chỉ"),
  phoneNumber: requiredVnPhoneNumber(),
  email: requiredEmail(),
  languageSkills: Yup.string(),
});

export default function CrewMyProfilePage() {
  const { data: profile, isLoading } = useCrewProfile("me");

  const initialValues = useMemo(() => {
    return {
      fullName: profile?.fullName || "",
      dob: profile?.birthDate || "",
      gender: profile?.gender || "",
      address: profile?.address || "",
      phoneNumber: profile?.phoneNumber || "",
      email: profile?.email || "",
      languageSkills: profile?.languageSkills?.[0] || "",
      avatarUrl: profile?.avatarUrl || "",
    };
  }, [profile]);

  const handleFormSubmission = async (values, { setSubmitting }) => {
    try {
      // TODO: Call update profile API here
      console.log("Update profile:", values);
      // await crewProfileService.updateMyProfile({
      //   fullName: values.fullName,
      //   birthDate: values.dob,
      //   gender: values.gender,
      //   address: values.address,
      //   phoneNumber: values.phoneNumber,
      //   email: values.email,
      //   languageSkills: [values.languageSkills],
      // });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <CenterCircularProgress />;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={FORM_SCHEMA}
      validateOnChange
      validateOnBlur
      onSubmit={handleFormSubmission}
    >
      {({ handleSubmit, isSubmitting, dirty, isValid, values }) => (
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 2, py: 3 }}>
          {/* Page Header */}
          <SectionWrapper>
            <PageTitle
              title="Hồ Sơ Cá Nhân"
              subtitle={`Mã nhân viên: ${profile?.employeeCardId || "-"}`}
            />
          </SectionWrapper>

          {/* Avatar Section */}
          <SectionWrapper>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <Box sx={{ position: "relative", width: "fit-content" }}>
                  <CloudinaryImage
                    avatar
                    src={profile?.avatarUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: `3px solid ${Color.SecondaryBlue}`,
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                <ImageUploadFieldFormik
                  name="avatarUrl"
                  label="Thay đổi ảnh đại diện"
                  startIcon={<PhotoCameraIcon />}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  JPG, PNG tối đa 2MB
                </Typography>
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Personal Information Section */}
          <SectionWrapper title="Thông Tin Cá Nhân">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="fullName"
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="dob"
                  label="Ngày sinh"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="gender"
                  label="Giới tính"
                  select
                >
                  {GENDERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </InfoTextFieldFormik>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="0123 456 789"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="example@email.com"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoTextFieldFormik
                  name="languageSkills"
                  label="Trình độ ngoại ngữ"
                  placeholder="Ví dụ: Tiếng Anh cơ bản"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InfoTextFieldFormik
                  name="address"
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ đầy đủ"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Additional Information */}
          <SectionWrapper title="Thông Tin Bổ Sung">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Vị trí chuyên môn:</strong> {profile?.professionalPosition || "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Kinh nghiệm:</strong>{" "}
                  {profile?.experience?.[0]
                    ? `${profile?.experience[0]} năm`
                    : "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Trình độ học vấn:</strong> {profile?.educationLevel || "-"}
                </Typography>
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* Form Actions */}
          <SectionWrapper>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => window.history.back()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={isSubmitting || !dirty || !isValid}
                sx={{
                  bgcolor: Color.SecondaryBlue,
                  "&:hover": {
                    bgcolor: Color.SecondaryBlue,
                    opacity: 0.9,
                  },
                }}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
              </Button>
            </Box>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
}
