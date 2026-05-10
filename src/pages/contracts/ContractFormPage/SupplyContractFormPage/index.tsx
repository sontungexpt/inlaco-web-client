import { useMemo, useState } from "react";
import {
  FileUploadFieldFormik,
  PageTitle,
  SectionWrapper,
  NationalityTextField,
  ImageUploadFieldFormik,
} from "@components/common";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Color from "@constants/Color";
import { Formik, FormikHelpers } from "formik";
import { useNavigate, useSearchParams } from "react-router";
import { createSupplyContract } from "@/services/contract.service";
import TemplateDialog from "@/components/contract-templates/TemplateDialog";
import cloudinaryUpload, { FileRequest } from "@/services/cloudinary.service";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import {
  mapContractToFormValues,
  mapSupplyRequestToFormValues,
  mapValuesToNewSupplyContract,
} from "./mapper";
import { FORM_SCHEMA, FormValues } from "./schema";
import { BASE_FORM_VALUES } from "./initial";

import { useSupplyRequest } from "@/queries/supply-request.query";
import { useContract, useEditContract } from "@/queries/contract.query";
import { keepChangedFields } from "@/utils/object";
import InfoTextFieldFormik from "@/components/common/fields/InfoTextFieldFormik";
import {
  CrewSupplyContract,
  NewCrewSupplyContract,
} from "@/types/api/contract.api";
import { useFormIdentifider } from "../hooks/useFormIdentifier";

export type SypplyContractFormParams = {
  contractId?: string;
  supplyRequestId?: string;
  isEdit?: boolean;
};

const useSupplyContractFormParams = (): SypplyContractFormParams => {
  const { contractId, isEdit } = useFormIdentifider();
  const [searchParams] = useSearchParams({});
  const supplyRequestId = searchParams.get("supplyRequestId") || undefined;
  return { contractId, supplyRequestId, isEdit };
};

const SupplyContractFormPage = () => {
  const navigate = useNavigate();
  const { contractId, supplyRequestId, isEdit } = useSupplyContractFormParams();

  const { data: supplyRequestInfo, isLoading: requestInfoLoading } =
    useSupplyRequest(supplyRequestId);
  const { data: contractInfo, isLoading: contractInfoLoading } =
    useContract(contractId);

  const { mutateAsync: editContract } = useEditContract<
    NewCrewSupplyContract,
    CrewSupplyContract
  >();

  const freezedContract = contractInfo?.freezed;
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const initialValues = useMemo(
    () =>
      isEdit
        ? mapContractToFormValues(
            BASE_FORM_VALUES,
            contractInfo as CrewSupplyContract,
          )
        : mapSupplyRequestToFormValues(BASE_FORM_VALUES, supplyRequestInfo),
    [isEdit, supplyRequestInfo, contractInfo],
  );

  const createContract = async (values: FormValues) => {
    const [shipImageResult, contractFileResult, ...attachmentResults] =
      await Promise.all([
        cloudinaryUpload(values.shipInfo.image, UploadStrategy.SHIP_IMAGE),
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

    return createSupplyContract(
      supplyRequestId as string,
      mapValuesToNewSupplyContract(values, {
        contractFileId: contractFileResult.assetId,
        shipImageId: shipImageResult.assetId,
        attachmentFileIds: attachmentResults?.map((file) => file.assetId),
      }),
      contractFileResult.asset_id,
      shipImageResult.asset_id,
    );
  };

  const updateContract = async (values: FormValues) => {
    const [shipImageResult, contractFile, ...attachmentFiles] =
      await Promise.all([
        values.shipInfo?.image instanceof File
          ? cloudinaryUpload(values.shipInfo.image, UploadStrategy.SHIP_IMAGE)
          : null,
        // keep the order
        values.contractFile &&
          cloudinaryUpload(values.contractFile, UploadStrategy.CONTRACT_FILE),
        ...(values?.attachmentFiles?.map((file: FileRequest) =>
          cloudinaryUpload(file, UploadStrategy.CONTRACT_FILE),
        ) || []),
      ]);

    const oldRequest = mapValuesToNewSupplyContract(initialValues, {} as any);
    const newRequest = mapValuesToNewSupplyContract(values, {
      shipImageId: shipImageResult?.assetId,
      contractFileId: contractFile?.assetId,
      attachmentFileIds: attachmentFiles?.map((file) => file?.assetId),
    });

    const patchRequest = keepChangedFields(oldRequest, newRequest, {
      keepPaths: ["initiator"],
    }) as NewCrewSupplyContract;

    const contract = await editContract({
      id: contractInfo!.id,
      newDatas: patchRequest,
      type: "SUPPLY_CONTRACT",
    });

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
      helpers.resetForm();
      navigate(`/contracts/${contract.id}`);
    } catch (err) {
      const msg = isEdit
        ? freezedContract
          ? "Thêm phụ lục thất bại"
          : "Cập nhật hợp đồng thất bại"
        : "Tạo hợp đồng thất bại";
      toast.error(msg);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validateOnBlur
      validateOnChange={false}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleFormSubmission}
    >
      {({ values, errors, touched, dirty, isSubmitting, handleSubmit }) => {
        console.log(errors);
        return (
          <Box component="form" onSubmit={handleSubmit} p={2}>
            {/* ===== Sticky Header ===== */}
            <SectionWrapper
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "background.paper",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <PageTitle
                title={
                  isEdit
                    ? "CÂP NHẤT HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
                    : "TẠO HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
                }
                subtitle={isEdit ? "Lưu hợp đồng mới" : "Tạo hợp đồng"}
              />

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  onClick={() => setOpenTemplateDialog(true)}
                  sx={{
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
                    !dirty ||
                    isSubmitting ||
                    requestInfoLoading ||
                    contractInfoLoading
                  }
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress
                        size={22}
                        sx={{
                          mr: 2,
                          color: Color.PrimaryBlack,
                        }}
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
                  {isEdit
                    ? freezedContract
                      ? "Thêm phụ lục"
                      : "Sửa hợp đồng"
                    : "Tạo hợp đồng"}
                </Button>
              </Box>
            </SectionWrapper>
            <SectionWrapper>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <InfoTextFieldFormik label="Tiêu đề hợp đồng" name="title" />
                </Grid>
              </Grid>
            </SectionWrapper>

            <SectionWrapper title="Công ty Cung ứng lao động (Bên A)*: ">
              <Grid container spacing={2}>
                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Tên công ty"
                    name="partyA.compName"
                  />
                </Grid>
                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Địa chỉ"
                    name="partyA.compAddress"
                  />
                </Grid>
                <Grid size={3}>
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
                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Chức vụ"
                    name="partyA.representativePos"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
            <SectionWrapper title="Công ty yêu cầu Cung ứng lao động (Bên B)*: ">
              <Grid container spacing={2}>
                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Tên công ty"
                    name="partyB.compName"
                  />
                </Grid>
                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Địa chỉ"
                    name="partyB.compAddress"
                  />
                </Grid>
                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Số điện thoại"
                    name="partyB.compPhoneNumber"
                  />
                </Grid>
                <Grid size={4}>
                  <InfoTextFieldFormik
                    label="Email công ty"
                    name="partyB.companyEmail"
                  />
                </Grid>
                <Grid size={5}>
                  <InfoTextFieldFormik
                    label="Người đại diện"
                    name="partyB.representative"
                  />
                </Grid>
                <Grid size={3}>
                  <InfoTextFieldFormik
                    label="Chức vụ"
                    name="partyB.representativePos"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>
            <SectionWrapper title="Thông tin hợp đồng*: ">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    label="Ngày bắt đầu hợp đồng"
                    name="activationDate"
                  />
                </Grid>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    label="Ngày kết thúc hợp đồng"
                    name="expiryDate"
                  />
                </Grid>
                {/* <Grid size={6}> */}
                {/*   <InfoTextFieldFormik */}
                {/*     type="number" */}
                {/*     label="Tổng số nhân lực cần cung ứng" */}
                {/*     name="numOfCrewMember" */}
                {/*     slotProps={{ */}
                {/*       input: { */}
                {/*         endAdornment: ( */}
                {/*           <InputAdornment position="end">người</InputAdornment> */}
                {/*         ), */}
                {/*       }, */}
                {/*     }} */}
                {/*     sx={{ */}
                {/*       "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": */}
                {/*         { */}
                {/*           display: "none", */}
                {/*         }, */}
                {/*       "& input[type=number]": { */}
                {/*         MozAppearance: "textfield", */}
                {/*       }, */}
                {/*     }} */}
                {/*   /> */}
                {/* </Grid> */}
              </Grid>
            </SectionWrapper>
            {/* ===== SECTION: SHIP INFO ===== */}
            <SectionWrapper title="Thông tin tàu">
              <Grid container spacing={3}>
                <Grid size={6}>
                  <ImageUploadFieldFormik
                    required
                    helperText={
                      touched.shipInfo?.image && errors.shipInfo?.image
                    }
                    name="shipInfo.image"
                  />
                </Grid>

                <Grid size={6} container direction="column" rowSpacing={3}>
                  <InfoTextFieldFormik label="IMO" name="shipInfo.IMONumber" />
                  <InfoTextFieldFormik label="Tên tàu" name="shipInfo.name" />
                  <NationalityTextField
                    component={InfoTextFieldFormik}
                    label="Quốc tịch"
                    name="shipInfo.countryISO"
                  />
                  <InfoTextFieldFormik label="Loại tàu" name="shipInfo.type" />
                  <InfoTextFieldFormik
                    label="Mô tả"
                    name="shipInfo.description"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            <SectionWrapper title="Hợp đồng bản giấy (Có thể tải lên sau nhưng sẽ yêu cầu khi kí)">
              <FileUploadFieldFormik
                name="contractFile"
                helperText={touched.contractFile && errors.contractFile}
                disabled={false}
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
export default SupplyContractFormPage;
