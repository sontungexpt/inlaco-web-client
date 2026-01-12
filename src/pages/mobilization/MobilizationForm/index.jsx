import React, { useMemo, useState, useCallback } from "react";
import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  EditableDataGridFormik,
  ImageUploadFieldFormik,
  SearchEditCell,
} from "@components/common";
import { NationalityTextField } from "@components/common";
import { Grid, Typography, Box, Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import { createMobilization } from "@/services/mobilizationServices";
import Color from "@constants/Color";
import { FORM_SCHEMA } from "./schema";
import { mapValuesToRequestBody } from "./mapper";
import { DEFAULT_INITIAL_VALUES } from "./defaults";
import { searchCrewMembers } from "@/services/crewServices";
import { sfEqual } from "spring-filter-query-builder";
import toast from "react-hot-toast";

const CrewOptionItem = ({ cardId, fullName, active }) => (
  <Box
    px={1.5}
    py={0.75}
    sx={{
      borderRadius: 0.75,
      bgcolor: active ? "action.hover" : "transparent",
    }}
  >
    <Typography fontWeight={600} noWrap>
      {fullName}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {cardId}
    </Typography>
  </Box>
);

const CrewSearchEditCell = ({
  id,
  value,
  field,
  error,
  api,
  hasFocus,
  mapOptionToRow = (crew) => ({
    fullName: crew.fullName,
    cardId: crew.cardId || crew.id,
  }),
}) => {
  const [options, setOptions] = useState([]);

  // Search & normalize option data
  const handleSearch = useCallback(async (keyword) => {
    if (!keyword) return;
    try {
      const res = await searchCrewMembers({
        query: keyword,
        page: 0,
        size: 10,
        filter: sfEqual("workStatus", "AVAILABLE"),
      });
      setOptions(res.content || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <SearchEditCell
      id={id}
      field={field}
      value={value}
      showSearchIcon={false}
      api={api}
      error={error}
      hasFocus={hasFocus}
      options={options}
      onSearch={handleSearch}
      mapOptionToRow={mapOptionToRow}
      renderOption={({ raw: crew }, active, idx) => {
        return (
          <CrewOptionItem
            cardId={crew.cardId || crew.id}
            fullName={crew.fullName}
            position={crew.professionalPosition}
            active={active}
          />
        );
      }}
    />
  );
};

const MobiliaztionForm = () => {
  const navigate = useNavigate();

  const handleFormSubmission = async (values, { resetForm }) => {
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

  const initialValues = useMemo(() => DEFAULT_INITIAL_VALUES, []);

  const columns = useMemo(
    () => [
      {
        field: "cardId",
        headerName: "Số thẻ",
        headerAlign: "center",
        renderEditCell: (params) => <CrewSearchEditCell {...params} />,
      },
      {
        field: "fullName",
        headerName: "Họ tên",
        renderEditCell: (params) => <CrewSearchEditCell {...params} />,
      },
      {
        field: "rankOnBoard",
        headerName: "Chức danh",
      },
      {
        field: "startDate",
        headerName: "Ngày bắt đầu",
        type: "date",
        flex: 1,
      },
      {
        field: "endDate",
        headerName: "Ngày kết thúc",
        type: "date",
        flex: 1,
      },
      {
        field: "remark",
        headerName: "Ghi chú",
      },
    ],
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FORM_SCHEMA}
      validateOnChange
      onSubmit={handleFormSubmission}
    >
      {({ handleSubmit, isValid, dirty, isSubmitting }) => (
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
              disabled={!isValid || !dirty || isSubmitting}
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
                <InfoTextFieldFormik name="partnerPhone" label="SĐT công ty" />
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
            <EditableDataGridFormik
              name="crewMembers"
              title="Danh sách thuyền viên được điều động"
              addButtonText="Thêm thuyền viên"
              columns={columns}
            />
          </SectionWrapper>
        </Box>
      )}
    </Formik>
  );
};

export default MobiliaztionForm;
