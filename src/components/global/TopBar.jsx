import { Box, IconButton, Typography } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NavSearchBar from "./NavSearchBar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import Color from "@constants/Color";

const TopBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogoutClick = async () => {
    logout();
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
        backgroundColor={Color.SecondaryBlue}
        color={Color.PrimaryWhite}
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
                color: Color.PrimaryOrgange,
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
