import { useState, memo, useMemo } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import { useNavigate, useLocation } from "react-router";

/* ===== Icons ===== */
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useAuthContext } from "../../contexts/AuthContext";
import Color from "@constants/Color";

/* ======================================================
   ROLE CONSTANTS
====================================================== */
const ROLES = {
  ADMIN: "ADMIN",
  SAILOR: "SAILOR",
  USER: "USER",
};

/* ======================================================
   MENU CONFIG (JSON – EXTENDABLE)
====================================================== */
const MENU_CONFIG = [
  {
    section: "MAIN",
    items: [
      {
        title: "Trang chủ",
        to: "/",
        icon: <HomeOutlinedIcon />,
        roles: [ROLES.ADMIN, ROLES.SAILOR, ROLES.USER],
      },
    ],
  },

  {
    section: "Thuyền Viên",
    short: "TV",
    roles: [ROLES.ADMIN, ROLES.SAILOR],
    items: [
      {
        title: "Hồ sơ cá nhân",
        to: "/crews/my-profile",
        icon: <AccountBoxRoundedIcon />,
        roles: [ROLES.SAILOR],
      },
      {
        title: "Thông tin Thuyền viên",
        to: "/crews",
        icon: <PeopleOutlinedIcon />,
        roles: [ROLES.ADMIN],
      },
      {
        title: "Lịch điều động",
        to: "/mobilizations",
        icon: <DirectionsBoatOutlinedIcon />,
        roles: [ROLES.ADMIN],
      },
      // {
      //   title: "Lịch điều động",
      //   to: "/mobilizations/my-mobilizations",
      //   icon: <DirectionsBoatOutlinedIcon />,
      //   roles: [ROLES.SAILOR],
      // },
    ],
  },

  {
    section: "Hợp Đồng",
    short: "HĐ",
    roles: [ROLES.ADMIN],
    items: [
      {
        title: "Hợp đồng Thuyền viên",
        to: "/crew-contracts",
        icon: <AssignmentIndOutlinedIcon />,
        roles: [ROLES.ADMIN],
      },
      {
        title: "Hợp đồng Cung ứng",
        to: "/supply-contracts",
        icon: <RequestQuoteOutlinedIcon />,
        roles: [ROLES.ADMIN],
      },
      {
        title: "Templates",
        to: "/template-contracts",
        icon: <DescriptionOutlinedIcon />,
        roles: [ROLES.ADMIN],
      },
    ],
  },

  {
    section: "Khác",
    short: "K",
    items: [
      {
        title: "Yêu cầu Cung ứng",
        to: "/supply-requests",
        icon: <MarkEmailUnreadOutlinedIcon />,
        roles: [ROLES.ADMIN, ROLES.USER],
      },
      {
        title: "Tuyển dụng",
        to: "/recruitment",
        icon: <HowToRegOutlinedIcon />,
        roles: [ROLES.ADMIN, ROLES.USER],
      },
      {
        title: "Đào tạo",
        to: "/courses",
        icon: <WorkspacePremiumOutlinedIcon />,
        roles: [ROLES.ADMIN, ROLES.SAILOR],
      },
    ],
  },
];

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
  const { accountName, hasRole, logout } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ===== Helpers ===== */
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const hasAnyRole = (roles = []) => roles.length === 0 || roles.some(hasRole);

  /* ===== Filter menu by role (memoized) ===== */
  const filteredMenu = useMemo(() => {
    return MENU_CONFIG.map((section) => ({
      ...section,
      items: section.items.filter((item) => hasAnyRole(item.roles)),
    })).filter(
      (section) => hasAnyRole(section.roles) && section.items.length > 0,
    );
  }, [hasRole]);

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
          icon={<MenuOutlinedIcon />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: Color.PrimaryWhite }}
        >
          {!collapsed && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <img
                src={require("../../assets/images/inlaco-logo.png")}
                alt="logo"
                style={{ width: 60 }}
              />
              <IconButton>
                <MenuOutlinedIcon sx={{ color: Color.PrimaryWhite }} />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        {/* ===== USER INFO (ANIMATED) ===== */}
        <Collapse in={!collapsed}>
          <Box my={3} textAlign="center">
            <img
              src={require("../../assets/images/profile-logo-placeholder.jpg")}
              alt="profile"
              width={90}
              height={90}
              style={{ borderRadius: "50%" }}
            />
            <Typography variant="h6" color={Color.PrimaryWhite} mt={1}>
              {accountName}
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
                key={item.to}
                title={item.title}
                icon={item.icon}
                active={isActive(item.to)}
                onClick={() => navigate(item.to)}
              />
            ))}
          </Box>
        ))}

        {/* ===== ACCOUNT ===== */}
        <Typography
          variant="h6"
          color={Color.PrimaryGold}
          sx={{
            m: collapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
            textAlign: collapsed ? "center" : "left",
          }}
        >
          {collapsed ? "TK" : "Tài khoản"}
        </Typography>

        <Item
          title="Tài khoản"
          icon={<PersonOutlineRoundedIcon />}
          active={isActive("/account")}
          onClick={() => navigate("/account")}
        />

        <MenuItem
          icon={<LogoutRoundedIcon />}
          style={{ color: Color.PrimaryWhite }}
          onClick={logout}
        >
          {!collapsed && "Đăng xuất"}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
// import { useState, useEffect } from "react";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography } from "@mui/material";
// import { useNavigate, useLocation } from "react-router";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
// import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
// import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
// import { useAuthContext } from "../../contexts/AuthContext";
// import Color from "@constants/Color";
// import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

// const Item = ({ title, to, navigateState, icon, selected, setSelected }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Set the selected state based on the current path
//     const pathToTitleMap = {
//       "/": "Trang chủ",
//       "/crews": "Thông tin Thuyền viên",
//       "/mobilizations": "Lịch điều động",
//       "/crew-contracts": "Hợp đồng Thuyền viên",
//       "/supply-contracts": "Hợp đồng Cung ứng",
//       "/template-contracts": "Templates",
//       "/supply-requests": "Yêu cầu Cung ứng",
//       "/recruitment": "Tuyển dụng",
//       "/courses": "Đào tạo",
//     };

//     const currentPath = location.pathname;
//     const currentTitle = pathToTitleMap[currentPath];
//     setSelected(currentTitle);
//   }, [location.pathname]);

//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: Color.PrimaryWhite,
//       }}
//       onClick={() => {
//         setSelected(title);
//         navigate(to, { state: navigateState });
//       }}
//       icon={icon}
//     >
//       <Typography
//         sx={{
//           whiteSpace: "nowrap", // Prevent text wrapping
//           overflow: "hidden", // Hide overflowing text
//           textOverflow: "ellipsis", // Add the ellipsis
//           fontSize: 15,
//         }}
//       >
//         {title}
//       </Typography>
//     </MenuItem>
//   );
// };

// const SideBar = () => {
//   const { accountName, hasRole, logout } = useAuthContext();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Trang chủ");
//   const isAdmin = hasRole("ADMIN");
//   const isCrewMember = hasRole("SAILOR");
//   const isGeneralUser = hasRole("USER");

//   return (
//     <Box>
//       <Sidebar
//         collapsed={isCollapsed}
//         backgroundColor={Color.PrimaryBlue}
//         style={{ height: "100%" }}
//       >
//         <Menu
//           iconShape="square"
//           menuItemStyles={{
//             button: ({ level, active, disabled }) => {
//               // only apply styles on first level elements of the tree
//               if (level === 0)
//                 return {
//                   backgroundColor: active ? Color.SecondaryBlue : undefined,
//                   "&:hover": {
//                     backgroundColor: Color.PrimaryHoverBlue,
//                   },
//                 };
//             },
//           }}
//         >
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: Color.PrimaryWhite,
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <img
//                   src={require("../../assets/images/inlaco-logo.png")}
//                   alt="INLACO Logo"
//                   style={{ width: 60, height: 48 }}
//                 />
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon sx={{ color: Color.PrimaryWhite }} />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <Box mb="25px">
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <img
//                   alt="profile-user"
//                   width="100px"
//                   height="100px"
//                   src={require("../../assets/images/profile-logo-placeholder.jpg")}
//                   style={{ cursor: "pointer", borderRadius: "50%" }}
//                 />
//               </Box>
//               <Box textAlign="center">
//                 <Typography
//                   variant="h5"
//                   color={Color.PrimaryWhite}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 0 0" }}
//                 >
//                   {accountName}
//                 </Typography>
//                 <Typography variant="h6" color={Color.PrimaryGold}>
//                   {isAdmin ? "Admin" : isCrewMember ? "Crew Member" : "User"}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           <Box>
//             <Item
//               title="Trang chủ"
//               to="/"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {(isAdmin || isCrewMember) && ( //only show these items if user is admin or crew member
//               <>
//                 <Typography
//                   variant="h6"
//                   color={Color.PrimaryGold}
//                   sx={{
//                     m: isCollapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
//                     textAlign: isCollapsed ? "center" : "left",
//                   }}
//                 >
//                   {isCollapsed ? "TV" : "Thuyền Viên"}
//                 </Typography>
//                 {isCrewMember && !isAdmin && (
//                   <Item
//                     title="Hồ sơ cá nhân"
//                     to="/crews/my-profile"
//                     icon={<AccountBoxRoundedIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                   />
//                 )}
//                 {isAdmin ? (
//                   <>
//                     <Item
//                       title="Thông tin Thuyền viên"
//                       to="/crews"
//                       icon={<PeopleOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />
//                     <Item
//                       title="Lịch điều động"
//                       to="/mobilizations"
//                       icon={<DirectionsBoatOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />

//                     <Typography
//                       variant="h6"
//                       color={Color.PrimaryGold}
//                       sx={{
//                         m: isCollapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
//                         textAlign: isCollapsed ? "center" : "left",
//                       }}
//                     >
//                       {isCollapsed ? "HĐ" : "Hợp Đồng"}
//                     </Typography>
//                     <Item
//                       title="Hợp đồng Thuyền viên"
//                       to="/crew-contracts"
//                       icon={<AssignmentIndOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />
//                     <Item
//                       title="Hợp đồng Cung ứng"
//                       to="/supply-contracts"
//                       icon={<RequestQuoteOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />
//                     <Item
//                       title="Templates"
//                       to="/template-contracts"
//                       icon={<DescriptionOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <Item
//                       title="Lịch điều động"
//                       to="/mobilizations/my-mobilizations"
//                       icon={<DirectionsBoatOutlinedIcon />}
//                       selected={selected}
//                       setSelected={setSelected}
//                     />
//                   </>
//                 )}
//               </>
//             )}
//             <Typography
//               variant="h6"
//               color={Color.PrimaryGold}
//               sx={{
//                 m: isCollapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
//                 textAlign: isCollapsed ? "center" : "left",
//               }}
//             >
//               Khác
//             </Typography>
//             {(isAdmin || (isGeneralUser && !isCrewMember)) && ( //only show these items if user is admin or general user
//               <>
//                 <Item
//                   title="Yêu cầu Cung ứng"
//                   to="/supply-requests"
//                   icon={<MarkEmailUnreadOutlinedIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//                 <Item
//                   title="Tuyển dụng"
//                   to="/recruitment"
//                   icon={<HowToRegOutlinedIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//               </>
//             )}
//             {(isAdmin || isCrewMember) && ( //only show this item if user is admin or crew member
//               <>
//                 <Item
//                   title="Đào tạo"
//                   to="/courses"
//                   icon={<WorkspacePremiumOutlinedIcon />}
//                   selected={selected}
//                   setSelected={setSelected}
//                 />
//               </>
//             )}
//           </Box>

//           {/* ===== ACCOUNT & LOGOUT ===== */}
//           <Box mt={2}>
//             <Typography
//               variant="h6"
//               color={Color.PrimaryGold}
//               sx={{
//                 m: isCollapsed ? "15px 0 5px 0" : "15px 0 5px 20px",
//                 textAlign: isCollapsed ? "center" : "left",
//               }}
//             >
//               {isCollapsed ? "TK" : "Tài khoản"}
//             </Typography>

//             {/* Account */}
//             <Item
//               title="Tài khoản"
//               to="/account"
//               icon={<PersonOutlineRoundedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />

//             {/* Logout */}
//             <MenuItem
//               icon={<LogoutRoundedIcon />}
//               style={{ color: Color.PrimaryWhite }}
//               onClick={logout}
//             >
//               {!isCollapsed && <Typography fontSize={15}>Đăng xuất</Typography>}
//             </MenuItem>
//           </Box>
//         </Menu>
//       </Sidebar>
//     </Box>
//   );
// };

// export default SideBar;
