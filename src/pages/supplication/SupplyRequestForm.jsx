import React from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import { Formik } from "formik";

import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";

import {
  PageTitle,
  SectionWrapper,
  InfoTextField,
  FileUploadFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
} from "@/components/common";

import Color from "@constants/Color";

const SHARED_SX = {
  "& .MuiInputBase-input.Mui-disabled": {
    color: Color.PrimaryBlack,
  },
  "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
    borderColor: Color.PrimaryBlack,
  },
};

const SupplyRequestForm = ({
  title,
  subtitle,
  initialValues,
  validationSchema,
  onSubmit,
  submitLabel = "Gửi yêu cầu",
  submittingLabel = "Đang gửi...",
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
            mb={4}
          >
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
            >
              {isSubmitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress
                    size={18}
                    sx={{ color: Color.PrimaryBlack }}
                  />
                  <Typography fontWeight={600}>{submittingLabel}</Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ScheduleSendRoundedIcon />
                  <Typography fontWeight={700}>{submitLabel}</Typography>
                </Stack>
              )}
            </Button>
          </Box>

          {/* ===== COMPANY INFO ===== */}
          <SectionWrapper title="Thông tin công ty">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextField
                  label="Tên công ty"
                  required
                  fullWidth
                  name="companyName"
                  value={values.companyName}
                  error={!!touched.companyName && !!errors.companyName}
                  helperText={touched.companyName && errors.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>

              <Grid size={5}>
                <InfoTextField
                  label="Địa chỉ"
                  required
                  fullWidth
                  name="companyAddress"
                  value={values.companyAddress}
                  error={!!touched.companyAddress && !!errors.companyAddress}
                  helperText={touched.companyAddress && errors.companyAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  label="Số điện thoại"
                  required
                  fullWidth
                  name="companyPhone"
                  value={values.companyPhone}
                  error={!!touched.companyPhone && !!errors.companyPhone}
                  helperText={touched.companyPhone && errors.companyPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  label="Email"
                  required
                  fullWidth
                  name="companyEmail"
                  value={values.companyEmail}
                  error={!!touched.companyEmail && !!errors.companyEmail}
                  helperText={touched.companyEmail && errors.companyEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>

              <Grid size={5}>
                <InfoTextField
                  label="Người đại diện"
                  required
                  fullWidth
                  name="companyRepresentor"
                  value={values.companyRepresentor}
                  error={
                    !!touched.companyRepresentor && !!errors.companyRepresentor
                  }
                  helperText={
                    touched.companyRepresentor && errors.companyRepresentor
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  label="Chức vụ"
                  required
                  fullWidth
                  name="companyRepresentorPosition"
                  value={values.companyRepresentorPosition}
                  error={
                    !!touched.companyRepresentorPosition &&
                    !!errors.companyRepresentorPosition
                  }
                  helperText={
                    touched.companyRepresentorPosition &&
                    errors.companyRepresentorPosition
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== REQUEST INFO ===== */}
          <SectionWrapper title="Thông tin yêu cầu">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextField
                  type="datetime-local"
                  label="Thời gian bắt đầu thuê"
                  required
                  fullWidth
                  name="rentalStartDate"
                  value={values.rentalStartDate}
                  error={!!touched.rentalStartDate && !!errors.rentalStartDate}
                  helperText={touched.rentalStartDate && errors.rentalStartDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  type="datetime-local"
                  label="Thời gian kết thúc thuê"
                  required
                  fullWidth
                  name="rentalEndDate"
                  value={values.rentalEndDate}
                  error={!!touched.rentalEndDate && !!errors.rentalEndDate}
                  helperText={touched.rentalEndDate && errors.rentalEndDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={12}>
                <FileUploadFieldFormik
                  required
                  accept=".doc,.docx,.pdf,.xls,.xlsx"
                  label="Danh sách số lượng cần cung ứng"
                  name="detailFile"
                  helperText={touched.detailFile && errors.detailFile}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SHIP INFO ===== */}
          <SectionWrapper title="Thông tin tàu">
            <Grid container spacing={3}>
              <Grid size={6}>
                <ImageUploadFieldFormik
                  required
                  name="shipInfo.image"
                  helperText={touched.shipInfo?.image && errors.shipInfo?.image}
                />
              </Grid>

              <Grid size={6} container direction="column" rowSpacing={3}>
                <InfoTextField
                  label="IMO"
                  name="shipInfo.IMONumber"
                  value={values.shipInfo?.IMONumber}
                  error={
                    !!touched.shipInfo?.IMONumber &&
                    !!errors.shipInfo?.IMONumber
                  }
                  helperText={
                    touched.shipInfo?.IMONumber && errors.shipInfo?.IMONumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />

                <InfoTextField
                  label="Tên tàu"
                  name="shipInfo.name"
                  value={values.shipInfo?.name}
                  error={!!touched.shipInfo?.name && !!errors.shipInfo?.name}
                  helperText={touched.shipInfo?.name && errors.shipInfo?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />

                <NationalityTextField
                  label="Quốc tịch"
                  name="shipInfo.countryISO"
                  value={values.shipInfo?.countryISO}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />

                <InfoTextField
                  label="Loại tàu"
                  name="shipInfo.type"
                  value={values.shipInfo?.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
                />

                <InfoTextField
                  label="Mô tả"
                  name="shipInfo.description"
                  value={values.shipInfo?.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={SHARED_SX}
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
