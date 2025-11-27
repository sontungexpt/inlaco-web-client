import React, { useState, useEffect } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "../components/global";
import { FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { COLOR } from "../assets/Color";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import DifferenceRoundedIcon from "@mui/icons-material/DifferenceRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import {
  getCrewContractByID_API,
  activeContractByID_API,
  editSupplyContractAPI,
} from "../services/contractServices";
import HttpStatusCode from "../constants/HttpStatusCode";
import {
  isoStringToDateString,
  isoStringToMUIDateTime,
  formatDateString,
  dateStringToISOString,
} from "../utils/converter";

const SupplyContractDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const isOfficialContract = location.state?.signed;
  // const isOfficialContract = true; //edit this later

  const [loading, setLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState({});

  const fetchContractInfo = async (id) => {
    setLoading(true);
    try {
      //Call API to get contract info
      const response = await getCrewContractByID_API(id);
      await new Promise((resolve) => setTimeout(resolve, 200)); //delay 200ms

      if (response.status === HttpStatusCode.OK) {
        console.log("Successfully fetched contract info");
        console.log("Contract info: ", response.data);
        setContractInfo(response.data);
      }
    } catch (err) {
      console.log("Error when fetching contract info: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractInfo(id);
  }, []);

  console.log(contractInfo);

  const initialValues = {
    contractFileLink: "",
    title: contractInfo.title || "",
    partyA: {
      compName: contractInfo.initiator?.partyName,
      compAddress: contractInfo.initiator?.address,
      compPhoneNumber: contractInfo.initiator?.phone,
      representative: contractInfo.initiator?.representer,
      representativePos: "Trưởng phòng nhân sự",
    },
    partyB: {
      compName: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.partyName
        : "",
      compAddress: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.address
        : "",
      compPhoneNumber: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.phone
        : "",
      representative: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.representer
        : "",
      representativePos: contractInfo.signedPartners
        ? contractInfo.signedPartners[0].customAttributes[0].value
        : "",
    },
    contractInfo: {
      startDate: contractInfo.activationDate
        ? isoStringToDateString(contractInfo.activationDate)
        : "", //startDate
      endDate: contractInfo.expiredDate
        ? isoStringToDateString(contractInfo.expiredDate)
        : "", //endDate
      numOfCrewMember: contractInfo.customAttributes
        ? contractInfo.customAttributes[0].value
        : "", //numOfCrewMember

      timeOfDeparture: contractInfo.customAttributes
        ? isoStringToMUIDateTime(contractInfo.customAttributes[1].value)
        : "", //timeOfDeparture
      UN_LOCODE_DepartureLocation: contractInfo.customAttributes
        ? contractInfo.customAttributes[2].value
        : "", //UN_LOCODE_DepartureLocation
      departureLocation: contractInfo.customAttributes
        ? contractInfo.customAttributes[3].value
        : "", //departureLocation

      estimatedTimeOfArrival: contractInfo.customAttributes
        ? isoStringToMUIDateTime(contractInfo.customAttributes[4].value)
        : "", //estimatedTimeOfArrival
      arrivalLocation: contractInfo.customAttributes
        ? contractInfo.customAttributes[6].value
        : "", //arrivalLocation
      UN_LOCODE_ArrivalLocation: contractInfo.customAttributes
        ? contractInfo.customAttributes[5].value
        : "", //UN_LOCODE_ArrivalLocation
    },
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const supplyContractSchema = yup.object().shape({
    partyA: yup.object().shape({
      compName: yup.string().required("Tên công ty không được để trống"),
      compAddress: yup.string().required("Địa chỉ không được để trống"),

      compPhoneNumber: yup
        .string()
        .matches(phoneRegex, "SĐT không hợp lệ")
        .required("SĐT không được để trống"),

      representative: yup
        .string()
        .required("Người đại diện không được để trống"),

      representativePos: yup.string().required("Chức vụ không được để trống"),
    }),

    partyB: yup.object().shape({
      compName: yup.string().required("Tên công ty không được để trống"),
      compAddress: yup.string().required("Địa chỉ không được để trống"),

      compPhoneNumber: yup
        .string()
        .matches(phoneRegex, "SĐT không hợp lệ")
        .required("SĐT không được để trống"),

      representative: yup
        .string()
        .required("Người đại diện không được để trống"),

      representativePos: yup.string().required("Chức vụ không được để trống"),
    }),

    contractInfo: yup.object().shape({
      startDate: yup
        .date()
        .min(yesterday, "Ngày bắt đầu không hợp lệ")
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
        .min(yesterday, "Thời gian khởi hành không hợp lệ")
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

  //   const [createContractLoading, setCreateContractLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleAddContractAddendum = (id) => {
    navigate(`/supply-contracts/${id}/create-addendum`);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleApproveContract = async () => {
    try {
      const response = await activeContractByID_API(id);
      if (response.status === HttpStatusCode.OK) {
        navigate("/supply-contracts");
      }
    } catch (err) {
      console.log("Error when approving contract: ", err);
    }
  };

  const handleDownloadPaperContractClick = (values) => {
    const loadFile = (url, callback) => {
      JSZipUtils.getBinaryContent(url, callback);
    };

    loadFile(
      require("../assets/templates/template-hop-dong-cung-ung-thuyen-vien.docx"),
      (error, content) => {
        if (error) {
          throw error;
        }

        // Initialize PizZip with the .docx content
        const zip = new PizZip(content);

        // Initialize docxtemplater
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        // Set dynamic values for placeholders
        doc.setData({
          title: values.title,
          partyA_representative: values.partyA.representative,
          partyA_representativePos: values.partyA.representativePos,
          partyA_compAddress: values.partyA.compAddress,
          partyA_phoneNumber: values.partyA.compPhoneNumber,
          partyB_compName: values.partyB.compName,
          partyB_representative: values.partyB.representative,
          partyB_representativePos: values.partyB.representativePos,
          partyB_compAddress: values.partyB.compAddress,
          partyB_phoneNumber: values.partyB.compPhoneNumber,
          startDate: formatDateString(values.contractInfo.startDate),
          endDate: formatDateString(values.contractInfo.endDate),
        });

        try {
          // Render the document with dynamic data
          doc.render();

          // Generate the final document
          const out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          // Save the file locally
          saveAs(out, "hop-dong-cung-ung-thuyen-vien.docx");
        } catch (error) {
          console.error("Error generating document:", error);
        }
      },
    );
  };

  const handleCreateSupplyContractSubmit = async (values) => {
    setLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await editSupplyContractAPI(id, {
        title: values.title,
        initiator: {
          partyName: values.partyA.compName,
          address: values.partyA.compAddress,
          phone: values.partyA.compPhoneNumber,
          representer: values.partyA.representative,
          email: "thong2046@gmail.com",
          type: "STATIC",
        },
        signedPartners: [
          {
            partyName: values.partyB.compName,
            address: values.partyB.compAddress,
            phone: values.partyB.compPhoneNumber,
            representer: values.partyB.representative,
            type: "DYNAMIC",
            customAttributes: [
              {
                key: "representativePos",
                value: values.partyB.representativePos,
              },
            ],
          },
        ],
        activationDate: dateStringToISOString(values.contractInfo.startDate),
        expiredDate: dateStringToISOString(values.contractInfo.endDate),
        customAttributes: [
          {
            key: "numOfCrewMember",
            value: values.contractInfo.numOfCrewMember,
          },
          {
            key: "timeOfDeparture",
            value: dateStringToISOString(values.contractInfo.timeOfDeparture),
          },
          {
            key: "UN_LOCODE_DepartureLocation",
            value: values.contractInfo.UN_LOCODE_DepartureLocation,
          },
          {
            key: "departureLocation",
            value: values.contractInfo.departureLocation,
          },
          {
            key: "estimatedTimeOfArrival",
            value: dateStringToISOString(
              values.contractInfo.estimatedTimeOfArrival,
            ),
          },
          {
            key: "arrivalLocation",
            value: values.contractInfo.arrivalLocation,
          },
          {
            key: "UN_LOCODE_ArrivalLocation",
            value: values.contractInfo.UN_LOCODE_ArrivalLocation,
          },
        ],
      });
      await new Promise((resolve) => setTimeout(resolve, 2000)); //Mock API call

      if (response.status === HttpStatusCode.OK) {
        // console.log("Successfully submitted: ", values);
        setIsEditable(false);
        await fetchContractInfo(id);
      }
    } catch (err) {
      console.log("Error when updating supply contract: ", err);
    } finally {
      setLoading(false);
    }
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
        validationSchema={supplyContractSchema}
        onSubmit={handleCreateSupplyContractSubmit}
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <PageTitle
                    title="CHI TIẾT HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
                    subtitle={
                      isOfficialContract
                        ? `Tên hợp đồng: ${contractInfo.title}`
                        : "Hợp đồng chưa chính thức (đang chờ ký kết)"
                    }
                  />
                  {!isEditable && !isOfficialContract && (
                    <IconButton
                      sx={{
                        backgroundColor: COLOR.PrimaryBlue,
                        color: COLOR.PrimaryWhite,
                        "&:hover": { backgroundColor: COLOR.SecondaryBlue },
                      }}
                      onClick={() => handleDownloadPaperContractClick(values)}
                    >
                      <GetAppRoundedIcon sx={{ width: 28, height: 28 }} />
                    </IconButton>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {!isOfficialContract ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        marginRight: 2,
                        width: "50%",
                      }}
                    >
                      {isEditable ? (
                        <>
                          <Button
                            variant="outlined"
                            sx={{
                              color: COLOR.PrimaryOrgange,
                              padding: "8px",
                              marginRight: 2,
                              borderColor: COLOR.PrimaryOrgange,
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
                              color: COLOR.PrimaryWhite,
                              backgroundColor: COLOR.PrimaryBlue,
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
                        <>
                          <Button
                            variant="contained"
                            type={"button"}
                            sx={{
                              color: COLOR.PrimaryBlack,
                              backgroundColor: COLOR.PrimaryGold,
                              padding: "10px",
                              marginTop: "1px",
                              marginBottom: "1px",
                              marginRight: 2,
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
                                  color: COLOR.PrimaryBlack,
                                }}
                              >
                                Chỉnh sửa
                              </Typography>
                            </Box>
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              width: "35%",
                              padding: 1,
                              color: COLOR.PrimaryWhite,
                              backgroundColor: COLOR.PrimaryGreen,
                              minWidth: 130,
                            }}
                            onClick={() => handleApproveContract()}
                          >
                            <Box sx={{ display: "flex", alignItems: "end" }}>
                              <HandshakeRoundedIcon
                                sx={{
                                  marginRight: "5px",
                                  width: 22,
                                  height: 22,
                                }}
                              />
                              <Typography
                                sx={{ fontWeight: 700, fontSize: 14 }}
                              >
                                Xác nhận ký kết
                              </Typography>
                            </Box>
                          </Button>
                        </>
                      )}
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleAddContractAddendum(id)}
                      sx={{
                        width: "15%",
                        padding: 1,
                        color: COLOR.PrimaryBlack,
                        backgroundColor: COLOR.PrimaryGold,
                        minWidth: 130,
                      }}
                    >
                      <DifferenceRoundedIcon
                        sx={{ width: 22, height: 22, marginRight: "5px" }}
                      />
                      <Typography sx={{ fontWeight: 700 }}>
                        Thêm Phụ lục
                      </Typography>
                    </Button>
                  )}
                  <FileUploadField
                    disabled={!isEditable}
                    name="contractFileLink"
                  />
                </Box>
              </Box>
            </Box>
            <Grid
              container
              spacing={2}
              mt={3}
              mx={2}
              rowSpacing={1}
              pt={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid size={6}>
                <InfoTextField
                  id="title"
                  label="Tiêu đề hợp đồng"
                  size="small"
                  margin="none"
                  required
                  disabled={!isEditable}
                  fullWidth
                  name="title"
                  value={values.title}
                  error={!!touched.title && !!errors.title}
                  helperText={
                    touched.title && errors.title ? errors.title : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <SectionDivider
              sx={{ marginTop: 1 }}
              sectionName="Công ty Cung ứng lao động (Bên A)*: "
            />
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
                  name="partyA.compName"
                  value={values.partyA?.compName}
                  error={
                    !!touched.partyA?.compName && !!errors.partyA?.compName
                  }
                  helperText={
                    touched.partyA?.compName && errors.partyA?.compName
                      ? errors.partyA?.compName
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyA.compAddress"
                  value={values.partyA?.compAddress}
                  error={
                    !!touched.partyA?.compAddress &&
                    !!errors.partyA?.compAddress
                  }
                  helperText={
                    touched.partyA?.compAddress && errors.partyA?.compAddress
                      ? errors.partyA?.compAddress
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="company-phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyA.compPhoneNumber"
                  value={values.partyA?.compPhoneNumber}
                  error={
                    !!touched.partyA?.compPhoneNumber &&
                    !!errors.partyA?.compPhoneNumber
                  }
                  helperText={
                    touched.partyA?.compPhoneNumber &&
                    errors.partyA?.compPhoneNumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyA.representative"
                  value={values.partyA?.representative}
                  error={
                    !!touched.partyA?.representative &&
                    !!errors.partyA?.representative
                  }
                  helperText={
                    touched.partyA?.representative &&
                    errors.partyA?.representative
                      ? errors.partyA?.representative
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  name="partyA.representativePos"
                  value={values.partyA?.representativePos}
                  error={
                    !!touched.partyA?.representativePos &&
                    !!errors.partyA?.representativePos
                  }
                  helperText={
                    touched.partyA?.representativePos &&
                    errors.partyA?.representativePos
                      ? errors.partyA?.representativePos
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Công ty yêu cầu Cung ứng lao động (Bên B)*: " />
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
                  name="partyB.compName"
                  value={values.partyB?.compName}
                  error={
                    !!touched.partyB?.compName && !!errors.partyB?.compName
                  }
                  helperText={
                    touched.partyB?.compName && errors.partyB?.compName
                      ? errors.partyB?.compName
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyB.compAddress"
                  value={values.partyB?.compAddress}
                  error={
                    !!touched.partyB?.compAddress &&
                    !!errors.partyB?.compAddress
                  }
                  helperText={
                    touched.partyB?.compAddress && errors.partyB?.compAddress
                      ? errors.partyB?.compAddress
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="company-phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyB.compPhoneNumber"
                  value={values.partyB?.compPhoneNumber}
                  error={
                    !!touched.partyB?.compPhoneNumber &&
                    !!errors.partyB?.compPhoneNumber
                  }
                  helperText={
                    touched.partyB?.compPhoneNumber &&
                    errors.partyB?.compPhoneNumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
                  required
                  fullWidth
                  name="partyB.representative"
                  value={values.partyB?.representative}
                  error={
                    !!touched.partyB?.representative &&
                    !!errors.partyB?.representative
                  }
                  helperText={
                    touched.partyB?.representative &&
                    errors.partyB?.representative
                      ? errors.partyB?.representative
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  name="partyB.representativePos"
                  value={values.partyB?.representativePos}
                  error={
                    !!touched.partyB?.representativePos &&
                    !!errors.partyB?.representativePos
                  }
                  helperText={
                    touched.partyB?.representativePos &&
                    errors.partyB?.representativePos
                      ? errors.partyB?.representativePos
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Thông tin hợp đồng*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={3}>
                <InfoTextField
                  id="start-date"
                  type="date"
                  label="Ngày bắt đầu"
                  size="small"
                  margin="none"
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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
                  disabled={!isEditable}
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
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
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

export default SupplyContractDetail;
