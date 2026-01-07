import React, { useMemo } from "react";
import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  EditableDataGrid,
} from "@components/common";
import { NationalityTextField } from "@components/common";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import { createMobilization } from "@/services/mobilizationServices";
import Color from "@constants/Color";
import { SCHEMA } from "./schema";
import { mapValuesToRequestBody } from "./mapper";
import { DEFAULT_INITIAL_VALUES } from "./defaults";

const MobiliaztionForm = () => {
  const navigate = useNavigate();

  const createEmptyRow = () => ({
    cardId: "",
    professionalPosition: "",
  });

  const handleFormSubmission = async (values, { resetForm }) => {
    try {
      const newMobilization = await createMobilization(
        mapValuesToRequestBody(values),
      );

      // resetForm();
      // navigate(`/mobilizations/${newMobilization.id}`);
    } catch (err) {
      console.error("Error when creating mobilization: ", err);
    }
  };

  const initialValues = useMemo(() => DEFAULT_INITIAL_VALUES, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SCHEMA}
      validateOnChange
      onSubmit={handleFormSubmission}
    >
      {({ handleSubmit, isValid, dirty, isSubmitting }) => (
        <Box component="form" onSubmit={handleSubmit} m={2}>
          {/* ================= HEADER ================= */}
          <SectionWrapper
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <PageTitle
              title="TẠO ĐIỀU ĐỘNG"
              subtitle="Tạo và lên kế hoạch cho các điều động mới"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || !dirty}
              sx={{
                minWidth: 140,
                fontWeight: 700,
                bgcolor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
              }}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
              }
            >
              Tạo
            </Button>
          </SectionWrapper>

          {/* ================= THÔNG TIN CHUNG ================= */}
          <SectionWrapper title="Thông tin chung">
            <Grid container spacing={2}>
              <Grid size={5}>
                <InfoTextFieldFormik
                  name="partnerName"
                  label="Điều động đến công ty"
                  fullWidth
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  name="partnerEmail"
                  label="Email công ty"
                  fullWidth
                />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  name="partnerPhone"
                  label="SĐT công ty"
                  fullWidth
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= LỊCH TRÌNH ================= */}
          <SectionWrapper title="Lịch trình dự kiến">
            <Grid container spacing={2}>
              <Grid size={6}>
                <InfoTextFieldFormik
                  name="startDate"
                  type="datetime-local"
                  label="Thời gian bắt đầu công việc"
                />
              </Grid>
              <Grid size={6}>
                <InfoTextFieldFormik
                  name="endDate"
                  type="datetime-local"
                  label="Thời gian kết thúc công việc"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= THÔNG TIN TÀU ================= */}
          <SectionWrapper title="Thông tin tàu">
            <Box display="flex" justifyContent="center" mb={2}>
              <ImageUploadFieldFormik
                name="shipInfo.imageUrl"
                width={300}
                height={180}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid size={2}>
                <InfoTextFieldFormik name="shipInfo.imonumber" label="IMO" />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik name="shipInfo.name" label="Tên tàu" />
              </Grid>

              <Grid size={2}>
                <NationalityTextField
                  name="shipInfo.countryISO"
                  label="Quốc tịch"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  name="shipInfo.shipType"
                  label="Loại tàu"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= CREW ================= */}
          <SectionWrapper>
            <EditableDataGrid
              title="Danh sách thuyền viên được điều động"
              createEmptyRow={createEmptyRow}
              buttonText="Thêm thuyền viên"
              name="crewMembers"
              columns={[
                {
                  field: "cardId",
                  headerName: "Số thẻ",
                  flex: 1,
                  editable: true,
                },
                {
                  field: "professionalPosition",
                  headerName: "Chức danh",
                  flex: 1,
                  editable: true,
                },
              ]}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default MobiliaztionForm;
