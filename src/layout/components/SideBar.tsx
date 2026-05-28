import { memo, useCallback, useMemo, useState } from "react";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import { Box, Collapse, IconButton, Typography } from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { useLocation, useNavigate } from "react-router";

import Color from "@constants/Color";

import SidebarConfig, {
  Action,
  type SidebarItem,
} from "@/constants/SidebarConfig";

import { ImageAssets } from "@/constants/Asset";

import { CloudinaryImage } from "@/components/common";

import { useAuthContext } from "@/contexts/auth.context";

import { canAccess, type AccessHelpers } from "@/utils/access-control";

/* =========================================================================
 * ITEM
 * ========================================================================= */

interface ItemProps {
  title: string;

  icon: React.ReactNode;

  active?: boolean;

  onClick?: () => void;
}

const Item = memo(({ title, icon, active = false, onClick }: ItemProps) => {
  return (
    <MenuItem
      active={active}
      icon={icon}
      onClick={onClick}
      style={{
        color: Color.PrimaryWhite,
      }}
    >
      <Typography
        sx={{
          fontSize: 15,

          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
    </MenuItem>
  );
});

Item.displayName = "SidebarItem";

/* =========================================================================
 * SIDEBAR
 * ========================================================================= */

const SideBar = () => {
  const {
    user,

    roles,

    logout,

    includesRole,

    includesAllRoles,
  } = useAuthContext();

  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  /* =========================================================================
   * ACCESS HELPERS
   * ========================================================================= */

  const accessHelpers = useMemo<AccessHelpers>(
    () => ({
      roles,

      includesRole,

      includesAllRoles,
    }),
    [roles, includesRole, includesAllRoles],
  );

  /* =========================================================================
   * ACTION MAP
   * ========================================================================= */

  const actionMap = useMemo(
    () => ({
      [Action.LOGOUT]: logout,
    }),
    [logout],
  );

  /* =========================================================================
   * ACTIVE ROUTE
   * ========================================================================= */

  const isActive = useCallback(
    (path?: string) => {
      if (!path) {
        return false;
      }

      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    },
    [location.pathname],
  );

  /* =========================================================================
   * FILTERED MENU
   * ========================================================================= */

  const filteredMenu = useMemo(() => {
    return SidebarConfig.map((section) => ({
      ...section,

      items: section.items.filter((item) =>
        canAccess(accessHelpers, item.access),
      ),
    })).filter(
      (section) =>
        canAccess(accessHelpers, section.access) && section.items.length > 0,
    );
  }, [accessHelpers]);

  /* =========================================================================
   * HANDLE ITEM CLICK
   * ========================================================================= */

  const handleItemClick = useCallback(
    async (item: SidebarItem) => {
      try {
        if (item.preNavigate) {
          await actionMap[item.preNavigate]?.();
        }

        if (item.to) {
          navigate(item.to);
        }

        if (item.postNavigate) {
          await actionMap[item.postNavigate]?.();
        }
      } catch (error) {
        console.error("Sidebar action error:", error);
      }
    },
    [actionMap, navigate],
  );

  /* =========================================================================
   * TOGGLE SIDEBAR
   * ========================================================================= */

  const handleToggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor={Color.PrimaryBlue}
      style={{
        height: "100%",

        borderRight: "none",
      }}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            transition: "0.2s ease",

            backgroundColor: active ? Color.SecondaryBlue : "transparent",

            "&:hover": {
              backgroundColor: Color.PrimaryHoverBlue,
            },
          }),
        }}
      >
        {/* =========================================================================
         * HEADER
         * ========================================================================= */}

        <MenuItem
          onClick={handleToggleSidebar}
          style={{
            color: Color.PrimaryWhite,
          }}
        >
          <Box
            sx={{
              px: collapsed ? 0 : 1,

              width: "100%",

              display: "flex",
              alignItems: "center",

              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            {!collapsed && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  alt="logo"
                  src={ImageAssets.InlacoLogo}
                  style={{
                    width: 60,

                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

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

        {/* =========================================================================
         * USER INFO
         * ========================================================================= */}

        <Collapse in={!collapsed}>
          <Box
            my={3}
            width="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <CloudinaryImage
              alt="profile"
              width={90}
              height={90}
              src={user?.avatar?.url}
              publicId={user?.avatar?.publicId}
              fallback={ImageAssets.ProfilePlaceHolder}
              style={{
                borderRadius: "50%",

                objectFit: "cover",
              }}
            />

            <Typography
              mt={1}
              variant="h6"
              color={Color.PrimaryWhite}
              sx={{
                maxWidth: 180,

                textAlign: "center",

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name}
            </Typography>
          </Box>
        </Collapse>

        {/* =========================================================================
         * MENU SECTIONS
         * ========================================================================= */}

        {filteredMenu.map((section) => (
          <Box key={section.section}>
            {section.section !== "MAIN" && (
              <Typography
                variant="h6"
                color={Color.PrimaryGold}
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1,

                  textAlign: collapsed ? "center" : "left",

                  m: collapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
                }}
              >
                {collapsed
                  ? (section.short ?? section.section[0])
                  : section.section}
              </Typography>
            )}

            {section.items.map((item) => (
              <Item
                key={item.to ?? item.title}
                title={item.title}
                icon={item.icon}
                active={isActive(item.to)}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </Box>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default SideBar;

// import { useState, memo, useMemo, useCallback } from "react";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography, Collapse } from "@mui/material";
// import { useNavigate, useLocation } from "react-router";

// /* ===== Icons ===== */
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

// import Color from "@constants/Color";
// import SidebarConfig, { Action } from "@/constants/SidebarConfig";
// import { CloudinaryImage } from "@/components/common";
// import { ImageAssets } from "@/constants/Asset";
// import { useAuthContext } from "@/contexts/auth.context";

// const Item = memo(({ title, icon, active, onClick }) => (
//   <MenuItem
//     active={active}
//     icon={icon}
//     onClick={onClick}
//     style={{ color: Color.PrimaryWhite }}
//   >
//     <Typography
//       sx={{
//         whiteSpace: "nowrap",
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//         fontSize: 15,
//       }}
//     >
//       {title}
//     </Typography>
//   </MenuItem>
// ));

// const SideBar = () => {
//   const { user, includesRole, logout } = useAuthContext();

//   /* ===== ACTION MAP ===== */
//   const ACTION_MAP = {
//     [Action.LOGOUT]: logout,
//   };

//   const [collapsed, setCollapsed] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   /* ===== Helpers ===== */
//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + "/");

//   const hasAnyRole = useCallback(
//     (roles = []) => roles.length === 0 || roles.some(includesRole),
//     [includesRole],
//   );

//   /* ===== Filter menu by role (memoized) ===== */
//   const filteredMenu = useMemo(() => {
//     return SidebarConfig.map((section) => ({
//       ...section,
//       items: section.items.filter((item) => hasAnyRole(item.roles)),
//     })).filter(
//       (section) => hasAnyRole(section.roles) && section.items.length > 0,
//     );
//   }, [hasAnyRole]);

//   const handleItemClick = async (e, item) => {
//     if (item.preNavigate) {
//       const f = ACTION_MAP[item.preNavigate];
//       if (f) await f();
//     }
//     if (item.to) {
//       navigate(item.to);
//     }

//     if (item.postNavigate) {
//       const f = ACTION_MAP[item.postNavigate];
//       if (f) await f();
//     }
//   };
//   return (
//     <Sidebar
//       collapsed={collapsed}
//       backgroundColor={Color.PrimaryBlue}
//       style={{ height: "100%" }}
//     >
//       <Menu
//         menuItemStyles={{
//           button: ({ active }) => ({
//             backgroundColor: active ? Color.SecondaryBlue : undefined,
//             "&:hover": {
//               backgroundColor: Color.PrimaryHoverBlue,
//             },
//           }),
//         }}
//       >
//         {/* ===== TOGGLE ===== */}
//         <MenuItem
//           onClick={() => setCollapsed(!collapsed)}
//           style={{ color: Color.PrimaryWhite }}
//         >
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: collapsed ? "center" : "space-between",
//               px: collapsed ? 0 : 1,
//             }}
//           >
//             {/* LOGO */}
//             {!collapsed && (
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <img
//                   src={ImageAssets.InlacoLogo}
//                   alt="logo"
//                   style={{ width: 60 }}
//                 />
//               </Box>
//             )}

//             {/* TOGGLE ICON */}
//             <IconButton
//               sx={{
//                 color: Color.PrimaryWhite,
//                 transition: "0.3s",
//                 transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
//               }}
//             >
//               <MenuOutlinedIcon />
//             </IconButton>
//           </Box>
//         </MenuItem>

//         {/* ===== USER INFO (ANIMATED) ===== */}
//         <Collapse in={!collapsed}>
//           <Box
//             width="100%"
//             flexDirection="column"
//             my={3}
//             display="flex"
//             alignItems="center"
//           >
//             <CloudinaryImage
//               fallback={ImageAssets.ProfilePlaceHolder}
//               publicId={user?.avatar?.publicId}
//               src={user?.avatar?.url}
//               alt="profile"
//               width={90}
//               height={90}
//               style={{ borderRadius: "50%" }}
//             />
//             <Typography variant="h6" color={Color.PrimaryWhite} mt={1}>
//               {user?.name}
//             </Typography>
//           </Box>
//         </Collapse>

//         {/* ===== MENU SECTIONS ===== */}
//         {filteredMenu.map((section) => (
//           <Box key={section.section}>
//             {section.section !== "MAIN" && (
//               <Typography
//                 variant="h6"
//                 color={Color.PrimaryGold}
//                 sx={{
//                   m: collapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
//                   textAlign: collapsed ? "center" : "left",
//                 }}
//               >
//                 {collapsed ? section.short : section.section}
//               </Typography>
//             )}

//             {section.items.map((item) => (
//               <Item
//                 key={item.to || item.action}
//                 title={item.title}
//                 icon={item.icon}
//                 active={item.to ? isActive(item.to) : false}
//                 onClick={(e) => {
//                   handleItemClick(e, item);
//                 }}
//               />
//             ))}
//           </Box>
//         ))}
//       </Menu>
//     </Sidebar>
//   );
// };

// export default SideBar;
