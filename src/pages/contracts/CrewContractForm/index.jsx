import React, { useMemo, useState } from "react";
import {
  SectionWrapper,
  FileUploadFieldFormik,
  PageTitle,
  InfoTextFieldFormik,
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
                  <InfoTextFieldFormik label="Tiêu đề hợp đồng" name="title" />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== Party A ===== */}
            <SectionWrapper title="Người sử dụng lao động (Bên A)">
              <Grid container spacing={2} mt={1}>
                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Tên công ty"
                    name="partyA.compName"
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Địa chỉ"
                    name="partyA.compAddress"
                  />
                </Grid>

                <Grid size={2}>
                  <InfoTextFieldFormik
                    label="Số điện thoại"
                    name="partyA.compPhoneNumber"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Người đại diện"
                    name="partyA.representative"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Chức vụ"
                    name="partyA.representativePos"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== Party B ===== */}
            <SectionWrapper title="Người lao động (Bên B)">
              <Grid container spacing={2} mt={1}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Họ và tên"
                    name="partyB.fullName"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    type="date"
                    label="Ngày sinh"
                    name="partyB.dob"
                  />
                </Grid>
                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Nơi sinh"
                    name="partyB.birthPlace"
                  />
                </Grid>

                <Grid size={2}>
                  <InfoTextFieldFormik
                    label="Quốc tịch"
                    name="partyB.nationality"
                  />
                </Grid>

                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Địa chỉ thường trú"
                    name="partyB.permanentAddr"
                  />
                </Grid>
                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Địa chỉ tạm trú"
                    name="partyB.temporaryAddr"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Số điện thoại"
                    name="partyB.phone"
                  />
                </Grid>
                <Grid size={12}>
                  <SectionWrapper title="Thông tin Căn cước công dân">
                    <Grid container spacing={2}>
                      <Grid size={4}>
                        <InfoTextFieldFormik
                          label="Số Căn cước công dân"
                          name="partyB.ciNumber"
                        />
                      </Grid>

                      <Grid size={3}>
                        <InfoTextFieldFormik
                          type="date"
                          label="Ngày cấp"
                          name="partyB.ciIssueDate"
                        />
                      </Grid>

                      <Grid size={5}>
                        <InfoTextFieldFormik
                          label="Nơi cấp"
                          name="partyB.ciIssuePlace"
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
                  <InfoTextFieldFormik
                    type="datetime-local"
                    label="Ngày bắt đầu"
                    name="jobInfo.startDate"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    label="Ngày kết thúc"
                    name="jobInfo.endDate"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Vị trí chuyên môn"
                    name="jobInfo.position"
                  />
                </Grid>
                <Grid size={12}>
                  <InfoTextFieldFormik
                    label="Địa điểm làm việc"
                    name="jobInfo.workingLocation"
                  />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik
                    label="Mô tả công việc"
                    multiline
                    rows={5}
                    name="jobInfo.jobDescription"
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
                  <InfoTextFieldFormik
                    type="number"
                    label="Lương cơ bản"
                    name="salaryInfo.basicSalary"
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
                  <InfoTextFieldFormik
                    label="Phụ cấp"
                    name="salaryInfo.allowance"
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    select
                    label="Hình thức trả lương"
                    name="salaryInfo.receiveMethod"
                  >
                    {RECEIVE_METHOD.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </InfoTextFieldFormik>
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Thời hạn trả lương"
                    name="salaryInfo.payday"
                  />
                </Grid>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Thời hạn được xét nâng lương"
                    name="salaryInfo.salaryReviewPeriod"
                  />
                </Grid>

                {values.salaryInfo?.receiveMethod ===
                  "Chuyển khoản ngân hàng" && (
                  <>
                    <Grid size={6}>
                      <InfoTextFieldFormik
                        label="Tài khoản ngân hàng"
                        name="salaryInfo.bankAccount"
                      />
                    </Grid>
                    <Grid size={6}>
                      <InfoTextFieldFormik
                        id="bankName"
                        label="Tên ngân hàng"
                        name="salaryInfo.bankName"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </SectionWrapper>

            <SectionWrapper title="Hợp đồng">
              <FileUploadFieldFormik required name="contractFile" />
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
