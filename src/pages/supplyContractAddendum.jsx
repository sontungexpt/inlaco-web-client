import React, { useState } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "../components/global";
import { FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { COLOR } from "../assets/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router";

const AddendumContractAddendum = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // useEffect(() => {
  //   fetchCrewContractInfos(id);
  // },[]);

  const initialValues = {
    addendumFileLink: null,
    contractInfo: {
      startDate: "",
      endDate: "",
      numOfCrewMember: "",

      timeOfDeparture: "",
      departureLocation: "",
      UN_LOCODE_DepartureLocation: "",

      estimatedTimeOfArrival: "",
      arrivalLocation: "",
      UN_LOCODE_ArrivalLocation: "",
    },
  };

  const addendumSchema = yup.object().shape({
    addendumFileLink: yup
      .mixed()
      .required("Bạn phải tải lên tệp phụ lục hợp đồng"),

    contractInfo: yup.object().shape({
      startDate: yup
        .date()
        .max(new Date(), "Ngày bắt đầu không hợp lệ")
        .required("Ngày bắt đầu không được để trống")
        .test(
          "is-before-end-date",
          "Ngày bắt đầu phải trước ngày kết thúc",
          function (value) {
            const { endDate } = this.parent; // Access sibling field endDate
            return !endDate || value < endDate;
          },
        ),

      endDate: yup
        .date()
        .required("Ngày kết thúc không được để trống")
        .test(
          "is-after-start-date",
          "Ngày kết thúc phải sau ngày bắt đầu",
          function (value) {
            const { startDate } = this.parent; // Access sibling field startDate
            return !startDate || value > startDate;
          },
        ),

      numOfCrewMember: yup
        .number()
        .min(1, "Tổng số nhân lực cần cung ứng không hợp lệ")
        .required("Tổng số nhân lực cần cung ứng không được để trống"),

      timeOfDeparture: yup
        .date()
        .max(new Date(), "Thời gian khởi hành không hợp lệ")
        .test(
          "is-before-end-datetime",
          "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
          function (value) {
            const { estimatedTimeOfArrival } = this.parent; // Access sibling field estimatedTimeOfArrival
            return !estimatedTimeOfArrival || value < estimatedTimeOfArrival;
          },
        ),

      estimatedTimeOfArrival: yup
        .date()
        .test(
          "is-after-start-datetime",
          "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
          function (value) {
            const { timeOfDeparture } = this.parent; // Access sibling field timeOfDeparture
            return !timeOfDeparture || value > timeOfDeparture;
          },
        ),
    }),
  });

  const [createAddendumLoading, setCreateAddendumLoading] = useState(false);

  const handleCreateAddendumSubmit = async (values) => {
    setCreateAddendumLoading(true);
    try {
      //Calling API to create a new crew member
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Mock API call

      console.log("Successfully creating: ", values);
    } catch (err) {
      console.log("Error when creating addendum: ", err);
    } finally {
      setCreateAddendumLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={addendumSchema}
        onSubmit={handleCreateAddendumSubmit}
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
                  title="THÊM PHỤ LỤC HỢP ĐỒNG"
                  subtitle={`Mã hợp đồng: ${id}`} //Change this to the actual contractID, this currently display an id, not contractID
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty}
                    sx={{
                      width: "16%",
                      padding: 1,
                      color: COLOR.primary_black,
                      backgroundColor: COLOR.primary_gold,
                      minWidth: 130,
                    }}
                  >
                    {createAddendumLoading ? (
                      <CircularProgress size={24} color={COLOR.primary_black} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <SaveIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>
                          Lưu phụ lục
                        </Typography>
                      </Box>
                    )}
                  </Button>
                  <FileUploadField
                    label="File phụ lục*"
                    name="addendumFileLink"
                  />
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin hợp đồng*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={3}>
                <InfoTextField
                  id="start-date"
                  type="date"
                  label="Ngày bắt đầu"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.startDate"
                  value={values.contractInfo?.startDate}
                  error={
                    !!touched.contractInfo?.startDate &&
                    !!errors.contractInfo?.startDate
                  }
                  helperText={
                    touched.contractInfo?.startDate &&
                    errors.contractInfo?.startDate
                      ? errors.contractInfo?.startDate
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
              <Grid size={3}>
                <InfoTextField
                  id="end-date"
                  type="date"
                  label="Ngày kết thúc"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.endDate"
                  value={values.contractInfo?.endDate}
                  error={
                    !!touched.contractInfo?.endDate &&
                    !!errors.contractInfo?.endDate
                  }
                  helperText={
                    touched.contractInfo?.endDate &&
                    errors.contractInfo?.endDate
                      ? errors.contractInfo?.endDate
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
              <Grid size={4}>
                <InfoTextField
                  id="num-of-crew-member"
                  type="number"
                  label="Tổng số nhân lực cần cung ứng"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.numOfCrewMember"
                  value={values.contractInfo?.numOfCrewMember}
                  error={
                    !!touched.contractInfo?.numOfCrewMember &&
                    !!errors.contractInfo?.numOfCrewMember
                  }
                  helperText={
                    touched.contractInfo?.numOfCrewMember &&
                    errors.contractInfo?.numOfCrewMember
                      ? errors.contractInfo?.numOfCrewMember
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
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">người</InputAdornment>
                      ),
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
              Lịch trình dự kiến:
            </Typography>
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="time-of-departure"
                  type="datetime-local"
                  label="Thời gian khởi hành dự kiến"
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.timeOfDeparture"
                  value={values.contractInfo?.timeOfDeparture}
                  error={
                    !!touched.contractInfo?.timeOfDeparture &&
                    !!errors.contractInfo?.timeOfDeparture
                  }
                  helperText={
                    touched.contractInfo?.timeOfDeparture &&
                    errors.contractInfo?.timeOfDeparture
                      ? errors.contractInfo?.timeOfDeparture
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
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.UN_LOCODE_DepartureLocation"
                  value={values.contractInfo?.UN_LOCODE_DepartureLocation}
                  error={
                    !!touched.contractInfo?.UN_LOCODE_DepartureLocation &&
                    !!errors.contractInfo?.UN_LOCODE_DepartureLocation
                  }
                  helperText={
                    touched.contractInfo?.UN_LOCODE_DepartureLocation &&
                    errors.contractInfo?.UN_LOCODE_DepartureLocation
                      ? errors.contractInfo?.UN_LOCODE_DepartureLocation
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
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.departureLocation"
                  value={values.contractInfo?.departureLocation}
                  error={
                    !!touched.contractInfo?.departureLocation &&
                    !!errors.contractInfo?.departureLocation
                  }
                  helperText={
                    touched.contractInfo?.departureLocation &&
                    errors.contractInfo?.departureLocation
                      ? errors.contractInfo?.departureLocation
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
                  label="Thời gian đến nơi dự kiến"
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.estimatedTimeOfArrival"
                  value={values.contractInfo?.estimatedTimeOfArrival}
                  error={
                    !!touched.contractInfo?.estimatedTimeOfArrival &&
                    !!errors.contractInfo?.estimatedTimeOfArrival
                  }
                  helperText={
                    touched.contractInfo?.estimatedTimeOfArrival &&
                    errors.contractInfo?.estimatedTimeOfArrival
                      ? errors.contractInfo?.estimatedTimeOfArrival
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
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.UN_LOCODE_ArrivalLocation"
                  value={values.contractInfo?.UN_LOCODE_ArrivalLocation}
                  error={
                    !!touched.contractInfo?.UN_LOCODE_ArrivalLocation &&
                    !!errors.contractInfo?.UN_LOCODE_ArrivalLocation
                  }
                  helperText={
                    touched.contractInfo?.UN_LOCODE_ArrivalLocation &&
                    errors.contractInfo?.UN_LOCODE_ArrivalLocation
                      ? errors.contractInfo?.UN_LOCODE_ArrivalLocation
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
                  size="small"
                  margin="none"
                  fullWidth
                  name="contractInfo.arrivalLocation"
                  value={values.contractInfo?.arrivalLocation}
                  error={
                    !!touched.contractInfo?.arrivalLocation &&
                    !!errors.contractInfo?.arrivalLocation
                  }
                  helperText={
                    touched.contractInfo?.arrivalLocation &&
                    errors.contractInfo?.arrivalLocation
                      ? errors.contractInfo?.arrivalLocation
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

export default AddendumContractAddendum;
