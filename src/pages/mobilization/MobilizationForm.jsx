import React, { useState } from "react";
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
import * as yup from "yup";
import { useNavigate } from "react-router";
import { createMobilizationAPI } from "@/services/mobilizationServices";
import HttpStatusCode from "@constants/HttpStatusCode";
import { dateTimeStringToISOString } from "@utils/converter";
import Color from "@constants/Color";

const MobiliaztionForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    compName: "",
    mobilizationInfo: {
      timeOfDeparture: "",
      departureLocation: "",
      UN_LOCODE_DepartureLocation: "",

      estimatedTimeOfArrival: "",
      arrivalLocation: "",
      UN_LOCODE_ArrivalLocation: "",

      shipImage: "",
      shipIMO: "",
      shipName: "",
      shipNationality: "",
      shipType: "",
    },

    mobilizedCrewMembers: [],
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const mobilizationSchema = yup.object().shape({
    compName: yup.string().required("Tên công ty không được để trống"),

    mobilizationInfo: yup.object().shape({
      timeOfDeparture: yup
        .date()
        .min(yesterday, "Thời gian khởi hành không hợp lệ")
        .required("Thời gian khởi hành dự kiến không được để trống")
        .test(
          "is-before-end-datetime",
          "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
          function (value) {
            const { estimatedTimeOfArrival } = this.parent; // Access sibling field estimatedTimeOfArrival
            return !estimatedTimeOfArrival || value < estimatedTimeOfArrival;
          },
        ),
      UN_LOCODE_DepartureLocation: yup
        .string()
        .required("UN/LOCODE điểm khởi hành không được để trống"),
      departureLocation: yup
        .string()
        .required("Tên điểm khởi hành không được để trống"),

      estimatedTimeOfArrival: yup
        .date()
        .required("Thời gian đến nơi dự kiến không được để trống")
        .test(
          "is-after-start-datetime",
          "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
          function (value) {
            const { timeOfDeparture } = this.parent; // Access sibling field timeOfDeparture
            return !timeOfDeparture || value > timeOfDeparture;
          },
        ),
      UN_LOCODE_ArrivalLocation: yup
        .string()
        .required("UN/LOCODE điểm đến không được để trống"),
      arrivalLocation: yup
        .string()
        .required("Tên điểm đến không được để trống"),
    }),
  });

  const [createMobilizationLoading, setCreateMobilizationLoading] =
    useState(false);

  const handleCreateMobilizationSubmit = async (values, { resetForm }) => {
    setCreateMobilizationLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await createMobilizationAPI({
        status: "PENDING",
        partnerPhone: values.phoneNumber,
        partnerEmail: values.email,
        partnerAddress: "Temporary Address",

        partnerName: values.compName,
        // totalSailors: values.numOfMobilizedCrew,
        startDate: dateTimeStringToISOString(
          values.mobilizationInfo.timeOfDeparture,
        ),
        departurePoint: values.mobilizationInfo.departureLocation,
        departureUNLOCODE: values.mobilizationInfo.UN_LOCODE_DepartureLocation,

        estimatedEndDate: dateTimeStringToISOString(
          values.mobilizationInfo.estimatedTimeOfArrival,
        ),
        arrivalPoint: values.mobilizationInfo.arrivalLocation,
        arrivalUNLOCODE: values.mobilizationInfo.UN_LOCODE_ArrivalLocation,

        shipInfo: {
          imageUrl: values.mobilizationInfo.shipImage,
          imonumber: values.mobilizationInfo.shipIMO,
          name: values.mobilizationInfo.shipName,
          countryISO: values.mobilizationInfo.shipNationality,
          shipType: values.mobilizationInfo.shipType,
        },

        crewMembers: values.mobilizedCrewMembers,
        // crewMembers: [
        //   {
        //     cardId: "202500001",
        //     professionalPosition: "Thợ máy",
        //   },
        //   {
        //     cardId: "202500002",
        //     professionalPosition: "Thuyền phó",
        //   },
        // ],
      });
      await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

      if (response.status === HttpStatusCode.CREATED) {
        console.log("Successfully submitted: ", values);
        resetForm();
        navigate("/mobilizations");
      }
    } catch (err) {
      console.log("Error when creating mobilization: ", err);
    } finally {
      setCreateMobilizationLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={mobilizationSchema}
      validateOnChange={false}
      onSubmit={handleCreateMobilizationSubmit}
    >
      {({ handleSubmit, isValid, dirty }) => (
        <Box component="form" onSubmit={handleSubmit} m={2}>
          {/* ================= HEADER ================= */}
          <SectionWrapper
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
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
              startIcon={!createMobilizationLoading && <SaveIcon />}
            >
              {createMobilizationLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Tạo"
              )}
            </Button>
          </SectionWrapper>

          {/* ================= THÔNG TIN CHUNG ================= */}
          <SectionWrapper title="Thông tin chung">
            <Grid container spacing={2}>
              <Grid size={5}>
                <InfoTextFieldFormik
                  name="compName"
                  label="Điều động đến công ty"
                  fullWidth
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  name="email"
                  label="Email công ty"
                  fullWidth
                />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  name="phoneNumber"
                  label="SĐT công ty"
                  fullWidth
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= LỊCH TRÌNH ================= */}
          <SectionWrapper title="Lịch trình dự kiến">
            <Grid container spacing={2}>
              <Grid size={4}>
                <InfoTextFieldFormik
                  name="mobilizationInfo.timeOfDeparture"
                  type="datetime-local"
                  label="Thời gian khởi hành"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= THÔNG TIN TÀU ================= */}
          <SectionWrapper title="Thông tin tàu">
            <Box display="flex" justifyContent="center" mb={2}>
              <ImageUploadFieldFormik
                name="mobilizationInfo.shipImage"
                width={300}
                height={180}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid size={2}>
                <InfoTextFieldFormik
                  name="mobilizationInfo.shipIMO"
                  label="IMO"
                  fullWidth
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  name="mobilizationInfo.shipName"
                  label="Tên tàu"
                  fullWidth
                />
              </Grid>

              <Grid size={2}>
                <NationalityTextField
                  name="mobilizationInfo.shipNationality"
                  label="Quốc tịch"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  name="mobilizationInfo.shipType"
                  label="Loại tàu"
                  fullWidth
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ================= CREW ================= */}
          <SectionWrapper title="Danh sách thuyền viên được điều động">
            <EditableDataGrid
              name="mobilizedCrewMembers"
              initialIsEditable={false}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default MobiliaztionForm;
