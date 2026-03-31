import { useNavigate, useParams } from "react-router";
import {
  FileUploadFieldFormik,
  PageTitle,
  InfoTextFieldFormik,
  SectionWrapper,
} from "@components/common";
import {
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import Color from "@constants/Color";

import { Formik, FormikHelpers } from "formik";

import { applyRecruitment } from "@/services/post.service";

import cloudinaryUpload from "@/services/cloudinary.service";
import UploadStrategy from "@/constants/UploadStrategy";

import toast from "react-hot-toast";

import { FORM_SCHEMA, FormValues } from "./schema";
import { BASE_FORM_VALUES, GENDERS } from "./initials";
import { mapValuesToRequestBody } from "./mapper";

const ApplyCVPage = () => {
  const navigate = useNavigate();
  const { postId: recruitmentPostId } = useParams();

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const resumeResult = await cloudinaryUpload(
        values.cvFile,
        UploadStrategy.RESUME,
      );

      const candidate = await applyRecruitment(
        recruitmentPostId,
        mapValuesToRequestBody(values),
        resumeResult.assetId,
      );
      resetForm();
      navigate(`/recruitments/candidates/${candidate.id}`);
    } catch (error) {
      toast.error("Ứng tuyển thất bại");
    }
  };

  return (
    <Formik
      validateOnBlur
      validateOnChange={false}
      initialValues={BASE_FORM_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, handleSubmit }) => (
        <Box m="20px" component="form" onSubmit={handleSubmit}>
          <SectionWrapper
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <PageTitle
              title="NỘP HỒ SƠ ỨNG TUYỂN"
              subtitle={`Bài đăng tuyển dụng: ${recruitmentPostId}`} //Change this to the actual recruitmentID
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={!dirty || isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    <SendRoundedIcon />
                  )
                }
                sx={{
                  padding: 1,
                  color: Color.PrimaryBlack,
                  backgroundColor: Color.PrimaryGold,
                  minWidth: 130,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>Nộp đơn</Typography>
              </Button>
            </Box>
          </SectionWrapper>
          <SectionWrapper title="Thông tin ứng viên: ">
            <Grid container spacing={2} rowSpacing={1} pt={2}>
              <Grid size={6}>
                <InfoTextFieldFormik label="Họ và tên" name="fullName" />
              </Grid>
              <Grid size={4}>
                <InfoTextFieldFormik label="Số điện thoại" name="phoneNumber" />
              </Grid>
              <Grid size={2}>
                <InfoTextFieldFormik select label="Giới tính" name="gender">
                  {GENDERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </InfoTextFieldFormik>
              </Grid>

              <Grid size={6}>
                <InfoTextFieldFormik label="Email" name="email" />
              </Grid>
              <Grid size={6}>
                <InfoTextFieldFormik label="Địa chỉ" name="address" />
              </Grid>
              <Grid size={12}>
                <InfoTextFieldFormik
                  required={false}
                  label="Trình độ ngoại ngữ (liệt kê nếu có)"
                  name="languageSkills"
                />
              </Grid>
              <Grid size={12}>
                <InfoTextFieldFormik
                  label="Kinh nghiệm làm việc"
                  name="experiences"
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          <SectionWrapper title="CV đính kèm*: ">
            <FileUploadFieldFormik required name="cvFile" />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default ApplyCVPage;
