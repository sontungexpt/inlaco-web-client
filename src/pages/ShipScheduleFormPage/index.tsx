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

import { useCrewProfiles } from "@/queries/crew-profile.query";

import { CrewProfile } from "@/types/api/crew-profile";

import { createShipSchedule } from "@/services/ship-schedule.service";

import cloudinaryUpload from "@/services/cloudinary.service";

import UploadStrategy from "@/constants/UploadStrategy";

import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

import { ErrorResponse } from "@/types/api/shared/base.api";

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

        /**
         * =========================================================
         * SHIP_SCHEDULE_ERR_001
         * =========================================================
         * IMO required
         */
        if (
          err.status === HttpStatusCode.BadRequest &&
          errorCode === "SHIP_SCHEDULE_ERR_001"
        ) {
          setFieldError("shipInfo.imoNumber", "IMO tàu là bắt buộc");

          toast.error("Vui lòng nhập IMO tàu");

          return;
        }

        /**
         * =========================================================
         * SHIP_SCHEDULE_ERR_002
         * =========================================================
         * Ship not found in active contracts
         */
        if (
          err.status === HttpStatusCode.NotFound &&
          errorCode === "SHIP_SCHEDULE_ERR_002"
        ) {
          setFieldError(
            "shipInfo.imoNumber",
            "Không tìm thấy tàu trong hợp đồng đang hoạt động",
          );

          toast.error("Tàu chưa tồn tại trong hợp đồng đang hoạt động");

          return;
        }

        /**
         * =========================================================
         * SHIP_SCHEDULE_ERR_003
         * =========================================================
         * Ship not authorized for user
         */
        if (
          err.status === HttpStatusCode.Forbidden &&
          errorCode === "SHIP_SCHEDULE_ERR_003"
        ) {
          setFieldError(
            "shipInfo.imoNumber",
            "Bạn không có quyền tạo lịch cho tàu này",
          );

          toast.error("Bạn không có quyền với tàu này");

          return;
        }

        /**
         * =========================================================
         * SHIP_SCHEDULE_ERR_004
         * =========================================================
         * Crew profile not found
         */
        if (
          err.status === HttpStatusCode.NotFound &&
          errorCode === "SHIP_SCHEDULE_ERR_004"
        ) {
          const employeeCardIds = (response.data.data as string[]) || [];

          const employeeCardIdSet = new Set(employeeCardIds);

          const crewErrors: FormikErrors<FormValuesCrew>[] = [];

          values.crews.forEach((crew, index) => {
            if (employeeCardIdSet.has(crew.employeeCardId)) {
              crewErrors[index] = {
                employeeCardId: "Không tìm thấy hồ sơ thuyền viên",
              };
            }
          });

          /**
           * fallback nếu backend không trả data
           */
          if (employeeCardIds.length === 0) {
            values.crews.forEach((_, index) => {
              crewErrors[index] = {
                employeeCardId: "Không tìm thấy hồ sơ thuyền viên",
              };
            });
          }

          setErrors({
            crews: crewErrors,
          });

          toast.error("Có thuyền viên không tồn tại");

          return;
        }

        /**
         * =========================================================
         * SHIP_SCHEDULE_ERR_005
         * =========================================================
         * Crew member has no account
         */
        if (
          err.status === HttpStatusCode.BadRequest &&
          errorCode === "SHIP_SCHEDULE_ERR_005"
        ) {
          const crewErrors: FormikErrors<FormValuesCrew>[] = [];

          values.crews.forEach((_, index) => {
            crewErrors[index] = {
              employeeCardId: "Thuyền viên chưa có tài khoản",
            };
          });

          setErrors({
            crews: crewErrors,
          });

          toast.error("Có thuyền viên chưa có tài khoản");

          return;
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
              />
            </SectionWrapper>
          </Box>
        );
      }}
    </Formik>
  );
}

// import { useMemo, useState } from "react";

// import {
//   PageTitle,
//   SectionWrapper,
//   InfoTextFieldFormik,
//   ImageUploadFieldFormik,
//   NationalityTextField,
//   BaseEditableDataGrid,
//   SearchBar,
//   InfoTextField,
// } from "@components/common";

// import { Box, Button, CircularProgress, Grid } from "@mui/material";

// import SaveIcon from "@mui/icons-material/Save";

// import { Formik, FormikHelpers, useFormikContext } from "formik";

// import { useNavigate } from "react-router";

// import toast from "react-hot-toast";

// import { FORM_SCHEMA, FormValues, FormValuesCrew } from "./schema";

// import { BASE_FORM_VALUES } from "./initial";

// import { mapValuesToRequestBody } from "./mapper";

// import {
//   BaseEditableDataGridColumn,
//   BaseEditableDataGridRenderEditCellProps,
// } from "@/components/common/datagrid/BaseEditableDataGrid";

// import BaseEditableDataGridToolbar from "@/components/common/datagrid/components/BaseEditableDataGridToolbar";

// import { useCrewProfiles } from "@/queries/crew-profile.query";

// import { CrewProfile } from "@/types/api/crew-profile";

// import { createShipSchedule } from "@/services/ship-schedule.service";

// import cloudinaryUpload from "@/services/cloudinary.service";

// import UploadStrategy from "@/constants/UploadStrategy";

// function CrewSearchEditCell({
//   row,
//   column,
//   onRowChange,
// }: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>) {
//   const key = column.key as keyof FormValuesCrew;

//   const [keyword, setKeyword] = useState("");

//   const { data: { content: crewProfiles = [] } = {}, isLoading } =
//     useCrewProfiles({
//       page: 0,
//       pageSize: 10,
//       filter: {
//         keyword,
//         workStatus: "AVAILABLE",
//       },
//     });

//   const { values } = useFormikContext<FormValues>();

//   const handleSelect = (opt: CrewProfile) => {
//     onRowChange(
//       {
//         ...row,

//         employeeCardId: opt.employeeCardId,
//         fullName: opt.fullName,
//         rankOnBoard: opt.professionalPosition,

//         boardingTime: row.boardingTime || values.departureTime,
//         disembarkTime: row.disembarkTime || values.arrivalTime,

//         boardingPort: row.boardingPort || values.departurePort,
//         disembarkPort: row.disembarkPort || values.arrivalPort,
//       },
//       true,
//     );
//   };

//   return (
//     <SearchBar
//       autoFocus
//       dropdownEnabled
//       dropdownItems={crewProfiles}
//       loading={isLoading}
//       onSearch={setKeyword}
//       onDropdownItemSeletected={handleSelect}
//       onChange={(_, value: string) => {
//         onRowChange({
//           ...row,
//           [key]: value,
//         });
//       }}
//     />
//   );
// }

// function renderSearchEditCell(
//   props: BaseEditableDataGridRenderEditCellProps<FormValuesCrew>,
// ) {
//   return <CrewSearchEditCell {...props} />;
// }

// function renderEditableCell<R, SR>({
//   row,
//   column,
//   onRowChange,
// }: BaseEditableDataGridRenderEditCellProps<R, SR>) {
//   const key = column.key as keyof R;

//   return (
//     <InfoTextField
//       value={row[key] as string}
//       type={column.type || undefined}
//       onChange={(e) => {
//         const manualKeyMap: Record<string, string> = {
//           boardingTime: "isBoardingTimeManual",
//           disembarkTime: "isDisembarkTimeManual",
//           boardingPort: "isBoardingPortManual",
//           disembarkPort: "isDisembarkPortManual",
//         };

//         const manualKey = manualKeyMap[key as string];

//         onRowChange({
//           ...row,
//           [key]: e.target.value,

//           ...(manualKey
//             ? {
//                 [manualKey]: true,
//               }
//             : {}),
//         });
//       }}
//       sx={{
//         height: "100%",
//         width: "100%",
//       }}
//     />
//   );
// }

// export default function ShipScheduleFormPage() {
//   const navigate = useNavigate();

//   const handleSubmitForm = async (
//     values: FormValues,
//     { resetForm }: FormikHelpers<FormValues>,
//   ) => {
//     try {
//       const shipImageUploaded = await cloudinaryUpload(
//         values.shipInfo.image as File,
//         UploadStrategy.SHIP_IMAGE,
//       );

//       const created = await createShipSchedule(
//         mapValuesToRequestBody(values, shipImageUploaded.assetId),
//       );

//       toast.success("Tạo lịch tàu thành công");

//       resetForm();

//       navigate(`/ship-schedules/${created.id}`);
//     } catch (err) {
//       toast.error("Tạo lịch tàu thất bại");
//     }
//   };

//   const columns: BaseEditableDataGridColumn<FormValuesCrew>[] = useMemo(
//     () => [
//       {
//         key: "employeeCardId",
//         name: "Mã nhân viên",
//         renderEditCell: renderSearchEditCell,
//       },

//       {
//         key: "fullName",
//         name: "Họ tên",
//         editable: false,
//       },

//       {
//         key: "rankOnBoard",
//         name: "Chức danh",
//       },

//       {
//         key: "boardingTime",
//         name: "Ngày bắt đầu",
//         type: "datetime",
//         renderEditCell: renderEditableCell,
//       },

//       {
//         key: "disembarkTime",
//         name: "Ngày kết thúc",
//         type: "datetime",
//         renderEditCell: renderEditableCell,
//       },

//       {
//         key: "boardingPort",
//         name: "Địa điểm lên tàu",
//         renderEditCell: renderEditableCell,
//       },

//       {
//         key: "disembarkPort",
//         name: "Địa điểm xuống tàu",
//         renderEditCell: renderEditableCell,
//       },

//       {
//         key: "remark",
//         name: "Ghi chú",
//       },

//       {
//         key: "__action__",
//         width: 70,
//         name: "",
//         renderCell: ({ row }) => {
//           const { values, setFieldValue } = useFormikContext<FormValues>();

//           return (
//             <Button
//               color="error"
//               onClick={() => {
//                 const newRows = values.crews.filter((r) => r.id !== row.id);

//                 setFieldValue("crews", newRows, true);
//               }}
//             >
//               Xoá
//             </Button>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   return (
//     <Formik
//       initialValues={BASE_FORM_VALUES}
//       validationSchema={FORM_SCHEMA}
//       onSubmit={handleSubmitForm}
//     >
//       {({
//         values,
//         errors,
//         handleSubmit,
//         setFieldValue,
//         dirty,
//         isSubmitting,
//       }) => {
//         console.log(errors);

//         return (
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{ m: { xs: 2, md: 3 } }}
//           >
//             {/* HEADER */}
//             <SectionWrapper
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 justifyContent: "space-between",
//                 alignItems: { xs: "stretch", sm: "center" },
//                 gap: 2,
//                 mb: 2,
//               }}
//             >
//               <PageTitle
//                 title="TẠO LỊCH TÀU"
//                 subtitle="Tạo lịch trình tàu mới"
//               />

//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={!dirty || isSubmitting}
//                 sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
//                 startIcon={
//                   isSubmitting ? <CircularProgress size={18} /> : <SaveIcon />
//                 }
//               >
//                 Tạo lịch
//               </Button>
//             </SectionWrapper>

//             {/* SHIP INFO */}
//             <SectionWrapper title="Thông tin tàu">
//               <Box display="flex" justifyContent="center" mb={2}>
//                 <ImageUploadFieldFormik
//                   name="shipInfo.image"
//                   width="100%"
//                   height={180}
//                   sx={{ maxWidth: 300 }}
//                 />
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                   <InfoTextFieldFormik name="shipInfo.imoNumber" label="IMO" />
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6, md: 4 }}>
//                   <InfoTextFieldFormik name="shipInfo.name" label="Tên tàu" />
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6, md: 2 }}>
//                   <NationalityTextField
//                     component={InfoTextFieldFormik}
//                     name="shipInfo.countryISO"
//                     label="Quốc tịch"
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                   <InfoTextFieldFormik name="shipInfo.type" label="Loại tàu" />
//                 </Grid>
//               </Grid>
//             </SectionWrapper>

//             {/* ROUTE */}
//             <SectionWrapper title="Lịch trình">
//               <Grid container spacing={2}>
//                 <Grid size={12}>
//                   <InfoTextFieldFormik name="route" label="Tuyến hành trình" />
//                 </Grid>

//                 <Grid size={6}>
//                   <InfoTextFieldFormik
//                     name="departurePort"
//                     label="Cảng đi"
//                     onChange={(e) => {
//                       const val = e.target.value as string;

//                       setFieldValue("departurePort", val);

//                       setFieldValue(
//                         "crews",
//                         values.crews.map((crew) => ({
//                           ...crew,

//                           boardingPort: crew.isBoardingPortManual
//                             ? crew.boardingPort
//                             : val,
//                         })),
//                         false,
//                       );
//                     }}
//                   />
//                 </Grid>

//                 <Grid size={6}>
//                   <InfoTextFieldFormik
//                     name="arrivalPort"
//                     label="Cảng đến"
//                     onChange={(e) => {
//                       const val = e.target.value as string;

//                       setFieldValue("arrivalPort", val);

//                       setFieldValue(
//                         "crews",
//                         values.crews.map((crew) => ({
//                           ...crew,

//                           disembarkPort: crew.isDisembarkPortManual
//                             ? crew.disembarkPort
//                             : val,
//                         })),
//                         false,
//                       );
//                     }}
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <InfoTextFieldFormik
//                     type="datetime-local"
//                     name="departureTime"
//                     label="Thời gian khởi hành"
//                     onChange={(e) => {
//                       const val = e.target.value as string;

//                       setFieldValue("departureTime", val);

//                       setFieldValue(
//                         "crews",
//                         values.crews.map((crew) => ({
//                           ...crew,

//                           boardingTime: crew.isBoardingTimeManual
//                             ? crew.boardingTime
//                             : val,
//                         })),
//                         false,
//                       );
//                     }}
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <InfoTextFieldFormik
//                     type="datetime-local"
//                     name="arrivalTime"
//                     label="Thời gian cập cảng"
//                     onChange={(e) => {
//                       const val = e.target.value as string;

//                       setFieldValue("arrivalTime", val);

//                       setFieldValue(
//                         "crews",
//                         values.crews.map((crew) => ({
//                           ...crew,

//                           disembarkTime: crew.isDisembarkTimeManual
//                             ? crew.disembarkTime
//                             : val,
//                         })),
//                         false,
//                       );
//                     }}
//                   />
//                 </Grid>
//               </Grid>
//             </SectionWrapper>

//             {/* CREW */}
//             <SectionWrapper title="Danh sách thuyền viên">
//               <BaseEditableDataGrid<FormValuesCrew>
//                 rows={values.crews}
//                 columns={columns}
//                 toolbar={
//                   <BaseEditableDataGridToolbar
//                     onNewRowClick={() => {
//                       setFieldValue(
//                         "crews",
//                         [
//                           {
//                             id: crypto.randomUUID(),
//                             employeeCardId: "",

//                             boardingTime: values.departureTime,
//                             disembarkTime: values.arrivalTime,
//                             isBoardingTimeManual: false,
//                             isDisembarkTimeManual: false,

//                             boardingPort: values.departurePort,
//                             disembarkPort: values.arrivalPort,
//                             isBoardingPortManual: false,
//                             isDisembarkPortManual: false,
//                           },

//                           ...values.crews,
//                         ] as FormValuesCrew[],
//                         true,
//                       );
//                     }}
//                   />
//                 }
//                 onRowsChange={(newRows) => {
//                   setFieldValue("crews", newRows, true);
//                 }}
//               />
//             </SectionWrapper>
//           </Box>
//         );
//       }}
//     </Formik>
//   );
// }
