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
  Stack,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Formik } from "formik";
import * as Yup from "yup";
import Color from "@constants/Color";
import { HttpStatusCode } from "axios";
import { signUp } from "@/services/authServices";
import { requiredString } from "@/utils/yupHelpers";
import Regex from "@/constants/Regex";
import { InfoTextFieldFormik } from "@/components/common";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isShowPass, setIsShowPass] = useState(false);
  const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const SIGN_UP_SCHEMA = Yup.object().shape({
    fullName: requiredString("Vui lòng nhập họ tên"),
    email: requiredString("Vui lòng nhập email").email("Email không hợp lệ"),
    password: requiredString("Vui lòng nhập mật khẩu").matches(
      Regex.PASSWORD,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 chữ thường",
    ),
    confirmPassword: requiredString("Vui lòng nhập lại mật khẩu").oneOf(
      [Yup.ref("password")],
      "Mật khẩu đã nhập không trùng khớp",
    ),
  });

  const handleSignUpClick = async (values, { setErrors }) => {
    try {
      const res = await signUp(
        values.fullName,
        values.email,
        values.password,
        values.confirmPassword,
      );

      navigate("/verify-email-confirmation");
    } catch (error) {
      const res = error.response;

      if (res.status === HttpStatusCode.Conflict) {
        setErrors({ email: "Email này đã được sử dụng" });
        return;
      }
      setErrors({
        fullName: "Đã có lỗi xảy ra",
        email: "Đã có lỗi xảy ra",
        password: "Đã có lỗi xảy ra",
        confirmPassword: "Đã có lỗi xảy ra",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: Color.PrimaryWhite,
        m: "auto",
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
        validationSchema={SIGN_UP_SCHEMA}
        onSubmit={handleSignUpClick}
      >
        {({
          values,
          errors,
          touched,
          dirty,
          isValid,
          isSubmitting,
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
            <InfoTextFieldFormik
              label="Họ tên"
              name="fullName"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ backgroundColor: Color.SecondaryWhite }}
            />
            <InfoTextFieldFormik
              label="Email"
              name="email"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ backgroundColor: Color.SecondaryWhite }}
            />
            <InfoTextFieldFormik
              label="Mật khẩu"
              name="password"
              type={isShowPass ? "text" : "password"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={() => setIsShowPass((v) => !v)}>
                      {isShowPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  ),
                },
              }}
              sx={{ backgroundColor: Color.SecondaryWhite }}
            />
            <InfoTextFieldFormik
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type={isShowConfirmPass ? "text" : "password"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={() => setIsShowConfirmPass((v) => !v)}>
                      {isShowConfirmPass ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                },
              }}
              sx={{ backgroundColor: Color.SecondaryWhite }}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={24} />}
              sx={{ mt: 3, minWidth: 120 }}
            >
              Đăng ký
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
      <Stack spacing={1} py={1} backgroundColor={Color.PrimaryBlue}>
        <Typography
          color={Color.PrimaryWhite}
          sx={{
            fontSize: 12,
            fontWeight: 700,
            textAlign: "center",
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
      </Stack>
    </Box>
  );
};

export default SignUpPage;
