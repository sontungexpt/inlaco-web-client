import React, { useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  StatusLabel,
} from "../components/global";
import { NationalityTextField } from "../components/mobilization";
import { FileUploadField } from "../components/contract";
import { Box, Button, Typography, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as yup from "yup";
import { useParams } from "react-router";
import Color from "@constants/Color";

const UserSupplyRequestDetail = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  const status = "Đang chờ xác nhận"; //Change this to the status of the request
  //"Chấp thuận", "Từ chối", "Đang chờ xác nhận", "Đã ký hợp đồng"

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

    requestList: [],
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
        .max(new Date(), "Thời gian khởi hành không hợp lệ")
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

  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleSaveRequestSubmit = async (values) => {
    try {
      //Calling API to create a new crew member
      await new Promise((resolve) => setTimeout(resolve, 2000)); //Mock API call

      console.log("Successfully saving update: ", values);
      setIsEditable(false);
    } catch (err) {
      console.log("Error when saving supply request info update: ", err);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={supplyRequestSchema}
        onSubmit={handleSaveRequestSubmit}
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
                    title="CHI TIẾT YÊU CẦU CUNG ỨNG"
                    subtitle={`Yêu cầu cung ứng của công ty: ${id}`} //Change this to the companyName of them company that made the request
                  />
                  {status === "Chấp thuận" ? (
                    <StatusLabel
                      label="Chấp thuận"
                      color={Color.PrimaryGreen}
                    />
                  ) : status === "Từ chối" ? (
                    <StatusLabel label="Từ chối" color={Color.PrimaryOrgange} />
                  ) : status === "Đang chờ xác nhận" ? (
                    <StatusLabel
                      label="Đang chờ xác nhận"
                      color={Color.SecondaryGray}
                    />
                  ) : (
                    <StatusLabel
                      label="Đã ký hợp đồng"
                      color={Color.SecondaryGold}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  {status === "Đang chờ xác nhận" && isEditable ? (
                    <Box
                      sx={{
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          color: Color.PrimaryOrgange,
                          padding: "8px",
                          marginRight: 2,
                          borderColor: Color.PrimaryOrgange,
                          width: "12%",
                        }}
                        onClick={handleCancelClick}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <DeleteForeverRoundedIcon
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: "2px",
                              marginBottom: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            Hủy
                          </Typography>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        type={"submit"}
                        disabled={!isValid || !dirty}
                        sx={{
                          color: Color.PrimaryWhite,
                          backgroundColor: Color.PrimaryBlue,
                          padding: "10px",
                          marginTop: "1px",
                          marginBottom: "1px",
                          width: "12%",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <SaveIcon
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: "2px",
                              marginBottom: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            Lưu
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  ) : status === "Đang chờ xác nhận" && !isEditable ? (
                    <Box
                      sx={{
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        type={"button"}
                        sx={{
                          color: Color.PrimaryBlack,
                          backgroundColor: Color.PrimaryGold,
                          padding: "10px",
                          width: "22%",
                        }}
                        onClick={handleEditClick}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <EditIcon
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: "2px",
                              marginBottom: "2px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: Color.PrimaryBlack,
                            }}
                          >
                            Chỉnh sửa
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  ) : (
                    <></>
                  )}
                  <FileUploadField
                    label="Danh sách số lượng cần cung ứng"
                    disabled={!isEditable}
                    name="requestListFileLink"
                  />
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin công ty: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="company-name"
                  label="Tên công ty"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                  id="email"
                  label="Email"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                color: Color.PrimaryBlackPlaceHolder,
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
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                  id="departure-location"
                  label="Tên điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                  id="estimated-time-of-arrival"
                  type="datetime-local"
                  required
                  label="Thời gian đến nơi dự kiến"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                  id="arrival-location"
                  label="Tên điểm đến"
                  required
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                color: Color.PrimaryBlackPlaceHolder,
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  id="ship-name"
                  label="Tên tàu"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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
                  disabled={!isEditable}
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
                  id="ship-type"
                  label="Loại tàu"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: Color.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: Color.PrimaryBlack,
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

export default UserSupplyRequestDetail;
