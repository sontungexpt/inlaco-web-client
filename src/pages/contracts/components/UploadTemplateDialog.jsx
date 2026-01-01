import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import Color from "@constants/Color";
import { InfoTextField } from "@/components/global";
import { Formik } from "formik";
import * as Yup from "yup";
import { FileUploadField } from "@/components/contract";
import ContractTemplateType from "@/constants/ContractTemplateType";

const UploadTemplateDialog = ({
  open,
  onClose,
  onSubmit,
  accept = "*",
  initialValues,
}) => {
  const TEMPLATE_TYPES = [
    { value: ContractTemplateType.LABOR_CONTRACT, label: "Hợp đồng lao động" },
    { value: ContractTemplateType.SUPPLY_CONTRACT, label: "Hợp đồng cung ứng" },
  ];

  const initValues = {
    name: "",
    contractType: "",
    description: "",
    file: null,
    ...initialValues,
  };

  const UPLOAD_TEMPLATE_SCHEMA = Yup.object({
    name: Yup.string()
      .trim()
      .required("Vui lòng nhập tên template")
      .max(255, "Tên template tối đa 255 ký tự"),
    contractType: Yup.string().required("Vui lòng chọn loại hợp đồng"),
    description: Yup.string().max(1000, "Mô tả tối đa 1000 ký tự"),
    file: Yup.mixed()
      .required("Vui lòng chọn file template")
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
      )
      .test("fileSize", "Dung lượng file tối đa 10MB", (file) => {
        if (!file) return false;
        return file.size <= 10 * 1024 * 1024;
      }),
  });

  return (
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={initValues}
      validationSchema={UPLOAD_TEMPLATE_SCHEMA}
      onSubmit={onSubmit}
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle fontWeight={700}>
              Tải lên template hợp đồng
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Box display="flex" flexDirection="column" gap={3}>
                <InfoTextField
                  label="Tên template"
                  required
                  id="name"
                  name="name"
                  value={values.name}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                />

                <InfoTextField
                  select
                  label="Loại hợp đồng"
                  id="contractType"
                  name="contractType"
                  required
                  minRows={3}
                  value={values.contractType}
                  error={!!touched.contractType && !!errors.contractType}
                  helperText={touched.contractType && errors.contractType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                >
                  {TEMPLATE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </InfoTextField>

                <InfoTextField
                  label="Mô tả"
                  id="description"
                  name="description"
                  multiline
                  minRows={3}
                  value={values.description}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                />

                {/* File input */}
                <FileUploadField
                  required
                  id="file"
                  name="file"
                  accept={accept}
                  helperText={touched.file && errors.file}
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || !dirty || isSubmitting}
                sx={{
                  backgroundColor: Color.SecondaryBlue,
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? <CircularProgress size={20} /> : "Tải lên"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </Formik>
  );
};

export default UploadTemplateDialog;
