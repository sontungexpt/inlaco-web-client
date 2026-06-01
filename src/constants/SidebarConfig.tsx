import type { ReactNode } from "react";

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

import type { AccessControl } from "@/utils/access-control";

/* =========================================================================
 * ACTION
 * ========================================================================= */

export enum Action {
  LOGOUT = "LOGOUT",
}

/* =========================================================================
 * TYPES
 * ========================================================================= */

export interface SidebarItem {
  title: string;

  to?: string;

  icon: ReactNode;

  access?: AccessControl;

  preNavigate?: Action;

  postNavigate?: Action;
}

export interface SidebarSection {
  section: string;

  short?: string;

  access?: AccessControl;

  items: SidebarItem[];
}

/* =========================================================================
 * PERMISSIONS
 * ========================================================================= */

export const Permission = {
  ALL: {},

  ADMIN_ONLY: {
    anyOf: [UserRole.ADMIN],
  },

  USER_ONLY: {
    anyOf: [UserRole.USER],
  },

  SAILOR_ONLY: {
    anyOf: [UserRole.SAILOR],
  },

  ADMIN_OR_USER: {
    predicate: ({ includesRole }) =>
      includesRole(UserRole.ADMIN) ||
      (includesRole(UserRole.USER) && !includesRole(UserRole.SAILOR)),
  },

  ADMIN_OR_SAILOR: {
    anyOf: [UserRole.ADMIN, UserRole.SAILOR],
  },

  /* =========================================================================
   * sailor nhưng KHÔNG có admin
   * ========================================================================= */

  SAILOR_BUT_NOT_ADMIN: {
    predicate: ({ includesRole }) =>
      includesRole(UserRole.SAILOR) && !includesRole(UserRole.ADMIN),
  },

  /* =========================================================================
   * chỉ đúng role sailor
   * ========================================================================= */

  EXACT_SAILOR: {
    exact: [UserRole.SAILOR],
  },

  /* =========================================================================
   * phải có cả admin và sailor
   * ========================================================================= */

  ADMIN_AND_SAILOR: {
    allOf: [UserRole.ADMIN, UserRole.SAILOR],
  },

  /* =========================================================================
   * admin nhưng không phải user
   * ========================================================================= */

  ADMIN_BUT_NOT_USER: {
    predicate: ({ includesRole }) =>
      includesRole(UserRole.ADMIN) && !includesRole(UserRole.USER),
  },
} satisfies Record<string, AccessControl>;

/* =========================================================================
 * SIDEBAR CONFIG
 * ========================================================================= */

const SidebarConfig: SidebarSection[] = [
  {
    section: "MAIN",

    items: [
      {
        title: "Trang chủ",

        to: "/",

        icon: <HomeOutlinedIcon />,

        access: Permission.ALL,
      },
    ],
  },

  {
    section: "Thuyền Viên",

    short: "TV",

    items: [
      {
        title: "Hồ sơ cá nhân",

        to: "/crews/me/profile",

        icon: <AccountBoxRoundedIcon />,

        access: Permission.SAILOR_BUT_NOT_ADMIN,
      },

      {
        title: "Thông tin Thuyền viên",

        to: "/crews",

        icon: <PeopleOutlinedIcon />,

        access: Permission.ADMIN_OR_USER,
      },

      {
        title: "Lịch Tàu",

        to: "/ship-schedules",

        icon: <HowToRegOutlinedIcon />,

        access: Permission.USER_ONLY,
      },

      {
        title: "Lịch điều động",

        to: "/mobilizations",

        icon: <DirectionsBoatOutlinedIcon />,

        access: Permission.ADMIN_OR_SAILOR,
      },

      // {
      //   title: "Lịch tàu cá nhân",

      //   to: "/crew-schedule",

      //   icon: <DirectionsBoatOutlinedIcon />,

      //   access: Permission.SAILOR_BUT_NOT_ADMIN,
      // },
    ],
  },

  {
    section: "Hợp Đồng",

    short: "HĐ",

    items: [
      {
        title: "Hợp đồng Thuyền viên",

        to: "/contracts?type=LABOR_CONTRACT",

        icon: <AssignmentIndOutlinedIcon />,

        access: Permission.ADMIN_OR_SAILOR,
      },

      {
        title: "Hợp đồng Cung ứng",

        to: "/contracts?type=SUPPLY_CONTRACT",

        icon: <RequestQuoteOutlinedIcon />,

        access: Permission.ADMIN_ONLY,
      },

      {
        title: "Templates",

        to: "/template-contracts",

        icon: <DescriptionOutlinedIcon />,

        access: Permission.ADMIN_ONLY,
      },
    ],
  },

  {
    section: "Khác",

    short: "K",

    items: [
      // {
      //   title: "Tạo yêu cầu Cung ứng",
      //   to: "/supply-requests/form",
      //   icon: <MarkEmailUnreadOutlinedIcon />,
      //   access: Permission.USER_ONLY,
      // },

      {
        title: "Yêu cầu Cung ứng",
        to: "/supply-requests",
        icon: <MarkEmailUnreadOutlinedIcon />,
        access: Permission.ADMIN_ONLY,
      },

      {
        title: "Tuyển dụng",

        to: "/recruitments",

        icon: <HowToRegOutlinedIcon />,

        access: Permission.ADMIN_OR_USER,
      },

      {
        title: "Đào tạo",

        to: "/courses",

        icon: <WorkspacePremiumOutlinedIcon />,

        access: Permission.ADMIN_OR_SAILOR,
      },
    ],
  },

  {
    section: "Tài khoản",

    short: "TK",

    items: [
      {
        title: "Tài khoản",

        to: "/account",

        icon: <PersonOutlineRoundedIcon />,

        access: Permission.USER_ONLY,
      },

      {
        title: "Đăng xuất",

        to: "/login",

        icon: <LogoutRoundedIcon />,

        preNavigate: Action.LOGOUT,

        access: Permission.ALL,
      },
    ],
  },
];

export default SidebarConfig;

// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
// import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
// import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
// import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
// import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
// import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

// import UserRole from "@/constants/UserRole";

// export const Action = {
//   LOGOUT: "LOGOUT",
// };

// export const SidebarConfig = [
//   {
//     section: "MAIN",
//     items: [
//       {
//         title: "Trang chủ",
//         to: "/",
//         icon: <HomeOutlinedIcon />,
//         roles: [UserRole.ADMIN, UserRole.SAILOR, UserRole.USER],
//       },
//     ],
//   },

//   {
//     section: "Thuyền Viên",
//     short: "TV",
//     items: [
//       {
//         title: "Hồ sơ cá nhân",
//         to: "/crews/me/profile",
//         icon: <AccountBoxRoundedIcon />,
//         roles: [UserRole.SAILOR],
//       },
//       {
//         title: "Thông tin Thuyền viên",
//         to: "/crews",
//         icon: <PeopleOutlinedIcon />,
//         roles: [UserRole.ADMIN],
//       },
//       {
//         title: "Lịch Tàu",
//         to: "/ship-schedules",
//         icon: <HowToRegOutlinedIcon />,
//         roles: [UserRole.USER],
//       },
//       {
//         title: "Lịch điều động",
//         to: "/mobilizations",
//         icon: <DirectionsBoatOutlinedIcon />,
//         roles: [UserRole.ADMIN, UserRole.SAILOR],
//       },
//       {
//         title: "Lịch tàu cá nhân",
//         to: "/crew-schedule",
//         icon: <DirectionsBoatOutlinedIcon />,
//         roles: [UserRole.SAILOR],
//       },
//     ],
//   },

//   {
//     section: "Hợp Đồng",
//     short: "HĐ",
//     items: [
//       {
//         title: "Hợp đồng Thuyền viên",
//         to: "/contracts?type=LABOR_CONTRACT",
//         icon: <AssignmentIndOutlinedIcon />,
//         roles: [UserRole.ADMIN, UserRole.SAILOR],
//       },
//       {
//         title: "Hợp đồng Cung ứng",
//         to: "/contracts?type=SUPPLY_CONTRACT",
//         icon: <RequestQuoteOutlinedIcon />,
//         roles: [UserRole.ADMIN],
//       },
//       {
//         title: "Templates",
//         to: "/template-contracts",
//         icon: <DescriptionOutlinedIcon />,
//         roles: [UserRole.ADMIN],
//       },
//     ],
//   },

//   {
//     section: "Khác",
//     short: "K",
//     items: [
//       {
//         title: "Tạo yêu cầu Cung ứng",
//         to: "/supply-requests/form",
//         icon: <MarkEmailUnreadOutlinedIcon />,
//         roles: [UserRole.USER],
//       },
//       {
//         title: "Yêu cầu Cung ứng",
//         to: "/supply-requests",
//         icon: <MarkEmailUnreadOutlinedIcon />,
//         roles: [UserRole.ADMIN],
//       },
//       {
//         title: "Tuyển dụng",
//         to: "/recruitments",
//         icon: <HowToRegOutlinedIcon />,
//         roles: [UserRole.ADMIN, UserRole.USER],
//       },
//       {
//         title: "Đào tạo",
//         to: "/courses",
//         icon: <WorkspacePremiumOutlinedIcon />,
//         roles: [UserRole.ADMIN, UserRole.SAILOR],
//       },
//     ],
//   },

//   {
//     section: "Tài khoản",
//     short: "TK",
//     items: [
//       {
//         title: "Tài khoản",
//         icon: <PersonOutlineRoundedIcon />,
//         to: "/account",
//         roles: [UserRole.USER],
//       },
//       {
//         title: "Đăng xuất",
//         icon: <LogoutRoundedIcon />,
//         to: "/login",
//         preNavigate: Action.LOGOUT,
//         roles: [UserRole.USER],
//       },
//     ],
//   },
// ];
// export default SidebarConfig;
