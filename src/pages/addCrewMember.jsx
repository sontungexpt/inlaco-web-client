import React, { useState } from "react";
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
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { COLOR } from "../assets/Color";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router";
import HttpStatusCode from "../constants/HttpStatusCode";
import { createCrMemberFrCandidateAPI } from "../services/crewServices";
import {
  dateStringToISOString,
  isoStringToDateString,
} from "../utils/ValueConverter";

const AddCrewMember = () => {
  const navigate = useNavigate();
  const { candidateID } = useParams();
  const location = useLocation();
  const candidateInfo = location.state?.candidateInfo;

  const genders = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];
  console.log("CandidateInfo: ", candidateInfo);

  const initialValues = {
    cardPhoto: "",
    fullName: candidateInfo?.fullName || "",
    dob: candidateInfo?.birthDate
      ? isoStringToDateString(candidateInfo?.birthDate)
      : "",
    gender: candidateInfo?.gender || "OTHER",
    address: candidateInfo?.address || "",
    phoneNumber: candidateInfo?.phoneNumber || "",
    email: candidateInfo?.email || "",
    languageSkills: candidateInfo?.languageSkills
      ? candidateInfo?.languageSkills[0]
      : "",

    insuranceInfo: {
      socialInsID: "",
      socialInsImage: "",

      accidentInsID: "",
      accidentInsImage: "",

      healthInsID: "",
      healthInsImage: "",
      healthInsHospital: "",
    },
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";
  // const ciNumberRegex = "^\\d{12}$";

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

  const [addCrewLoading, setAddCrewLoading] = useState(false);

  const handleCreateCrewMemberSubmit = async (values, { resetForm }) => {
    setAddCrewLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await createCrMemberFrCandidateAPI(candidateID, {
        birthDate: dateStringToISOString(values.dob),
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        gender: values.gender,
        socialInsuranceCode: values.insuranceInfo.socialInsID,
        accidentInsuranceCode: values.insuranceInfo.accidentInsID,
        //add more later
      });
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay for 200ms

      if (response.status === HttpStatusCode.CREATED) {
        console.log("Successfully adding new crew member");
        resetForm();
        navigate("/crews");
      } else {
        console.log("Failed to adding new crew member");
      }
    } catch (err) {
      console.log("Error when adding new crew member: ", err);
    } finally {
      setAddCrewLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={crewMemberInfosSchema}
        onSubmit={handleCreateCrewMemberSubmit}
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
                  title="THÊM THUYỀN VIÊN"
                  subtitle="Thêm thuyền viên mới vào hệ thống"
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isValid}
                  sx={{
                    width: "10%",
                    padding: 1,
                    color: COLOR.primary_black,
                    backgroundColor: COLOR.primary_gold,
                    minWidth: 130,
                  }}
                >
                  {addCrewLoading ? (
                    <CircularProgress size={24} color={COLOR.primary_black} />
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "end" }}>
                      <PersonAddIcon
                        sx={{ marginRight: "5px", marginBottom: "1px" }}
                      />
                      <Typography sx={{ fontWeight: 700 }}>Thêm</Typography>
                    </Box>
                  )}
                </Button>
              </Box>
              <CardPhotoInput
                id="card-photo"
                name="cardPhoto"
                sx={{ marginRight: "10px" }}
                onClick={() => document.getElementById("card-photo").click()}
              />
            </Box>
            <SectionDivider sectionName="Thông tin cá nhân*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={5}>
                <InfoTextField
                  id="full-name"
                  label="Họ và tên"
                  size="small"
                  margin="none"
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
            </Grid>
            <SectionDivider sectionName="Thông tin công việc: " />
            <Box sx={{ padding: 4 }}>
              <Typography
                sx={{ textAlign: "center", color: COLOR.primary_black }}
              >
                <span
                  style={{
                    fontStyle: "italic",
                    color: COLOR.primary_gray,
                    textDecoration: "underline",
                  }}
                >
                  Thông tin công việc
                </span>{" "}
                sẽ được thêm sau khi{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    color: COLOR.primary_gray,
                    textDecoration: "underline",
                  }}
                >
                  Tạo hợp đồng
                </span>
              </Typography>
            </Box>
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
                    Ảnh chụp BHYT hoặc tra cứu BHYT:{" "}
                  </Typography>
                  <HorizontalImageInput
                    id="health-ins-image"
                    name="insuranceInfo.healthInsImage"
                    onClick={() =>
                      document.getElementById("health-ins-image").click()
                    }
                  />
                </Box>
              </Grid>
              <Grid size={9}>
                <InfoTextField
                  // id="salary-review-period"
                  label="Nơi đăng ký khám chữa bệnh ban đầu"
                  size="small"
                  margin="none"
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
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default AddCrewMember;
