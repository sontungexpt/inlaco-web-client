import { useMemo, useState, useCallback } from "react";
import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
  BaseEditableDataGrid,
} from "@components/common";
import { Grid, Typography, Box, Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import Color from "@constants/Color";
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import { createMobilization } from "@/services/mobilization.service";
import { FORM_SCHEMA, FormValues, FormValuesCrew } from "./schema";
import { mapValuesToRequestBody } from "./mapper";
import toast from "react-hot-toast";
import { fetchCrewMembers } from "@/services/crew.service";
import { BASE_FORM_VALUES } from "./initial";
import { Column } from "react-data-grid";
import {
  BaseEditableDataGridColumn,
  useEditableDataGrid,
} from "@/components/common/datagrid/BaseEditableDataGrid";

// const CrewOptionItem = ({ cardId, fullName, active }) => (
//   <Box
//     px={1.5}
//     py={0.75}
//     sx={{
//       borderRadius: 0.75,
//       bgcolor: active ? "action.hover" : "transparent",
//     }}
//   >
//     <Typography fontWeight={600} noWrap>
//       {fullName}
//     </Typography>
//     <Typography variant="caption" color="text.secondary">
//       {cardId}
//     </Typography>
//   </Box>
// );

// const CrewSearchEditCell = ({
//   id,
//   value,
//   field,
//   error,
//   api,
//   hasFocus,
//   mapOptionToRow = (crew) => ({
//     fullName: crew.fullName,
//     cardId: crew.cardId || crew.id,
//   }),
// }) => {
//   const [options, setOptions] = useState([]);

//   // Search & normalize option data
//   const handleSearch = useCallback(async (keyword) => {
//     if (!keyword) return;
//     try {
//       const res = await fetchCrewMembers({
//         query: keyword,
//         page: 0,
//         size: 10,
//         filter: {
//           workStatus: "AVAILABLE",
//         },
//       });
//       setOptions(res.content || []);
//     } catch (err) {}
//   }, []);

//   return (
//     <SearchEditCell
//       id={id}
//       field={field}
//       value={value}
//       showSearchIcon={false}
//       api={api}
//       error={error}
//       hasFocus={hasFocus}
//       options={options}
//       onSearch={handleSearch}
//       mapOptionToRow={mapOptionToRow}
//       renderOption={({ raw: crew }, active, idx) => {
//         return (
//           <CrewOptionItem
//             cardId={crew.cardId || crew.id}
//             fullName={crew.fullName}
//             position={crew.professionalPosition}
//             active={active}
//           />
//         );
//       }}
//     />
//   );
// };

const MobiliaztionForm = () => {
  const navigate = useNavigate();

  const handleFormSubmission = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const newMobilization = await createMobilization(
        mapValuesToRequestBody(values),
      );
      resetForm();
      navigate(`/mobilizations/${newMobilization.id}`);
    } catch (err) {
      toast.error("Tạo điều động thất bại, thử lại sau");
    }
  };

  const columns: BaseEditableDataGridColumn<FormValuesCrew>[] = useMemo(
    () =>
      [
        {
          key: "employeeCardId",
          name: "Số thẻ nhân viên",
        },
        {
          key: "fullName",
          name: "Họ tên",
        },
        {
          key: "rankOnBoard",
          name: "Chức danh",
        },
        {
          key: "startDate",
          name: "Ngày bắt đầu",
          type: "date",
        },
        {
          key: "endDate",
          name: "Ngày kết thúc",
          type: "date",
        },
        {
          key: "remark",
          name: "Ghi chú",
        },
      ] as BaseEditableDataGridColumn<FormValuesCrew>[],
    [],
  );

  return (
    <Formik
      initialValues={BASE_FORM_VALUES}
      validationSchema={FORM_SCHEMA}
      validateOnChange={false}
      validateOnBlur
      onSubmit={handleFormSubmission}
    >
      {({
        values,
        errors,
        handleSubmit,
        dirty,
        isSubmitting,
        setFieldValue,
      }) => {
        console.debug("errors", errors);
        return (
          <Box component="form" onSubmit={handleSubmit} m={2}>
            {/* ================= HEADER ================= */}
            <SectionWrapper
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <PageTitle
                title="TẠO ĐIỀU ĐỘNG"
                subtitle="Tạo và lên kế hoạch cho các điều động mới"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!dirty || isSubmitting}
                sx={{
                  minWidth: 140,
                  fontWeight: 700,
                  bgcolor: Color.PrimaryGold,
                  color: Color.PrimaryBlack,
                }}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                Tạo
              </Button>
            </SectionWrapper>

            {/* ================= THÔNG TIN CHUNG ================= */}
            <SectionWrapper title="Thông tin chung">
              <Grid container spacing={2}>
                <Grid size={5}>
                  <InfoTextFieldFormik
                    name="partnerName"
                    label="Điều động đến công ty"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    name="partnerEmail"
                    label="Email công ty"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    name="partnerPhone"
                    label="SĐT công ty"
                  />
                </Grid>

                <Grid size={3}>
                  <InfoTextFieldFormik
                    name="partnerAddress"
                    label="Địa chỉ công ty"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ================= LỊCH TRÌNH ================= */}
            <SectionWrapper title="Lịch trình dự kiến">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    name="startDate"
                    type="datetime-local"
                    label="Thời gian bắt đầu công việc"
                  />
                </Grid>
                <Grid size={6}>
                  <InfoTextFieldFormik
                    name="endDate"
                    type="datetime-local"
                    label="Thời gian kết thúc công việc"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ================= THÔNG TIN TÀU ================= */}
            <SectionWrapper title="Thông tin tàu">
              <Box display="flex" justifyContent="center" mb={2}>
                <ImageUploadFieldFormik
                  name="shipInfo.imageUrl"
                  width={300}
                  height={180}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={2}>
                  <InfoTextFieldFormik name="shipInfo.imonumber" label="IMO" />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik name="shipInfo.name" label="Tên tàu" />
                </Grid>

                <Grid size={2}>
                  <NationalityTextField
                    component={InfoTextFieldFormik}
                    name="shipInfo.countryISO"
                    label="Quốc tịch"
                  />
                </Grid>

                <Grid size={4}>
                  <InfoTextFieldFormik
                    name="shipInfo.shipType"
                    label="Loại tàu"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ================= CREW ================= */}
            <SectionWrapper>
              <BaseEditableDataGrid<FormValuesCrew>
                columns={columns}
                rows={values.crews}
                onNewRowClick={() => {
                  const newRow = {
                    id: crypto.randomUUID(),
                    employeeCardId: "",
                    fullName: "",
                  };
                  const updated = [newRow, ...values.crews];
                  setFieldValue("crews", updated, true);
                  return newRow;
                }}
                errors={errors.crews}
                onRowsChange={(newRows: any[]) => {
                  setFieldValue("crews", newRows, true);
                }}
              />
            </SectionWrapper>
          </Box>
        );
      }}
    </Formik>
  );
};

export default MobiliaztionForm;
