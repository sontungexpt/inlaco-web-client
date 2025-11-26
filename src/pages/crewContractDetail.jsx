import React, { useState, useEffect } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  MultilineFileUploadField,
} from "../components/global";
import { FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
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
import { formatDateString } from "../utils/ValueConverter";
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import {
  getCrewContractByID_API,
  editCrewContractAPI,
  activeContractByID_API,
} from "../services/contractServices";
import {
  isoStringToDateString,
  dateStringToISOString,
} from "../utils/ValueConverter";

const CrewContractDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const isOfficialContract = location.state?.signed;

  const [loading, setLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState({});

  const fetchCrewContractInfo = async (id) => {
    setLoading(true);
    try {
      const response = await getCrewContractByID_API(id);
      await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

      if (response.status === HttpStatusCodes.OK) {
        console.log("Crew contract info: ", response.data);
        setContractInfo(response.data);
      }
    } catch (err) {
      console.log("Error when fetching crew contract info: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewContractInfo(id);
  }, []);

  const receiveMethod = ["Tiền mặt", "Chuyển khoản ngân hàng"];

  const initialValues = {
    contractFileLink: "",
    title: contractInfo.title || "",
    partyA: {
      compName: contractInfo.initiator?.partyName,
      compAddress: contractInfo.initiator?.address,
      compPhoneNumber: contractInfo.initiator?.phone,
      representative: contractInfo.initiator?.representer,
      representativePos: "Trưởng phòng Nhân sự",
    },
    partyB: {
      fullName: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.partyName
        : "",
      dob: contractInfo.signedPartners
        ? isoStringToDateString(
            contractInfo.signedPartners[0]?.customAttributes[0]?.value,
          )
        : "", //dob
      birthplace: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.customAttributes[1]?.value
        : "", //birthplace
      nationality: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.customAttributes[2]?.value
        : "", //nationality
      permanentAddr: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.address
        : "", //permanentAddr
      temporaryAddr: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.customAttributes[3]?.value
        : "", //temporaryAddr
      ciNumber: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.customAttributes[4]?.value
        : "", //ciNumber
      ciIssueDate: contractInfo.signedPartners
        ? isoStringToDateString(
            contractInfo.signedPartners[0]?.customAttributes[5]?.value,
          )
        : "", //ciIssueDate
      ciIssuePlace: contractInfo.signedPartners
        ? contractInfo.signedPartners[0]?.customAttributes[6]?.value
        : "", //ciIssuePlace
    },
    jobInfo: {
      startDate: contractInfo.activationDate
        ? isoStringToDateString(contractInfo.activationDate)
        : "", //startDate
      endDate: contractInfo.expiredDate
        ? isoStringToDateString(contractInfo.expiredDate)
        : "", //endDate
      workingLocation: contractInfo.customAttributes
        ? contractInfo.customAttributes[0]?.value
        : "", //workingLocation
      position: contractInfo.customAttributes
        ? contractInfo.customAttributes[1]?.value
        : "", //position
      jobDescription: contractInfo.customAttributes
        ? contractInfo.customAttributes[2]?.value
        : "", //jobDescription
    },
    salaryInfo: {
      basicSalary: contractInfo.customAttributes
        ? contractInfo.customAttributes[3]?.value
        : "", //basicSalary
      allowance: contractInfo.customAttributes
        ? contractInfo.customAttributes[4]?.value
        : "", //allowance
      receiveMethod: contractInfo.customAttributes
        ? contractInfo.customAttributes[5]?.value
        : "", //receiveMethod
      payday: contractInfo.customAttributes
        ? contractInfo.customAttributes[6]?.value
        : "", //payday
      salaryReviewPeriod: contractInfo.customAttributes
        ? contractInfo.customAttributes[7]?.value
        : "", //salaryReviewPeriod
    },
    addendum: [],
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";
  const ciNumberRegex = "^\\d{12}$";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const crewContractSchema = yup.object().shape({
    title: yup.string().required("Tiêu đề không được để trống"),
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
      fullName: yup.string().required("Họ và tên không được để trống"),

      dob: yup
        .date()
        .max(new Date(), "Ngày sinh không hợp lệ")
        .required("Ngày sinh không được để trống"),

      birthplace: yup.string().required("Nơi sinh không được để trống"),
      nationality: yup.string().required("Quốc tịch không được để trống"),
      permanentAddr: yup
        .string()
        .required("Địa chỉ thường trú không được để trống"),
      temporaryAddr: yup
        .string()
        .required("Địa chỉ tạm trú không được để trống"),

      ciNumber: yup
        .string()
        .matches(ciNumberRegex, "Số CCCD không hợp lệ")
        .required("Số căn cước công dân không được để trống"),
      ciIssueDate: yup
        .date()
        .max(new Date(), "Ngày cấp không hợp lệ")
        .required("Ngày cấp không được để trống"),
      ciIssuePlace: yup.string().required("Nơi cấp không được để trống"),
    }),

    jobInfo: yup.object().shape({
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

      workingLocation: yup
        .string()
        .required("Địa điểm làm việc không được để trống"),
      position: yup.string().required("Vị trí chuyên môn không được để trống"),
      jobDescription: yup
        .string()
        .required("Mô tả công việc không được để trống"),
    }),

    salaryInfo: yup.object().shape({
      basicSalary: yup
        .number()
        .min(0, "Lương cơ bản không hợp lệ")
        .required("Lương cơ bản không được để trống"),
      allowance: yup.number().min(0, "Phụ cấp không hợp lệ"),
      receiveMethod: yup
        .string()
        .required("Hình thức trả lương không được để trống"),

      payday: yup.string().required("Thời hạn trả lương không được để trống"),

      salaryReviewPeriod: yup
        .string()
        .required("Thời hạn được xét nâng lương không được để trống"),
    }),
  });

  //   const [createContractLoading, setCreateContractLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleAddContractAddendum = (id) => {
    navigate(`/crew-contracts/${id}/create-addendum`);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleUpdateCrewContractSubmit = async (values) => {
    // setCreateContractLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await editCrewContractAPI(id, {
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
            partyName: values.partyB.fullName,
            address: values.partyB.permanentAddr,
            type: "LABOR",
            customAttributes: [
              {
                key: "dob",
                value: dateStringToISOString(values.partyB.dob),
              },
              {
                key: "birthplace",
                value: values.partyB.birthplace,
              },
              {
                key: "nationality",
                value: values.partyB.nationality,
              },
              {
                key: "temporaryAddr",
                value: values.partyB.temporaryAddr,
              },
              {
                key: "ciNumber",
                value: values.partyB.ciNumber,
              },
              {
                key: "ciIssueDate",
                value: dateStringToISOString(values.partyB.ciIssueDate),
              },
              {
                key: "ciIssuePlace",
                value: values.partyB.ciIssuePlace,
              },
            ],
          },
        ],
        activationDate: dateStringToISOString(values.jobInfo.startDate),
        expiredDate: dateStringToISOString(values.jobInfo.endDate),
        customAttributes: [
          {
            key: "workingLocation",
            value: values.jobInfo.workingLocation,
          },
          {
            key: "position",
            value: values.jobInfo.position,
          },
          {
            key: "jobDescription",
            value: values.jobInfo.jobDescription,
          },
          {
            key: "basicSalary",
            value: values.salaryInfo.basicSalary,
          },
          {
            key: "allowance",
            value: values.salaryInfo.allowance,
          },
          {
            key: "receiveMethod",
            value: values.salaryInfo.receiveMethod,
          },
          {
            key: "payday",
            value: values.salaryInfo.payday,
          },
          {
            key: "salaryReviewPeriod",
            value: values.salaryInfo.salaryReviewPeriod,
          },
        ],
      });
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay UI for 200ms
      if (response.status === HttpStatusCodes.OK) {
        console.log("Successfully updating: ", values);
        setIsEditable(false);
      }
    } catch (err) {
      console.log("Error when updating crew contract: ", err);
    } finally {
      //   setCreateContractLoading(false);
    }
  };

  const handleApproveContract = async () => {
    try {
      const response = await activeContractByID_API(id);
      if (response.status === HttpStatusCodes.OK) {
        navigate("/crew-contracts");
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
      require("../assets/templates/template-hop-dong-thuyen-vien.docx"),
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
          compName: values.partyA.compName,
          compAddress: values.partyA.compAddress,
          compPhoneNumber: values.partyA.compPhoneNumber,
          representative: values.partyA.representative,
          representativePos: values.partyA.representativePos,

          fullName: values.partyB.fullName,
          dob: formatDateString(values.partyB.dob),
          birthplace: values.partyB.birthplace,
          nationality: values.partyB.nationality,
          permanentAddr: values.partyB.permanentAddr,
          temporaryAddr: values.partyB.temporaryAddr,
          ciNumber: values.partyB.ciNumber,
          ciIssueDate: formatDateString(values.partyB.ciIssueDate),
          ciIssuePlace: values.partyB.ciIssuePlace,

          startDate: formatDateString(values.jobInfo.startDate),
          endDate: formatDateString(values.jobInfo.endDate),
          workingLocation: values.jobInfo.workingLocation,
          position: values.jobInfo.position,
          jobDescription: values.jobInfo.jobDescription,

          basicSalary: values.salaryInfo.basicSalary,
          allowance: values.salaryInfo.allowance,
          receiveMethod: values.salaryInfo.receiveMethod,
          payday: values.salaryInfo.payday,
          salaryReviewPeriod: values.salaryInfo.salaryReviewPeriod,
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
          saveAs(out, "hop-dong-thuyen-vien.docx");
        } catch (error) {
          console.error("Error generating document:", error);
        }
      },
    );
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
        validationSchema={crewContractSchema}
        onSubmit={handleUpdateCrewContractSubmit}
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
                    title="CHI TIẾT HỢP ĐỒNG THUYỀN VIÊN"
                    subtitle={
                      isOfficialContract
                        ? `Mã hợp đồng: ${id}`
                        : "Hợp đồng đang chờ ký kết"
                    }
                  />
                  {!isEditable && !isOfficialContract && (
                    <IconButton
                      sx={{
                        backgroundColor: COLOR.primary_blue,
                        color: COLOR.primary_white,
                        "&:hover": { backgroundColor: COLOR.secondary_blue },
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
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Button
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
                    {createContractLoading ? (
                      <CircularProgress size={24} color={COLOR.primary_black} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <PersonAddIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>Thêm</Typography>
                      </Box>
                    )}
                  </Button> */}
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
                        <>
                          <Button
                            variant="contained"
                            type={"button"}
                            sx={{
                              color: COLOR.primary_black,
                              backgroundColor: COLOR.primary_gold,
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
                                  color: COLOR.primary_black,
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
                              color: COLOR.primary_white,
                              backgroundColor: COLOR.primary_green,
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
                        color: COLOR.primary_black,
                        backgroundColor: COLOR.primary_gold,
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
              sectionName="Người sử dụng lao động (Bên A)*: "
            />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="company-name"
                  label="Tên công ty"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
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
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
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
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
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
                  disabled={!isEditable || isOfficialContract}
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
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
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
                  disabled={!isEditable || isOfficialContract}
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
                      color: COLOR.primary_black,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.primary_black,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Người lao động (Bên B)*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={3}>
                <InfoTextField
                  id="full-name"
                  label="Họ và tên"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.fullName"
                  value={values.partyB?.fullName}
                  error={
                    !!touched.partyB?.fullName && !!errors.partyB?.fullName
                  }
                  helperText={
                    touched.partyB?.fullName && errors.partyB?.fullName
                      ? errors.partyB?.fullName
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
                  id="dob"
                  type="date"
                  label="Ngày sinh"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.dob"
                  value={values.partyB?.dob}
                  error={!!touched.partyB?.dob && !!errors.partyB?.dob}
                  helperText={
                    touched.partyB?.dob && errors.partyB?.dob
                      ? errors.partyB?.dob
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
                    input: {
                      placeholder: "asjdbnaskjd",
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="birthplace"
                  label="Nơi sinh"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.birthplace"
                  value={values.partyB?.birthplace}
                  error={
                    !!touched.partyB?.birthplace && !!errors.partyB?.birthplace
                  }
                  helperText={
                    touched.partyB?.birthplace && errors.partyB?.birthplace
                      ? errors.partyB?.birthplace
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
                  id="nationality"
                  label="Quốc tịch"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.nationality"
                  value={values.partyB?.nationality}
                  error={
                    !!touched.partyB?.nationality &&
                    !!errors.partyB?.nationality
                  }
                  helperText={
                    touched.partyB?.nationality && errors.partyB?.nationality
                      ? errors.partyB?.nationality
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
                  id="permanent-address"
                  label="Địa chỉ thường trú"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.permanentAddr"
                  value={values.partyB?.permanentAddr}
                  error={
                    !!touched.partyB?.permanentAddr &&
                    !!errors.partyB?.permanentAddr
                  }
                  helperText={
                    touched.partyB?.permanentAddr &&
                    errors.partyB?.permanentAddr
                      ? errors.partyB?.permanentAddr
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
                  id="temporary-address"
                  label="Địa chỉ tạm trú"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.temporaryAddr"
                  value={values.partyB?.temporaryAddr}
                  error={
                    !!touched.partyB?.temporaryAddr &&
                    !!errors.partyB?.temporaryAddr
                  }
                  helperText={
                    touched.partyB?.temporaryAddr &&
                    errors.partyB?.temporaryAddr
                      ? errors.partyB?.temporaryAddr
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
                  id="ci-number"
                  label="Số Căn cước công dân"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.ciNumber"
                  value={values.partyB?.ciNumber}
                  error={
                    !!touched.partyB?.ciNumber && !!errors.partyB?.ciNumber
                  }
                  helperText={
                    touched.partyB?.ciNumber && errors.partyB?.ciNumber
                      ? errors.partyB?.ciNumber
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
                  id="ci-issue-date"
                  type="date"
                  label="Ngày cấp"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.ciIssueDate"
                  value={values.partyB?.ciIssueDate}
                  error={
                    !!touched.partyB?.ciIssueDate &&
                    !!errors.partyB?.ciIssueDate
                  }
                  helperText={
                    touched.partyB?.ciIssueDate && errors.partyB?.ciIssueDate
                      ? errors.partyB?.ciIssueDate
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
                    input: {
                      placeholder: "asjdbnaskjd",
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="ci-issue-place"
                  label="Nơi cấp"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="partyB.ciIssuePlace"
                  value={values.partyB?.ciIssuePlace}
                  error={
                    !!touched.partyB?.ciIssuePlace &&
                    !!errors.partyB?.ciIssuePlace
                  }
                  helperText={
                    touched.partyB?.ciIssuePlace && errors.partyB?.ciIssuePlace
                      ? errors.partyB?.ciIssuePlace
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
            <SectionDivider sectionName="Thông tin công việc*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={3}>
                <InfoTextField
                  id="start-date"
                  type="date"
                  label="Ngày bắt đầu"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="jobInfo.startDate"
                  value={values.jobInfo?.startDate}
                  error={
                    !!touched.jobInfo?.startDate && !!errors.jobInfo?.startDate
                  }
                  helperText={
                    touched.jobInfo?.startDate && errors.jobInfo?.startDate
                      ? errors.jobInfo?.startDate
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
                    input: {
                      placeholder: "asjdbnaskjd",
                    },
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
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="jobInfo.endDate"
                  value={values.jobInfo?.endDate}
                  error={
                    !!touched.jobInfo?.endDate && !!errors.jobInfo?.endDate
                  }
                  helperText={
                    touched.jobInfo?.endDate && errors.jobInfo?.endDate
                      ? errors.jobInfo?.endDate
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
                    input: {
                      placeholder: "asjdbnaskjd",
                    },
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="working-location"
                  label="Địa điểm làm việc"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="jobInfo.workingLocation"
                  value={values.jobInfo?.workingLocation}
                  error={
                    !!touched.jobInfo?.workingLocation &&
                    !!errors.jobInfo?.workingLocation
                  }
                  helperText={
                    touched.jobInfo?.workingLocation &&
                    errors.jobInfo?.workingLocation
                      ? errors.jobInfo?.workingLocation
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
                  id="position"
                  label="Vị trí chuyên môn"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="jobInfo.position"
                  value={values.jobInfo?.position}
                  error={
                    !!touched.jobInfo?.position && !!errors.jobInfo?.position
                  }
                  helperText={
                    touched.jobInfo?.position && errors.jobInfo?.position
                      ? errors.jobInfo?.position
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
              <Grid size={12}>
                <InfoTextField
                  id="job-description"
                  label="Mô tả công việc"
                  rows={6}
                  multiline
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="jobInfo.jobDescription"
                  value={values.jobInfo?.jobDescription}
                  error={
                    !!touched.jobInfo?.jobDescription &&
                    !!errors.jobInfo?.jobDescription
                  }
                  helperText={
                    touched.jobInfo?.jobDescription &&
                    errors.jobInfo?.jobDescription
                      ? errors.jobInfo?.jobDescription
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
            <SectionDivider sectionName="Thông tin lương*: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={3}>
                <InfoTextField
                  id="basic-salary"
                  type="number"
                  label="Lương cơ bản"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="salaryInfo.basicSalary"
                  value={values.salaryInfo?.basicSalary}
                  error={
                    !!touched.salaryInfo?.basicSalary &&
                    !!errors.salaryInfo?.basicSalary
                  }
                  helperText={
                    touched.salaryInfo?.basicSalary &&
                    errors.salaryInfo?.basicSalary
                      ? errors.salaryInfo?.basicSalary
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
                        <InputAdornment position="end">vnđ</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="allowance"
                  type="number"
                  label="Phụ cấp"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  fullWidth
                  name="salaryInfo.allowance"
                  value={values.salaryInfo?.allowance}
                  error={
                    !!touched.salaryInfo?.allowance &&
                    !!errors.salaryInfo?.allowance
                  }
                  helperText={
                    touched.salaryInfo?.allowance &&
                    errors.salaryInfo?.allowance
                      ? errors.salaryInfo?.allowance
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
                        <InputAdornment position="end">vnđ</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="receive-method"
                  select
                  label="Hình thức trả lương"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="salaryInfo.receiveMethod"
                  value={values.salaryInfo?.receiveMethod}
                  error={
                    !!touched.salaryInfo?.receiveMethod &&
                    !!errors.salaryInfo?.receiveMethod
                  }
                  helperText={
                    touched.salaryInfo?.receiveMethod &&
                    errors.salaryInfo?.receiveMethod
                      ? errors.salaryInfo?.receiveMethod
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
                >
                  {receiveMethod.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </InfoTextField>
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="payday"
                  label="Thời hạn trả lương"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="salaryInfo.payday"
                  value={values.salaryInfo?.payday}
                  error={
                    !!touched.salaryInfo?.payday && !!errors.salaryInfo?.payday
                  }
                  helperText={
                    touched.salaryInfo?.payday && errors.salaryInfo?.payday
                      ? errors.salaryInfo?.payday
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
                  id="salary-review-period"
                  label="Thời hạn được xét nâng lương"
                  size="small"
                  margin="none"
                  disabled={!isEditable || isOfficialContract}
                  required
                  fullWidth
                  name="salaryInfo.salaryReviewPeriod"
                  value={values.salaryInfo?.salaryReviewPeriod}
                  error={
                    !!touched.salaryInfo?.salaryReviewPeriod &&
                    !!errors.salaryInfo?.salaryReviewPeriod
                  }
                  helperText={
                    touched.salaryInfo?.salaryReviewPeriod &&
                    errors.salaryInfo?.salaryReviewPeriod
                      ? errors.salaryInfo?.salaryReviewPeriod
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
            {isOfficialContract && (
              <>
                <SectionDivider sectionName="Phụ lục đính kèm (nếu có): " />
                <MultilineFileUploadField
                  label="Tải lên phụ lục đính kèm"
                  name="addendum"
                  disabled={true}
                />
              </>
            )}
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CrewContractDetail;
