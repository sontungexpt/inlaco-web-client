import React, { useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  MultilineFileUploadField,
} from "../components/global";
import { CardPhotoInput, FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router";
import { applyRecruitmentAPI } from "../services/postServices";
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import { dateStringToISOString } from "../utils/ValueConverter";

const ApplyRecruitment = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const genders = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const initialValues = {
    fullName: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    email: "",
    permanentAddr: "",
    languageSkills: [],
    cvFile: "",
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";

  const applicationSchema = yup.object().shape({
    fullName: yup.string().required("Họ và tên không được để trống"),

    dob: yup
      .date()
      .max(new Date(), "Ngày sinh không hợp lệ")
      .required("Ngày sinh không được để trống"),

    gender: yup.string().required("Giới tính không được để trống"),
    phoneNumber: yup
      .string()
      .matches(phoneRegex, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),

    permanentAddr: yup.string().required("Địa chỉ không được để trống"),

    // cvFile: yup
    //   .mixed()
    //   .required("Vui lòng tải lên CV")
  });

  const [loading, isLoading] = useState(false);

  const handleApplySubmit = async (values, { resetForm }) => {
    isLoading(true);
    try {
      //Calling API to create a new crew member
      // const tempFile = {
      //   file: URL.createObjectURL(values.cvFile),
      //   name: values.cvFile.name,
      //   type: values.cvFile.type,
      // };
      const response = await applyRecruitmentAPI(id, {
        birthDate: dateStringToISOString(values.dob),
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        address: values.permanentAddr,
        languageSkills: [values.languageSkills],
        // resume: tempFile,
      });
      await new Promise((resolve) => setTimeout(resolve, 400)); //Delay for 0.4s to simulate API call

      if (response.status === HttpStatusCodes.CREATED) {
        resetForm();
        navigate("/recruitment");
      }
    } catch (err) {
      console.log("Error when submitting application for a recruitment: ", err);
    } finally {
      isLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={applicationSchema}
        onSubmit={handleApplySubmit}
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
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <PageTitle
                    title="NỘP HỒ SƠ ỨNG TUYỂN"
                    subtitle={`Bài đăng tuyển dụng: ${id}`} //Change this to the actual recruitmentID
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty}
                    sx={{
                      width: "12%",
                      padding: 1,
                      color: COLOR.primary_black,
                      backgroundColor: COLOR.primary_gold,
                      minWidth: 130,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color={COLOR.primary_black} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <SendRoundedIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>
                          Nộp đơn
                        </Typography>
                      </Box>
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin ứng viên: " />
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
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="dob"
                  type="date"
                  label="Ngày sinh"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="dob"
                  value={values.dob}
                  error={!!touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob ? errors.dob : " "}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                  slotProps={{
                    input: {
                      placeholder: "asjdbnaskjd",
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="phoneNumber"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="phoneNumber"
                  value={values.phoneNumber}
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={
                    touched.phoneNumber && errors.phoneNumber
                      ? errors.phoneNumber
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="permanent-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="permanentAddr"
                  value={values.permanentAddr}
                  error={!!touched.permanentAddr && !!errors.permanentAddr}
                  helperText={
                    touched.permanentAddr && errors.permanentAddr
                      ? errors.permanentAddr
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
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
              <Grid size={4}>
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
                  helperText={
                    touched.email && errors.email ? errors.email : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="language-skills"
                  label="Trình độ ngoại ngữ (liệt kê nếu có)"
                  size="small"
                  margin="none"
                  fullWidth
                  name="languageSkills"
                  value={values.languageSkills}
                  error={!!touched.languageSkills && !!errors.languageSkills}
                  helperText={
                    touched.languageSkills && errors.languageSkills
                      ? errors.languageSkills
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="CV đính kèm*: " />
            <FileUploadField
              label="Tải lên CV"
              name="cvFile"
              sx={{ justifyContent: "start", marginLeft: 2 }}
            />
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default ApplyRecruitment;
