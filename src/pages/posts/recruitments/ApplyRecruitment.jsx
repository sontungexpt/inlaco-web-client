import React, { useState } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "@components/global";
import { FileUploadField } from "@components/contract";
import {
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Formik } from "formik";
import Color from "@constants/Color";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { applyRecruitment } from "@/services/postServices";
import Regex from "@/constants/Regex";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStragegy from "@/constants/UploadStragegy";
import toast from "react-hot-toast";

const ApplyRecruitment = () => {
  const navigate = useNavigate();
  const { recruitmentId } = useParams();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsPending(true);
    try {
      const uploadResponse = await cloudinaryUpload(
        values.cvFile,
        UploadStragegy.RESUME,
      );

      const candidate = await applyRecruitment(
        recruitmentId,
        {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          address: values.permanentAddr,
          languageSkills: values.languageSkills,
          experiences: values.experiences,
        },
        uploadResponse.public_id,
      );
      resetForm();
      console.log(candidate);
      navigate(`/recruitment/candidates/${candidate.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Ứng tuyển thất bại");
    }
    setIsPending(false);
  };

  const GENDERS = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const APPLICATION_SCHEMA = Yup.object().shape({
    fullName: Yup.string().required("Họ và tên không được để trống"),
    gender: Yup.string().required("Giới tính không được để trống"),
    phoneNumber: Yup.string()
      .matches(Regex.VN_PHONE, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    permanentAddr: Yup.string().required("Địa chỉ không được để trống"),
    cvFile: Yup.mixed()
      .required("Vui lòng tải lên CV")
      .test(
        "fileSize",
        "Dung lượng file tối đa 5MB",
        (value) => value && value.size <= 5 * 1024 * 1024,
      )
      .test(
        "fileType",
        "Chỉ chấp nhận file PDF, DOC hoặc DOCX",
        (value) =>
          value &&
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(value.type),
      ),
  });

  const initialValues = {
    fullName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    permanentAddr: "",
    languageSkills: "",
    experiences: "",
    cvFile: null,
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValues}
      validationSchema={APPLICATION_SCHEMA}
      onSubmit={handleSubmit}
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
                  subtitle={`Bài đăng tuyển dụng: ${recruitmentId}`} //Change this to the actual recruitmentID
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
                    color: Color.PrimaryBlack,
                    backgroundColor: Color.PrimaryGold,
                    minWidth: 130,
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={24} color={Color.PrimaryBlack} />
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "end" }}>
                      <SendRoundedIcon
                        sx={{ marginRight: "5px", marginBottom: "1px" }}
                      />
                      <Typography sx={{ fontWeight: 700 }}>Nộp đơn</Typography>
                    </Box>
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
          <SectionDivider sectionName="Thông tin ứng viên: " />
          <Grid container spacing={2} rowSpacing={1} pt={2}>
            <Grid size={6}>
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
                helperText={touched.fullName && errors.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
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
                helperText={touched.phoneNumber && errors.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
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
                {GENDERS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </InfoTextField>
            </Grid>

            <Grid size={6}>
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
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
                  },
                }}
              />
            </Grid>
            <Grid size={6}>
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
                helperText={touched.permanentAddr && errors.permanentAddr}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <InfoTextField
                id="language-skills"
                label="Trình độ ngoại ngữ (liệt kê nếu có)"
                size="small"
                margin="none"
                fullWidth
                name="languageSkills"
                value={values.languageSkills}
                error={!!touched.languageSkills && !!errors.languageSkills}
                helperText={touched.languageSkills && errors.languageSkills}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <InfoTextField
                id="experiences"
                label="Kinh nghiệm làm việc"
                size="small"
                margin="none"
                fullWidth
                name="experiences"
                value={values.experiences}
                error={!!touched.experiences && !!errors.experiences}
                helperText={touched.experiences && errors.experiences}
                rows={2}
                multiline={true}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: Color.PrimaryBlack,
                  },
                  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                    borderColor: Color.PrimaryBlack,
                  },
                }}
              />
            </Grid>
          </Grid>
          <SectionDivider sectionName="CV đính kèm*: " />
          <FileUploadField
            required
            id="cvFile"
            // label="Tải lên CV"
            name="cvFile"
            helperText={touched.cvFile && errors.cvFile}
          />
        </Box>
      )}
    </Formik>
  );
};

export default ApplyRecruitment;
