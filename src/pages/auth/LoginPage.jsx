import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
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
import { HttpStatusCode } from "axios";
import { useQueryClient } from "@tanstack/react-query";

import StorageKey from "@/constants/StorageKey";
import Color from "@constants/Color";
import Regex from "@/constants/Regex";
import { login } from "@/services/authServices";
import { localStorage, sessionStorage } from "@/utils/storage";

import { InfoTextFieldFormik } from "@/components/common";

const LOGIN_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string()
    .matches(
      Regex.PASSWORD,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 chữ thường",
    )
    .required("Vui lòng nhập mật khẩu"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isShowPass, setIsShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLoginClick = async (values, { setErrors }) => {
    try {
      const response = await login(values.email, values.password);

      if (response.status === HttpStatusCode.Ok) {
        const { jwt } = response.data;
        const { accessToken, refreshToken } = jwt;

        localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
        storage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);

        // trigger fetch /users/me
        queryClient.invalidateQueries({
          queryKey: ["user-profile"],
        });

        navigate("/", { replace: true });
        return;
      }

      if (response.status === HttpStatusCode.NotFound) {
        setErrors({
          email: "Tên đăng nhập hoặc mật khẩu không chính xác",
          password: "Tên đăng nhập hoặc mật khẩu không chính xác",
        });
        return;
      }

      if (response.status === HttpStatusCode.Forbidden) {
        setErrors({
          email: "Email chưa được xác thực, vui lòng kiểm tra email của bạn",
        });
        return;
      }

      setErrors({
        email: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        password: "Đã có lỗi xảy ra, vui lòng thử lại sau",
      });
    } catch (err) {
      setErrors({
        email: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        password: "Đã có lỗi xảy ra, vui lòng thử lại sau",
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
        validationSchema={LOGIN_SCHEMA}
        onSubmit={handleLoginClick}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          dirty,
          handleBlur,
          handleChange,
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
              paddingX: 5,
              width: "100%",
              paddingTop: 2,
            }}
          >
            <Typography
              mb={4}
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: Color.PrimaryBlue,
              }}
            >
              Đăng nhập
            </Typography>

            {/* EMAIL */}
            <InfoTextFieldFormik
              size="medium"
              margin="normal"
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

            {/* PASSWORD */}
            <InfoTextFieldFormik
              size="medium"
              label="Mật khẩu"
              margin="normal"
              type={isShowPass ? "text" : "password"}
              name="password"
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

            {/* REMEMBER */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Typography fontSize={14}>Lưu đăng nhập</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={24} />}
              sx={{ mt: 3, minWidth: 120 }}
            >
              Đăng nhập
            </Button>

            <Divider sx={{ width: "100%", my: 2 }} />

            <Typography fontSize={20}>
              Chưa có tài khoản? <NavLink to="/sign-up">Đăng kí</NavLink>
            </Typography>
            <Typography fontSize={20}>
              <NavLink to="/">Quên mật khẩu</NavLink>
            </Typography>
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

export default LoginPage;
