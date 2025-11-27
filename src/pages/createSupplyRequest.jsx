import { useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
} from "../components/global";
import { NationalityTextField } from "../components/mobilization";
import { FileUploadField } from "../components/contract";
import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router";
import HttpStatusCode from "../constants/HttpStatusCode";
import { createSupplyRequestAPI } from "../services/supplyReqServices";

const CreateSupplyRequest = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchRequestInfos(id);
  // },[]);

  const initialValues = {
    requestListFileLink: "",
    compInfo: {
      compName: "",
      compAddress: "",
      compPhoneNumber: "",
      compEmail: "",
      representative: "",
      representativePos: "",
    },

    requestInfo: {
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
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";

  const supplyRequestSchema = yup.object().shape({
    compInfo: yup.object().shape({
      compName: yup.string().required("Tên công ty không được để trống"),
      compAddress: yup.string().required("Địa chỉ công ty không được để trống"),

      compPhoneNumber: yup
        .string()
        .matches(phoneRegex, "Số điện thoại không hợp lệ")
        .required("Số điện thoại không được để trống"),
      compEmail: yup
        .string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),

      representative: yup
        .string()
        .required("Tên người đại diện không được để trống"),
      representativePos: yup
        .string()
        .required("Chức vụ người đại diện không được để trống"),
    }),

    requestInfo: yup.object().shape({
      timeOfDeparture: yup
        .date()
        .min(new Date(), "Thời gian khởi hành không hợp lệ")
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

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRequestSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await createSupplyRequestAPI(values);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay 0.2s

      if (response.status === HttpStatusCode.CREATED) {
        resetForm();
        navigate("/supply-requests");
      } else {
        console.log("Failed to create supply request");
      }
    } catch (err) {
      console.log("Error when creating supply request: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={supplyRequestSchema}
        onSubmit={handleCreateRequestSubmit}
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
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <PageTitle
                    title="GỬI YÊU CẦU CUNG ỨNG"
                    subtitle="Tạo và gửi yêu cầu cung ứng cho công ty INLACO Hải Phòng"
                  />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={!isValid || !dirty || isLoading}
                sx={{
                  width: "16%",
                  padding: 1,
                  color: COLOR.primary_black,
                  backgroundColor: COLOR.primary_gold,
                  minWidth: 130,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color={COLOR.primary_black} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "end" }}>
                    <ScheduleSendRoundedIcon
                      sx={{ marginRight: "5px", marginBottom: "1px" }}
                    />
                    <Typography sx={{ fontWeight: 700 }}>
                      Gửi yêu cầu
                    </Typography>
                  </Box>
                )}
              </Button>
              <FileUploadField
                label="Danh sách số lượng cần cung ứng"
                name="requestListFileLink"
              />
            </Box>
            <SectionDivider sectionName="Thông tin công ty: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="company-name"
                  label="Tên công ty"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.compName"
                  value={values.compInfo?.compName}
                  error={
                    !!touched.compInfo?.compName && !!errors.compInfo?.compName
                  }
                  helperText={
                    touched.compInfo?.compName && errors.compInfo?.compName
                      ? errors.compInfo?.compName
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
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.compAddress"
                  value={values.compInfo?.compAddress}
                  error={
                    !!touched.compInfo?.compAddress &&
                    !!errors.compInfo?.compAddress
                  }
                  helperText={
                    touched.compInfo?.compAddress &&
                    errors.compInfo?.compAddress
                      ? errors.compInfo?.compAddress
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
                  id="company-phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.compPhoneNumber"
                  value={values.compInfo?.compPhoneNumber}
                  error={
                    !!touched.compInfo?.compPhoneNumber &&
                    !!errors.compInfo?.compPhoneNumber
                  }
                  helperText={
                    touched.compInfo?.compPhoneNumber &&
                    errors.compInfo?.compPhoneNumber
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
              <Grid size={4}>
                <InfoTextField
                  id="email"
                  label="Email"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.compEmail"
                  value={values.compInfo?.compEmail}
                  error={
                    !!touched.compInfo?.compEmail &&
                    !!errors.compInfo?.compEmail
                  }
                  helperText={
                    touched.compInfo?.compEmail && errors.compInfo?.compEmail
                      ? errors.compInfo?.compEmail
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
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.representative"
                  value={values.compInfo?.representative}
                  error={
                    !!touched.compInfo?.representative &&
                    !!errors.compInfo?.representative
                  }
                  helperText={
                    touched.compInfo?.representative &&
                    errors.compInfo?.representative
                      ? errors.compInfo?.representative
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
                  id="representative-position"
                  label="Chức vụ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="compInfo.representativePos"
                  value={values.compInfo?.representativePos}
                  error={
                    !!touched.compInfo?.representativePos &&
                    !!errors.compInfo?.representativePos
                  }
                  helperText={
                    touched.compInfo?.representativePos &&
                    errors.compInfo?.representativePos
                      ? errors.compInfo?.representativePos
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
            <SectionDivider sectionName="Thông tin Tàu và Lịch trình*: " />
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
                  name="requestInfo.timeOfDeparture"
                  value={values.requestInfo?.timeOfDeparture}
                  error={
                    !!touched.requestInfo?.timeOfDeparture &&
                    !!errors.requestInfo?.timeOfDeparture
                  }
                  helperText={
                    touched.requestInfo?.timeOfDeparture &&
                    errors.requestInfo?.timeOfDeparture
                      ? errors.requestInfo?.timeOfDeparture
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
                  name="requestInfo.UN_LOCODE_DepartureLocation"
                  value={values.requestInfo?.UN_LOCODE_DepartureLocation}
                  error={
                    !!touched.requestInfo?.UN_LOCODE_DepartureLocation &&
                    !!errors.requestInfo?.UN_LOCODE_DepartureLocation
                  }
                  helperText={
                    touched.requestInfo?.UN_LOCODE_DepartureLocation &&
                    errors.requestInfo?.UN_LOCODE_DepartureLocation
                      ? errors.requestInfo?.UN_LOCODE_DepartureLocation
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
              <Grid size={6}>
                <InfoTextField
                  id="departure-location"
                  label="Tên điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.departureLocation"
                  value={values.requestInfo?.departureLocation}
                  error={
                    !!touched.requestInfo?.departureLocation &&
                    !!errors.requestInfo?.departureLocation
                  }
                  helperText={
                    touched.requestInfo?.departureLocation &&
                    errors.requestInfo?.departureLocation
                      ? errors.requestInfo?.departureLocation
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
              <Grid size={4}>
                <InfoTextField
                  id="estimated-time-of-arrival"
                  type="datetime-local"
                  required
                  label="Thời gian đến nơi dự kiến"
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.estimatedTimeOfArrival"
                  value={values.requestInfo?.estimatedTimeOfArrival}
                  error={
                    !!touched.requestInfo?.estimatedTimeOfArrival &&
                    !!errors.requestInfo?.estimatedTimeOfArrival
                  }
                  helperText={
                    touched.requestInfo?.estimatedTimeOfArrival &&
                    errors.requestInfo?.estimatedTimeOfArrival
                      ? errors.requestInfo?.estimatedTimeOfArrival
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
                  name="requestInfo.UN_LOCODE_ArrivalLocation"
                  value={values.requestInfo?.UN_LOCODE_ArrivalLocation}
                  error={
                    !!touched.requestInfo?.UN_LOCODE_ArrivalLocation &&
                    !!errors.requestInfo?.UN_LOCODE_ArrivalLocation
                  }
                  helperText={
                    touched.requestInfo?.UN_LOCODE_ArrivalLocation &&
                    errors.requestInfo?.UN_LOCODE_ArrivalLocation
                      ? errors.requestInfo?.UN_LOCODE_ArrivalLocation
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
              <Grid size={6}>
                <InfoTextField
                  id="arrival-location"
                  label="Tên điểm đến"
                  required
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.arrivalLocation"
                  value={values.requestInfo?.arrivalLocation}
                  error={
                    !!touched.requestInfo?.arrivalLocation &&
                    !!errors.requestInfo?.arrivalLocation
                  }
                  helperText={
                    touched.requestInfo?.arrivalLocation &&
                    errors.requestInfo?.arrivalLocation
                      ? errors.requestInfo?.arrivalLocation
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
                  name="requestInfo.shipImage"
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
                  name="requestInfo.shipIMO"
                  value={values.requestInfo?.shipIMO}
                  error={
                    !!touched.requestInfo?.shipIMO &&
                    !!errors.requestInfo?.shipIMO
                  }
                  helperText={
                    touched.requestInfo?.shipIMO && errors.requestInfo?.shipIMO
                      ? errors.requestInfo?.shipIMO
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
              <Grid size={4}>
                <InfoTextField
                  id="ship-name"
                  label="Tên tàu"
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.shipName"
                  value={values.requestInfo?.shipName}
                  error={
                    !!touched.requestInfo?.shipName &&
                    !!errors.requestInfo?.shipName
                  }
                  helperText={
                    touched.requestInfo?.shipName &&
                    errors.requestInfo?.shipName
                      ? errors.requestInfo?.shipName
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
              <Grid size={2}>
                <NationalityTextField
                  id="ship-nationality"
                  label="Quốc tịch"
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.shipNationality"
                  value={values.requestInfo?.shipNationality}
                  error={
                    !!touched.requestInfo?.shipNationality &&
                    !!errors.requestInfo?.shipNationality
                  }
                  helperText={
                    touched.requestInfo?.shipNationality &&
                    errors.requestInfo?.shipNationality
                      ? errors.requestInfo?.shipNationality
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
              <Grid size={4}>
                <InfoTextField
                  id="ship-type"
                  label="Loại tàu"
                  size="small"
                  margin="none"
                  fullWidth
                  name="requestInfo.shipType"
                  value={values.requestInfo?.shipType}
                  error={
                    !!touched.requestInfo?.shipType &&
                    !!errors.requestInfo?.shipType
                  }
                  helperText={
                    touched.requestInfo?.shipType &&
                    errors.requestInfo?.shipType
                      ? errors.requestInfo?.shipType
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
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CreateSupplyRequest;
