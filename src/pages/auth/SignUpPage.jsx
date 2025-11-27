import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import * as yup from "yup";
import Color from "@constants/Color";
import { HttpStatusCode } from "axios";
import { signUpAPI } from "@/services/authServices";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isShowPass, setIsShowPass] = useState(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d@$!%*?&]{8,}$";

  const signUpSchema = yup.object().shape({
    fullName: yup.string().required("Họ tên không được để trống"), //"\n" is to make sure the error message will be displayed in 2 lines for fixed height
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"), //"\n" is to make sure the error message will be displayed in 2 lines for fixed height

    password: yup
      .string()
      .matches(
        passwordRegex,
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 chữ thường", //no need to add \n cuz this one already takes 2 lines
      )
      .required("Vui lòng nhập mật khẩu"), //"\n" is to make sure the error message will be displayed in 2 lines for fixed height

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu đã nhập không trùng khớp")
      .required("Vui lòng nhập lại mật khẩu"), //"\n" is to make sure the error message will be displayed in 2 lines for fixed height
  });

  const handleSignUpClick = async (values, { setErrors }) => {
    setSignUpLoading(true);
    try {
      //Calling API to sign up
      const response = await signUpAPI(
        values.fullName,
        values.email,
        values.password,
        values.confirmPassword,
      );

      if (response.status === HttpStatusCode.Accepted) {
        navigate("/verify-email-confirmation");
      } else if (response.status === HttpStatusCode.Conflict) {
        setErrors({ email: "Email này đã được sử dụng để tạo tài khoản" });
      } else {
        setErrors({
          fullName: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          email: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          password: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          confirmPassword: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        });
      }
    } catch (err) {
      console.log("Error when sign up: ", err);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="login">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: Color.PrimaryWhite,
          width: 500,
          height: 650,
          borderRadius: 4,
        }}
      >
        <Box
          backgroundColor={Color.PrimaryBlue}
          height="10%"
          width="100%"
          sx={{
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            alt="inlaco-logo"
            width="54"
            height="54"
            src={require("@assets/images/inlaco-logo.png")}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={handleSignUpClick}
        >
          {({
            values,
            errors,
            touched,
            dirty,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                flex: 1,
                mt: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingLeft: 5,
                paddingRight: 5,
                width: "100%",
                paddingTop: 2,
              }}
            >
              <Typography
                mb={2}
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: Color.PrimaryBlue,
                }}
              >
                Đăng ký
              </Typography>
              <TextField
                size="small"
                margin="none"
                required
                autoFocus
                fullWidth
                label="Họ tên"
                id="fullName"
                name="fullName"
                value={values.fullName}
                error={!!touched.fullName && !!errors.fullName}
                helperText={
                  touched.fullName && errors.fullName ? errors.fullName : " "
                }
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  },
                  formHelperText: {
                    sx: {
                      backgroundColor: Color.PrimaryWhite,
                      margin: 0,
                      paddingRight: 1,
                      paddingLeft: 1,
                      letterSpacing: 0.3,
                      lineHeight: 1.4,
                      fontSize: 11,
                      whiteSpace: "pre-line",
                    },
                  },
                }}
                sx={{
                  backgroundColor: Color.SecondaryWhite,
                  marginBottom: 3,
                }}
              />
              <TextField
                size="small"
                margin="none"
                required
                fullWidth
                label="Email"
                id="email"
                name="email"
                value={values.email}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email ? errors.email : " "}
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  },
                  formHelperText: {
                    sx: {
                      backgroundColor: Color.PrimaryWhite,
                      margin: 0,
                      paddingRight: 1,
                      paddingLeft: 1,
                      letterSpacing: 0.3,
                      lineHeight: 1.4,
                      fontSize: 11,
                      whiteSpace: "pre-line",
                    },
                  },
                }}
                sx={{
                  backgroundColor: Color.SecondaryWhite,
                  marginBottom: 3,
                }}
              />
              <TextField
                size="small"
                margin="none"
                required
                fullWidth
                label="Mật khẩu"
                type={isShowPass ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                error={!!touched.password && !!errors.password}
                helperText={
                  touched.password && errors.password ? errors.password : " "
                }
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          isShowPass
                            ? setIsShowPass(false)
                            : setIsShowPass(true);
                        }}
                      >
                        {isShowPass ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  },
                  formHelperText: {
                    sx: {
                      backgroundColor: Color.PrimaryWhite,
                      margin: 0,
                      paddingRight: 1,
                      paddingLeft: 1,
                      letterSpacing: 0.3,
                      lineHeight: 1.4,
                      fontSize: 11,
                      whiteSpace: "pre-line",
                    },
                  },
                }}
                sx={{
                  backgroundColor: Color.SecondaryWhite,
                  marginBottom: 3,
                }}
              />
              <TextField
                size="small"
                margin="none"
                required
                fullWidth
                label="Xác nhận mật khẩu"
                type={isShowConfirmPass ? "text" : "password"}
                id="confirm_password"
                name="confirmPassword"
                value={values.confirmPassword}
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : " "
                }
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          isShowConfirmPass
                            ? setIsShowConfirmPass(false)
                            : setIsShowConfirmPass(true);
                        }}
                      >
                        {isShowConfirmPass ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  },
                  formHelperText: {
                    sx: {
                      backgroundColor: Color.PrimaryWhite,
                      margin: 0,
                      paddingRight: 1,
                      paddingLeft: 1,
                      letterSpacing: 0.3,
                      lineHeight: 1.4,
                      fontSize: 11,
                      whiteSpace: "pre-line",
                    },
                  },
                }}
                sx={{
                  backgroundColor: Color.SecondaryWhite,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || !dirty}
                sx={{
                  pt: 1,
                  pb: 1,
                  backgroundColor: Color.PrimaryBlue,
                  color: Color.PrimaryWhite,
                  minWidth: 120,
                  marginTop: 1,
                }}
                // disabled={loading}
              >
                {signUpLoading ? (
                  <CircularProgress color={Color.PrimaryWhite} size={24} />
                ) : (
                  "Đăng ký"
                )}
              </Button>
              <Divider
                sx={{
                  borderWidth: 1,
                  borderColor: Color.PrimaryGray,
                  width: "100%",
                  marginTop: 2,
                  marginBottom: 1,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>Đã có tài khoản?&nbsp;</Typography>
                <NavLink
                  style={({ isActive }) => ({
                    color: isActive ? Color.SecondaryGold : Color.SecondaryGold, //adjust this if needed
                  })}
                  to="/login"
                >
                  Đăng nhập
                </NavLink>
              </Box>
            </Box>
          )}
        </Formik>
        <Box
          backgroundColor={Color.PrimaryGray}
          height="12%"
          width="100%"
          sx={{
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            color={Color.PrimaryWhite}
            sx={{
              fontSize: 12,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "2px",
            }}
          >
            CÔNG TY CỔ PHẦN HỢP TÁC LAO ĐỘNG VỚI NƯỚC NGOÀI
          </Typography>
          <Typography
            color={Color.PrimaryWhite}
            sx={{ fontSize: 8, textAlign: "center" }}
          >
            INTERNATIONAL LABOUR AND SERVICES STOCK COMPANY (INLACO - HP)
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default SignUpPage;
