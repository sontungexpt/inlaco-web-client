import {
  PageTitle,
  InfoTextFieldFormik,
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
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import Color from "@constants/Color";
import toast from "react-hot-toast";

import { BASE_FORM_VALUES } from "./initial";
import { FORM_SCHEMA, FormValues } from "./schema";
import { mapValuesToNewShipSchedule } from "./mapper";

export default function ShipScheduleFormPage() {
  const navigate = useNavigate();

  const handleFormSubmission = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      // TODO: Call API to create ship schedule
      // const shipSchedule = await createShipSchedule(
      //   mapValuesToNewShipSchedule(values),
      // );
      
      const shipSchedule = mapValuesToNewShipSchedule(values);
      console.log("Ship Schedule created:", shipSchedule);
      
      resetForm();
      toast.success("Tạo lịch trình tàu thành công!");
      navigate("/shipschedule");
    } catch (err) {
      console.error(err);
      toast.error("Tạo lịch trình tàu thất bại!");
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
              title="TẠO LỊCH TRÌNH TÀU"
              subtitle="Tạo mới lịch trình hoạt động của tàu"
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
                  <Typography fontWeight={600}>Đang lưu...</Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SaveRoundedIcon />
                  <Typography fontWeight={700}>Lưu lịch trình</Typography>
                </Stack>
              )}
            </Button>
          </Box>

          {/* ===== SECTION: PARTNER INFO ===== */}
          <SectionWrapper title="Thông tin đối tác">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextFieldFormik label="Tên công ty" name="partnerName" />
              </Grid>

              <Grid size={5}>
                <InfoTextFieldFormik label="Địa chỉ" name="partnerAddress" />
              </Grid>

              <Grid size={3}>
                <InfoTextFieldFormik
                  label="Số điện thoại"
                  name="partnerPhone"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik label="Email" name="partnerEmail" />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SECTION: SHIP INFO ===== */}
          <SectionWrapper title="Thông tin tàu">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={4}>
                <InfoTextFieldFormik
                  label="Tên tàu"
                  name="shipInfo.name"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  label="Số IMO"
                  name="shipInfo.imonumber"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  label="Loại tàu"
                  name="shipInfo.shipType"
                />
              </Grid>

              <Grid size={4}>
                <InfoTextFieldFormik
                  label="Quốc tịch tàu"
                  name="shipInfo.countryISO"
                />
              </Grid>
            </Grid>
          </SectionWrapper>

          {/* ===== SECTION: SCHEDULE ===== */}
          <SectionWrapper title="Lịch trình">
            <Grid container spacing={2} rowSpacing={3}>
              <Grid size={6}>
                <InfoTextFieldFormik
                  label="Ngày khởi hành"
                  name="startDate"
                  type="datetime-local"
                />
              </Grid>

              <Grid size={6}>
                <InfoTextFieldFormik
                  label="Ngày dự kiến kết thúc"
                  name="endDate"
                  type="datetime-local"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
}
