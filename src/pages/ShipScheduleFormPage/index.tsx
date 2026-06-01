import { useCallback, useMemo, useState } from "react";

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

import { Formik, FormikErrors, FormikHelpers, useFormikContext } from "formik";

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

import {
  useCrewProfiles,
  useMyMobilizedCrewProfiles,
} from "@/queries/crew-profile.query";

import { CrewProfile, CrewProfileFetchParams } from "@/types/api/crew-profile";

import { createShipSchedule } from "@/services/ship-schedule.service";

import cloudinaryUpload from "@/services/cloudinary.service";

import UploadStrategy from "@/constants/UploadStrategy";

import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

import { ErrorResponse } from "@/types/api/shared/base.api";
import { GetCellError } from "@/components/common/datagrid/shared/error-store";
import { useAuthContext } from "@/contexts/auth.context";
import UserRole from "@/constants/UserRole";

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

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
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
          {opt.professionalPosition && (
            <Box sx={{ whiteSpace: "nowrap" }}>{opt.professionalPosition}</Box>
          )}

          {(opt.professionalPosition || age) && (
            <Box sx={{ opacity: 0.4 }}>•</Box>
          )}

          {age && age > 0 && <Box>{age} tuổi</Box>}

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

function CrewSearchEditCell({
  row,
  column,
  onRowChange,
}: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>) {
  const key = column.key as keyof FormValuesCrew;
  const [keyword, setKeyword] = useState("");
  const { includesRole } = useAuthContext();
  const isAdmin = includesRole(UserRole.ADMIN);

  const baseQueryOptions = {
    page: 0,
    pageSize: 10,
    filter: {
      keyword,
      workStatus: "AVAILABLE",
    },
  } as CrewProfileFetchParams;

  const adminQuery = useCrewProfiles({
    ...baseQueryOptions,
    enabled: isAdmin,
  });

  const myQuery = useMyMobilizedCrewProfiles({
    ...baseQueryOptions,
    enabled: !isAdmin,
  });

  const activeQuery = isAdmin ? adminQuery : myQuery;
  const { data: { content: crewProfiles = [] } = {}, isLoading } = activeQuery;

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
      renderDropdownItem={renderCrewOption}
      onDropdownItemSeletected={handleSelect}
      onChange={(_, value: string) => {
        onRowChange({
          ...row,
          [key]: value,
        });
      }}
      sx={{
        width: "100%",
        height: "100%",
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
    { resetForm, setErrors, setFieldError }: FormikHelpers<FormValues>,
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
      if (err instanceof AxiosError) {
        const response = err.response as AxiosResponse<ErrorResponse>;

        const errorCode = response?.data?.errorCode;

        const buildCrewErrors = (
          predicate: (employeeCardId: string) => string | undefined,
        ) => {
          const crewErrors: FormikErrors<FormValuesCrew>[] = [];

          values.crews.forEach((crew, index) => {
            const message = predicate(crew.employeeCardId);

            if (message) {
              crewErrors[index] = {
                employeeCardId: message,
              };
            }
          });

          return crewErrors;
        };

        switch (errorCode) {
          /**
           * SHIP_SCHEDULE_ERR_001
           */
          case "SHIP_SCHEDULE_ERR_001":
            setFieldError("shipInfo.imoNumber", "IMO tàu là bắt buộc");

            toast.error("Vui lòng nhập IMO tàu");
            return;

          /**
           * SHIP_SCHEDULE_ERR_002
           */
          case "SHIP_SCHEDULE_ERR_002":
            setFieldError(
              "shipInfo.imoNumber",
              "Không tìm thấy tàu trong hợp đồng đang hoạt động",
            );

            toast.error("Không tìm thấy tàu trong hợp đồng");
            return;

          /**
           * SHIP_SCHEDULE_ERR_003
           */
          case "SHIP_SCHEDULE_ERR_003":
            setFieldError(
              "shipInfo.imoNumber",
              "Bạn không có quyền với tàu này",
            );

            toast.error("Bạn không có quyền với tàu này");
            return;

          /**
           * SHIP_SCHEDULE_ERR_004
           */
          case "SHIP_SCHEDULE_ERR_004": {
            const employeeCardIds =
              (response.data.data as string[] | undefined) ?? [];

            const employeeCardIdSet = new Set(employeeCardIds);

            const crewErrors: FormikErrors<FormValuesCrew>[] = [];

            values.crews.forEach((crew, index) => {
              if (
                employeeCardIds.length === 0 ||
                employeeCardIdSet.has(crew.employeeCardId)
              ) {
                crewErrors[index] = {
                  employeeCardId: "Không tìm thấy hồ sơ thuyền viên",
                };
              }
            });

            setErrors({
              crews: crewErrors,
            });

            toast.error("Có thuyền viên không tồn tại");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_005
           */
          case "SHIP_SCHEDULE_ERR_005": {
            const crewErrors = buildCrewErrors(
              () => "Thuyền viên chưa có tài khoản",
            );

            setErrors({
              crews: crewErrors,
            });

            toast.error("Có thuyền viên chưa có tài khoản");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_006
           * INVALID_ASSIGNMENT_DATE
           */
          case "SHIP_SCHEDULE_ERR_006": {
            const crewErrors: FormikErrors<FormValuesCrew>[] = [];

            values.crews.forEach((_, index) => {
              crewErrors[index] = {
                boardingTime: "Thời gian không hợp lệ",
                disembarkTime: "Thời gian không hợp lệ",
              };
            });

            setErrors({
              crews: crewErrors,
            });

            toast.error("Ngày bắt đầu phải trước ngày kết thúc");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_007
           * ASSIGNMENT_EMPTY
           */
          case "SHIP_SCHEDULE_ERR_007":
            setFieldError("crews", "Danh sách thuyền viên không được để trống");

            toast.error("Vui lòng thêm thuyền viên");

            return;

          /**
           * SHIP_SCHEDULE_ERR_008
           * ASSIGNMENT_INVALID_RANGE
           */
          case "SHIP_SCHEDULE_ERR_008":
            toast.error("Khoảng thời gian phân công không hợp lệ");

            return;

          /**
           * SHIP_SCHEDULE_ERR_009
           * CREW_ALREADY_ASSIGNED
           */
          case "SHIP_SCHEDULE_ERR_009": {
            const conflicts = (response.data.data as any[]) ?? [];

            const conflictIds = new Set(conflicts.map((x) => x.employeeCardId));

            const crewErrors = buildCrewErrors((employeeCardId) =>
              conflictIds.has(employeeCardId)
                ? "Thuyền viên đã được phân công"
                : undefined,
            );

            setErrors({
              crews: crewErrors,
            });

            toast.error("Có thuyền viên đã được phân công");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_010
           * CREW_ASSIGNMENT_OVERLAP
           */
          case "SHIP_SCHEDULE_ERR_010": {
            const conflicts = (response.data.data as any[]) ?? [];

            const conflictMap = new Map(
              conflicts.map((x) => [
                x.employeeCardId,
                `Trùng lịch từ ${new Date(
                  x.startDate,
                ).toLocaleDateString()} đến ${new Date(
                  x.endDate,
                ).toLocaleDateString()}`,
              ]),
            );

            const crewErrors = buildCrewErrors((employeeCardId) =>
              conflictMap.get(employeeCardId),
            );

            setErrors({
              crews: crewErrors,
            });

            toast.error("Có thuyền viên bị trùng lịch");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_011
           * CREW_CONFLICT_WITH_SHIP_SCHEDULE
           */
          case "SHIP_SCHEDULE_ERR_011": {
            const conflicts = (response.data.data as any[]) ?? [];

            const conflictIds = new Set(conflicts.map((x) => x.employeeCardId));

            const crewErrors = buildCrewErrors((employeeCardId) =>
              conflictIds.has(employeeCardId)
                ? "Thuyền viên đang thuộc lịch tàu khác"
                : undefined,
            );

            setErrors({
              crews: crewErrors,
            });

            toast.error("Có thuyền viên đang thuộc lịch tàu khác");

            return;
          }

          /**
           * SHIP_SCHEDULE_ERR_012
           */
          case "SHIP_SCHEDULE_ERR_012":
            toast.error("Không tìm thấy lịch tàu");
            return;

          /**
           * SHIP_SCHEDULE_ERR_013
           */
          case "SHIP_SCHEDULE_ERR_013":
            toast.error("Trạng thái lịch tàu không hợp lệ");
            return;

          /**
           * SHIP_SCHEDULE_ERR_014
           */
          case "SHIP_SCHEDULE_ERR_014":
            toast.error("Bạn không có quyền tạo lịch tàu");
            return;

          /**
           * SHIP_SCHEDULE_ERR_015
           */
          case "SHIP_SCHEDULE_ERR_015":
            setFieldError(
              "shipInfo.imoNumber",
              "Không có hợp đồng hiệu lực cho tàu này",
            );

            toast.error("Không có hợp đồng hiệu lực cho tàu này");

            return;

          case "SHIP_SCHEDULE_ERR_016": {
            const overlapSchedule = response.data.data as any;

            toast.error(
              `Lịch tàu bị trùng với lịch từ ${new Date(
                overlapSchedule.departureTime,
              ).toLocaleString()} đến ${new Date(
                overlapSchedule.arrivalTime,
              ).toLocaleString()}`,
            );

            setFieldError("departureTime", "Trùng lịch với lịch tàu khác");

            setFieldError("arrivalTime", "Trùng lịch với lịch tàu khác");

            return;
          }

          default:
            break;
        }
      }

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
        handleSubmit,
        errors,
        setFieldValue,
        dirty,
        isSubmitting,
      }) => {
        return (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ m: { xs: 2, md: 3 } }}
          >
            {/* HEADER */}
            <SectionWrapper
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                gap: 2,
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
                sx={{
                  alignSelf: {
                    xs: "stretch",
                    sm: "auto",
                  },
                }}
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
                  width="100%"
                  height={180}
                  sx={{ maxWidth: 300 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoTextFieldFormik name="shipInfo.imoNumber" label="IMO" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoTextFieldFormik name="shipInfo.name" label="Tên tàu" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <NationalityTextField
                    component={InfoTextFieldFormik}
                    name="shipInfo.countryISO"
                    label="Quốc tịch"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
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
                    error={typeof errors.crews === "string"}
                    helperText={
                      typeof errors.crews === "string"
                        ? errors.crews
                        : undefined
                    }
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
                getCellError={useCallback<GetCellError<FormValuesCrew>>(
                  ({ rowIdx, column }) => {
                    const colKey = column.key;
                    return (errors.crews as any)?.[rowIdx]?.[colKey];
                  },
                  [errors.crews],
                )}
              />
            </SectionWrapper>
          </Box>
        );
      }}
    </Formik>
  );
}
