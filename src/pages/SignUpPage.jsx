import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
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
import { signUp } from "@/services/auth.service";
import { requiredString } from "@/utils/validation/yupHelpers";
import Regex from "@/utils/validation/Regex";
import { InfoTextFieldFormik } from "@/components/common";
import { ImageAssets } from "@/constants/Asset";
import toast from "react-hot-toast";

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
      await signUp(
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
      console.debug(error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        m: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Color.PrimaryBlue,
          }}
        >
          <img alt="logo" width={60} src={ImageAssets.InlacoLogo} />
        </Box>

        {/* FORM */}
        <Formik
          initialValues={initialValues}
          validationSchema={SIGN_UP_SCHEMA}
          onSubmit={handleSignUpClick}
        >
          {({ dirty, isValid, isSubmitting, handleSubmit }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                mb={3}
                textAlign="center"
                fontSize={26}
                fontWeight={700}
                color={Color.PrimaryBlue}
              >
                Đăng ký
              </Typography>

              {/* FULL NAME */}
              <InfoTextFieldFormik
                label="Họ tên"
                name="fullName"
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* EMAIL */}
              <InfoTextFieldFormik
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* PASSWORD */}
              <InfoTextFieldFormik
                label="Mật khẩu"
                name="password"
                type={isShowPass ? "text" : "password"}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => setIsShowPass((v) => !v)}
                        edge="end"
                      >
                        {isShowPass ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />

              {/* CONFIRM PASSWORD */}
              <InfoTextFieldFormik
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type={isShowConfirmPass ? "text" : "password"}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => setIsShowConfirmPass((v) => !v)}
                        edge="end"
                      >
                        {isShowConfirmPass ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />

              {/* BUTTON */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={!isValid || !dirty || isSubmitting}
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Đăng ký"
                )}
              </Button>

              {/* LOGIN LINK */}
              <Typography textAlign="center" mt={3} fontSize={14}>
                Đã có tài khoản? <NavLink to="/login">Đăng nhập</NavLink>
              </Typography>
            </Box>
          )}
        </Formik>

        {/* FOOTER */}
        <Stack
          spacing={0.5}
          py={1.5}
          sx={{ backgroundColor: Color.PrimaryBlue }}
        >
          <Typography
            color={Color.PrimaryWhite}
            fontSize={11}
            fontWeight={600}
            textAlign="center"
          >
            CÔNG TY CỔ PHẦN HỢP TÁC LAO ĐỘNG VỚI NƯỚC NGOÀI
          </Typography>
          <Typography
            color={Color.PrimaryWhite}
            fontSize={9}
            textAlign="center"
          >
            INTERNATIONAL LABOUR AND SERVICES STOCK COMPANY (INLACO - HP)
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default SignUpPage;
