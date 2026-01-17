import { useState, memo, useMemo, useCallback } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import { useNavigate, useLocation } from "react-router";

/* ===== Icons ===== */
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { useAuthContext } from "../../contexts/AuthContext";
import Color from "@constants/Color";
import SidebarConfig, { Action } from "@/constants/SidebarConfig";
import { CloudinaryImage } from "@/components/common";

const Item = memo(({ title, icon, active, onClick }) => (
  <MenuItem
    active={active}
    icon={icon}
    onClick={onClick}
    style={{ color: Color.PrimaryWhite }}
  >
    <Typography
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: 15,
      }}
    >
      {title}
    </Typography>
  </MenuItem>
));

const SideBar = () => {
  const { user, hasRole, logout } = useAuthContext();

  /* ===== ACTION MAP ===== */
  const ACTION_MAP = {
    [Action.LOGOUT]: logout,
  };

  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ===== Helpers ===== */
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const hasAnyRole = useCallback(
    (roles = []) => roles.length === 0 || roles.some(hasRole),
    [hasRole],
  );

  /* ===== Filter menu by role (memoized) ===== */
  const filteredMenu = useMemo(() => {
    return SidebarConfig.map((section) => ({
      ...section,
      items: section.items.filter((item) => hasAnyRole(item.roles)),
    })).filter(
      (section) => hasAnyRole(section.roles) && section.items.length > 0,
    );
  }, [hasAnyRole]);

  const handleItemClick = async (e, item) => {
    if (item.preNavigate) {
      const f = ACTION_MAP[item.preNavigate];
      if (f) await f();
    }
    if (item.to) {
      navigate(item.to);
    }

    if (item.postNavigate) {
      const f = ACTION_MAP[item.postNavigate];
      if (f) await f();
    }
  };
  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor={Color.PrimaryBlue}
      style={{ height: "100%" }}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? Color.SecondaryBlue : undefined,
            "&:hover": {
              backgroundColor: Color.PrimaryHoverBlue,
            },
          }),
        }}
      >
        {/* ===== TOGGLE ===== */}
        <MenuItem
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: Color.PrimaryWhite }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              px: collapsed ? 0 : 1,
            }}
          >
            {/* LOGO */}
            {!collapsed && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={require("@assets/images/inlaco-logo.png")}
                  alt="logo"
                  style={{ width: 60 }}
                />
              </Box>
            )}

            {/* TOGGLE ICON */}
            <IconButton
              sx={{
                color: Color.PrimaryWhite,
                transition: "0.3s",
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        </MenuItem>

        {/* ===== USER INFO (ANIMATED) ===== */}
        <Collapse in={!collapsed}>
          <Box
            width="100%"
            flexDirection="column"
            my={3}
            display="flex"
            alignItems="center"
          >
            <CloudinaryImage
              fallback={require("@assets/images/profile-logo-placeholder.jpg")}
              publicId={user?.avatar?.publicId}
              src={user?.avatar?.url}
              alt="profile"
              width={90}
              height={90}
              style={{ borderRadius: "50%" }}
            />
            <Typography variant="h6" color={Color.PrimaryWhite} mt={1}>
              {user?.name}
            </Typography>
          </Box>
        </Collapse>

        {/* ===== MENU SECTIONS ===== */}
        {filteredMenu.map((section) => (
          <Box key={section.section}>
            {section.section !== "MAIN" && (
              <Typography
                variant="h6"
                color={Color.PrimaryGold}
                sx={{
                  m: collapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
                  textAlign: collapsed ? "center" : "left",
                }}
              >
                {collapsed ? section.short : section.section}
              </Typography>
            )}

            {section.items.map((item) => (
              <Item
                key={item.to || item.action}
                title={item.title}
                icon={item.icon}
                active={item.to ? isActive(item.to) : false}
                onClick={(e) => {
                  handleItemClick(e, item);
                }}
              />
            ))}
          </Box>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
