import React, { useMemo } from "react";
import {
  PageTitle,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  SectionWrapper,
} from "@components/common";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Color from "@constants/Color";

import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import { createCrMemberFrCandidateAPI } from "@/services/crewServices";
import { datetimeToISO } from "@utils/converter";
import { buildInitialValues } from "@/pages/mobilization/MobilizationForm/initial";
import { HttpStatusCode } from "axios";
import { FORM_SCHEMA } from "./schema";
import { useCrewProfile } from "@/hooks/services/crew";

export default function CrewProfileForm() {
  const navigate = useNavigate();
  const { candidateID } = useParams();

  // const { data: profile, isLoading } = useCrewProfile(candidateID);

  const GENDERS = useMemo(
    () => [
      { label: "Nam", value: "MALE" },
      { label: "Nữ", value: "FEMALE" },
      { label: "Khác", value: "OTHER" },
    ],
    [],
  );

  const initialValues = useMemo(() => buildInitialValues({}), []);

  const handleFormSubmission = async (values, { resetForm }) => {
    const response = await createCrMemberFrCandidateAPI(candidateID, {
      birthDate: datetimeToISO(values.dob),
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      gender: values.gender,
      socialInsuranceCode: values.insuranceInfo.socialInsID,
      accidentInsuranceCode: values.insuranceInfo.accidentInsID,
    });

    if (response.status === HttpStatusCode.Created) {
      resetForm();
      navigate("/crews");
    }
  };

  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleFormSubmission}
    >
      {({ isValid, dirty, isSubmitting, handleSubmit }) => (
        <Box m={3} component="form" onSubmit={handleSubmit}>
          {/* ===== HEADER ===== */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <PageTitle
              title="THÊM THUYỀN VIÊN"
              subtitle="Thêm thuyền viên mới vào hệ thống"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              sx={{
                color: Color.PrimaryBlack,
                backgroundColor: Color.PrimaryGold,
              }}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  <PersonAddIcon />
                )
              }
            >
              Cập nhật
            </Button>
          </Box>

          {/* ===== PERSONAL INFO ===== */}
          <SectionWrapper title="Thông tin cá nhân *">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <ImageUploadFieldFormik
                  label="Ảnh thuyền viên"
                  required
                  name="cardPhoto"
                />
              </Grid>
              <Grid container size={{ xs: 12, md: 9 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <InfoTextFieldFormik label="Họ và tên" name="fullName" />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoTextFieldFormik select label="Giới tính" name="gender">
                    {GENDERS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </InfoTextFieldFormik>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoTextFieldFormik
                    label="Số điện thoại"
                    name="phoneNumber"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoTextFieldFormik
                    type="date"
                    label="Ngày sinh"
                    name="dob"
                  />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik label="Địa chỉ" name="address" />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik label="Email" name="email" />
                </Grid>
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== JOB INFO ===== */}
          <SectionWrapper title="Thông tin công việc">
            <Typography
              align="center"
              sx={{ fontStyle: "italic", color: Color.PrimaryGray }}
            >
              Thông tin công việc sẽ được thêm sau khi <u>Tạo hợp đồng</u>
            </Typography>
          </SectionWrapper>

          {/* ===== INSURANCE INFO ===== */}
          <SectionWrapper title="Thông tin Bảo hiểm">
            {/* BHXH */}
            <Typography fontWeight={600} mb={1}>
              1. Bảo hiểm Xã hội
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid size={12}>
                <InfoTextFieldFormik
                  label="Mã số BHXH"
                  name="insuranceInfo.socialInsID"
                />
              </Grid>
              <Grid size={12}>
                <ImageUploadFieldFormik
                  required
                  label="Ảnh chụp BHXH / Tra cứu BHXH"
                  name="insuranceInfo.socialInsImage"
                />
              </Grid>
            </Grid>

            {/* BHTN */}
            <Typography fontWeight={600} mb={1}>
              2. Bảo hiểm Tai nạn
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid size={12}>
                <InfoTextFieldFormik
                  label="Mã số BHTN"
                  name="insuranceInfo.accidentInsID"
                />
              </Grid>
              <Grid size={12}>
                <ImageUploadFieldFormik
                  required
                  label="Ảnh chụp BHTN / Tra cứu BHTN"
                  name="insuranceInfo.accidentInsImage"
                />
              </Grid>
            </Grid>

            {/* BHYT */}
            <Typography fontWeight={600} mb={1}>
              3. Bảo hiểm Y tế
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoTextFieldFormik
                  label="Mã số BHYT"
                  name="insuranceInfo.healthInsID"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <InfoTextFieldFormik
                  label="Nơi đăng ký khám chữa bệnh ban đầu"
                  name="insuranceInfo.healthInsHospital"
                />
              </Grid>
              <Grid size={12}>
                <ImageUploadFieldFormik
                  required
                  label="Ảnh chụp BHYT / Tra cứu BHYT"
                  name="insuranceInfo.healthInsImage"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
}
