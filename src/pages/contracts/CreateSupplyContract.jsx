import { useState } from "react";
import {
  FileUploadField,
  PageTitle,
  InfoTextField,
  SectionWrapper,
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
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router";
import { createSupplyContract } from "@/services/contractServices";
import { datetimeToISO } from "@utils/converter";
import Regex from "@/constants/Regex";
import { yesterday } from "@/utils/date";
import TemplateDialog from "./components/TemplateDialog";

const CreateSupplyContract = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: requestInfo } = useLocation();
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const createContract = async (values, { resetForm }) => {
    try {
      //Calling API to create a new crew member
      const response = await createSupplyContract(id, {
        title: values.title,
        initiator: {
          partyName: values.partyA.compName,
          address: values.partyA.compAddress,
          phone: values.partyA.compPhoneNumber,
          representer: values.partyA.representative,
          representerPosition: values.partyA.representativePos,
          email: "thong2046@gmail.com",
          type: "STATIC",
        },
        signedPartners: [
          {
            partyName: values.partyB.compName,
            address: values.partyB.compAddress,
            phone: values.partyB.compPhoneNumber,
            representer: values.partyB.representative,
            representerPosition: values.partyB.representativePos,
            type: "STATIC",
          },
        ],
        activationDate: datetimeToISO(values.contractInfo.startDate),
        expiredDate: datetimeToISO(values.contractInfo.endDate),
        numOfCrews: values.contractInfo.numOfCrewMember,

        shipInfo: {},
      });

      resetForm();
      navigate("/supply-contracts");
    } catch (err) {
      console.log("Error when creating supply contract: ", err);
    }
  };

  const initialValues = {
    contractFile: null,
    title: "",
    partyA: {
      compName: "Công ty INLACO Hải Phòng",
      compAddress: "",
      compPhoneNumber: "",
      representative: "",
      representativePos: "Trưởng phòng Nhân sự",
    },
    partyB: {
      compName: requestInfo?.companyName,
      compAddress: requestInfo?.companyAddress,
      compPhoneNumber: requestInfo?.companyPhone,
      representative: requestInfo?.companyRepresentor,
      representativePos: requestInfo?.companyRepresentorPosition,
    },
    contractInfo: {
      startDate: "",
      endDate: "",
      numOfCrewMember: "",
      rentalStartDate: requestInfo?.rentalStartDate,
      rentalEndDate: requestInfo?.rentalEndDate,

      shipInfo: {
        image: "",
        IMONumber: "",
        name: "",
        countryISO: "",
        type: "",
        description: "",
      },
    },
  };

  const ytd = yesterday();
  const now = new Date();

  const SCHEMA = Yup.object().shape({
    title: Yup.string().required("Tiêu đề không được để trống"),
    partyA: Yup.object().shape({
      compName: Yup.string().required("Tên công ty không được để trống"),
      compAddress: Yup.string().required("Địa chỉ không được để trống"),
      compPhoneNumber: Yup.string()
        .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
        .required("SĐT không được để trống"),
      representative: Yup.string().required(
        "Người đại diện không được để trống",
      ),
      representativePos: Yup.string().required("Chức vụ không được để trống"),
    }),

    partyB: Yup.object().shape({
      compName: Yup.string().required("Tên công ty không được để trống"),
      compAddress: Yup.string().required("Địa chỉ không được để trống"),
      compPhoneNumber: Yup.string()
        .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
        .required("SĐT không được để trống"),
      representative: Yup.string().required(
        "Người đại diện không được để trống",
      ),
      representativePos: Yup.string().required("Chức vụ không được để trống"),
    }),

    contractInfo: Yup.object().shape({
      startDate: Yup.date()
        .min(ytd, "Ngày bắt đầu không hợp lệ")
        .required("Ngày bắt đầu không được để trống")
        .test(
          "is-before-end-date",
          "Ngày bắt đầu phải trước ngày kết thúc",
          function (value) {
            const { endDate } = this.parent; // Access sibling field endDate
            return !endDate || value < endDate;
          },
        ),

      endDate: Yup.date()
        .required("Ngày kết thúc không được để trống")
        .test(
          "is-after-start-date",
          "Ngày kết thúc phải sau ngày bắt đầu",
          function (value) {
            const { startDate } = this.parent; // Access sibling field startDate
            return !startDate || value > startDate;
          },
        ),

      numOfCrewMember: Yup.number()
        .min(1, "Tổng số nhân lực cần cung ứng không hợp lệ")
        .required("Tổng số nhân lực cần cung ứng không được để trống"),

      rentalStartDate: Yup.date()
        .min(now, "Ngày bắt đầu không hợp lệ")
        .required("Ngày bắt đầu không được để trống")
        .test(
          "is-before-end-date",
          "Ngày bắt đầu phải trước ngày kết thúc",
          function (value) {
            const { rentalEndDate } = this.parent; // Access sibling field endDate
            return !rentalEndDate || value < rentalEndDate;
          },
        ),
      rentalEndDate: Yup.date()
        .min(now, "Ngày bắt đầu không hợp lệ")
        .required("Ngày kết thúc không đượcể trống")
        .test(
          "is-after-start-date",
          "Ngày kết thúc phải sau ngày bắt đầu",
          function (value) {
            const { rentalStartDate } = this.parent; // Access sibling field startDate
            return !rentalStartDate || value > rentalStartDate;
          },
        ),

      shipInfo: Yup.object().shape({
        name: Yup.string().required("Tên tàu không được trống"),
        type: Yup.string().required("Loại tàu không được trống"),
      }),

      contractFile: Yup.mixed()
        .required("Vui lòng tải lên hợp đồng bản giấy")
        .test(
          "fileSize",
          "Dung lượng file tối đa 5MB",
          (value) => value && value.size <= 5 * 1024 * 1024,
        )
        .test(
          "fileType",
          "Chỉ chấp nhận file PDF, DOC hoặc DOCX",
          (value) =>
            value &&
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(value.type),
        ),
    }),
  });

  return (
    <Formik
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={SCHEMA}
      onSubmit={createContract}
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
        <Box m="20px" component="form" onSubmit={handleSubmit}>
          {/* ===== Sticky Header ===== */}
          <SectionWrapper>
            <PageTitle
              title="TẠO HỢP ĐỒNG CUNG ỨNG THUYỀN VIÊN"
              subtitle="Tạo và lưu Hợp đồng cung ứng thuyền viên mới vào hệ thống"
              mb={3}
            />

            <Box display="flex" gap={2}>
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
                disabled={!isValid || !dirty || isSubmitting}
                startIcon={!isSubmitting && <SaveIcon />}
                sx={{
                  minWidth: 150,
                  px: 3,
                  fontWeight: 700,
                  backgroundColor: Color.PrimaryGold,
                  color: Color.PrimaryBlack,
                }}
              >
                {isSubmitting && (
                  <CircularProgress
                    mr={2}
                    size={22}
                    sx={{ color: Color.PrimaryBlack }}
                  />
                )}
                Tạo hợp đồng
              </Button>
            </Box>
          </SectionWrapper>
          <SectionWrapper title="Tiêu đề">
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

          <SectionWrapper title="Công ty Cung ứng lao động (Bên A)*: ">
            <Grid container spacing={2}>
              <Grid size={4}>
                <InfoTextField
                  id="company-name"
                  label="Tên công ty"
                  margin="none"
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
                  margin="none"
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
                  margin="none"
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
                  margin="none"
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
                  margin="none"
                  required
                  fullWidth
                  name="partyA.representativePos"
                  value={values.partyA?.representativePos}
                  error={
                    !!touched.partyA?.representativePos &&
                    !!errors.partyA?.representativePos
                  }
                  helperText={
                    touched.partyA?.representativePos &&
                    errors.partyA?.representativePos
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          <SectionWrapper title="Công ty yêu cầu Cung ứng lao động (Bên B)*: ">
            <Grid container spacing={2}>
              <Grid size={4}>
                <InfoTextField
                  label="Tên công ty"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="partyB.compName"
                  value={values.partyB?.compName}
                  error={
                    !!touched.partyB?.compName && !!errors.partyB?.compName
                  }
                  helperText={
                    touched.partyB?.compName && errors.partyB?.compName
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="partyB.compAddress"
                  value={values.partyB?.compAddress}
                  error={
                    !!touched.partyB?.compAddress &&
                    !!errors.partyB?.compAddress
                  }
                  helperText={
                    touched.partyB?.compAddress && errors.partyB?.compAddress
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="partyB.compPhoneNumber"
                  value={values.partyB?.compPhoneNumber}
                  error={
                    !!touched.partyB?.compPhoneNumber &&
                    !!errors.partyB?.compPhoneNumber
                  }
                  helperText={
                    touched.partyB?.compPhoneNumber &&
                    errors.partyB?.compPhoneNumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="partyB.representative"
                  value={values.partyB?.representative}
                  error={
                    !!touched.partyB?.representative &&
                    !!errors.partyB?.representative
                  }
                  helperText={
                    touched.partyB?.representative &&
                    errors.partyB?.representative
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  label="Chức vụ"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="partyB.representativePos"
                  value={values.partyB?.representativePos}
                  error={
                    !!touched.partyB?.representativePos &&
                    !!errors.partyB?.representativePos
                  }
                  helperText={
                    touched.partyB?.representativePos &&
                    errors.partyB?.representativePos
                      ? errors.partyB?.representativePos
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </SectionWrapper>
          <SectionWrapper title="Thông tin hợp đồng*: ">
            <Grid container spacing={2}>
              <Grid size={3}>
                <InfoTextField
                  type="date"
                  label="Ngày bắt đầu"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.startDate"
                  value={values.contractInfo?.startDate}
                  error={
                    !!touched.contractInfo?.startDate &&
                    !!errors.contractInfo?.startDate
                  }
                  helperText={
                    touched.contractInfo?.startDate &&
                    errors.contractInfo?.startDate
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  type="date"
                  label="Ngày kết thúc"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.endDate"
                  value={values.contractInfo?.endDate}
                  error={
                    !!touched.contractInfo?.endDate &&
                    !!errors.contractInfo?.endDate
                  }
                  helperText={
                    touched.contractInfo?.endDate &&
                    errors.contractInfo?.endDate
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  type="number"
                  label="Tổng số nhân lực cần cung ứng"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="contractInfo.numOfCrewMember"
                  value={values.contractInfo?.numOfCrewMember}
                  error={
                    !!touched.contractInfo?.numOfCrewMember &&
                    !!errors.contractInfo?.numOfCrewMember
                  }
                  helperText={
                    touched.contractInfo?.numOfCrewMember &&
                    errors.contractInfo?.numOfCrewMember
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
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

          <SectionWrapper title="Bản mềm">
            <FileUploadField
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
export default CreateSupplyContract;
