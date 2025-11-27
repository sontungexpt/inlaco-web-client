import React, { useState, useEffect } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  NoValuesOverlay,
} from "../components/global";
import { NationalityTextField } from "../components/mobilization";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import * as yup from "yup";
import * as XLSX from "xlsx";
import { useLocation, useParams } from "react-router";
import { formatDate } from "../utils/ValueConverter";
import {
  getMobilizationByID_API,
  editMobilizationAPI,
} from "../services/mobilizationServices";
import HttpStatusCode from "../constants/HttpStatusCode";
import {
  isoStringToMUIDateTime,
  dateTimeStringToISOString,
} from "../utils/ValueConverter";

const MobilizationDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin;
  const position = location.state?.position;
  // const isAdmin = true;

  const [mobilizationInfos, setMobilizationInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [crewMembers, setCrewMembers] = useState([]);

  const fetchMobilizationInfos = async (id) => {
    setLoading(true);
    try {
      const response = await getMobilizationByID_API(id);
      if (response.status === HttpStatusCode.OK) {
        setMobilizationInfos(response.data);
        setCrewMembers(response.data.crewMembers);
      }
    } catch (err) {
      console.log("Error when fetching mobilization info: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMobilizationInfos(id);
  }, []);

  const initialValues = {
    compName: mobilizationInfos?.partnerName || "",
    email: mobilizationInfos.partnerEmail || "",
    phoneNumber: mobilizationInfos.partnerPhone || "",

    mobilizationInfo: {
      timeOfDeparture: mobilizationInfos?.startDate
        ? isoStringToMUIDateTime(mobilizationInfos?.startDate)
        : "",
      departureLocation: mobilizationInfos?.departurePoint || "",
      UN_LOCODE_DepartureLocation: mobilizationInfos?.departureUNLOCODE || "",

      estimatedTimeOfArrival: mobilizationInfos?.startDate
        ? isoStringToMUIDateTime(mobilizationInfos?.estimatedEndDate)
        : "",
      arrivalLocation: mobilizationInfos?.arrivalPoint || "",
      UN_LOCODE_ArrivalLocation: mobilizationInfos?.arrivalUNLOCODE || "",

      shipImage: mobilizationInfos?.shipInfo?.imageUrl?.url || "",
      shipIMO: mobilizationInfos?.shipInfo?.imonumber || "",
      shipName: mobilizationInfos?.shipInfo?.name || "",
      shipNationality: mobilizationInfos?.shipInfo?.countryISO || "",
      shipType: mobilizationInfos?.shipInfo?.shipType || "",
    },

    mobilizedCrewMembers: mobilizationInfos?.crewMembers || [],
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const mobilizationSchema = yup.object().shape({
    compName: yup.string().required("Tên công ty không được để trống"),
    email: yup.string().required("Email không được để trống"),
    phoneNumber: yup.string().required("Số điện thoại không được để trống"),

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

  const columns = [
    {
      field: "cardId",
      headerName: "Mã TV",
      flex: 2,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: "Họ tên",
      flex: 3,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      type: "date",
      flex: 2,
      editable: false,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      },
      valueFormatter: (params) => {
        if (!params) return "Invalid date";
        const date = new Date(params);
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
    {
      field: "phoneNumber",
      headerName: "SĐT",
      flex: 2,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "professionalPosition",
      headerName: "Vị trí chuyên môn",
      flex: 3,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
  ];
  //   const [createMobilizationLoading, setCreateMobilizationLoading] =
  //     useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleSaveMobilizationSubmit = async (values) => {
    // setCreateMobilizationLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await editMobilizationAPI(id, {
        partnerName: values.compName,
        partnerEmail: values.email,
        partnerPhone: values.phoneNumber,
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
          // imageUrl: { url: values.mobilizationInfo.shipImage },
          imonumber: values.mobilizationInfo.shipIMO,
          name: values.mobilizationInfo.shipName,
          countryISO: values.mobilizationInfo.shipNationality,
          shipType: values.mobilizationInfo.shipType,
        },
        crewMembers: values.mobilizedCrewMembers,
      });

      if (response.status === HttpStatusCode.OK) {
        setIsEditable(false);
      }
    } catch (err) {
      console.log("Error when saving editing mobilization: ", err);
    } finally {
      // setCreateMobilizationLoading(false);
    }
  };

  const handleDownloadExcel = (values) => {
    // Define the headers in Vietnamese
    const columnHeaders = [
      { header: "Mã thuyền viên", key: "cardId" },
      { header: "Họ và tên", key: "fullName" },
      { header: "Ngày sinh", key: "birthDate" },
      { header: "Số điện thoại", key: "phoneNumber" },
      { header: "Chức vụ", key: "professionalPosition" },
    ];

    // Map the data to include only the keys defined in headers
    const crewMembers = values.mobilizedCrewMembers.map((member) => ({
      cardId: member.cardId,
      fullName: member.fullName,
      birthDate: formatDate(member.birthDate),
      phoneNumber: member.phoneNumber,
      professionalPosition: member.professionalPosition,
    }));

    // Create an array with the headers and data
    const data = [
      columnHeaders.map((columnHeader) => columnHeader.header), // Add headers as the first row
      ...crewMembers.map((member) =>
        columnHeaders.map((columnHeader) => member[columnHeader.key]),
      ), // Add data rows
    ];

    // Convert the array to a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách thuyền viên");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "danh-sach-thuyen-vien-duoc-dieu-dong.xlsx");
    console.log("Download excel file successfully");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={mobilizationSchema}
        onSubmit={handleSaveMobilizationSubmit}
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
                  title="CHI TIẾT ĐIỀU ĐỘNG"
                  subtitle={"Thông tin chi tiết của điều động"}
                />
                {isAdmin && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      marginRight: 2,
                    }}
                  >
                    {isEditable ? (
                      <>
                        <Button
                          variant="outlined"
                          sx={{
                            color: COLOR.primary_orange,
                            padding: "8px",
                            marginRight: 2,
                            borderColor: COLOR.primary_orange,
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
                            color: COLOR.primary_white,
                            backgroundColor: COLOR.primary_blue,
                            padding: "10px",
                            marginTop: "1px",
                            marginBottom: "1px",
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
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        type={"button"}
                        sx={{
                          color: COLOR.primary_black,
                          backgroundColor: COLOR.primary_gold,
                          padding: "10px",
                          marginTop: "1px",
                          marginBottom: "1px",
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
                              color: COLOR.primary_black,
                            }}
                          >
                            Chỉnh sửa
                          </Typography>
                        </Box>
                      </Button>
                    )}
                  </Box>
                )}
                {/* <Box
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
                        <PersonAddIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>Thêm</Typography>
                      </Box>
                    )}
                  </Button>
                </Box> */}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="comp-phoneNumber"
                  label="SĐT Công ty"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Thông tin điều động*: " />
            {position && (
              <>
                <Typography
                  sx={{
                    ml: 2,
                    fontSize: 18,
                    textDecoration: "underline",
                    fontStyle: "italic",
                    color: COLOR.primary_black_placeholder,
                  }}
                >
                  Công việc:
                </Typography>
                <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
                  <Grid size={4}>
                    <TextField
                      id="position"
                      label="Vị trí chuyên môn trên tàu"
                      required
                      size="small"
                      margin="none"
                      fullWidth
                      value={position}
                      disabled={true}
                      sx={[
                        { backgroundColor: "#FFF", marginBottom: 1 },
                        {
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: COLOR.primary_black,
                          },
                          "& .MuiOutlinedInput-root.Mui-disabled": {
                            WebkitTextFillColor: COLOR.primary_black,
                          },
                          "& .MuiInputLabel-root.Mui-disabled": {
                            WebkitTextFillColor: COLOR.primary_black,
                          },
                        },
                      ]} // Merging styles with spread operator
                      slotProps={{
                        formHelperText: {
                          sx: {
                            margin: 0,
                            paddingRight: 1,
                            paddingLeft: 1,
                            backgroundColor: COLOR.primary_white,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
                marginTop: 4,
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                marginTop: 4,
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
            {isAdmin && (
              <>
                <SectionDivider sectionName="Danh sách thuyền viên được điều động*: " />
                {!isEditable && (
                  <Box sx={{ display: "flex", justifyContent: "end" }} px={2}>
                    <Button
                      variant="contained"
                      type="button"
                      sx={{
                        color: COLOR.primary_black,
                        backgroundColor: COLOR.primary_gold,
                        padding: "10px",
                        marginTop: "1px",
                        marginBottom: "1px",
                      }}
                      onClick={() => handleDownloadExcel(values)}
                    >
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <FileDownloadRoundedIcon
                          sx={{
                            width: 20,
                            height: 20,
                            marginRight: "4px",
                            marginBottom: "1px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          Tải xuống File Excel
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                )}
                <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
                  <Grid size={12}>
                    <Box
                      sx={[
                        {
                          width: "100%",
                          "& .actions": {
                            color: COLOR.primary_black_placeholder,
                          },
                          "& .MuiDataGrid-columnHeader": {
                            backgroundColor: COLOR.secondary_blue,
                            color: COLOR.primary_white,
                          },
                          "& .MuiTablePagination-root": {
                            backgroundColor: COLOR.secondary_blue,
                            color: COLOR.primary_white,
                          },
                        },
                      ]}
                    >
                      <DataGrid
                        rows={crewMembers}
                        columns={columns}
                        disableColumnMenu
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
                        slots={{ noRowsOverlay: NoValuesOverlay }}
                        slotProps={{
                          noRowsOverlay: {
                            text: "CHƯA CÓ THUYỀN VIÊN NÀO ĐƯỢC THÊM",
                          },
                        }}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                          },
                        }}
                        sx={{
                          backgroundColor: "#FFF",
                          headerAlign: "center",
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: 16,
                            fontWeight: 700,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default MobilizationDetail;
