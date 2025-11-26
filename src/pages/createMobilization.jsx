import React, { useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  EditableDataGrid,
} from "../components/global";
import { NationalityTextField } from "../components/mobilization";
import { FileUploadField } from "../components/contract";
import { Grid, Box, Button, Typography, CircularProgress } from "@mui/material";
import { COLOR } from "../assets/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { createMobilizationAPI } from "../services/mobilizationServices";
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import { dateTimeStringToISOString } from "../utils/ValueConverter";

const CreateMobilization = () => {
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

      if (response.status === HttpStatusCodes.CREATED) {
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
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={mobilizationSchema}
        onSubmit={handleCreateMobilizationSubmit}
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
                  title="TẠO ĐIỀU ĐỘNG"
                  subtitle="Tạo và lên kế hoạch cho các điều động mới"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty}
                    sx={{
                      width: "10%",
                      padding: 1,
                      color: COLOR.primary_black,
                      backgroundColor: COLOR.primary_gold,
                      minWidth: 130,
                    }}
                  >
                    {createMobilizationLoading ? (
                      <CircularProgress size={24} color={COLOR.primary_black} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <SaveIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>Tạo</Typography>
                      </Box>
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin chung*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={5}>
                <InfoTextField
                  id="comp-name"
                  label="Điều động đến công ty"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compName"
                  value={values.compName}
                  error={!!touched.compName && !!errors.compName}
                  helperText={
                    touched.compName && errors.compName ? errors.compName : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="comp-email"
                  label="Email công ty"
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
              <Grid size={3}>
                <InfoTextField
                  id="comp-phoneNumber"
                  label="SĐT Công ty"
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
            </Grid>
            <SectionDivider sectionName="Thông tin điều động*: " />
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              Lịch trình dự kiến:
            </Typography>
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="time-of-departure"
                  type="datetime-local"
                  required
                  label="Thời gian khởi hành dự kiến"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.timeOfDeparture"
                  value={values.mobilizationInfo?.timeOfDeparture}
                  error={
                    !!touched.mobilizationInfo?.timeOfDeparture &&
                    !!errors.mobilizationInfo?.timeOfDeparture
                  }
                  helperText={
                    touched.mobilizationInfo?.timeOfDeparture &&
                    errors.mobilizationInfo?.timeOfDeparture
                      ? errors.mobilizationInfo?.timeOfDeparture
                      : " "
                  }
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
                  id="arrival-location"
                  label="UN/LOCODE điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.UN_LOCODE_DepartureLocation"
                  value={values.mobilizationInfo?.UN_LOCODE_DepartureLocation}
                  error={
                    !!touched.mobilizationInfo?.UN_LOCODE_DepartureLocation &&
                    !!errors.mobilizationInfo?.UN_LOCODE_DepartureLocation
                  }
                  helperText={
                    touched.mobilizationInfo?.UN_LOCODE_DepartureLocation &&
                    errors.mobilizationInfo?.UN_LOCODE_DepartureLocation
                      ? errors.mobilizationInfo?.UN_LOCODE_DepartureLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="departure-location"
                  label="Tên điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.departureLocation"
                  value={values.mobilizationInfo?.departureLocation}
                  error={
                    !!touched.mobilizationInfo?.departureLocation &&
                    !!errors.mobilizationInfo?.departureLocation
                  }
                  helperText={
                    touched.mobilizationInfo?.departureLocation &&
                    errors.mobilizationInfo?.departureLocation
                      ? errors.mobilizationInfo?.departureLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="estimated-time-of-arrival"
                  type="datetime-local"
                  required
                  label="Thời gian đến nơi dự kiến"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.estimatedTimeOfArrival"
                  value={values.mobilizationInfo?.estimatedTimeOfArrival}
                  error={
                    !!touched.mobilizationInfo?.estimatedTimeOfArrival &&
                    !!errors.mobilizationInfo?.estimatedTimeOfArrival
                  }
                  helperText={
                    touched.mobilizationInfo?.estimatedTimeOfArrival &&
                    errors.mobilizationInfo?.estimatedTimeOfArrival
                      ? errors.mobilizationInfo?.estimatedTimeOfArrival
                      : " "
                  }
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
                  id="arrival-location"
                  label="UN/LOCODE điểm đến"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.UN_LOCODE_ArrivalLocation"
                  value={values.mobilizationInfo?.UN_LOCODE_ArrivalLocation}
                  error={
                    !!touched.mobilizationInfo?.UN_LOCODE_ArrivalLocation &&
                    !!errors.mobilizationInfo?.UN_LOCODE_ArrivalLocation
                  }
                  helperText={
                    touched.mobilizationInfo?.UN_LOCODE_ArrivalLocation &&
                    errors.mobilizationInfo?.UN_LOCODE_ArrivalLocation
                      ? errors.mobilizationInfo?.UN_LOCODE_ArrivalLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="arrival-location"
                  label="Tên điểm đến"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.arrivalLocation"
                  value={values.mobilizationInfo?.arrivalLocation}
                  error={
                    !!touched.mobilizationInfo?.arrivalLocation &&
                    !!errors.mobilizationInfo?.arrivalLocation
                  }
                  helperText={
                    touched.mobilizationInfo?.arrivalLocation &&
                    errors.mobilizationInfo?.arrivalLocation
                      ? errors.mobilizationInfo?.arrivalLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              Thông tin Tàu:
            </Typography>
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <HorizontalImageInput
                  id="social-ins-image"
                  width={300}
                  height={180}
                  name="mobilizationInfo.shipImage"
                  sx={{ marginBottom: 2 }}
                  onClick={() =>
                    document.getElementById("social-ins-image").click()
                  }
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="ship-imo"
                  label="IMO"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.shipIMO"
                  value={values.mobilizationInfo?.shipIMO}
                  error={
                    !!touched.mobilizationInfo?.shipIMO &&
                    !!errors.mobilizationInfo?.shipIMO
                  }
                  helperText={
                    touched.mobilizationInfo?.shipIMO &&
                    errors.mobilizationInfo?.shipIMO
                      ? errors.mobilizationInfo?.shipIMO
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="ship-name"
                  label="Tên tàu"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.shipName"
                  value={values.mobilizationInfo?.shipName}
                  error={
                    !!touched.mobilizationInfo?.shipName &&
                    !!errors.mobilizationInfo?.shipName
                  }
                  helperText={
                    touched.mobilizationInfo?.shipName &&
                    errors.mobilizationInfo?.shipName
                      ? errors.mobilizationInfo?.shipName
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={2}>
                <NationalityTextField
                  id="ship-nationality"
                  label="Quốc tịch"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.shipNationality"
                  value={values.mobilizationInfo?.shipNationality}
                  error={
                    !!touched.mobilizationInfo?.shipNationality &&
                    !!errors.mobilizationInfo?.shipNationality
                  }
                  helperText={
                    touched.mobilizationInfo?.shipNationality &&
                    errors.mobilizationInfo?.shipNationality
                      ? errors.mobilizationInfo?.shipNationality
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="ship-type"
                  label="Loại tàu"
                  size="small"
                  margin="none"
                  fullWidth
                  name="mobilizationInfo.shipType"
                  value={values.mobilizationInfo?.shipType}
                  error={
                    !!touched.mobilizationInfo?.shipType &&
                    !!errors.mobilizationInfo?.shipType
                  }
                  helperText={
                    touched.mobilizationInfo?.shipType &&
                    errors.mobilizationInfo?.shipType
                      ? errors.mobilizationInfo?.shipType
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Danh sách thuyền viên được điều động*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={12}>
                <EditableDataGrid
                  name="mobilizedCrewMembers"
                  initialIsEditable={false}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CreateMobilization;
