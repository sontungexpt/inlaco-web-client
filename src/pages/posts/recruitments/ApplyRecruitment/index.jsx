import React, {} from "react";
import {
  FileUploadFieldFormik,
  PageTitle,
  InfoTextFieldFormik,
  SectionWrapper,
} from "@components/common";
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
import { useNavigate, useParams } from "react-router";
import { applyRecruitment } from "@/services/postServices";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import { FORM_SCHEMA } from "./schema";
import { DEFAULT_INITIAL_VALUES } from "./defaults";
import { mapValuesToRequestBody } from "./mapper";

const ApplyRecruitment = () => {
  const navigate = useNavigate();
  const { recruitmentId } = useParams();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const uploadResponse = await cloudinaryUpload(
        values.cvFile,
        UploadStrategy.RESUME,
      );

      const candidate = await applyRecruitment(
        recruitmentId,
        mapValuesToRequestBody(values),
        uploadResponse.asset_id,
      );

      resetForm();
      navigate(`/recruitments/candidates/${candidate.id}`);
    } catch (error) {
      toast.error("Ứng tuyển thất bại");
    }
  };

  const GENDERS = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  return (
    <Formik
      validateOnChange={true}
      initialValues={DEFAULT_INITIAL_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleSubmit}
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
      }) => (
        <Box m="20px" component="form" onSubmit={handleSubmit}>
          <SectionWrapper
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <PageTitle
              title="NỘP HỒ SƠ ỨNG TUYỂN"
              subtitle={`Bài đăng tuyển dụng: ${recruitmentId}`} //Change this to the actual recruitmentID
            />
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
                disabled={!isValid || !dirty || isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={24} color={Color.PrimaryBlack} />
                  ) : (
                    <SendRoundedIcon />
                  )
                }
                sx={{
                  padding: 1,
                  color: Color.PrimaryBlack,
                  backgroundColor: Color.PrimaryGold,
                  minWidth: 130,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>Nộp đơn</Typography>
              </Button>
            </Box>
          </SectionWrapper>
          <SectionWrapper title="Thông tin ứng viên: ">
            <Grid container spacing={2} rowSpacing={1} pt={2}>
              <Grid size={6}>
                <InfoTextFieldFormik label="Họ và tên" name="fullName" />
              </Grid>
              <Grid size={4}>
                <InfoTextFieldFormik label="Số điện thoại" name="phoneNumber" />
              </Grid>
              <Grid size={2}>
                <InfoTextFieldFormik select label="Giới tính" name="gender">
                  {GENDERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </InfoTextFieldFormik>
              </Grid>

              <Grid size={6}>
                <InfoTextFieldFormik label="Email" name="email" />
              </Grid>
              <Grid size={6}>
                <InfoTextFieldFormik label="Địa chỉ" name="address" />
              </Grid>
              <Grid size={12}>
                <InfoTextFieldFormik
                  label="Trình độ ngoại ngữ (liệt kê nếu có)"
                  name="languageSkills"
                />
              </Grid>
              <Grid size={12}>
                <InfoTextFieldFormik
                  label="Kinh nghiệm làm việc"
                  name="experiences"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          <SectionWrapper title="CV đính kèm*: ">
            <FileUploadFieldFormik
              required
              name="cvFile"
              helperText={touched.cvFile && errors.cvFile}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default ApplyRecruitment;
