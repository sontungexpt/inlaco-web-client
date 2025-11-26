import React, { useEffect, useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
} from "../components/global";
import { CardPhotoInput } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// import SaveIcon from "@mui/icons-material/Save";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
// import * as yup from "yup";
// import { useNavigate, useParams } from "react-router";
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import { getProfileCurrentCrewMemberAPI } from "../services/crewServices";
import { isoStringToDateString } from "../utils/ValueConverter";

const CrewProfile = () => {
  // const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfileCurrentCrewMemberAPI();
        await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

        if (response.status === HttpStatusCodes.OK) {
          console.log("Current profile: ", response.data);
          setProfile(response.data);
        } else {
          console.log("Error fetching current profile: ", response);
        }
      } catch (err) {
        console.log("Error fetching current profile: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const paymentStatus = ["Đã thanh toán", "Chưa thanh toán"];

  const genders = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const initialValues = {
    cardPhoto: "",
    fullName: profile?.fullName || "",
    dob: profile?.birthDate ? isoStringToDateString(profile?.birthDate) : "",
    gender: profile?.gender || "OTHER",
    address: profile?.address || "",
    phoneNumber: profile?.phoneNumber || "",
    email: profile?.email || "",
    languageSkills:
      profile?.languageSkills && profile?.languageSkills[0] !== null
        ? profile?.languageSkills[0]
        : "",

    jobInfo: {
      position: profile?.professionalPosition || "",
      experience:
        profile?.experience && profile?.experience[0] !== null
          ? profile?.experience[0]
          : "",
      expertiseLevels:
        profile?.expertiseLevels && profile?.expertiseLevels[0] !== null
          ? profile?.expertiseLevels[0]
          : "",
    },

    insuranceInfo: {
      socialInsID: profile?.socialInsuranceCode || "",
      socialInsImage: "",

      accidentInsID: profile?.accidentInsuranceCode || "",
      accidentInsImage: "",

      healthInsID: "",
      healthInsImage: "",
      healthInsHospital: "",
    },
  };

  // const phoneRegex =
  //   "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";
  // const ciNumberRegex = "^\\d{12}$";

  // const profilesSchema = yup.object().shape({
  //   fullName: yup.string().required("Họ và tên không được để trống"),
  //   dob: yup
  //     .date()
  //     .max(new Date(), "Ngày sinh không hợp lệ")
  //     .required("Ngày sinh không được để trống"),

  //   ciNumber: yup
  //     .string()
  //     .matches(ciNumberRegex, "Số CCCD không hợp lệ")
  //     .required("Số căn cước công dân không được để trống"),

  //   gender: yup.string().required("Vui lòng chọn giới tính"),
  //   address: yup.string().required("Địa chỉ không được để trống"),

  //   phoneNumber: yup
  //     .string()
  //     .matches(phoneRegex, "SĐT không hợp lệ")
  //     .required("SĐT không được để trống"),

  //   email: yup
  //     .string()
  //     .email("Email không hợp lệ")
  //     .required("Email không được để trống"),

  //   jobInfo: yup.object().shape({
  //     startDate: yup
  //       .date()
  //       .max(new Date(), "Ngày bắt đầu không hợp lệ")
  //       .required("Ngày bắt đầu không được để trống")
  //       .test(
  //         "is-before-end-date",
  //         "Ngày bắt đầu phải trước ngày kết thúc",
  //         function (value) {
  //           const { endDate } = this.parent; // Access sibling field endDate
  //           return !endDate || value < endDate;
  //         }
  //       ),

  //     endDate: yup
  //       .date()
  //       .required("Ngày kết thúc không được để trống")
  //       .test(
  //         "is-after-start-date",
  //         "Ngày kết thúc phải sau ngày bắt đầu",
  //         function (value) {
  //           const { startDate } = this.parent; // Access sibling field startDate
  //           return !startDate || value > startDate;
  //         }
  //       ),

  //     workingLocation: yup
  //       .string()
  //       .required("Địa điểm làm việc không được để trống"),
  //     position: yup.string().required("Vị trí chuyên môn không được để trống"),
  //     jobDescription: yup
  //       .string()
  //       .required("Mô tả công việc không được để trống"),
  //   }),

  //   insuranceInfo: yup.object().shape({
  //     // BHXH:
  //     socialInsStartDate: yup
  //       .date()
  //       .max(new Date(), "Ngày bắt đầu không hợp lệ")
  //       .test(
  //         "is-before-end-date",
  //         "Ngày bắt đầu phải trước ngày kết thúc",
  //         function (value) {
  //           const { socialInsEndDate } = this.parent; // Access sibling field socialInsEndDate
  //           return !socialInsEndDate || value < socialInsEndDate;
  //         }
  //       ),
  //     socialInsEndDate: yup
  //       .date()
  //       .test(
  //         "is-after-start-date",
  //         "Ngày kết thúc phải sau ngày bắt đầu",
  //         function (value) {
  //           const { socialInsStartDate } = this.parent; // Access sibling field socialInsStartDate
  //           return !socialInsStartDate || value > socialInsStartDate;
  //         }
  //       ),
  //     // BHTN:
  //     accidentInsStartDate: yup
  //       .date()
  //       .max(new Date(), "Ngày bắt đầu không hợp lệ")
  //       .test(
  //         "is-before-end-date",
  //         "Ngày bắt đầu phải trước ngày kết thúc",
  //         function (value) {
  //           const { accidentInsEndDate } = this.parent; // Access sibling field accidentInsEndDate
  //           return !accidentInsEndDate || value < accidentInsEndDate;
  //         }
  //       ),
  //     accidentInsEndDate: yup
  //       .date()
  //       .test(
  //         "is-after-start-date",
  //         "Ngày kết thúc phải sau ngày bắt đầu",
  //         function (value) {
  //           const { accidentInsStartDate } = this.parent; // Access sibling field accidentInsStartDate
  //           return !accidentInsStartDate || value > accidentInsStartDate;
  //         }
  //       ),
  //     // BHYT:
  //     healthInsStartDate: yup
  //       .date()
  //       .max(new Date(), "Ngày bắt đầu không hợp lệ")
  //       .test(
  //         "is-before-end-date",
  //         "Ngày bắt đầu phải trước ngày kết thúc",
  //         function (value) {
  //           const { healthInsEndDate } = this.parent; // Access sibling field healthInsEndDate
  //           return !healthInsEndDate || value < healthInsEndDate;
  //         }
  //       ),
  //     healthInsEndDate: yup
  //       .date()
  //       .test(
  //         "is-after-start-date",
  //         "Ngày kết thúc phải sau ngày bắt đầu",
  //         function (value) {
  //           const { healthInsStartDate } = this.parent; // Access sibling field healthInsStartDate
  //           return !healthInsStartDate || value > healthInsStartDate;
  //         }
  //       ),
  //   }),
  // });

  //   const [isEditable, setIsEditable] = useState(false);

  //   const handleEditClick = () => {
  //     setIsEditable(true);
  //   };

  //   const handleCancelClick = () => {
  //     setIsEditable(false);
  //   };

  //   const handleSaveCrewMemberSubmit = async (values) => {
  //     try {
  //       //Calling API to create a new crew member
  //       await new Promise((resolve) => setTimeout(resolve, 2000)); //Mock API call

  //       console.log("Successfully saving update: ", values);
  //       setIsEditable(false);
  //     } catch (err) {
  //       console.log("Error when saving crew member info update: ", err);
  //     }
  //   };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        // validationSchema={profilesSchema}
        // onSubmit={handleSaveCrewMemberSubmit}
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
        }) => (
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
                  title="HỒ SƠ THUYỀN VIÊN"
                  subtitle={`Mã thuyền viên: ${profile.cardId}`} //Change this to the actual crew ID, this currently display an id, not crewID
                />
                {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    marginRight: 2,
                  }}
                >
                  {isEditable ? (
                    <>
                      <Button
                        variant="outlined"
                        sx={{
                          color: COLOR.primary_orange,
                          padding: "8px",
                          marginRight: 2,
                          borderColor: COLOR.primary_orange,
                        }}
                        onClick={handleCancelClick}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <DeleteForeverRoundedIcon
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: "2px",
                              marginBottom: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            Hủy
                          </Typography>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        type={"submit"}
                        disabled={!isValid || !dirty}
                        sx={{
                          color: COLOR.primary_white,
                          backgroundColor: COLOR.primary_blue,
                          padding: "10px",
                          marginTop: "1px",
                          marginBottom: "1px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <SaveIcon
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: "2px",
                              marginBottom: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            Lưu
                          </Typography>
                        </Box>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      type={"button"}
                      sx={{
                        color: COLOR.primary_black,
                        backgroundColor: COLOR.primary_gold,
                        padding: "10px",
                        marginTop: "1px",
                        marginBottom: "1px",
                      }}
                      onClick={handleEditClick}
                    >
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <EditIcon
                          sx={{
                            width: 20,
                            height: 20,
                            marginRight: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: COLOR.primary_black,
                          }}
                        >
                          Chỉnh sửa
                        </Typography>
                      </Box>
                    </Button>
                  )}
                </Box> */}
              </Box>
              <CardPhotoInput
                id="card-photo"
                name="cardPhoto"
                disabled={true}
                sx={{ marginRight: "10px" }}
                onClick={() => document.getElementById("card-photo").click()}
              />
            </Box>
            <SectionDivider my={3} sectionName="Thông tin cá nhân*: " sx={{}} />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={5}>
                <InfoTextField
                  id="full-name"
                  label="Họ và tên"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="fullName"
                  value={values.fullName}
                  error={!!touched.fullName && !!errors.fullName}
                  helperText={
                    touched.fullName && errors.fullName ? errors.fullName : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  type="date"
                  id="dob"
                  label="Ngày sinh"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="dob"
                  value={values.dob}
                  error={!!touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  select
                  id="gender"
                  label="Giới tính"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="gender"
                  value={values.gender}
                  error={!!touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </InfoTextField>
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="phoneNumber"
                  value={values.phoneNumber}
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="address"
                  value={values.address}
                  error={!!touched.address && !!errors.address}
                  helperText={
                    touched.address && errors.address ? errors.address : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="email"
                  label="Email"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="email"
                  value={values.email}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="language-skills"
                  label="Trình độ ngoại ngữ"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="languageSkills"
                  value={values.languageSkills}
                  error={!!touched.languageSkills && !!errors.languageSkills}
                  helperText={touched.languageSkills && errors.languageSkills}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Thông tin công việc: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="position"
                  label="Vị trí chuyên môn"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="jobInfo.position"
                  value={values.jobInfo?.position}
                  error={
                    !!touched.jobInfo?.position && !!errors.jobInfo?.position
                  }
                  helperText={
                    touched.jobInfo?.position && errors.jobInfo?.position
                      ? errors.jobInfo?.position
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="experience"
                  label="Số năm kinh nghiệm"
                  size="small"
                  type="number"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="jobInfo.experience"
                  value={values.jobInfo?.experience}
                  error={
                    !!touched.jobInfo?.experience &&
                    !!errors.jobInfo?.experience
                  }
                  helperText={
                    touched.jobInfo?.experience && errors.jobInfo?.experience
                      ? errors.jobInfo?.experience
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">năm</InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="expertise-levels"
                  label="Bằng cấp chuyên môn"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="jobInfo.expertiseLevels"
                  value={values.jobInfo?.expertiseLevels}
                  error={
                    !!touched.jobInfo?.expertiseLevels &&
                    !!errors.jobInfo?.expertiseLevels
                  }
                  helperText={
                    touched.jobInfo?.expertiseLevels &&
                    errors.jobInfo?.expertiseLevels
                      ? errors.jobInfo?.expertiseLevels
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Thông tin Bảo hiểm: " />
            {/* BHXH */}
            <Typography
              sx={{
                mt: 1,
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              1. Bảo hiểm Xã hội:
            </Typography>
            <Grid container spacing={4} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4} sx={{ display: "flex", alignItems: "end" }}>
                <InfoTextField
                  // id=""
                  label="Mã số BHXH"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="insuranceInfo.socialInsID"
                  value={values.insuranceInfo?.socialInsID}
                  error={
                    !!touched.insuranceInfo?.socialInsID &&
                    !!errors.insuranceInfo?.socialInsID
                  }
                  helperText={
                    touched.insuranceInfo?.socialInsID &&
                    errors.insuranceInfo?.socialInsID
                      ? errors.insuranceInfo?.socialInsID
                      : ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ marginBottom: 0 }}
                />
              </Grid>
              <Grid size={8}>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Typography
                    mr={2}
                    sx={{
                      color: COLOR.primary_black_placeholder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHXH hoặc tra cứu BHXH:{" "}
                  </Typography>
                  <HorizontalImageInput
                    disabled={true}
                    id="social-ins-image"
                    name="insuranceInfo.socialInsImage"
                    onClick={() =>
                      document.getElementById("social-ins-image").click()
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            {/* BHTN */}
            <Typography
              sx={{
                mt: 3,
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              2. Bảo hiểm Tai nạn:
            </Typography>
            <Grid container spacing={4} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4} sx={{ display: "flex", alignItems: "end" }}>
                <InfoTextField
                  // id=""
                  label="Mã số BHTN"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="insuranceInfo.accidentInsID"
                  value={values.insuranceInfo?.accidentInsID}
                  error={
                    !!touched.insuranceInfo?.accidentInsID &&
                    !!errors.insuranceInfo?.accidentInsID
                  }
                  helperText={
                    touched.insuranceInfo?.accidentInsID &&
                    errors.insuranceInfo?.accidentInsID
                      ? errors.insuranceInfo?.accidentInsID
                      : ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ marginBottom: 0 }}
                />
              </Grid>
              <Grid size={8}>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Typography
                    mr={2}
                    sx={{
                      color: COLOR.primary_black_placeholder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHTN hoặc tra cứu BHTN:{" "}
                  </Typography>
                  <HorizontalImageInput
                    disabled={true}
                    id="accident-ins-image"
                    name="insuranceInfo.accidentInsImage"
                    onClick={() =>
                      document.getElementById("accident-ins-image").click()
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            {/* BHYT */}
            <Typography
              sx={{
                mt: 3,
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              3. Bảo hiểm Y tế:
            </Typography>
            <Grid container spacing={4} mx={2} rowSpacing={2} pt={2}>
              <Grid size={4} sx={{ display: "flex", alignItems: "end" }}>
                <InfoTextField
                  // id=""
                  label="Mã số BHYT"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="insuranceInfo.healthInsID"
                  value={values.insuranceInfo?.healthInsID}
                  error={
                    !!touched.insuranceInfo?.healthInsID &&
                    !!errors.insuranceInfo?.healthInsID
                  }
                  helperText={
                    touched.insuranceInfo?.healthInsID &&
                    errors.insuranceInfo?.healthInsID
                      ? errors.insuranceInfo?.healthInsID
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={8}>
                <InfoTextField
                  // id="salary-review-period"
                  label="Nơi đăng ký khám chữa bệnh ban đầu"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="insuranceInfo.healthInsHospital"
                  value={values.insuranceInfo?.healthInsHospital}
                  error={
                    !!touched.insuranceInfo?.healthInsHospital &&
                    !!errors.insuranceInfo?.healthInsHospital
                  }
                  helperText={
                    touched.insuranceInfo?.healthInsHospital &&
                    errors.insuranceInfo?.healthInsHospital
                      ? errors.insuranceInfo?.healthInsHospital
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={8}>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Typography
                    mr={2}
                    sx={{
                      color: COLOR.primary_black_placeholder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHYT hoặc tra cứu BHYT:{" "}
                  </Typography>
                  <HorizontalImageInput
                    disabled={true}
                    id="health-ins-image"
                    name="insuranceInfo.healthInsImage"
                    onClick={() =>
                      document.getElementById("health-ins-image").click()
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CrewProfile;
