import { useMemo, useState } from "react";
import {
  FileUploadFieldFormik,
  PageTitle,
  SectionWrapper,
  NationalityTextField,
  ImageUploadFieldFormik,
} from "@components/common";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Color from "@constants/Color";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import {
  createSupplyContract,
  editContract,
} from "@/services/contractServices";
import TemplateDialog from "../components/TemplateDialog";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import toast from "react-hot-toast";
import { mapValuesToRequestBody } from "./mapper";
import { FORM_SCHEMA } from "./schema";
import { buildInitialValues } from "./initial";
import { useSupplyRequest } from "@/hooks/services/supplyRequest";
import { useContract } from "@/hooks/services/contract";
import { keepChangedFields } from "@/utils/object";
import InfoTextFieldFormik from "@/components/common/fields/InfoTextFieldFormik";
import FormMode from "@/constants/FormMode";

const SupplyContractForm = () => {
  const navigate = useNavigate();
  const { contractId, requestId } = useParams();
  const formMode = contractId ? FormMode.EDIT : FormMode.CREATE;
  const isUpdateForm = formMode === FormMode.EDIT;

  const { data: requestInfo, isLoading: requestInfoLoading } =
    useSupplyRequest(requestId);

  const { data: contractInfo, isLoading: contractInfoLoading } =
    useContract(contractId);

  const freezedContract = contractInfo?.freezed;

  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const createContract = async (values) => {
    const [contractFileRes, shipImageRes] = await Promise.all([
      cloudinaryUpload(values.contractFile, UploadStrategy.CONTRACT_FILE),
      cloudinaryUpload(values.shipInfo.image, UploadStrategy.SHIP_IMAGE),
    ]);

    return createSupplyContract(
      requestId,
      mapValuesToRequestBody(values),
      contractFileRes.asset_id,
      shipImageRes.asset_id,
    );
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
      const contract = isUpdateForm
        ? await updateContract(values, helpers)
        : await createContract(values, helpers);
      if (!contract?.id) return;
      helpers.resetForm();
      navigate(`/supply-contracts/${contract.id}`);
    } catch (err) {
      const msg = isUpdateForm
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
        updatingForm: isUpdateForm,
        requestInfo,
        contractInfo,
      }),
    [isUpdateForm, requestInfo, contractInfo],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={FORM_SCHEMA}
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
      }) => (
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
                isUpdateForm
                  ? "CÂP NHẤT HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
                  : "TẠO HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
              }
              subtitle={isUpdateForm ? "Lưu hợp đồng mới" : "Tạo hợp đồng"}
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
                  !isValid ||
                  !dirty ||
                  isSubmitting ||
                  requestInfoLoading ||
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
                {isUpdateForm
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
              <Grid item size={4}>
                <InfoTextFieldFormik
                  label="Người đại diện"
                  name="partyA.representative"
                />
              </Grid>
              <Grid item size={5}>
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
              <Grid item size={4}>
                <InfoTextFieldFormik
                  label="Người đại diện"
                  name="partyB.representative"
                />
              </Grid>
              <Grid item size={5}>
                <InfoTextFieldFormik
                  label="Chức vụ"
                  name="partyB.representativePos"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          <SectionWrapper title="Thông tin hợp đồng*: ">
            <Grid container spacing={2}>
              <Grid item size={6}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Ngày bắt đầu hợp đồng"
                  name="contractInfo.startDate"
                />
              </Grid>
              <Grid item size={6}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Ngày kết thúc hợp đồng"
                  name="contractInfo.endDate"
                />
              </Grid>
              <Grid size={6}>
                <InfoTextFieldFormik
                  type="number"
                  label="Tổng số nhân lực cần cung ứng"
                  name="contractInfo.numOfCrewMember"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">người</InputAdornment>
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
            </Grid>
          </SectionWrapper>
          {/* ===== SECTION: SHIP INFO ===== */}
          <SectionWrapper title="Thông tin tàu">
            <Grid container spacing={3}>
              <Grid size={6}>
                <ImageUploadFieldFormik
                  required
                  helperText={touched.shipInfo?.image && errors.shipInfo?.image}
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

          <SectionWrapper title="Bản mềm">
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
      )}
    </Formik>
  );
};
export default SupplyContractForm;
