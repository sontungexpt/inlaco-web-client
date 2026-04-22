import { useMemo, useState } from "react";
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
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Formik, FormikHelpers } from "formik";
import { useNavigate, useSearchParams } from "react-router";
import Color from "@constants/Color";
import { createLaborContract, editContract } from "@/services/contract.service";
import cloudinaryUpload, { FileRequest } from "@/services/cloudinary.service";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import { keepChangedFields } from "@/utils/object";
import { ContractQueryKey, useContract } from "@/queries/contract.query";
import { useCandidate } from "@/queries/post.query";
import { BASE_FORM_VALUES, RECEIVE_METHOD } from "./initial";
import { FormValues, SCHEMA } from "./schema";
import TemplateDialog from "@/components/contract-templates/TemplateDialog";

import {
  mapCandidateInfoToFormValues,
  mapContractToFormValues,
  mapValuesToRequestBody,
} from "./mapper";

import { useQueryClient } from "@tanstack/react-query";
import { LaborContract, NewLaborContract } from "@/types/api/contract.api";
import { useFormIdentifider } from "../hooks/useFormIdentifier";

export interface CrewContractFormParams {
  candidateId?: string;
  contractId?: string;
  isEdit?: boolean;
}

export const useContractFormParams = (): CrewContractFormParams => {
  const { contractId, isEdit } = useFormIdentifider();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId") || undefined;
  return { candidateId, contractId, isEdit };
};

const CrewContractFormPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { candidateId, contractId, isEdit } = useContractFormParams();

  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const { data: candidateInfo, isLoading: candidateInfoLoading } =
    useCandidate(candidateId);

  const { data: contractInfo, isLoading: contractInfoLoading } =
    useContract(contractId);

  const IS_FREEZED_CONTRACT = contractInfo?.freezed;

  const createContract = async (values: FormValues) => {
    const [contractFileResult, ...attachmentResults] = await Promise.all([
      // keep the order
      values.contractFile &&
        cloudinaryUpload(
          values.contractFile as FileRequest,
          UploadStrategy.CONTRACT_FILE,
        ),
      ...(values.attachmentFiles?.map((f) =>
        cloudinaryUpload(f, UploadStrategy.CONTRACT_FILE),
      ) || []),
    ]);

    return await createLaborContract(
      candidateId as string,
      mapValuesToRequestBody(values, {
        contractFile: contractFileResult.assetId,
        attachments: attachmentResults.map((file) => file.assetId),
      }),
    );
  };

  const updateContract = async (values: FormValues) => {
    const [contractFile, ...attachmentFiles] = await Promise.all([
      // keep the order
      values.contractFile &&
        cloudinaryUpload(values.contractFile, UploadStrategy.CONTRACT_FILE),
      ...(values?.attachmentFiles?.map((file) =>
        cloudinaryUpload(file, UploadStrategy.CONTRACT_FILE),
      ) || []),
    ]);

    const oldRequest = mapValuesToRequestBody(initialValues, {});
    const newRequest = mapValuesToRequestBody(values, {
      contractFile: contractFile?.assetId,
      attachments: attachmentFiles?.map((file) => file?.assetId),
    });

    const patchRequest = keepChangedFields(oldRequest, newRequest, {
      keepPaths: ["initiator"],
    }) as NewLaborContract;

    const contract = await editContract<NewLaborContract>(
      (contractInfo as LaborContract).id as string,
      patchRequest,
      "LABOR_CONTRACT",
    );

    return contract;
  };

  const handleFormSubmission = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>,
  ) => {
    try {
      const contract = isEdit
        ? await updateContract(values)
        : await createContract(values);

      if (!contract?.id) return;

      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });

      helpers.resetForm();
      navigate(`/contracts/${contract.id}`);
    } catch (err) {
      const msg = isEdit
        ? IS_FREEZED_CONTRACT
          ? "Thêm phụ lục thất bại"
          : "Cập nhật hợp đồng thất bại"
        : "Tạo hợp đồng thất bại";
      toast.error(msg);
    }
  };

  const initialValues = useMemo(
    () =>
      isEdit
        ? mapContractToFormValues(
            BASE_FORM_VALUES,
            contractInfo as LaborContract,
          )
        : mapCandidateInfoToFormValues(BASE_FORM_VALUES, candidateInfo),
    [isEdit, candidateInfo, contractInfo],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={SCHEMA}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={handleFormSubmission}
    >
      {(formik) => {
        const { values, isValid, dirty, isSubmitting, handleSubmit } = formik;
        // const handleSubmitClick = useFormikSubmitWithScroll(formik);

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
                  // type="button"
                  // onClick={handleSubmitClick}

                  variant="contained"
                  disabled={
                    !dirty ||
                    isSubmitting ||
                    contractInfoLoading ||
                    candidateInfoLoading
                  }
                  loading={isSubmitting}
                  loadingIndicator={<CircularProgress size={22} />}
                  startIcon={!isSubmitting && <SaveIcon />}
                  sx={{
                    minWidth: 150,
                    px: 3,
                    fontWeight: 700,
                    backgroundColor: Color.PrimaryGold,
                    color: Color.PrimaryBlack,
                  }}
                >
                  {isEdit ? "Sửa hợp đồng" : "Tạo hợp đồng"}
                </Button>
              </Box>
            </SectionWrapper>

            {/* ===== TITLE ===== */}
            <SectionWrapper>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <InfoTextFieldFormik label="Tiêu đề hợp đồng" name="title" />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== EMPLOYER (BÊN A) ===== */}
            <SectionWrapper title="Người sử dụng lao động (Bên A)">
              <Grid container spacing={2} mt={1}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Tên công ty"
                    name="employer.companyName"
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Địa chỉ"
                    name="employer.companyAddress"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Số điện thoại"
                    name="employer.companyPhone"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Người đại diện"
                    name="employer.representativeName"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Chức vụ"
                    name="employer.representativePosition"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== EMPLOYEE (BÊN B) ===== */}
            <SectionWrapper title="Người lao động (Bên B)">
              <Grid container spacing={2} mt={1}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Họ và tên"
                    name="employee.fullName"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    type="date"
                    label="Ngày sinh"
                    name="employee.birthDate"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Nơi sinh"
                    name="employee.birthPlace"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Quốc tịch"
                    name="employee.nationality"
                  />
                </Grid>

                <Grid size={5}>
                  <InfoTextFieldFormik label="Email" name="employee.email" />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="SĐT"
                    name="employee.phoneNumber"
                  />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik
                    label="Địa chỉ thường trú"
                    name="employee.permanentAddress"
                  />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik
                    label="Địa chỉ tạm trú"
                    name="employee.temporaryAddress"
                  />
                </Grid>

                {/* CCCD */}
                <Grid size={12}>
                  <SectionWrapper title="Thông tin CCCD">
                    <Grid container spacing={2}>
                      <Grid size={4}>
                        <InfoTextFieldFormik
                          label="Số CCCD"
                          name="employee.idCardNumber"
                        />
                      </Grid>

                      <Grid size={4}>
                        <InfoTextFieldFormik
                          type="date"
                          label="Ngày cấp"
                          name="employee.idCardIssueDate"
                        />
                      </Grid>

                      <Grid size={4}>
                        <InfoTextFieldFormik
                          label="Nơi cấp"
                          name="employee.idCardIssuePlace"
                        />
                      </Grid>
                    </Grid>
                  </SectionWrapper>
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== JOB INFO ===== */}
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
                  <InfoTextFieldFormik label="Vị trí" name="jobInfo.position" />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik
                    label="Địa điểm làm việc"
                    name="jobInfo.workLocation"
                  />
                </Grid>

                <Grid size={12}>
                  <InfoTextFieldFormik
                    multiline
                    rows={5}
                    label="Mô tả công việc"
                    name="jobInfo.jobDescription"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ===== SALARY ===== */}
            <SectionWrapper title="Thông tin lương">
              <Grid container spacing={2} mt={1}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="number"
                    label="Lương cơ bản"
                    name="salaryInfo.baseSalary"
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
                    name="salaryInfo.paymentMethod"
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
                    label="Ngày trả lương"
                    name="salaryInfo.payday"
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    label="Chu kỳ xét lương"
                    name="salaryInfo.salaryReviewCycle"
                  />
                </Grid>

                {values.salaryInfo?.paymentMethod ===
                  "Chuyển khoản ngân hàng" && (
                  <>
                    <Grid size={6}>
                      <InfoTextFieldFormik
                        label="Số tài khoản"
                        name="salaryInfo.bankAccountNumber"
                      />
                    </Grid>

                    <Grid size={6}>
                      <InfoTextFieldFormik
                        label="Ngân hàng"
                        name="salaryInfo.bankName"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </SectionWrapper>

            {/* ===== FILES ===== */}
            <SectionWrapper title="Hợp đồng (Có thể tải lên sau nhưng bắt buộc khi xác nhận)">
              <FileUploadFieldFormik required={false} name="contractFile" />
            </SectionWrapper>

            <SectionWrapper title="Đính kèm">
              <FileUploadFieldFormik
                name="attachmentFiles"
                multiple
                required={false}
              />
            </SectionWrapper>

            <TemplateDialog
              type="LABOR_CONTRACT"
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

export default CrewContractFormPage;
