import React, { useEffect, useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  ImageUploadField,
} from "@components/global";
import { CardPhotoInput } from "@components/contract";
import {
  Box,
  Button,
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router";
import HttpStatusCode from "../constants/HttpStatusCode";
import {
  getCrewMemberByID_API,
  editCrewMemberProfileAPI,
} from "../services/crewServices";
import {
  isoStringToDateString,
  dateStringToISOString,
} from "../utils/converter";

const CrewMemberDetail = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const official = location.state?.official;
  //
  const [crewMemberInfo, setCrewMemberInfo] = useState({});

  const fetchCrewMemberInfos = async (crewMemberID) => {
    setLoading(true);
    try {
      const response = await getCrewMemberByID_API(crewMemberID);
      await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

      if (response.status === HttpStatusCode.OK) {
        console.log("Successfully fetching crew member info: ", response.data);
        setCrewMemberInfo(response.data);
      } else {
        console.log("Error when fetching crew member info");
      }
    } catch (err) {
      console.log("Error when fetching crew member info: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewMemberInfos(id);
  }, []);

  const genders = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const initialValues = {
    cardPhoto: "",
    fullName: crewMemberInfo?.fullName || "",
    dob: crewMemberInfo?.birthDate
      ? isoStringToDateString(crewMemberInfo?.birthDate)
      : "",
    gender: crewMemberInfo?.gender || "OTHER",
    address: crewMemberInfo?.address || "",
    phoneNumber: crewMemberInfo?.phoneNumber || "",
    email: crewMemberInfo?.email || "",
    languageSkills:
      crewMemberInfo?.languageSkills &&
      crewMemberInfo?.languageSkills[0] !== null
        ? crewMemberInfo?.languageSkills[0]
        : "",

    jobInfo: {
      position: crewMemberInfo?.professionalPosition || "",
      experience:
        crewMemberInfo?.experience && crewMemberInfo?.experience[0] !== null
          ? crewMemberInfo?.experience[0]
          : "",
      expertiseLevels:
        crewMemberInfo?.expertiseLevels &&
        crewMemberInfo?.expertiseLevels[0] !== null
          ? crewMemberInfo?.expertiseLevels[0]
          : "",
    },

    insuranceInfo: {
      socialInsID: crewMemberInfo?.socialInsuranceCode || "",
      socialInsImage: "",

      accidentInsID: crewMemberInfo?.accidentInsuranceCode || "",
      accidentInsImage: "",

      healthInsID: "",
      healthInsImage: "",
      healthInsHospital: "",
    },
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";

  const crewMemberInfosSchema = yup.object().shape({
    fullName: yup.string().required("Họ và tên không được để trống"),
    dob: yup
      .date()
      .max(new Date(), "Ngày sinh không hợp lệ")
      .required("Ngày sinh không được để trống"),

    gender: yup.string().required("Vui lòng chọn giới tính"),
    address: yup.string().required("Địa chỉ không được để trống"),

    phoneNumber: yup
      .string()
      .matches(phoneRegex, "SĐT không hợp lệ")
      .required("SĐT không được để trống"),

    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleSaveCrewMemberSubmit = async (values) => {
    try {
      //Calling API to create a new crew member
      const response = await editCrewMemberProfileAPI(id, values);
      // await new Promise((resolve) => setTimeout(resolve, 2000)); //Mock API call
      console.log(response);
      if (response.status === HttpStatusCode.OK) {
        await fetchCrewMemberInfos(id);
        setIsEditable(false);
        // console.log("Successfully saving update: ", values);
      } else {
        console.log("Error when saving crew member info update");
      }
    } catch (err) {
      console.log("Error when saving crew member info update: ", err);
    }
  };

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
        validationSchema={crewMemberInfosSchema}
        onSubmit={handleSaveCrewMemberSubmit}
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
                  title="CHI TIẾT THUYỀN VIÊN"
                  subtitle={
                    official
                      ? `Thuyền viên chính thức: ${id}`
                      : "Thuyền viên chưa chính thức (đang chờ kí hợp đồng)"
                  }
                />
                <Box
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
                          color: COLOR.PrimaryOrgange,
                          padding: "8px",
                          marginRight: 2,
                          borderColor: COLOR.PrimaryOrgange,
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
                          color: COLOR.PrimaryWhite,
                          backgroundColor: COLOR.PrimaryBlue,
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
                        color: COLOR.PrimaryBlack,
                        backgroundColor: COLOR.PrimaryGold,
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
                            color: COLOR.PrimaryBlack,
                          }}
                        >
                          Chỉnh sửa
                        </Typography>
                      </Box>
                    </Button>
                  )}
                </Box>
              </Box>
              <CardPhotoInput
                id="card-photo"
                name="cardPhoto"
                disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
              {official ? (
                <>
                  <Grid size={4}>
                    <InfoTextField
                      id="position"
                      label="Vị trí chuyên môn"
                      size="small"
                      margin="none"
                      disabled={!isEditable}
                      fullWidth
                      name="jobInfo.position"
                      value={values.jobInfo?.position}
                      error={
                        !!touched.jobInfo?.position &&
                        !!errors.jobInfo?.position
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
                      disabled={!isEditable}
                      fullWidth
                      name="jobInfo.experience"
                      value={values.jobInfo?.experience}
                      error={
                        !!touched.jobInfo?.experience &&
                        !!errors.jobInfo?.experience
                      }
                      helperText={
                        touched.jobInfo?.experience &&
                        errors.jobInfo?.experience
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
                      disabled={!isEditable}
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
                </>
              ) : (
                <Grid sx={{ padding: 4 }} size={12}>
                  <Typography
                    sx={{ textAlign: "center", color: COLOR.PrimaryBlack }}
                  >
                    <span
                      style={{
                        fontStyle: "italic",
                        color: COLOR.PrimaryGray,
                        textDecoration: "underline",
                      }}
                    >
                      Thông tin công việc
                    </span>{" "}
                    sẽ được thêm sau khi{" "}
                    <span
                      style={{
                        fontStyle: "italic",
                        color: COLOR.PrimaryGray,
                        textDecoration: "underline",
                      }}
                    >
                      Tạo hợp đồng
                    </span>
                  </Typography>
                </Grid>
              )}
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
                color: COLOR.PrimaryBlackPlaceHolder,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlackPlaceHolder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHXH hoặc tra cứu BHXH:{" "}
                  </Typography>
                  <ImageUploadField
                    disabled={!isEditable}
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
                color: COLOR.PrimaryBlackPlaceHolder,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlackPlaceHolder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHTN hoặc tra cứu BHTN:{" "}
                  </Typography>
                  <ImageUploadField
                    disabled={!isEditable}
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
                color: COLOR.PrimaryBlackPlaceHolder,
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlackPlaceHolder,
                      fontWeight: 700,
                    }}
                  >
                    Ảnh chụp BHYT hoặc tra cứu BHYT:{" "}
                  </Typography>
                  <ImageUploadField
                    disabled={!isEditable}
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

export default CrewMemberDetail;
