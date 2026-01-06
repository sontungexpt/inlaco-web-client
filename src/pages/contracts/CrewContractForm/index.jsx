import React, { useMemo, useState } from "react";
import {
  SectionWrapper,
  FileUploadFieldFormik,
  PageTitle,
  InfoTextField,
} from "@components/common";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router";
import Color from "@constants/Color";
import { createLaborContract, editContract } from "@/services/contractServices";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import { keepChangedFields } from "@/utils/object";
import { useContract } from "@/hooks/services/contract";
import { useCandidate } from "@/hooks/services/post";
import { buildInitialValues } from "./initial";
import { SCHEMA } from "./schema";
import { RECEIVE_METHOD } from "./defaults";
import TemplateDialog from "../components/TemplateDialog";
import { mapValuesToRequestBody } from "./mapper";

const CrewContractForm = () => {
  const navigate = useNavigate();
  const {
    state: { candidateProfileId, contractId, type: formType = "create" } = {},
  } = useLocation();
  const updatingForm = formType === "update";

  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const { data: candidateInfo, isLoading: candidateInfoLoading } =
    useCandidate(candidateProfileId);
  const { data: contractInfo, isLoading: contractInfoLoading } =
    useContract(contractId);
  const freezedContract = contractInfo?.freezed;

  const createContract = async (values) => {
    const uploadRespone = await cloudinaryUpload(
      values.contractFile,
      UploadStrategy.CONTRACT_FILE,
    );

    //Calling API to create a new crew member
    const contract = await createLaborContract(
      candidateProfileId,
      mapValuesToRequestBody(values, {
        contractFileAssetId: uploadRespone?.assetId || uploadRespone?.asset_id,
      }),
    );
    return contract;
  };

  const updateContract = async (values) => {
    // const uploadRespone = await cloudinaryUpload(
    //   values.contractFile,
    //   UploadStrategy.CONTRACT_FILE,
    // );
    const changedValues = keepChangedFields(
      contractInfo,
      mapValuesToRequestBody(values, {}),
    );

    //Calling API to create a new crew member
    const contract = await editContract(
      contractInfo?.id,
      changedValues,
      freezedContract,
    );

    return contract;
  };

  const handleFormSubmission = async (values, helpers) => {
    try {
      const contract = updatingForm
        ? await updateContract(values, helpers)
        : await createContract(values, helpers);
      if (!contract?.id) return;
      helpers.resetForm();
      navigate(`/crew-contracts/${contract.id}`);
    } catch (err) {
      const msg = updatingForm
        ? freezedContract
          ? "Thêm phụ lục thất bại"
          : "Cập nhật hợp đồng thất bại"
        : "Tạo hợp đồng thất bại";
      toast.error(msg);
    }
  };

  const initialValues = useMemo(
    () =>
      buildInitialValues({
        updatingForm,
        candidateInfo,
        contractInfo,
      }),
    [updatingForm, candidateInfo, contractInfo],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={SCHEMA}
      onSubmit={handleFormSubmission}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => {
        return (
          <Box p={2} component="form" onSubmit={handleSubmit}>
            {/* ===== Sticky Header ===== */}
            <SectionWrapper
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
              <PageTitle
                mb={2}
                title="TẠO HỢP ĐỒNG THUYỀN VIÊN"
                subtitle="Tạo và lưu hợp đồng mới vào hệ thống"
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={() => setOpenTemplateDialog(true)}
                  variant="contained"
                  sx={{
                    minWidth: 150,
                    px: 3,
                    fontWeight: 700,
                    backgroundColor: Color.PrimaryBlue,
                    color: Color.PrimaryWhite,
                  }}
                >
                  Tải template
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !isValid ||
                    !dirty ||
                    isSubmitting ||
                    candidateInfoLoading ||
                    contractInfoLoading
                  }
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress
                        size={22}
                        mr={2}
                        sx={{ color: Color.PrimaryBlack }}
                      />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    minWidth: 150,
                    px: 3,
                    fontWeight: 700,
                    backgroundColor: Color.PrimaryGold,
                    color: Color.PrimaryBlack,
                  }}
                >
                  {updatingForm
                    ? freezedContract
                      ? "Thêm phụ lục"
                      : "Sửa hợp đồng"
                    : "Tạo hợp đồng"}
                </Button>
              </Box>
            </SectionWrapper>

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
            <SectionWrapper title="Người sử dụng lao động (Bên A)">
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
            <SectionWrapper title="Người lao động (Bên B)">
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
                    id="birthPlace"
                    label="Nơi sinh"
                    margin="none"
                    required
                    fullWidth
                    name="partyB.birthPlace"
                    value={values.partyB?.birthPlace}
                    error={
                      !!touched.partyB?.birthPlace &&
                      !!errors.partyB?.birthPlace
                    }
                    helperText={
                      touched.partyB?.birthPlace && errors.partyB?.birthPlace
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

                <Grid size={3}>
                  <InfoTextField
                    label="Số điện thoại"
                    required
                    fullWidth
                    name="partyB.phone"
                    value={values.partyB?.phone}
                    error={!!touched.partyB?.phone && !!errors.partyB?.phone}
                    helperText={touched.partyB?.phone && errors.partyB?.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={12}>
                  <SectionWrapper title="Thông tin Căn cước công dân">
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
                  </SectionWrapper>
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== Job Info ===== */}
            <SectionWrapper title="Thông tin công việc">
              <Grid container spacing={2} mt={1}>
                <Grid size={4}>
                  <InfoTextField
                    type="datetime-local"
                    label="Ngày bắt đầu"
                    required
                    fullWidth
                    name="jobInfo.startDate"
                    value={values.jobInfo?.startDate}
                    error={
                      !!touched.jobInfo?.startDate &&
                      !!errors.jobInfo?.startDate
                    }
                    helperText={
                      touched.jobInfo?.startDate && errors.jobInfo?.startDate
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextField
                    type="datetime-local"
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
              title="Thống tin lương"
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(255,215,0,0.15), transparent)",
              }}
            >
              <Grid container spacing={2} mt={1}>
                <Grid size={6}>
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

                <Grid size={6}>
                  <InfoTextField
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

                <Grid size={6}>
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

                <Grid size={6}>
                  <InfoTextField
                    label="Thời hạn trả lương"
                    required
                    fullWidth
                    name="salaryInfo.payday"
                    value={values.salaryInfo?.payday}
                    error={
                      !!touched.salaryInfo?.payday &&
                      !!errors.salaryInfo?.payday
                    }
                    helperText={
                      touched.salaryInfo?.payday && errors.salaryInfo?.payday
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={6}>
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

                {values.salaryInfo?.receiveMethod ===
                  "Chuyển khoản ngân hàng" && (
                  <>
                    <Grid size={6}>
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
                    <Grid size={6}>
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
                          touched.salaryInfo?.bankName &&
                          errors.salaryInfo?.bankName
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </SectionWrapper>

            <SectionWrapper title="Hợp đồng">
              <FileUploadFieldFormik
                required
                name="contractFile"
                helperText={touched.contractFile && errors.contractFile}
              />
            </SectionWrapper>

            <TemplateDialog
              open={openTemplateDialog}
              onClose={() => setOpenTemplateDialog(false)}
              title="Chọn template hợp đồng"
              initialData={() => values}
              fullWidth
              maxWidth="lg"
            />
          </Box>
        );
      }}
    </Formik>
  );
};

export default CrewContractForm;
