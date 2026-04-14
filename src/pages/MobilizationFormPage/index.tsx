import { useMemo, useState, useCallback } from "react";
import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
  BaseEditableDataGrid,
  SearchBar,
} from "@components/common";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import Color from "@constants/Color";
import { Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import { createMobilization } from "@/services/mobilization.service";
import { FORM_SCHEMA, FormValues, FormValuesCrew } from "./schema";
import { mapValuesToRequestBody } from "./mapper";
import toast from "react-hot-toast";
import { BASE_FORM_VALUES } from "./initial";
import {
  BaseEditableDataGridColumn,
  BaseEditableDataGridRenderCellProps,
  BaseEditableDataGridRenderEditCellProps,
} from "@/components/common/datagrid/BaseEditableDataGrid";
import BaseEditableDataGridToolbar from "@/components/common/datagrid/components/BaseEditableDataGridToolbar";
import { useCrewProfiles } from "@/queries/crew-profile.query";
import { CrewProfile } from "@/types/api/crew-profile";
import { GetCellError } from "@/components/common/datagrid/shared/error-store";

const renderCrewOption = (opt: CrewProfile, selected?: boolean) => {
  const initials = opt.fullName?.charAt(0)?.toUpperCase() ?? "?";

  const birth = opt.birthDate ? new Date(opt.birthDate) : null;
  const age = birth ? new Date().getFullYear() - birth.getFullYear() : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.18s ease",

        bgcolor: selected ? "primary.50" : "transparent",

        "&:hover": {
          bgcolor: selected ? "primary.50" : "action.hover",
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {initials}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Row 1 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          {/* Name */}
          <Box
            sx={{
              fontWeight: 600,
              fontSize: 13.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {opt.fullName}
          </Box>

          {/* ID badge */}
          <Box
            sx={{
              fontSize: 10.5,
              px: 0.7,
              py: 0.2,
              borderRadius: 1,
              bgcolor: "grey.100",
              color: "text.secondary",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {opt.employeeCardId}
          </Box>
        </Box>

        {/* Row 2 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            fontSize: 12,
            color: "text.secondary",
            mt: 0.2,
            flexWrap: "wrap",
          }}
        >
          {/* Role */}
          {opt.professionalPosition && (
            <Box sx={{ whiteSpace: "nowrap" }}>{opt.professionalPosition}</Box>
          )}

          {/* Divider dot */}
          {(opt.professionalPosition || age) && (
            <Box sx={{ opacity: 0.4 }}>•</Box>
          )}

          {/* Age */}
          {age && <Box>{age} tuổi</Box>}

          {/* Insurance badges */}
          {(opt.socialInsuranceCode || opt.accidentInsuranceCode) && (
            <>
              <Box sx={{ opacity: 0.4 }}>•</Box>

              <Box sx={{ display: "flex", gap: 0.5 }}>
                {opt.socialInsuranceCode && (
                  <Box
                    sx={{
                      px: 0.6,
                      py: 0.1,
                      borderRadius: 1,
                      bgcolor: "success.lighter",
                      color: "success.dark",
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  >
                    BHXH
                  </Box>
                )}

                {opt.accidentInsuranceCode && (
                  <Box
                    sx={{
                      px: 0.6,
                      py: 0.1,
                      borderRadius: 1,
                      bgcolor: "warning.lighter",
                      color: "warning.dark",
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  >
                    BHTN
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Selected indicator */}
      {selected && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "primary.main",
            flexShrink: 0,
            boxShadow: "0 0 0 2px rgba(25,118,210,0.2)",
          }}
        />
      )}
    </Box>
  );
};

export default function MobiliaztionForm() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: { content: crewProfiles = [] } = {},
    isLoading: isCrewProfilesLoading,
  } = useCrewProfiles({
    page: 0,
    pageSize: 10,
    filter: {
      keyword: searchKeyword,
      workStatus: "READY_FOR_ASSIGNMENT",
    },
  });
  console.log("crewProfiles", crewProfiles);

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

  const renderSearchEditCell = ({
    row,
    column,
    onRowChange,
  }: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>) => {
    const key = column.key as keyof FormValuesCrew;

    const handleSelect = (opt: CrewProfile) => {
      onRowChange(
        {
          ...row,
          employeeCardId: opt.employeeCardId,
          fullName: opt.fullName,
          // rankOnBoard: opt.healthInsHospital,
        },
        true,
      );
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent,
      value: string,
    ) => {
      onRowChange({ ...row, [key]: value });
    };

    return (
      <SearchBar
        onSearch={(value) => {
          setSearchKeyword(value);
        }}
        dropdownItems={crewProfiles}
        loading={isCrewProfilesLoading}
        autoFocus
        dropdownEnabled
        renderDropdownItem={renderCrewOption}
        onChange={handleChange}
        onDropdownItemSeletected={handleSelect}
        sx={{
          height: "100%",
          width: "100%",
        }}
      />
    );
  };

  const columns: BaseEditableDataGridColumn<FormValuesCrew>[] = useMemo(
    () =>
      [
        {
          key: "employeeCardId",
          name: "Số thẻ nhân viên",
          renderEditCell: renderSearchEditCell,
        },
        {
          key: "fullName",
          name: "Họ tên",
          renderEditCell: renderSearchEditCell,
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
                // rowKeyGetter={({ id }) => id}
                rows={values.crews}
                toolbar={useMemo(
                  () => (
                    <BaseEditableDataGridToolbar
                      onNewRowClick={() => {
                        const updated = [
                          {
                            id: crypto.randomUUID(),
                          },
                          ...values.crews,
                        ];
                        setFieldValue("crews", updated, true);
                      }}
                    />
                  ),
                  [setFieldValue],
                )}
                getCellError={useCallback<GetCellError<FormValuesCrew>>(
                  ({ row, rowIdx, column }) => {
                    const colKey = column.key;
                    return (errors.crews as any)?.[rowIdx]?.[colKey];
                  },
                  [errors.crews],
                )}
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
}
