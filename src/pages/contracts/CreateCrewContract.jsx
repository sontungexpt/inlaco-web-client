import React, { useState } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "@components/global";
import { FileUploadField } from "@components/contract";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import Color from "@constants/Color";
import { createLaborContract } from "@/services/contractServices";
import { dateStringToISOString } from "@utils/converter";
import Regex from "@/constants/Regex";
import { now, yesterday } from "@/utils/date";
import SubSegmentWrapper from "./components/SubSegmentWrapper";
import SectionWrapper from "@components/global/SectionWrapper";

const CreateCrewContract = () => {
  const navigate = useNavigate();
  const { candidateProfileId } = useParams();

  const RECEIVE_METHOD = ["Tiền mặt", "Chuyển khoản ngân hàng"];

  const [creating, setCreating] = useState(false);

  const createContract = async (values, { resetForm }) => {
    setCreating(true);
    try {
      //Calling API to create a new crew member
      const response = await createLaborContract(candidateProfileId, {
        title: values.title,
        initiator: {
          partyName: values.partyA.compName,
          address: values.partyA.compAddress,
          phone: values.partyA.compPhoneNumber,
          representer: values.partyA.representative,
          email: "thong2046@gmail.com",
          type: "STATIC",
        },
        partners: [
          {
            partyName: values.partyB.fullName,
            representer: values.partyB.fullName,
            address: values.partyB.permanentAddr,
            phone: "0865474654",
            type: "LABOR",
            birthPlace: values.partyB.birthplace,
            birthDate: dateStringToISOString(values.partyB.dob),
            nationality: values.partyB.nationality,
            temporaryAddress: values.partyB.temporaryAddr,
            identificationCardId: values.partyB.ciNumber,
            identificationCardIssuedDate: dateStringToISOString(
              values.partyB.ciIssueDate,
            ),
            identificationCardIssuedPlace: values.partyB.ciIssuePlace,
            bankAccount: values.salaryInfo.bankAccount,
            bankName: values.salaryInfo.bankName,
          },
        ],
        activationDate: dateStringToISOString(values.jobInfo.startDate),
        expiredDate: dateStringToISOString(values.jobInfo.endDate),
        position: values.jobInfo.position,
        workingLocation: values.jobInfo.workingLocation,
        basicSalary: values.salaryInfo.basicSalary,
        birthplace: values.partyB.birthplace,
        terms: [],
        customAttributes: [
          {
            key: "jobDescription",
            value: values.jobInfo.jobDescription,
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
      resetForm();
      navigate("/crew-contracts");
    } catch (err) {}
    setCreating(false);
  };

  const initialValues = {
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
      bankAccount: "",
      bankName: "",
    },
    contractFileLink: null,
  };

  const FORM_SCHEMA = Yup.object().shape({
    title: Yup.string().required("Tiêu đề không được để trống"),
    partyA: Yup.object().shape({
      compName: Yup.string().required("Tên công ty không được để trống"),
      compAddress: Yup.string().required("Địa chỉ không được để trống"),
      compPhoneNumber: Yup.string()
        .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
        .required("SĐT không được để trống"),
      representative: Yup.string().required(
        "Người đại diện không được để trống",
      ),
      representativePos: Yup.string().required("Chức vụ không được để trống"),
    }),

    partyB: Yup.object().shape({
      fullName: Yup.string().required("Họ và tên không được để trống"),
      dob: Yup.date()
        .max(now(), "Ngày sinh không hợp lệ")
        .required("Ngày sinh không được để trống"),
      birthplace: Yup.string().required("Nơi sinh không được để trống"),
      nationality: Yup.string().required("Quốc tịch không được để trống"),
      permanentAddr: Yup.string().required(
        "Địa chỉ thường trú không được để trống",
      ),
      temporaryAddr: Yup.string().required(
        "Địa chỉ tạm trú không được để trống",
      ),
      ciNumber: Yup.string()
        .matches(Regex.CI_NUMBER, "Số CCCD không hợp lệ")
        .required("Số căn cước công dân không được để trống"),
      ciIssueDate: Yup.date()
        .max(now(), "Ngày cấp không hợp lệ")
        .required("Ngày cấp không được để trống"),
      ciIssuePlace: Yup.string().required("Nơi cấp không được để trống"),
    }),

    jobInfo: Yup.object().shape({
      startDate: Yup.date()
        .min(yesterday(), "Ngày bắt đầu không hợp lệ")
        .required("Ngày bắt đầu không được để trống")
        .test(
          "is-before-end-date",
          "Ngày bắt đầu phải trước ngày kết thúc",
          function (value) {
            const { endDate } = this.parent; // Access sibling field endDate
            return !endDate || value < endDate;
          },
        ),

      endDate: Yup.date()
        .required("Ngày kết thúc không được để trống")
        .test(
          "is-after-start-date",
          "Ngày kết thúc phải sau ngày bắt đầu",
          function (value) {
            const { startDate } = this.parent; // Access sibling field startDate
            return !startDate || value > startDate;
          },
        ),
      workingLocation: Yup.string().required(
        "Địa điểm làm việc không được để trống",
      ),
      position: Yup.string().required("Vị trí chuyên môn không được để trống"),
      jobDescription: Yup.string().required(
        "Mô tả công việc không được để trống",
      ),
    }),

    salaryInfo: Yup.object().shape({
      basicSalary: Yup.number()
        .min(0, "Lương cơ bản không hợp lệ")
        .required("Lương cơ bản không được để trống"),
      allowance: Yup.number().min(0, "Phụ cấp không hợp lệ"),
      receiveMethod: Yup.string().required(
        "Hình thức trả lương không được để trống",
      ),
      payday: Yup.string().required("Thời hạn trả lương không được để trống"),
      salaryReviewPeriod: Yup.string().required(
        "Thời hạn được xét nâng lương không được để trống",
      ),
      bankAccount: Yup.string().required(
        "Tài khoản ngân hàng không đượcể trống",
      ),
      bankName: Yup.string().required(
        "Tài khoản ngân hàng không được để trống",
      ),
    }),
    contractFileLink: Yup.mixed()
      .required("Vui lòng tải lên hợp đồng bản giấy")
      .test(
        "fileSize",
        "Dung lượng file tối đa 5MB",
        (value) => value && value.size <= 5 * 1024 * 1024,
      )
      .test(
        "fileType",
        "Chỉ chấp nhận file PDF, DOC hoặc DOCX",
        (value) =>
          value &&
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(value.type),
      ),
  });
  return (
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={initialValues}
      validationSchema={FORM_SCHEMA}
      onSubmit={createContract}
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
        <Box p={2} component="form" onSubmit={handleSubmit}>
          {/* ===== Sticky Header ===== */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "background.paper",
              borderBottom: "1px solid #e0e0e0",
              px: 3,
              py: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
              }}
            >
              <PageTitle
                title="TẠO HỢP ĐỒNG THUYỀN VIÊN"
                subtitle="Tạo và lưu hợp đồng mới vào hệ thống"
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid || !dirty || creating}
                  startIcon={!creating && <SaveIcon />}
                  sx={{
                    minWidth: 150,
                    px: 3,
                    fontWeight: 700,
                    backgroundColor: Color.PrimaryGold,
                    color: Color.PrimaryBlack,
                  }}
                >
                  {creating ? (
                    <CircularProgress
                      size={22}
                      sx={{ color: Color.PrimaryBlack }}
                    />
                  ) : (
                    "Tạo hợp đồng"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* ===== Title ===== */}
          <SectionWrapper>
            <Grid container spacing={2}>
              <Grid size={6}>
                <InfoTextField
                  label="Tiêu đề hợp đồng"
                  required
                  fullWidth
                  name="title"
                  value={values.title}
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== Party A ===== */}
          <SectionWrapper>
            <SectionDivider sectionName="Người sử dụng lao động (Bên A)" />
            <Grid container spacing={2} mt={1}>
              <Grid size={4}>
                <InfoTextField
                  label="Tên công ty"
                  required
                  fullWidth
                  name="partyA.compName"
                  value={values.partyA?.compName}
                  error={
                    !!touched.partyA?.compName && !!errors.partyA?.compName
                  }
                  helperText={
                    touched.partyA?.compName && errors.partyA?.compName
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={6}>
                <InfoTextField
                  label="Địa chỉ"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={2}>
                <InfoTextField
                  label="Số điện thoại"
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
                  label="Người đại diện"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  label="Chức vụ"
                  required
                  fullWidth
                  name="partyA.representativePos"
                  error={
                    !!touched.partyA?.representativePos &&
                    !!errors.partyA?.representativePos
                  }
                  helperText={
                    touched.partyA?.representativePos &&
                    errors.partyA?.representativePos
                  }
                  value={values.partyA?.representativePos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== Party B ===== */}
          <SectionWrapper>
            <SectionDivider sectionName="Người lao động (Bên B)" />
            <Grid container spacing={2} mt={1}>
              <Grid size={6}>
                <InfoTextField
                  label="Họ và tên"
                  required
                  fullWidth
                  name="partyB.fullName"
                  value={values.partyB?.fullName}
                  error={
                    !!touched.partyB?.fullName && !!errors.partyB?.fullName
                  }
                  helperText={
                    touched.partyB?.fullName && errors.partyB?.fullName
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  type="date"
                  label="Ngày sinh"
                  required
                  fullWidth
                  name="partyB.dob"
                  value={values.partyB?.dob}
                  error={!!touched.partyB?.dob && !!errors.partyB?.dob}
                  helperText={touched.partyB?.dob && errors.partyB?.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="birthplace"
                  label="Nơi sinh"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={2}>
                <InfoTextField
                  label="Quốc tịch"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={5}>
                <InfoTextField
                  label="Địa chỉ thường trú"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="temporary-address"
                  label="Địa chỉ tạm trú"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={12}>
                <SubSegmentWrapper title="Thông tin Căn cước công dân">
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <InfoTextField
                        id="ci-number"
                        label="Số Căn cước công dân"
                        required
                        fullWidth
                        name="partyB.ciNumber"
                        value={values.partyB?.ciNumber}
                        error={
                          !!touched.partyB?.ciNumber &&
                          !!errors.partyB?.ciNumber
                        }
                        helperText={
                          touched.partyB?.ciNumber && errors.partyB?.ciNumber
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
                        required
                        fullWidth
                        name="partyB.ciIssueDate"
                        value={values.partyB?.ciIssueDate}
                        error={
                          !!touched.partyB?.ciIssueDate &&
                          !!errors.partyB?.ciIssueDate
                        }
                        helperText={
                          touched.partyB?.ciIssueDate &&
                          errors.partyB?.ciIssueDate
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                      />
                    </Grid>

                    <Grid size={5}>
                      <InfoTextField
                        id="ci-issue-place"
                        label="Nơi cấp"
                        required
                        fullWidth
                        name="partyB.ciIssuePlace"
                        value={values.partyB?.ciIssuePlace}
                        error={
                          !!touched.partyB?.ciIssuePlace &&
                          !!errors.partyB?.ciIssuePlace
                        }
                        helperText={
                          touched.partyB?.ciIssuePlace &&
                          errors.partyB?.ciIssuePlace
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </SubSegmentWrapper>
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== Job Info ===== */}
          <SectionWrapper>
            <SectionDivider sectionName="Thông tin công việc" />
            <Grid container spacing={2} mt={1}>
              <Grid size={4}>
                <InfoTextField
                  type="date"
                  label="Ngày bắt đầu"
                  required
                  fullWidth
                  name="jobInfo.startDate"
                  value={values.jobInfo?.startDate}
                  onChange={handleChange}
                  error={
                    !!touched.jobInfo?.startDate && !!errors.jobInfo?.startDate
                  }
                  helperText={
                    touched.jobInfo?.startDate && errors.jobInfo?.startDate
                  }
                  onBlur={handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  type="date"
                  label="Ngày kết thúc"
                  required
                  fullWidth
                  name="jobInfo.endDate"
                  value={values.jobInfo?.endDate}
                  error={
                    !!touched.jobInfo?.endDate && !!errors.jobInfo?.endDate
                  }
                  helperText={
                    touched.jobInfo?.endDate && errors.jobInfo?.endDate
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  id="position"
                  label="Vị trí chuyên môn"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={12}>
                <InfoTextField
                  label="Địa điểm làm việc"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={12}>
                <InfoTextField
                  label="Mô tả công việc"
                  required
                  multiline
                  rows={5}
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== Salary ===== */}
          <SectionWrapper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.15), transparent)",
            }}
          >
            <SectionDivider sectionName="Thông tin lương" />
            <Grid container spacing={2} mt={1}>
              <Grid size={3}>
                <InfoTextField
                  type="number"
                  label="Lương cơ bản"
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
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  type="number"
                  label="Phụ cấp"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  select
                  label="Hình thức trả lương"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {RECEIVE_METHOD.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </InfoTextField>
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  label="Thời hạn trả lương"
                  required
                  fullWidth
                  name="salaryInfo.payday"
                  value={values.salaryInfo?.payday}
                  error={
                    !!touched.salaryInfo?.payday && !!errors.salaryInfo?.payday
                  }
                  helperText={
                    touched.salaryInfo?.payday && errors.salaryInfo?.payday
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="salary-review-period"
                  label="Thời hạn được xét nâng lương"
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
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  id="bankAccount"
                  label="Tài khoản ngân hàng"
                  margin="none"
                  required
                  fullWidth
                  name="salaryInfo.bankAccount"
                  value={values.salaryInfo?.bankAccount}
                  error={
                    !!touched.salaryInfo?.bankAccount &&
                    !!errors.salaryInfo?.bankAccount
                  }
                  helperText={
                    touched.salaryInfo?.bankAccount &&
                    errors.salaryInfo?.bankAccount
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="bankName"
                  label="Tên ngân hàng"
                  margin="none"
                  required
                  fullWidth
                  name="salaryInfo.bankName"
                  value={values.salaryInfo?.bankName}
                  error={
                    !!touched.salaryInfo?.bankName &&
                    !!errors.salaryInfo?.bankName
                  }
                  helperText={
                    touched.salaryInfo?.bankName && errors.salaryInfo?.bankName
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          <SectionWrapper>
            <SectionDivider sectionName="Bản mềm" />
            <FileUploadField
              required
              id="contractFileLink"
              name="contractFileLink"
              helperText={touched.contractFileLink && errors.contractFileLink}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default CreateCrewContract;
