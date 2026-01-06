import {
  PageTitle,
  InfoTextField,
  ImageUploadFieldFormik,
  NationalityTextField,
  FileUploadFieldFormik,
} from "@components/common";
import {
  Stack,
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { createSupplyRequest } from "@/services/supplyReqServices";
import Color from "@constants/Color";
import Regex from "@/constants/Regex";
import SectionWrapper from "@/components/common/SectionWrapper";
import toast from "react-hot-toast";
import cloudinaryUpload from "@/services/cloudinaryServices";
import UploadStrategy from "@/constants/UploadStrategy";
import { datetimeToISO } from "@/utils/converter";

const SupplyRequestForm = () => {
  const navigate = useNavigate();

  const handleCreateRequestSubmit = async (values, { resetForm }) => {
    try {
      const [detailFileUploadRes, shipImageUploadRes] = await Promise.all([
        cloudinaryUpload(
          values.detailFile,
          UploadStrategy.CREW_RENTAL_REQUEST_DETAIL_FILE,
        ),
        cloudinaryUpload(values.shipInfo.image, UploadStrategy.SHIP_IMAGE),
      ]);

      //Calling API to create a new crew member
      const request = await createSupplyRequest(
        {
          ...values,
          rentalStartDate: datetimeToISO(values.rentalStartDate),
          rentalEndDate: datetimeToISO(values.rentalEndDate),
          imoNumber: values.IMONumber,
        },
        detailFileUploadRes.asset_id,
        shipImageUploadRes.asset_id,
      );
      resetForm();
      navigate("/supply-requests");
    } catch (err) {
      toast.error("Tạo yêu cầu thất bại!");
    }
  };

  const initialValues = {
    companyName: "",
    companyPhone: "",
    companyAddress: "",
    companyEmail: "",
    companyRepresentor: "",
    companyRepresentorPosition: "",
    rentalStartDate: "",
    rentalEndDate: "",
    detailFile: null,

    shipInfo: {
      image: null,
      IMONumber: "",
      name: "",
      countryISO: "",
      type: "",
      description: "",
    },
  };

  const SUPPLY_REQUEST_SCHEMA = Yup.object().shape({
    companyName: Yup.string().required("Tên công ty không được để trống"),
    companyAddress: Yup.string().required(
      "Địa chỉ công ty không được để trống",
    ),
    companyPhone: Yup.string()
      .matches(Regex.VN_PHONE, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    companyEmail: Yup.string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    companyRepresentor: Yup.string().required(
      "Tên người đại diện không được để trống",
    ),
    companyRepresentorPosition: Yup.string().required(
      "Chức vụ người đại diện không được để trống",
    ),
    rentalStartDate: Yup.date()
      .min(new Date(), "Thời gian bắt đầu thuê không hợp lệ")
      .required("Thời gian bắt đầu thuê không được để trống")
      .test(
        "is-before-end-datetime",
        "Thời bắt đầu thuê phải trước thời gian kết thúc thuê",
        function (value) {
          const { rentalEndDate } = this.parent; // Access sibling field estimatedTimeOfArrival
          return !rentalEndDate || value < rentalEndDate;
        },
      ),
    rentalEndDate: Yup.date()
      .min(new Date(), "Thời gian ket thúc thuê không hợp lệ")
      .required("Thời gian ket thúc thuê không được để trống")
      .test(
        "is-before-end-datetime",
        "Thời gian ket thúc thuê phải sau thời gian bắt đầu thuê",
        function (value) {
          const { rentalStartDate } = this.parent; // Access sibling field estimatedTimeOfArrival
          return !rentalStartDate || value > rentalStartDate;
        },
      ),
    detailFile: Yup.mixed().required("Vui lồng tải lên tệp chi tiết"),
    shipInfo: Yup.object().shape({
      name: Yup.string().required("Tên cửa tàu không được để trống"),
      IMONumber: Yup.string().required("Số IMO của tàu không được để trống"),
      type: Yup.string().required("Loại tàu không được để trống"),
      description: Yup.string(),
      image: Yup.mixed().required("Vui lồng tải lên hình ảnh tàu"),
    }),
  });

  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={SUPPLY_REQUEST_SCHEMA}
      onSubmit={handleCreateRequestSubmit}
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
      }) => (
        <Box component="form" onSubmit={handleSubmit} m={3}>
          {/* ===== HEADER ===== */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
            mb={4}
          >
            <PageTitle
              title="GỬI YÊU CẦU CUNG ỨNG"
              subtitle="Tạo và gửi yêu cầu cung ứng cho công ty INLACO Hải Phòng"
            />

            <Button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              sx={{
                height: 44,
                px: 3,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: Color.PrimaryGold,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#9e9e9e",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress
                    size={18}
                    sx={{ color: Color.PrimaryBlack }}
                  />
                  <Typography fontWeight={600}>Đang gửi...</Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ScheduleSendRoundedIcon />
                  <Typography fontWeight={700}>Gửi yêu cầu</Typography>
                </Stack>
              )}
            </Button>
          </Box>

          {/* ===== SECTION: COMPANY INFO ===== */}
          <SectionWrapper title="Thông tin công ty">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextField
                  label="Tên công ty"
                  required
                  fullWidth
                  name="companyName"
                  value={values.companyName}
                  error={!!touched.companyName && !!errors.companyName}
                  helperText={touched.companyName && errors.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={5}>
                <InfoTextField
                  label="Địa chỉ"
                  required
                  fullWidth
                  name="companyAddress"
                  value={values.companyAddress}
                  error={!!touched.companyAddress && !!errors.companyAddress}
                  helperText={touched.companyAddress && errors.companyAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={3}>
                <InfoTextField
                  label="Số điện thoại"
                  required
                  fullWidth
                  name="companyPhone"
                  value={values.companyPhone}
                  error={!!touched.companyPhone && !!errors.companyPhone}
                  helperText={touched.companyPhone && errors.companyPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  label="Email"
                  required
                  fullWidth
                  name="companyEmail"
                  value={values.companyEmail}
                  error={!!touched.companyEmail && !!errors.companyEmail}
                  helperText={touched.companyEmail && errors.companyEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid size={5}>
                <InfoTextField
                  label="Người đại diện"
                  required
                  fullWidth
                  name="companyRepresentor"
                  value={values.companyRepresentor}
                  error={
                    !!touched.companyRepresentor && !!errors.companyRepresentor
                  }
                  helperText={
                    touched.companyRepresentor && errors.companyRepresentor
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
                  name="companyRepresentorPosition"
                  value={values.companyRepresentorPosition}
                  error={
                    !!touched.companyRepresentorPosition &&
                    !!errors.companyRepresentorPosition
                  }
                  helperText={
                    touched.companyRepresentorPosition &&
                    errors.companyRepresentorPosition
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SECTION: SCHEDULE ===== */}
          <SectionWrapper title="Thông tin yêu cầu">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextField
                  type="datetime-local"
                  label="Thời gian bắt đầu thuê"
                  required
                  fullWidth
                  name="rentalStartDate"
                  value={values.rentalStartDate}
                  error={!!touched.rentalStartDate && !!errors.rentalStartDate}
                  helperText={touched.rentalStartDate && errors.rentalStartDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={4}>
                <InfoTextField
                  type="datetime-local"
                  label="Thời gian kết thúc thuê"
                  required
                  fullWidth
                  name="rentalEndDate"
                  value={values.rentalEndDate}
                  error={!!touched.rentalEndDate && !!errors.rentalEndDate}
                  helperText={touched.rentalEndDate && errors.rentalEndDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={12}>
                <FileUploadFieldFormik
                  accept=".doc,.docx,.pdf,.xls,.xlsx"
                  required
                  label="Danh sách số lượng cần cung ứng"
                  name="detailFile"
                  helperText={touched.detailFile && errors.detailFile}
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
                <InfoTextField
                  label="IMO"
                  fullWidth
                  name="shipInfo.IMONumber"
                  value={values.shipInfo?.IMONumber}
                  error={
                    !!touched.shipInfo?.IMONumber &&
                    !!errors.shipInfo?.IMONumber
                  }
                  helperText={
                    touched.shipInfo?.IMONumber && errors.shipInfo?.IMONumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <InfoTextField
                  label="Tên tàu"
                  fullWidth
                  name="shipInfo.name"
                  value={values.shipInfo?.name}
                  error={!!touched.shipInfo?.name && !!errors.shipInfo?.name}
                  helperText={touched.shipInfo?.name && errors.shipInfo?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <NationalityTextField
                  label="Quốc tịch"
                  fullWidth
                  name="shipInfo.countryISO"
                  value={values.shipInfo?.countryISO}
                  error={
                    !!touched.shipInfo?.countryISO &&
                    !!errors.shipInfo?.countryISO
                  }
                  helperText={
                    touched.shipInfo?.countryISO && errors.shipInfo?.countryISO
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <InfoTextField
                  label="Loại tàu"
                  fullWidth
                  name="shipInfo.type"
                  value={values.shipInfo?.type}
                  error={!!touched.shipInfo?.type && !!errors.shipInfo?.type}
                  helperText={touched.shipInfo?.type && errors.shipInfo?.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InfoTextField
                  label="Mô tả"
                  fullWidth
                  name="shipInfo.description"
                  value={values.shipInfo?.description}
                  error={
                    !!touched.shipInfo?.description &&
                    !!errors.shipInfo?.description
                  }
                  helperText={
                    touched.shipInfo?.description &&
                    errors.shipInfo?.description
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default SupplyRequestForm;
