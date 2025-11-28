import React, { useState } from "react";
import { PageTitle, SectionDivider, InfoTextField } from "@components/global";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import Color from "@constants/Color";
import SaveIcon from "@mui/icons-material/Save";
import { Formik } from "formik";
import * as yup from "yup";
import { createPost } from "@/services/postServices";
import { dateStringToISOString } from "@utils/converter";
import { useNavigate } from "react-router";
import { HttpStatusCode } from "axios";

const CreateRecruitment = () => {
  const navigate = useNavigate();

  const yesterday = new Date(); // Create a copy of today's date
  yesterday.setDate(yesterday.getDate() - 1); // Increment the day by 1

  const initialValues = {
    title: "",
    content: "",
    workLocation: "",
    position: "",
    salary: "",
    recruitmentStartDate: "",
    recruitmentEndDate: "",
  };

  const recruitmentSchema = yup.object().shape({
    title: yup.string().required("Tiêu đề bài đăng không được để trống"),
    content: yup.string().required("Nội dung bài đăng không được để trống"),
    workLocation: yup.string().required("Địa điểm không được để trống"),
    position: yup.string().required("Vị trí tuyển dụng không được để trống"),
    salary: yup
      .number()
      .min(1, "Mức lương không hợp lệ")
      .required("Mức lương không được để trống"),

    recruitmentStartDate: yup
      .date()
      .min(yesterday, "Ngày mở đăng ký không hợp lệ")
      .test(
        "is-before-end-date",
        "Ngày mở đăng ký phải trước ngày đóng đăng ký",
        function (value) {
          const { recruitmentEndDate } = this.parent; // Access sibling field recruitmentEndDate
          return !recruitmentEndDate || value < recruitmentEndDate;
        },
      ),

    recruitmentEndDate: yup
      .date()
      .test(
        "is-after-start-date",
        "Ngày đóng đăng ký phải sau ngày bắt đầu mở đăng ký",
        function (value) {
          const { recruitmentStartDate } = this.parent; // Access sibling field recruitmentStartDate
          return !recruitmentStartDate || value > recruitmentStartDate;
        },
      ),
  });

  const [createCourseLoading, setCreateCourseLoading] = useState(false);
  // const [isActive, setIsActive] = useState(true);

  const handleCreateRecruitmentSubmit = async (values, { resetForm }) => {
    setCreateCourseLoading(true);
    try {
      //Calling API to create a new crew member
      const response = await createPost({
        title: values.title,
        content: values.content,
        // recruitmentStartDate: dateStringToISOString(
        //   values.recruitmentStartDate
        // ),
        recruitmentEndDate: dateStringToISOString(values.recruitmentEndDate),
        position: values.position,
        expectedSalary: [1000, values.salary], // Changed to double[2] which is the salary range
        workLocation: values.workLocation,
      });
      if (response.status === HttpStatusCode.Created) {
        resetForm();
        navigate("/recruitment");
      } else {
        console.log("Failed to create recruitment");
      }
    } catch (err) {
      console.log("Error when creating recruitment: ", err);
    } finally {
      setCreateCourseLoading(false);
    }
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={recruitmentSchema}
        onSubmit={handleCreateRecruitmentSubmit}
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
                  title="TẠO BÀI ĐĂNG TUYỂN DỤNG"
                  subtitle="Tạo bài đăng tuyển dụng Thuyền viên mới"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!isValid || !dirty}
                    sx={{
                      width: "10%",
                      padding: 1,
                      color: Color.PrimaryBlack,
                      backgroundColor: Color.PrimaryGold,
                      minWidth: 130,
                    }}
                  >
                    {createCourseLoading ? (
                      <CircularProgress size={24} color={Color.PrimaryBlack} />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "end" }}>
                        <SaveIcon
                          sx={{ marginRight: "5px", marginBottom: "1px" }}
                        />
                        <Typography sx={{ fontWeight: 700 }}>Đăng</Typography>
                      </Box>
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              px={2}
              mt={4}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <InfoTextField
                id="recruitrement-start-date"
                label="Ngày mở đăng ký"
                size="small"
                margin="none"
                type="date"
                // required
                fullWidth
                name="recruitmentStartDate"
                value={values.recruitmentStartDate}
                error={
                  !!touched.recruitmentStartDate &&
                  !!errors.recruitmentStartDate
                }
                helperText={
                  touched.recruitmentStartDate && errors.recruitmentStartDate
                    ? errors.recruitmentStartDate
                    : " "
                }
                onChange={handleChange}
                onBlur={handleBlur}
                mx={2}
                sx={{ width: "40%", marginBottom: 0 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30%",
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    borderBottom: `2px solid ${Color.PrimaryBlack}`,
                    width: "40%",
                  }}
                />
              </Box>
              <InfoTextField
                id="recruitrement-end-date"
                label="Ngày đóng đăng ký"
                size="small"
                margin="none"
                type="date"
                // required
                fullWidth
                name="recruitmentEndDate"
                value={values.recruitmentEndDate}
                error={
                  !!touched.recruitmentEndDate && !!errors.recruitmentEndDate
                }
                helperText={
                  touched.recruitmentEndDate && errors.recruitmentEndDate
                    ? errors.recruitmentEndDate
                    : " "
                }
                onChange={handleChange}
                onBlur={handleBlur}
                mx={2}
                sx={{ width: "40%", marginBottom: 0 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <SectionDivider
              sx={{ marginTop: 1 }}
              sectionName="Thông tin bài đăng*: "
            />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="title"
                  label="Tiêu đề bài đăng"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="title"
                  value={values.title}
                  error={!!touched.title && !!errors.title}
                  helperText={
                    touched.title && errors.title ? errors.title : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="position"
                  label="Vị trí tuyển dụng"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="position"
                  value={values.position}
                  error={!!touched.position && !!errors.position}
                  helperText={
                    touched.position && errors.position ? errors.position : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={2.5}>
                <InfoTextField
                  id="work-location"
                  label="Địa điểm"
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="workLocation"
                  value={values.workLocation}
                  error={!!touched.workLocation && !!errors.workLocation}
                  helperText={
                    touched.workLocation && errors.workLocation
                      ? errors.workLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid size={2.5}>
                <InfoTextField
                  id="salary"
                  label="Mức lương"
                  size="small"
                  type="number"
                  margin="none"
                  required
                  fullWidth
                  name="salary"
                  value={values.salary}
                  error={!!touched.salary && !!errors.salary}
                  helperText={
                    touched.salary && errors.salary ? errors.salary : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">vnđ</InputAdornment>
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
                  }}
                />
              </Grid>
              <Grid size={12}>
                <InfoTextField
                  id="content"
                  label="Mô tả công việc"
                  rows={8}
                  multiline
                  size="small"
                  margin="none"
                  required
                  fullWidth
                  name="content"
                  value={values.content}
                  error={!!touched.content && !!errors.content}
                  helperText={
                    touched.content && errors.content ? errors.content : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default CreateRecruitment;
