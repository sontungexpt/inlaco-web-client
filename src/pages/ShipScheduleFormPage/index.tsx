import { useMemo, useState } from "react";

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

  const { values } = useFormikContext<FormValues>();

  const handleSelect = (opt: CrewProfile) => {
    onRowChange(
      {
        ...row,

        employeeCardId: opt.employeeCardId,
        fullName: opt.fullName,
        rankOnBoard: opt.professionalPosition,

        boardingTime: row.boardingTime || values.departureTime,
        disembarkTime: row.disembarkTime || values.arrivalTime,

        boardingPort: row.boardingPort || values.departurePort,
        disembarkPort: row.disembarkPort || values.arrivalPort,
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

function renderEditableCell<R, SR>({
  row,
  column,
  onRowChange,
}: BaseEditableDataGridRenderEditCellProps<R, SR>) {
  const key = column.key as keyof R;

  return (
    <InfoTextField
      value={row[key] as string}
      type={column.type || undefined}
      onChange={(e) => {
        const manualKeyMap: Record<string, string> = {
          boardingTime: "isBoardingTimeManual",
          disembarkTime: "isDisembarkTimeManual",
          boardingPort: "isBoardingPortManual",
          disembarkPort: "isDisembarkPortManual",
        };

        const manualKey = manualKeyMap[key as string];

        onRowChange({
          ...row,
          [key]: e.target.value,

          ...(manualKey
            ? {
                [manualKey]: true,
              }
            : {}),
        });
      }}
      sx={{
        height: "100%",
        width: "100%",
      }}
    />
  );
}

export default function ShipScheduleFormPage() {
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
        key: "boardingTime",
        name: "Ngày bắt đầu",
        type: "datetime",
        renderEditCell: renderEditableCell,
      },

      {
        key: "disembarkTime",
        name: "Ngày kết thúc",
        type: "datetime",
        renderEditCell: renderEditableCell,
      },

      {
        key: "boardingPort",
        name: "Địa điểm lên tàu",
        renderEditCell: renderEditableCell,
      },

      {
        key: "disembarkPort",
        name: "Địa điểm xuống tàu",
        renderEditCell: renderEditableCell,
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
                  <InfoTextFieldFormik
                    name="departurePort"
                    label="Cảng đi"
                    onChange={(e) => {
                      const val = e.target.value as string;

                      setFieldValue("departurePort", val);

                      setFieldValue(
                        "crews",
                        values.crews.map((crew) => ({
                          ...crew,

                          boardingPort: crew.isBoardingPortManual
                            ? crew.boardingPort
                            : val,
                        })),
                        false,
                      );
                    }}
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    name="arrivalPort"
                    label="Cảng đến"
                    onChange={(e) => {
                      const val = e.target.value as string;

                      setFieldValue("arrivalPort", val);

                      setFieldValue(
                        "crews",
                        values.crews.map((crew) => ({
                          ...crew,

                          disembarkPort: crew.isDisembarkPortManual
                            ? crew.disembarkPort
                            : val,
                        })),
                        false,
                      );
                    }}
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    name="departureTime"
                    label="Thời gian khởi hành"
                    onChange={(e) => {
                      const val = e.target.value as string;

                      setFieldValue("departureTime", val);

                      setFieldValue(
                        "crews",
                        values.crews.map((crew) => ({
                          ...crew,

                          boardingTime: crew.isBoardingTimeManual
                            ? crew.boardingTime
                            : val,
                        })),
                        false,
                      );
                    }}
                  />
                </Grid>

                <Grid size={6}>
                  <InfoTextFieldFormik
                    type="datetime-local"
                    name="arrivalTime"
                    label="Thời gian cập cảng"
                    onChange={(e) => {
                      const val = e.target.value as string;

                      setFieldValue("arrivalTime", val);

                      setFieldValue(
                        "crews",
                        values.crews.map((crew) => ({
                          ...crew,

                          disembarkTime: crew.isDisembarkTimeManual
                            ? crew.disembarkTime
                            : val,
                        })),
                        false,
                      );
                    }}
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

                            boardingTime: values.departureTime,
                            disembarkTime: values.arrivalTime,
                            isBoardingTimeManual: false,
                            isDisembarkTimeManual: false,

                            boardingPort: values.departurePort,
                            disembarkPort: values.arrivalPort,
                            isBoardingPortManual: false,
                            isDisembarkPortManual: false,
                          },

                          ...values.crews,
                        ] as FormValuesCrew[],
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
