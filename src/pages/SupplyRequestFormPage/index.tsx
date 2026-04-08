import {
  PageTitle,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
  FileUploadFieldFormik,
  SectionWrapper,
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
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import Color from "@constants/Color";
import toast from "react-hot-toast";

import cloudinaryUpload from "@/services/cloudinary.service";
import { createSupplyRequest } from "@/services/supply-request.service";

import UploadStrategy from "@/constants/UploadStrategy";

import { BASE_FORM_VALUES } from "./initial";
import { FORM_SCHEMA, FormValues } from "./schema";
import { mapValuesToNewSupplyRequest } from "./mapper";

export default function SupplyRequestFormPage() {
  const navigate = useNavigate();

  const handleFormSubmission = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const [detailFileUploadRes, shipImageUploadRes] = await Promise.all([
        cloudinaryUpload(
          values.detailFile,
          UploadStrategy.CREW_RENTAL_REQUEST_DETAIL_FILE,
        ),
        cloudinaryUpload(values.shipInfo.image, UploadStrategy.SHIP_IMAGE),
      ]);

      const request = await createSupplyRequest(
        mapValuesToNewSupplyRequest(
          values,
          detailFileUploadRes.assetId as string,
          shipImageUploadRes.assetId as string,
        ),
      );
      resetForm();
      navigate("/supply-requests");
    } catch (err) {
      toast.error("Tạo yêu cầu thất bại!");
    }
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur
      initialValues={BASE_FORM_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleFormSubmission}
    >
      {({ dirty, isSubmitting, handleSubmit }) => (
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
              disabled={!dirty || isSubmitting}
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
}
