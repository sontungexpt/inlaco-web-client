import React, { useState, useEffect } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  StatusLabel,
} from "../components/global";
import { CardPhotoInput, FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import HttpStatusCode from "../constants/HttpStatusCode";
import {
  getCandidateByID_API,
  approveCandidateApplicationAPI,
  rejectCandidateApplicationAPI,
} from "../services/postServices";
import { isoStringToDateString } from "../utils/converter";

const AdminCandidateDetail = () => {
  const navigate = useNavigate();

  const { candidateID } = useParams();

  const genders = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const [loading, setLoading] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({});

  const fetchCandidateProfile = async () => {
    setLoading(true);
    try {
      const response = await getCandidateByID_API(candidateID);
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay the UI for 200ms

      if (response.status === HttpStatusCode.OK) {
        setCandidateInfo(response.data);
      } else {
        console.log("Failed to fetch candidate profile");
      }
    } catch (err) {
      console.log("Error when fetching candidate profile: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
  }, []);

  const statusMap = {
    APPLIED: "Đã nộp",
    WAIT_FOR_INTERVIEW: "Đã qua vòng phỏng vấn",
    REJECTED: "Từ chối",
    HIRED: "Đã ký hợp đồng",
  };

  const initialValues = {
    fullName: candidateInfo?.fullName || "",
    dob: candidateInfo?.birthDate
      ? isoStringToDateString(candidateInfo.birthDate)
      : "",
    phoneNumber: candidateInfo?.phoneNumber || "",
    address: candidateInfo?.address || "",
    gender: candidateInfo?.gender ? candidateInfo.gender : "OTHER",
    email: candidateInfo?.email || "",
    languageSkills: candidateInfo?.languageSkills || "",
    resume: "",
  };

  const status = statusMap[candidateInfo?.status] || "Lỗi";

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleApproveClick = async () => {
    setButtonLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await approveCandidateApplicationAPI(candidateID);
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay UI for 200ms

      if (response.status === HttpStatusCode.OK) {
        await fetchCandidateProfile();
      } else {
        console.log("Failed to approve request");
      }
      console.log("Successfully approved request");
    } catch (err) {
      console.log("Error when approving request: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDeclineClick = async () => {
    setButtonLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await rejectCandidateApplicationAPI(candidateID);
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay UI for 200ms

      if (response.status === HttpStatusCode.OK) {
        await fetchCandidateProfile();
      } else {
        console.log("Failed to decline request");
      }
    } catch (err) {
      console.log("Error when declining request: ", err);
    } finally {
      setButtonLoading(false);
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
        // validationSchema={crewContractSchema}
        // onSubmit={handleApproveDeclineClick}
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
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <PageTitle
                    title="THÔNG TIN CHI TIẾT ỨNG VIÊN"
                    subtitle={`Ứng viên: ${candidateInfo?.fullName}`}
                  />
                  {status === "Đã nộp" ? (
                    <StatusLabel
                      label="Đã nộp"
                      color={COLOR.primary_black_placeholder}
                    />
                  ) : status === "Từ chối" ? (
                    <StatusLabel label="Từ chối" color={COLOR.PrimaryOrgange} />
                  ) : status === "Đã qua vòng phỏng vấn" ? (
                    <StatusLabel
                      label="Đã qua vòng phỏng vấn"
                      color={COLOR.PrimaryGreen}
                    />
                  ) : (
                    <StatusLabel
                      label="Đã ký hợp đồng"
                      color={COLOR.SecondaryGold}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent:
                      status === "Đã nộp" ? "space-between" : "start",
                    marginTop: 2,
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
                  {status === "Đã nộp" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        marginRight: 2,
                        width: "50%",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleApproveClick()}
                        disabled={buttonLoading}
                        sx={{
                          width: "30%",
                          padding: 1,
                          color: COLOR.PrimaryWhite,
                          backgroundColor: COLOR.PrimaryBlue,
                          minWidth: 130,
                          marginRight: 2,
                        }}
                      >
                        {buttonLoading ? (
                          <CircularProgress
                            size={24}
                            color={COLOR.PrimaryBlack}
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <CheckCircleRoundedIcon
                              sx={{ marginRight: "5px", marginBottom: "1px" }}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              CHẤP NHẬN
                            </Typography>
                          </Box>
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDeclineClick()}
                        disabled={buttonLoading}
                        sx={{
                          width: "30%",
                          padding: 1,
                          color: COLOR.PrimaryWhite,
                          backgroundColor: COLOR.PrimaryOrgange,
                          minWidth: 130,
                        }}
                      >
                        {buttonLoading ? (
                          <CircularProgress
                            size={24}
                            color={COLOR.PrimaryBlack}
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <CancelRoundedIcon
                              sx={{ marginRight: "5px", marginBottom: "1px" }}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              Từ chối
                            </Typography>
                          </Box>
                        )}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin ứng viên: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={5}>
                <InfoTextField
                  id="full-name"
                  label="Họ và tên"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="fullName"
                  value={values?.fullName}
                  error={!!touched.fullName && !!errors.fullName}
                  helperText={
                    touched.fullName && errors.fullName ? errors.fullName : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="dob"
                  type="date"
                  label="Ngày sinh"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="dob"
                  value={values?.dob}
                  error={!!touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob ? errors.dob : " "}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
              <Grid size={4}>
                <InfoTextField
                  id="phoneNumber"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="phoneNumber"
                  value={values?.phoneNumber}
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
              <Grid size={5}>
                <InfoTextField
                  id="address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="address"
                  value={values?.address}
                  error={!!touched.address && !!errors.address}
                  helperText={
                    touched.address && errors.address ? errors.address : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  select
                  id="gender"
                  label="Giới tính"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="gender"
                  value={values?.gender || "OTHER"}
                  error={!!touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </InfoTextField>
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="email"
                  label="Email"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="email"
                  value={values?.email}
                  error={!!touched.email && !!errors.email}
                  helperText={
                    touched.email && errors.email ? errors.email : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="language-skills"
                  label="Trình độ ngoại ngữ (liệt kê nếu có)"
                  size="small"
                  margin="none"
                  fullWidth
                  name="languageSkills"
                  value={values?.languageSkills}
                  error={!!touched.languageSkills && !!errors.languageSkills}
                  helperText={
                    touched.languageSkills && errors.languageSkills
                      ? errors.languageSkills
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="CV đính kèm*: " />
            <FileUploadField
              label="CV đính kèm"
              name="resume"
              disabled={true}
              sx={{ justifyContent: "start", marginLeft: 2 }}
            />
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default AdminCandidateDetail;
