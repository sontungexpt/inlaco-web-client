import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import UserRole from "@/constants/UserRole";

export const ActionMap = {
  LOGOUT: "LOGOUT",
};

export const SidebarConfig = [
  {
    section: "MAIN",
    items: [
      {
        title: "Trang chủ",
        to: "/",
        icon: <HomeOutlinedIcon />,
        roles: [UserRole.ADMIN, UserRole.SAILOR, UserRole.USER],
      },
    ],
  },

  {
    section: "Thuyền Viên",
    short: "TV",
    roles: [UserRole.ADMIN, UserRole.SAILOR],
    items: [
      {
        title: "Hồ sơ cá nhân",
        to: "/crews/my-profile",
        icon: <AccountBoxRoundedIcon />,
        roles: [UserRole.SAILOR],
      },
      {
        title: "Thông tin Thuyền viên",
        to: "/crews",
        icon: <PeopleOutlinedIcon />,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Lịch điều động",
        to: "/mobilizations",
        icon: <DirectionsBoatOutlinedIcon />,
        roles: [UserRole.ADMIN],
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
    roles: [UserRole.ADMIN],
    items: [
      {
        title: "Hợp đồng Thuyền viên",
        to: "/crew-contracts",
        icon: <AssignmentIndOutlinedIcon />,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Hợp đồng Cung ứng",
        to: "/supply-contracts",
        icon: <RequestQuoteOutlinedIcon />,
        roles: [UserRole.ADMIN],
      },
      {
        title: "Templates",
        to: "/template-contracts",
        icon: <DescriptionOutlinedIcon />,
        roles: [UserRole.ADMIN],
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
        roles: [UserRole.ADMIN, UserRole.USER],
      },
      {
        title: "Tuyển dụng",
        to: "/recruitment",
        icon: <HowToRegOutlinedIcon />,
        roles: [UserRole.ADMIN, UserRole.USER],
      },
      {
        title: "Đào tạo",
        to: "/courses",
        icon: <WorkspacePremiumOutlinedIcon />,
        roles: [UserRole.ADMIN, UserRole.SAILOR],
      },
    ],
  },

  {
    section: "Tài khoản",
    short: "TK",
    items: [
      {
        title: "Tài khoản",
        icon: <PersonOutlineRoundedIcon />,
        to: "/account",
        roles: [UserRole.USER],
      },
      {
        title: "Đăng xuất",
        icon: <LogoutRoundedIcon />,
        to: "/login",
        preNavigate: ActionMap.LOGOUT,
        roles: [UserRole.USER],
      },
    ],
  },
];
export default SidebarConfig;
