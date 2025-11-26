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
import HttpStatusCodes from "../assets/constants/httpStatusCodes";
import { createCrewContractAPI } from "../services/contractServices";
import { dateStringToISOString } from "../utils/ValueConverter";

const CreateCrewContract = () => {
  const navigate = useNavigate();
  const { crewMemberID } = useParams();

  const receiveMethod = ["Tiền mặt", "Chuyển khoản ngân hàng"];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const initialValues = {
    contractFileLink: "",
    title: "",
    partyA: {
      cardPhoto: "",
      compName: "Công ty INLACO Hải Phòng",
      compAddress: "",
      compPhoneNumber: "",
      representative: "",
      representativePos: "Trưởng phòng Nhân sự",
    },
    partyB: {
      fullName: "",
      dob: "",
      birthplace: "",
      nationality: "",
      permanentAddr: "",
      temporaryAddr: "",
      ciNumber: "",
      ciIssueDate: "",
      ciIssuePlace: "",
    },
    jobInfo: {
      startDate: "",
      endDate: "",
      workingLocation: "Địa điểm làm việc sẽ được thông báo sau",
      position: "",
      jobDescription: "",
    },
    salaryInfo: {
      basicSalary: "",
      allowance: "",
      receiveMethod: "Tiền mặt",
      payday: "Ngày 5 hàng tháng",
      salaryReviewPeriod: "Mỗi 3 tháng",
    },
  };

  const phoneRegex =
    "^(\\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\\d{7}$";
  const ciNumberRegex = "^\\d{12}$";

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

  const [createContractLoading, setCreateContractLoading] = useState(false);

  const handleCreateCrewContractSubmit = async (values, { resetForm }) => {
    setCreateContractLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await createCrewContractAPI(crewMemberID, {
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
            phone: "0865474654",
            type: "DYNAMIC",
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
      // const temp = {
      //   title: values.title,
      //   initiator: {
      //     partyName: values.partyA.compName,
      //     address: values.partyA.compAddress,
      //     phone: values.partyA.compPhoneNumber,
      //     representer: values.partyA.representative,
      //     email: "thong2046@gmail.com",
      //     type: "STATIC",
      //   },
      //   signedPartners: [
      //     {
      //       partyName: values.partyB.fullName,
      //       address: values.partyB.permanentAddr,
      //       type: "DYNAMIC",
      //       customAttributes: [
      //         {
      //           key: "dob",
      //           value: dateStringToISOString(values.partyB.dob),
      //         },
      //         {
      //           key: "birthplace",
      //           value: values.partyB.birthplace,
      //         },
      //         {
      //           key: "nationality",
      //           value: values.partyB.nationality,
      //         },
      //         {
      //           key: "temporaryAddr",
      //           value: values.partyB.temporaryAddr,
      //         },
      //         {
      //           key: "ciNumber",
      //           value: values.partyB.ciNumber,
      //         },
      //         {
      //           key: "ciIssueDate",
      //           value: dateStringToISOString(values.partyB.ciIssueDate),
      //         },
      //         {
      //           key: "ciIssuePlace",
      //           value: values.partyB.ciIssuePlace,
      //         },
      //       ],
      //     },
      //   ],
      //   activationDate: dateStringToISOString(values.jobInfo.startDate),
      //   expiredDate: dateStringToISOString(values.jobInfo.endDate),
      //   customAttributes: [
      //     {
      //       key: "workingLocation",
      //       value: values.jobInfo.workingLocation,
      //     },
      //     {
      //       key: "position",
      //       value: values.jobInfo.position,
      //     },
      //     {
      //       key: "jobDescription",
      //       value: values.jobInfo.jobDescription,
      //     },
      //     {
      //       key: "basicSalary",
      //       value: values.salaryInfo.basicSalary,
      //     },
      //     {
      //       key: "allowance",
      //       value: values.salaryInfo.allowance,
      //     },
      //     {
      //       key: "receiveMethod",
      //       value: values.salaryInfo.receiveMethod,
      //     },
      //     {
      //       key: "payday",
      //       value: values.salaryInfo.payday,
      //     },
      //     {
      //       key: "salaryReviewPeriod",
      //       value: values.salaryInfo.salaryReviewPeriod,
      //     },
      //   ],
      // };

      console.log("Response: ", values);

      if (response.status === HttpStatusCodes.CREATED) {
        resetForm();
        navigate("/crew-contracts");
      }
      console.log("Successfully submitted: ", values);
    } catch (err) {
      console.log("Error when creating crew contract: ", err);
    } finally {
      setCreateContractLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={crewContractSchema}
        onSubmit={handleCreateCrewContractSubmit}
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
                  title="TẠO HỢP ĐỒNG THUYỀN VIÊN"
                  subtitle="Tạo và lưu Hợp đồng thuyền viên mới vào hệ thống"
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
                    {createContractLoading ? (
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
                  <FileUploadField name="contractFileLink" />
                </Box>
              </Box>
            </Box>
            <Grid
              container
              spacing={2}
              mt={2}
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
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="company-phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="nationality"
                  label="Quốc tịch"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="permanent-address"
                  label="Địa chỉ thường trú"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="temporary-address"
                  label="Địa chỉ tạm trú"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="ci-number"
                  label="Số Căn cước công dân"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="ci-issue-date"
                  type="date"
                  label="Ngày cấp"
                  size="small"
                  margin="none"
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
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="position"
                  label="Vị trí chuyên môn"
                  size="small"
                  margin="none"
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
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">vnđ</InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
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
                  required
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
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">vnđ</InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
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
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="salary-review-period"
                  label="Thời hạn được xét nâng lương"
                  size="small"
                  margin="none"
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
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CreateCrewContract;
