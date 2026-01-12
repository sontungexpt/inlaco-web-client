import React from "react";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { Formik } from "formik";

import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  FileUploadFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
} from "@/components/common";

import Color from "@constants/Color";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";

const SupplyRequestForm = ({
  title,
  subtitle,
  initialValues,
  validationSchema,
  onSubmit,
  submitLabel = "Gửi yêu cầu",
}) => {
  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
        <Box component="form" onSubmit={handleSubmit} m={3}>
          {/* ===== HEADER ===== */}
          <SectionWrapper display="flex" justifyContent="space-between" mb={4}>
            <PageTitle title={title} subtitle={subtitle} />

            <Button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              sx={{
                height: 44,
                px: 3,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: Color.PrimaryGold,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#9e9e9e",
                  boxShadow: "none",
                },
              }}
              startIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: Color.PrimaryBlack }}
                  />
                ) : (
                  <ScheduleSendRoundedIcon />
                )
              }
            >
              {submitLabel}
            </Button>
          </SectionWrapper>

          {/* ===== COMPANY INFO ===== */}
          <SectionWrapper title="Thông tin công ty">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextFieldFormik label="Tên công ty" name="companyName" />
              </Grid>

              <Grid size={5}>
                <InfoTextFieldFormik label="Địa chỉ" name="companyAddress" />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  label="Số điện thoại"
                  name="companyPhone"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik label="Email" name="companyEmail" />
              </Grid>

              <Grid size={5}>
                <InfoTextFieldFormik
                  label="Người đại diện"
                  name="companyRepresentor"
                />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  label="Chức vụ"
                  name="companyRepresentorPosition"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== REQUEST INFO ===== */}
          <SectionWrapper title="Thông tin yêu cầu">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Thời gian bắt đầu thuê"
                  name="rentalStartDate"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Thời gian kết thúc thuê"
                  name="rentalEndDate"
                />
              </Grid>

              <Grid size={12}>
                <FileUploadFieldFormik
                  required
                  accept=".doc,.docx,.pdf,.xls,.xlsx"
                  label="Danh sách số lượng cần cung ứng"
                  name="detailFile"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SHIP INFO ===== */}
          <SectionWrapper title="Thông tin tàu">
            <Grid container spacing={3}>
              <Grid size={6}>
                <ImageUploadFieldFormik required name="shipInfo.image" />
              </Grid>

              <Grid size={6} container direction="column" rowSpacing={3}>
                <InfoTextFieldFormik label="IMO" name="shipInfo.IMONumber" />

                <InfoTextFieldFormik label="Tên tàu" name="shipInfo.name" />

                <NationalityTextField
                  component={InfoTextFieldFormik}
                  label="Quốc tịch"
                  name="shipInfo.countryISO"
                />

                <InfoTextFieldFormik label="Loại tàu" name="shipInfo.type" />

                <InfoTextFieldFormik
                  label="Mô tả"
                  name="shipInfo.description"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default SupplyRequestForm;
