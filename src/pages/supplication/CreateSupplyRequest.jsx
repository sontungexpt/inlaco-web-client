import {
  PageTitle,
  InfoTextFieldFormik,
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

  const handleFormSubmission = async (values, { resetForm }) => {
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
                <InfoTextFieldFormik label="Tên công ty" name="companyName" />
              </Grid>

              <Grid size={5}>
                <InfoTextFieldFormik label="Địa chỉ" name="companyAddress" />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  label="Số điện thoại"
                  name="companyPhone"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik label="Email" name="companyEmail" />
              </Grid>

              <Grid size={5}>
                <InfoTextFieldFormik
                  label="Người đại diện"
                  name="companyRepresentor"
                />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  label="Chức vụ"
                  name="companyRepresentorPosition"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SECTION: SCHEDULE ===== */}
          <SectionWrapper title="Thông tin yêu cầu">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Thời gian bắt đầu thuê"
                  name="rentalStartDate"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  type="datetime-local"
                  label="Thời gian kết thúc thuê"
                  name="rentalEndDate"
                />
              </Grid>

              <Grid size={12}>
                <FileUploadFieldFormik
                  accept=".doc,.docx,.pdf,.xls,.xlsx"
                  required
                  label="Danh sách số lượng cần cung ứng"
                  name="detailFile"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SECTION: SHIP INFO ===== */}
          <SectionWrapper title="Thông tin tàu">
            <Grid container spacing={3}>
              <Grid size={6}>
                <ImageUploadFieldFormik required name="shipInfo.image" />
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
        </Box>
      )}
    </Formik>
  );
};

export default SupplyRequestForm;
