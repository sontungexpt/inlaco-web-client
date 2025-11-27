import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  Divider,
  CircularProgress,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import { COLOR } from "../assets/Color";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuthContext } from "../contexts/AuthContext";
import { localStorage, sessionStorage } from "../utils/storage";
import StorageKey from "@/constants/StorageKey";
import { Formik } from "formik";
import * as yup from "yup";
import { loginAPI } from "../services/authServices";
import HttpStatusCode from "../constants/HttpStatusCode";

const LoginPage = () => {
  const { setAccessToken, setRefreshToken, setAccountName, setRoles } =
    useAuthContext();
  const navigate = useNavigate();
  const [isShowPass, setIsShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d@$!%*?&]{8,}$";

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),

    password: yup
      .string()
      .matches(
        passwordRegex,
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 chữ thường",
      )
      .required("Vui lòng nhập mật khẩu"), //"\n" is to make sure the error message will be displayed in 2 lines for fixed height
  });

  const handleLoginClick = async (values, { setErrors }) => {
    setLoginLoading(true);
    try {
      // validate login inputs and calling API to login
      const response = await loginAPI(values.email, values.password);
      if (response.status === HttpStatusCode.OK) {
        localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);
        const { jwt, name, roles } = response.data;

        const accessToken = jwt.accessToken;
        const refreshToken = jwt.refreshToken;

        if (rememberMe) {
          localStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
          localStorage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);
          localStorage.setItem(StorageKey.ACCOUNT_NAME, name);
          localStorage.setItem(StorageKey.ROLES, roles);
        } else {
          sessionStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
          sessionStorage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);
          sessionStorage.setItem(StorageKey.ACCOUNT_NAME, name);
          sessionStorage.setItem(StorageKey.ROLES, roles);
        }

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setAccountName(name);
        setRoles(roles);

        navigate("/", { replace: true });
      } else if (response.status === HttpStatusCode.NOT_FOUND) {
        setErrors({
          email: "Tên đăng nhập hoặc mật khẩu không chính xác",
          password: "Tên đăng nhập hoặc mật khẩu không chính xác",
        });
      } else if (response.status === HttpStatusCode.FORBIDDEN) {
        setErrors({
          email: "Email chưa được xác thực, vui lòng kiểm tra email của bạn",
        });
      } else {
        setErrors({
          email: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          password: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        });
      }
      // const mockAccessToken = "ashdajsikdnasd"; //Mock access token
      // localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);

      // if (rememberMe) {
      //   localStorage.setItem(StorageKey.ACCESS_TOKEN, mockAccessToken);
      // } else {
      //   sessionStorage.setItem(StorageKey.ACCESS_TOKEN, mockAccessToken);
      // }

      // console.log("Login successfully: ", values);
      // setAccessToken(mockAccessToken);
      // navigate("/", { replace: true });
    } catch (err) {
      console.log("Error when login: ", err);
      setErrors({
        email: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        password: "Đã có lỗi xảy ra, vui lòng thử lại sau",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: COLOR.primary_white,
          width: 500,
          height: 650,
          borderRadius: 4,
        }}
      >
        <Box
          backgroundColor={COLOR.primary_blue}
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
            src={require("../assets/images/inlaco-logo.png")}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLoginClick}
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
                mb={4}
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLOR.primary_blue,
                }}
              >
                Đăng nhập
              </Typography>
              <TextField
                size="small"
                margin="normal"
                required
                fullWidth
                label="Email"
                id="email"
                autoFocus
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
                      backgroundColor: COLOR.primary_white,
                      margin: 0,
                      paddingRight: 1,
                      paddingLeft: 1,
                      fontSize: 11,
                    },
                  },
                }}
                sx={{
                  backgroundColor: COLOR.secondary_white,
                }}
              />
              <TextField
                size="small"
                margin="normal"
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
                      backgroundColor: COLOR.primary_white,
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
                  backgroundColor: COLOR.secondary_white,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 1,
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                    }}
                    sx={{
                      padding: 0,
                      marginRight: "4px",
                      color: COLOR.primary_gray,
                      "&.Mui-checked": {
                        color: COLOR.primary_gray,
                      },
                    }}
                  />
                  <Typography sx={{ color: COLOR.primary_gray, fontSize: 14 }}>
                    Lưu đăng nhập
                  </Typography>
                </Box>
                <NavLink
                  style={({ isActive }) => ({
                    fontSize: 14,
                    color: isActive ? COLOR.primary_gray : COLOR.primary_gray, //adjust this if needed
                  })}
                >
                  Quên mật khẩu
                </NavLink>
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  position: "relative",
                  pt: 1,
                  pb: 1,
                  mt: 3,
                  backgroundColor: COLOR.primary_blue,
                  color: COLOR.primary_white,
                  minWidth: 120,
                }}
                disabled={!isValid || !dirty}
              >
                {loginLoading ? (
                  <CircularProgress color={COLOR.primary_white} size={24} />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
              <Divider
                sx={{
                  borderWidth: 1,
                  borderColor: COLOR.primary_gray,
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
                <Typography>Chưa có tài khoản?&nbsp;</Typography>
                <NavLink
                  style={({ isActive }) => ({
                    color: isActive
                      ? COLOR.secondary_gold
                      : COLOR.secondary_gold, //adjust this if needed
                  })}
                  to="/sign-up"
                >
                  Tạo ở đây
                </NavLink>
              </Box>
            </Box>
          )}
        </Formik>
        <Box
          backgroundColor={COLOR.primary_gray}
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
            color={COLOR.primary_white}
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
            color={COLOR.primary_white}
            sx={{ fontSize: 8, textAlign: "center" }}
          >
            INTERNATIONAL LABOUR AND SERVICES STOCK COMPANY (INLACO - HP)
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
