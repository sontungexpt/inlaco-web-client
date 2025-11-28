import React, { useState } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  SwitchBar,
  NoValuesOverlay,
} from "@components/global";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { LogoInput } from "@components/other";
import { DataGrid } from "@mui/x-data-grid";
import { mockCandidates } from "@/data/mockData";
import {
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router";
import { formatDateTime } from "@utils/converter";
import Color from "@constants/Color";

const CourseDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin;
  const isAlreadyEnrolled = false; //this should be replace

  //   useEffect(() => {
  //     fetchCourseDetail(id);
  //   }, [])

  const columns = [
    {
      field: "id",
      headerName: "STT",
      flex: 0.75,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "fullName",
      headerName: "Họ tên",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "SĐT",
      sortable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "timeOfApplication",
      headerName: "Thời gian đăng ký",
      sortable: false,
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => formatDateTime(params),
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  const initialValues = {
    instructorName: "",
    institute: "",
    instituteLogo: "",
    courseName: "",
    startDate: "",
    endDate: "",
    description: "",
    estimatedCourseDuration: "",
    isCertificatedCourse: "",
    courseWallpaper: "",
  };

  const isCertificatedCourseOption = ["Có", "Không"];

  const courseSchema = yup.object().shape({
    instructorName: yup.string(),
    institute: yup.string().required("Tên đơn vị đào tạo không được để trống"),
    instituteLogo: yup.string(),
    courseName: yup.string().required("Tên khóa học không được để trống"),
    startDate: yup
      .date()
      .required("Ngày bắt đầu không được để trống")
      .test(
        "is-before-end-date",
        "Ngày bắt đầu phải trước ngày kết thúc",
        function (value) {
          const { endDate } = this.parent; // Access sibling field endDate
          return !endDate || value < endDate;
        },
      ),
    endDate: yup
      .date()
      .required("Ngày kết thúc không được để trống")
      .test(
        "is-after-start-date",
        "Ngày kết thúc phải sau ngày bắt đầu",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value > startDate;
        },
      ),
    startRegistrationAt: yup
      .date()
      .required("Ngày bắt đầu đăng kí khoá học không được để trống")
      .test(
        "is-before-registration-end-date",
        "Ngày bắt đầu đăng kí khoá học phải trước ngày kết thúc đăng kí khoá học",
        function (value) {
          const { endRegistrationAt } = this.parent; // Access sibling field endDate
          return !endRegistrationAt || value < endRegistrationAt;
        },
      )
      .test(
        "is-before-start-date",
        "Ngày bắt đầu đăng kí khoá học phải trước ngày bắt đầu khoá học",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value < startDate;
        },
      ),
    endRegistrationAt: yup
      .date()
      .required("Ngày kết thúc đăng kí khoá học không được đễ trống")
      .test(
        "is-after-registration-start-date",
        "Ngày kết thúc đăng kí khoá học phải sau ngày bắt đầu đăng kí khoá học",
        function (value) {
          const { startRegistrationAt } = this.parent; // Access sibling field startDate
          return startRegistrationAt ? value > startRegistrationAt : true;
        },
      )
      .test(
        "is-before-start-date",
        "Ngày kết thúc đăng kí khoá học phải trước ngày bắt đầu khoá học",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value < startDate;
        },
      ),
    description: yup.string().required("Mô tả khóa học không được để trống"),
    isCertificatedCourse: yup.string().required("Vui lòng chọn một lựa chọn"),
    limitStudent: yup.number().required("Vui lòng nhập số người học"),
    archivedPosition: yup
      .string()
      .required("Vui lòng nhập vị trí đạt được sau khi hoàn thành khoá học"),
  });

  const [openClosedLoading, setOpenClosedLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleSwitchingOpenClosedClick = async () => {
    setOpenClosedLoading(true);
    try {
      //Call API to update the status of the recruitment
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Mock API call

      setIsClosed(!isClosed);
    } catch (error) {
      console.log("Error when updating course status: ", error);
    } finally {
      setOpenClosedLoading(false);
    }
  };

  const handleEnrollCourseClick = async () => {
    setEnrollLoading(true);
    try {
      //Calling API to create a new crew member
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Mock API call

      console.log("Successfully enroll a course");
    } catch (err) {
      console.log("Error when enrolling a course: ", err);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleSaveCourseSubmit = async (values) => {
    // setCreateCourseLoading(true);
    try {
      //Calling API to create a new crew member
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Mock API call

      console.log("Successfully submitted: ", values);
      setIsEditable(false);
    } catch (err) {
      console.log("Error when creating course: ", err);
    } finally {
      //   setCreateCourseLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={courseSchema}
        onSubmit={handleSaveCourseSubmit}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Box m="20px" component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <PageTitle
                  title="CHI TIẾT KHÓA ĐÀO TẠO THUYỀN VIÊN"
                  subtitle={`Tên khóa đào tạo: ${id}`} //this should be the course name
                />
                {!isAdmin ? (
                  <>
                    {!isAlreadyEnrolled && (
                      <Button
                        variant="contained"
                        onClick={() => handleEnrollCourseClick()}
                        sx={{
                          width: "12%",
                          padding: 1,
                          color: Color.PrimaryBlack,
                          backgroundColor: Color.PrimaryGold,
                          minWidth: 130,
                        }}
                      >
                        {enrollLoading ? (
                          <CircularProgress
                            size={24}
                            color={Color.PrimaryBlack}
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <AppRegistrationRoundedIcon
                              sx={{ marginRight: "5px", marginBottom: "1px" }}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              Đăng ký
                            </Typography>
                          </Box>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        marginRight: 2,
                      }}
                    >
                      {isEditable ? (
                        <>
                          <Button
                            variant="outlined"
                            sx={{
                              color: Color.PrimaryOrgange,
                              padding: "8px",
                              marginRight: 2,
                              borderColor: Color.PrimaryOrgange,
                            }}
                            onClick={handleCancelClick}
                          >
                            <Box sx={{ display: "flex", alignItems: "end" }}>
                              <DeleteForeverRoundedIcon
                                sx={{
                                  width: 20,
                                  height: 20,
                                  marginRight: "2px",
                                  marginBottom: "2px",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 14,
                                }}
                              >
                                Hủy
                              </Typography>
                            </Box>
                          </Button>
                          <Button
                            variant="contained"
                            type={"submit"}
                            disabled={!isValid || !dirty}
                            sx={{
                              color: Color.PrimaryWhite,
                              backgroundColor: Color.PrimaryBlue,
                              padding: "10px",
                              marginTop: "1px",
                              marginBottom: "1px",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "end" }}>
                              <SaveIcon
                                sx={{
                                  width: 20,
                                  height: 20,
                                  marginRight: "2px",
                                  marginBottom: "2px",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 14,
                                }}
                              >
                                Lưu
                              </Typography>
                            </Box>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          type={"button"}
                          disabled={!isClosed}
                          sx={{
                            color: Color.PrimaryBlack,
                            backgroundColor: Color.PrimaryGold,
                            padding: "10px",
                            marginTop: "1px",
                            marginBottom: "1px",
                          }}
                          onClick={handleEditClick}
                        >
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <EditIcon
                              sx={{
                                width: 20,
                                height: 20,
                                marginRight: "2px",
                                marginBottom: "2px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: Color.PrimaryBlack,
                              }}
                            >
                              Chỉnh sửa
                            </Typography>
                          </Box>
                        </Button>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => handleSwitchingOpenClosedClick()}
                      disabled={openClosedLoading || isEditable}
                      sx={{
                        width: "15%",
                        padding: 1,
                        color: Color.PrimaryWhite,
                        backgroundColor: isClosed
                          ? Color.PrimaryBlue
                          : Color.PrimaryOrgange,
                        minWidth: 110,
                      }}
                    >
                      {openClosedLoading ? (
                        <CircularProgress
                          size={24}
                          color={Color.PrimaryBlack}
                        />
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          {isClosed ? (
                            <CheckCircleRoundedIcon
                              sx={{
                                marginRight: "5px",
                                marginBottom: "3px",
                                width: 20,
                                height: 20,
                              }}
                            />
                          ) : (
                            <EventBusyRoundedIcon
                              sx={{
                                marginRight: "5px",
                                marginBottom: "3px",
                                width: 20,
                                height: 20,
                              }}
                            />
                          )}
                          <Typography
                            sx={{ fontWeight: 700, marginLeft: "2px" }}
                          >
                            {isClosed ? "Mở đăng ký" : "Đóng đăng ký"}
                          </Typography>
                        </Box>
                      )}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <>
              {isAdmin && (
                <SwitchBar
                  tabLabel1={"Thông tin bài đăng"}
                  tabLabel2={"Danh sách ứng viên"}
                  variant={"fullWidth"}
                  onChange={(newValue) => handleTabChange(newValue)}
                  color={Color.SecondaryBlue}
                  sx={{
                    backgroundColor: Color.SecondaryWhite,
                    marginTop: 2,
                  }}
                />
              )}
              {tabValue === 1 ? (
                <Box
                  m="20px 0 0 0"
                  height="62vh"
                  maxHeight={550}
                  maxWidth={1600}
                  sx={{
                    "& .MuiDataGrid-columnHeader": {
                      backgroundColor: Color.SecondaryBlue,
                      color: Color.PrimaryWhite,
                    },
                    "& .MuiTablePagination-root": {
                      backgroundColor: Color.SecondaryBlue,
                      color: Color.PrimaryWhite,
                    },
                  }}
                >
                  <DataGrid
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableColumnResize
                    getRowHeight={() => "auto"}
                    rows={mockCandidates}
                    columns={columns}
                    slots={{ noRowsOverlay: NoValuesOverlay }}
                    pageSizeOptions={[5, 10, { value: -1, label: "All" }]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                      },
                    }}
                    sx={{
                      backgroundColor: "#FFF",
                      headerAlign: "center",
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontSize: 16,
                        fontWeight: 700,
                      },
                    }}
                  />
                </Box>
              ) : (
                <>
                  <SectionDivider sectionName="Thông tin cơ sở đào tạo*: " />
                  <Grid
                    container
                    spacing={2}
                    mx={2}
                    rowSpacing={1}
                    pt={2}
                    sx={{ justifyContent: "center" }}
                  >
                    <Grid size={1}>
                      <LogoInput
                        id="institute-logo"
                        name="instituteLogo"
                        onClick={() =>
                          document.getElementById("institute-logo").click()
                        }
                      />
                    </Grid>
                    <Grid size={5}>
                      <InfoTextField
                        id="institute"
                        label="Đơn vị đào tạo"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="institute"
                        value={values.institute}
                        error={!!touched.institute && !!errors.institute}
                        helperText={
                          touched.institute && errors.institute
                            ? errors.institute
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                          marginTop: 2,
                        }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <InfoTextField
                        id="instructor-name"
                        label="Tên giảng viên"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        fullWidth
                        name="instructorName"
                        value={values.instructorName}
                        error={
                          !!touched.instructorName && !!errors.instructorName
                        }
                        helperText={
                          touched.instructorName && errors.instructorName
                            ? errors.instructorName
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                          marginTop: 2,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <SectionDivider sectionName="Thông tin khóa đào tạo*: " />
                  <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
                    <Grid size={4}>
                      <InfoTextField
                        id="course-name"
                        label="Tên khóa học"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="courseName"
                        value={values.courseName}
                        error={!!touched.courseName && !!errors.courseName}
                        helperText={
                          touched.courseName && errors.courseName
                            ? errors.courseName
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <InfoTextField
                        id="start-date"
                        type="date"
                        label="Ngày bắt đầu"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="startDate"
                        value={values.startDate}
                        error={!!touched.startDate && !!errors.startDate}
                        helperText={
                          touched.startDate && errors.startDate
                            ? errors.startDate
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <InfoTextField
                        id="end-date"
                        type="date"
                        label="Ngày kết thúc"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="endDate"
                        value={values.endDate}
                        error={!!touched.endDate && !!errors.endDate}
                        helperText={
                          touched.endDate && errors.endDate
                            ? errors.endDate
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <InfoTextField
                        id="basic-salary"
                        type="number"
                        label="Thời lượng khóa học dự kiến"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="estimatedCourseDuration"
                        value={values.estimatedCourseDuration}
                        error={
                          !!touched.estimatedCourseDuration &&
                          !!errors.estimatedCourseDuration
                        }
                        helperText={
                          touched.estimatedCourseDuration &&
                          errors.estimatedCourseDuration
                            ? errors.estimatedCourseDuration
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                tuần
                              </InputAdornment>
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
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                      />
                      <InfoTextField
                        id="estimated-course-time"
                        select
                        label="Khóa học có cấp chứng chỉ?"
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="isCertificatedCourse"
                        value={values.isCertificatedCourse}
                        error={
                          !!touched.isCertificatedCourse &&
                          !!errors.isCertificatedCourse
                        }
                        helperText={
                          touched.isCertificatedCourse &&
                          errors.isCertificatedCourse
                            ? errors.isCertificatedCourse
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                      >
                        {isCertificatedCourseOption.map((method) => (
                          <MenuItem key={method} value={method}>
                            {method}
                          </MenuItem>
                        ))}
                      </InfoTextField>
                    </Grid>
                    <Grid size={8}>
                      <InfoTextField
                        id="description"
                        label="Mô tả khóa học"
                        rows={8}
                        multiline
                        size="small"
                        margin="none"
                        disabled={!isEditable}
                        required
                        fullWidth
                        name="description"
                        value={values.description}
                        error={!!touched.description && !!errors.description}
                        helperText={
                          touched.description && errors.description
                            ? errors.description
                            : " "
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: Color.PrimaryBlack,
                          },
                          "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                            borderColor: Color.PrimaryBlack,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <HorizontalImageInput
                        id="course-wallpaper"
                        name="courseWallpaper"
                        width="100%"
                        height={250}
                        onClick={() =>
                          document.getElementById("course-wallpaper").click()
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CourseDetail;
