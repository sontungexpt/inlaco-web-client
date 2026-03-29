import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
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

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Formik, FormikHelpers } from "formik";
import { AxiosError, HttpStatusCode } from "axios";

import * as Yup from "yup";

import Color from "@constants/Color";
import Regex from "@/utils/validation/Regex";

import { InfoTextFieldFormik } from "@/components/common";
import { useAuthContext } from "@/contexts/auth.context";
import { requiredString } from "@/utils/validation/yupHelpers";
import { ImageAssets } from "@/constants/Asset";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [isShowPass, setIsShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const LOGIN_SCHEMA = Yup.object().shape({
    email: requiredString("Vui lòng nhập email").email("Email không hợp lệ"),
    password: requiredString("Vui lòng nhập mật khẩu").matches(
      Regex.PASSWORD,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 chữ thường",
    ),
  });
  type FormValues = Yup.InferType<typeof LOGIN_SCHEMA>;

  const initialValues = {
    email: "",
    password: "",
  } as FormValues;

  const onSubmit = async (
    values: FormValues,
    { setErrors }: FormikHelpers<FormValues>,
  ) => {
    try {
      await login(
        {
          username: values.email,
          password: values.password,
        },
        rememberMe,
      );
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err instanceof AxiosError) {
        switch (err.status) {
          case HttpStatusCode.Forbidden:
            setErrors({
              email:
                "Email chưa được xác thực, vui lòng kiểm tra email của bạn",
            });
            return;
          case HttpStatusCode.NotFound:
            setErrors({
              email: "Tên đăng nhập hoặc mật khẩu không chính xác",
              password: "Tên đăng nhập hoặc mật khẩu không chính xác",
            });
            return;
        }
      }
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      console.debug(err);
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
            backgroundColor: Color.PrimaryBlue,
          }}
        >
          <img alt="logo" width={60} src={ImageAssets.InlacoLogo} />
        </Box>

        {/* FORM */}
        <Formik
          initialValues={initialValues}
          validationSchema={LOGIN_SCHEMA}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, isValid, dirty, handleSubmit }) => (
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
                Đăng nhập
              </Typography>

              {/* EMAIL */}
              <InfoTextFieldFormik
                label="Email"
                name="email"
                margin="normal"
                fullWidth
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
                margin="normal"
                fullWidth
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

              {/* REMEMBER + FORGOT */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Typography fontSize={14}>Ghi nhớ</Typography>
                </Box>

                <NavLink to="/forgot-password" style={{ fontSize: 14 }}>
                  Quên mật khẩu?
                </NavLink>
              </Box>

              {/* BUTTON */}
              <Button
                type="submit"
                variant="contained"
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
                  "Đăng nhập"
                )}
              </Button>

              {/* SIGN UP */}
              <Typography textAlign="center" mt={3} fontSize={14}>
                Chưa có tài khoản? <NavLink to="/sign-up">Đăng ký</NavLink>
              </Typography>
            </Box>
          )}
        </Formik>

        {/* FOOTER */}
        <Box
          sx={{
            py: 1.5,
            px: 2,
            backgroundColor: Color.PrimaryBlue,
            textAlign: "center",
          }}
        >
          <Typography color="#fff" fontSize={11} fontWeight={600}>
            CÔNG TY CỔ PHẦN HỢP TÁC LAO ĐỘNG VỚI NƯỚC NGOÀI
          </Typography>
          <Typography color="#fff" fontSize={9}>
            INTERNATIONAL LABOUR AND SERVICES STOCK COMPANY (INLACO - HP)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
