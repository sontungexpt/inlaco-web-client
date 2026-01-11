import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
  Chip,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  InfoTextFieldFormik,
  InfoTextField,
  SectionDivider,
} from "@/components/common";
import { dateTimeStringToISOString } from "@/utils/converter";

// ===================
// Validation Schema
// ===================
export const PostSchema = Yup.object({
  type: Yup.string().required("Loại bài viết là bắt buộc"),
  title: Yup.string().required("Tiêu đề của bài viết ko được bỏ trống"),
  content: Yup.string().required("Nội dung bài viết không được để trống"),
  company: Yup.string(),
  description: Yup.string(),
  image: Yup.object({
    url: Yup.string().url("Must be a valid URL").nullable(),
  }),
  attachments: Yup.array().of(
    Yup.object({
      name: Yup.string().required(),
      size: Yup.number().required(),
      type: Yup.string().required(),
    }),
  ),

  // Position (for RECRUITMENT)
  position: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) => Yup.string().required("Vị trí tuyển dụng là bắt buộc"),
    otherwise: (schema) => Yup.string().notRequired(),
  }),
  workLocation: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.string().required("Vị trí làm việc không được để trống"),
    otherwise: (schema) => Yup.string().notRequired(),
  }),
  expectedSalary: Yup.string(),

  recruitmentStartDate: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.date()
        .required()
        .test(
          "is-before-recruitment-end-date",
          "Ngày mở đăng ký phải trước ngày đóng đăng ký",
          function (value) {
            const { recruitmentEndDate } = this.parent; // Access sibling field recruitmentEndDate
            return !recruitmentEndDate || value < recruitmentEndDate;
          },
        ),
    otherwise: (schema) => Yup.date().notRequired(),
  }),
  recruitmentEndDate: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.date()
        .required()
        .test(
          "is-after-recruiment-start-date",
          "Ngày đóng đăng ký phải sau ngày bắt đầu mở đăng ký",
          function (value) {
            const { recruitmentStartDate } = this.parent; // Access sibling field recruitmentStartDate
            return !recruitmentStartDate || value > recruitmentStartDate;
          },
        ),
    otherwise: (schema) => Yup.date().notRequired(),
  }),
});

const POST_TYPES = [
  { label: "Tin tức", value: "NEWS" },
  { label: "Tuyển dụng", value: "RECRUITMENT" },
  { label: "Sự kiện", value: "EVENT" },
];

export default function PostForm({
  onSubmit,
  fixedType,
  initialValues = {},
  mode = "create", // create | edit
  isSubmitting = false,
  snackbar,
  onCloseSnackbar, // The fn call when snackbar close
  onViewPost, // The fn call when user click "Xem bài viết" in snackbar
  contentSectionLabel = "Nội dung bài viết*: ",
}) {
  const safeInitialValues = {
    title: "",
    content: "",
    type: fixedType || POST_TYPES[0].value,
    description: "",
    company: "",
    // Recruitment specific fields
    position: "",
    expectedSalary: "",
    workLocation: "",
    recruitmentStartDate: "",
    recruitmentEndDate: "",

    ...initialValues,
    image: { url: initialValues?.image?.url || "" },
    attachments: initialValues?.attachments || [],
  };

  const [attachments, setAttachments] = useState(safeInitialValues.attachments);

  const handleFakeUpload = (e) => {
    const files = Array.from(e?.target?.files || []);
    const mapped = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
  };

  return (
    <Formik
      initialValues={safeInitialValues}
      validationSchema={PostSchema}
      validateOnChange
      validateOnBlur
      validateOnMount
      onSubmit={(values, ...args) =>
        onSubmit(
          {
            ...values,
            recruitmentStartDate: dateTimeStringToISOString(
              values.recruitmentStartDate,
            ),
            recruitmentEndDate: dateTimeStringToISOString(
              values.recruitmentEndDate,
            ),
            attachments,
          },
          ...args,
        )
      }
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            {/* POST INFORMATION */}
            <Box>
              <SectionDivider
                sx={{ marginTop: 1 }}
                sectionName="Thông tin bài đăng*: "
              />

              {/* Type, Title, Company */}
              <Grid container spacing={3}>
                <Grid item size={4}>
                  {!fixedType ? (
                    <InfoTextFieldFormik
                      select
                      label="Chọn loại bài viết"
                      name="type"
                      disabled={mode === "edit"}
                    >
                      {POST_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </InfoTextFieldFormik>
                  ) : (
                    <InfoTextFieldFormik
                      disabled
                      label="Chọn loại bài viết"
                      name="type"
                    />
                  )}
                </Grid>

                <Grid item size={4}>
                  <InfoTextFieldFormik name="title" label="Tiêu đề" />
                </Grid>

                <Grid item size={4}>
                  <InfoTextFieldFormik
                    name="company"
                    label="Tên công ty liên quan"
                  />
                </Grid>
              </Grid>

              {/* Description hàng riêng */}
              <Box mt={3}>
                <InfoTextFieldFormik
                  name="description"
                  label="Mô tả"
                  multiline
                  minRows={2}
                  sx={{ "& textarea": { lineHeight: "1.5" } }}
                />
              </Box>
            </Box>
            {values.type === "RECRUITMENT" && (
              <Box mt={3}>
                <SectionDivider
                  sx={{ marginTop: 1 }}
                  sectionName="Thông tin tuyển dụng*: "
                />

                <Grid container spacing={3}>
                  <Grid item size={4}>
                    <InfoTextFieldFormik name="position" label="Vị trí" />
                  </Grid>

                  <Grid item size={4}>
                    <InfoTextFieldFormik
                      name="workLocation"
                      label="Địa điểm làm việc"
                    />
                  </Grid>

                  <Grid item size={4}>
                    <InfoTextFieldFormik
                      name="expectedSalary"
                      label="Mức lương dự kiến"
                    />
                  </Grid>

                  <Grid item size={4}>
                    <InfoTextFieldFormik
                      name="recruitmentStartDate"
                      label="Ngày bắt đầu đăng kí tuyển dụng"
                      type="datetime-local"
                    />
                  </Grid>

                  <Grid item size={4}>
                    <InfoTextFieldFormik
                      name="recruitmentEndDate"
                      label="Ngày kết thúc đăng kí tuyển dụng"
                      type="datetime-local"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* MEDIA */}
            <Box>
              <SectionDivider
                sx={{ marginTop: 1 }}
                sectionName="Các tệp đính kèm: "
              />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="image.url"
                    fullWidth
                    label="Image URL"
                    value={values.image.url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.image?.url && Boolean(errors.image?.url)}
                    helperText={touched.image?.url && errors.image?.url}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ height: 48 }}
                  >
                    Thêm tệp đính kèm
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFakeUpload}
                    />
                  </Button>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mt={2}>
                    {attachments.map((file, idx) => (
                      <Chip key={idx} label={file.name} variant="outlined" />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {/* CONTENT */}
            <Box>
              <SectionDivider
                sx={{ marginTop: 1 }}
                sectionName={contentSectionLabel}
              />
              <InfoTextField
                name="content"
                fullWidth
                multiline
                minRows={12}
                label="Nội dung"
                sx={{
                  "& textarea": { lineHeight: "1.5" },
                  background: "#fafafa",
                  borderRadius: 2,
                }}
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Đang cập nhật bài viết..."
                  : "Đang tạo bài viết..."
                : mode === "edit"
                  ? "Cập nhật bài viết"
                  : "Tạo bài viết"}
            </Button>
            {snackbar && (
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={onCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Alert
                  severity={snackbar.severity}
                  variant="filled"
                  onClose={onCloseSnackbar}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <span>{snackbar.message}</span>
                    {snackbar.severity === "success" && snackbar.postId && (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                          onViewPost?.(snackbar.postId, snackbar.payload);
                        }}
                        sx={{ fontWeight: 600 }}
                      >
                        Xem bài đăng
                      </Button>
                    )}
                  </Stack>
                </Alert>
              </Snackbar>
            )}
          </Stack>
        </form>
      )}
    </Formik>
  );
}
