import { useMemo, useState, useCallback } from "react";

import {
  PageTitle,
  SectionWrapper,
  InfoTextFieldFormik,
  ImageUploadFieldFormik,
  NationalityTextField,
  BaseEditableDataGrid,
  SearchBar,
  InfoTextField,
} from "@components/common";

import { Box, Button, CircularProgress, Grid } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import { Formik, FormikHelpers, useFormikContext } from "formik";

import { useNavigate } from "react-router";

import toast from "react-hot-toast";

import { FORM_SCHEMA, FormValues, FormValuesCrew } from "./schema";

import { BASE_FORM_VALUES } from "./initial";

import { mapValuesToRequestBody } from "./mapper";

import {
  BaseEditableDataGridColumn,
  BaseEditableDataGridRenderEditCellProps,
} from "@/components/common/datagrid/BaseEditableDataGrid";

import BaseEditableDataGridToolbar from "@/components/common/datagrid/components/BaseEditableDataGridToolbar";

import { useCrewProfiles } from "@/queries/crew-profile.query";

import { CrewProfile } from "@/types/api/crew-profile";

import { createShipSchedule } from "@/services/ship-schedule.service";

import cloudinaryUpload from "@/services/cloudinary.service";

import UploadStrategy from "@/constants/UploadStrategy";

function CrewSearchEditCell({
  row,
  column,
  onRowChange,
}: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>) {
  const key = column.key as keyof FormValuesCrew;

  const [keyword, setKeyword] = useState("");

  const { data: { content: crewProfiles = [] } = {}, isLoading } =
    useCrewProfiles({
      page: 0,
      pageSize: 10,
      filter: {
        keyword,
        workStatus: "AVAILABLE",
      },
    });

  const handleSelect = (opt: CrewProfile) => {
    onRowChange(
      {
        ...row,

        profileId: opt.id,
        employeeCardId: opt.employeeCardId,
        fullName: opt.fullName,
        rankOnBoard: opt.professionalPosition,
      },
      true,
    );
  };

  return (
    <SearchBar
      autoFocus
      dropdownEnabled
      dropdownItems={crewProfiles}
      loading={isLoading}
      onSearch={setKeyword}
      onDropdownItemSeletected={handleSelect}
      onChange={(_, value: string) => {
        onRowChange({
          ...row,
          [key]: value,
        });
      }}
    />
  );
}

function renderSearchEditCell(
  props: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>,
) {
  return <CrewSearchEditCell {...props} />;
}

export default function ShipScheduleCreatePage() {
  const navigate = useNavigate();

  const handleSubmitForm = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const shipImageUploaded = await cloudinaryUpload(
        values.shipInfo.image as File,
        UploadStrategy.SHIP_IMAGE,
      );

      const created = await createShipSchedule(
        mapValuesToRequestBody(values, shipImageUploaded.assetId),
      );

      toast.success("Tạo lịch tàu thành công");

      resetForm();

      navigate(`/ship-schedules/${created.id}`);
    } catch (err) {
      toast.error("Tạo lịch tàu thất bại");
    }
  };

  const columns: BaseEditableDataGridColumn<FormValuesCrew>[] = useMemo(
    () => [
      {
        key: "employeeCardId",
        name: "Mã nhân viên",
        renderEditCell: renderSearchEditCell,
      },

      {
        key: "fullName",
        name: "Họ tên",
        editable: false,
      },

      {
        key: "rankOnBoard",
        name: "Chức danh",
      },

      {
        key: "remark",
        name: "Ghi chú",
      },

      {
        key: "__action__",
        width: 70,
        name: "",
        renderCell: ({ row }) => {
          const { values, setFieldValue } = useFormikContext<FormValues>();
          return (
            <Button
              color="error"
              onClick={() => {
                const newRows = values.crews.filter((r) => r.id !== row.id);
                setFieldValue("crews", newRows, true);
              }}
            >
              Xoá
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <Formik
      initialValues={BASE_FORM_VALUES}
      validationSchema={FORM_SCHEMA}
      onSubmit={handleSubmitForm}
    >
      {({
        values,
        errors,
        handleSubmit,
        setFieldValue,
        dirty,
        isSubmitting,
      }) => {
        console.log(errors);
        return (
          <Box component="form" onSubmit={handleSubmit} m={2}>
            {/* HEADER */}
            <SectionWrapper
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <PageTitle
                title="TẠO LỊCH TÀU"
                subtitle="Tạo lịch trình tàu mới"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!dirty || isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
                }
              >
                Tạo lịch
              </Button>
            </SectionWrapper>

            {/* SHIP INFO */}
            <SectionWrapper title="Thông tin tàu">
              <Box display="flex" justifyContent="center" mb={2}>
                <ImageUploadFieldFormik
                  name="shipInfo.image"
                  width={300}
                  height={180}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={3}>
                  <InfoTextFieldFormik name="shipInfo.imoNumber" label="IMO" />
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

                <Grid size={3}>
                  <InfoTextFieldFormik name="shipInfo.type" label="Loại tàu" />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* ROUTE */}
            <SectionWrapper title="Lịch trình">
              <Grid container spacing={2}>
                <Grid size={12}>
                  <InfoTextFieldFormik name="route" label="Tuyến hành trình" />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik name="departurePort" label="Cảng đi" />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik name="arrivalPort" label="Cảng đến" />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    name="departureTime"
                    label="Thời gian khởi hành"
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    name="arrivalTime"
                    label="Thời gian cập cảng"
                  />
                </Grid>
              </Grid>
            </SectionWrapper>

            {/* CREW */}
            <SectionWrapper title="Danh sách thuyền viên">
              <BaseEditableDataGrid<FormValuesCrew>
                rows={values.crews}
                columns={columns}
                toolbar={
                  <BaseEditableDataGridToolbar
                    onNewRowClick={() => {
                      setFieldValue(
                        "crews",
                        [
                          {
                            id: crypto.randomUUID(),
                            employeeCardId: "",
                          },
                          ...values.crews,
                        ],
                        true,
                      );
                    }}
                  />
                }
                onRowsChange={(newRows) => {
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
