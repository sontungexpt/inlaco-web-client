import { Box, IconButton, Typography } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { COLOR } from "../../assets/Color";
import NavSearchBar from "./NavSearchBar";
import { useAuthContext } from "../../contexts/AuthContext";
import { localStorage, sessionStorage, StorageKey } from "../../utils/storage";
import { useNavigate } from "react-router";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const TopBar = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setAccountName, setRoles } =
    useAuthContext();

  const handleLogoutClick = async () => {
    //Perform something and calling logout API to invalid the refresh token
    const rememberMe = await localStorage.getItem(StorageKey.REMEMBER_ME);
    if (rememberMe) {
      localStorage.removeItem(StorageKey.ACCESS_TOKEN);
      localStorage.removeItem(StorageKey.REFRESH_TOKEN);
      localStorage.removeItem(StorageKey.ACCOUNT_NAME);
      localStorage.removeItem(StorageKey.ROLES);
    } else {
      sessionStorage.removeItem(StorageKey.ACCESS_TOKEN);
      sessionStorage.removeItem(StorageKey.REFRESH_TOKEN);
      sessionStorage.removeItem(StorageKey.ACCOUNT_NAME);
      sessionStorage.removeItem(StorageKey.ROLES);
    }

    localStorage.removeItem(StorageKey.REMEMBER_ME);
    setAccessToken("");
    setRefreshToken("");
    setAccountName("");
    setRoles([]);
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{ width: "100%", height: "10%" }}
    >
      {/* SEARCH BAR */}
      <NavSearchBar
        placeholder={"Tìm kiếm trang......"}
        backgroundColor={COLOR.secondary_blue}
        color={COLOR.primary_white}
        sx={{ width: "20%" }}
      />

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={handleMenuClick}>
          <SettingsOutlinedIcon sx={{ width: 28, height: 28 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleProfileClick}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PersonOutlinedIcon
                sx={{ width: 22, height: 22, marginRight: 1 }}
              />
              <Typography>Tài khoản</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: COLOR.primary_orange,
              }}
            >
              <LogoutRoundedIcon
                sx={{ width: 22, height: 22, marginRight: 1 }}
              />
              <Typography>Đăng xuất</Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default TopBar;
