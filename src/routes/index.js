// routes.js
import { lazy } from "react";

import HomePage from "@pages/HomePage";

import UserRole from "@/constants/UserRole";
import RoutePath from "@/constants/RoutePath";

const ADMIN_SAILOR = [UserRole.ADMIN, UserRole.SAILOR];

export * from "./authRoutes";
export * from "./errorRoutes";

export const AppRoutes = [
  {
    path: RoutePath.Home,
    element: HomePage,
  },

  {
    path: RoutePath.Account,
    element: lazy(() => import("@/pages/AccoountProfile")),
  },

  {
    path: RoutePath.Crew.Root,
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@pages/CrewInfos")),
      },
      {
        path: "add/:candidateID",
        element: lazy(() => import("@pages/AddCrewMember")),
      },
      {
        path: ":id",
        element: lazy(() => import("@pages/CrewMemberDetail")),
      },
      {
        path: "my-profile",
        element: lazy(() => import("@pages/CrewProfile")),
      },
    ],
  },

  {
    path: "/mobilizations",
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/mobilization/Mobilization")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/mobilization/MobilizationForm")),
      },

      {
        path: ":id",
        element: lazy(() => import("@pages/mobilization/MobilizationDetail")),
      },
      {
        path: "my-mobilizations",
        element: lazy(() => import("@pages/CrewMyMobilization")),
      },
    ],
  },

  {
    path: RoutePath.CrewContract.Root,
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/contracts/CrewContract")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/contracts/CrewContractForm")),
      },
      {
        path: ":id",
        element: lazy(
          () => import("@/pages/contracts/details/CrewContractDetail"),
        ),
      },
      // { path: ":id/create-addendum", element: CrewContractAddendum },
    ],
  },

  {
    path: RoutePath.SupplyContract.Root,
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/contracts/SupplyContract")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/contracts/SupplyContractForm")),
      },
      {
        path: ":id",
        element: lazy(
          () => import("@/pages/contracts/details/SupplyContractDetail"),
        ),
      },
      // { path: ":id/create-addendum", element: SupplyContractAddendum },
    ],
  },

  {
    path: "/template-contracts",
    element: lazy(() => import("@/pages/contracts/ContractTemplate")),
    roles: ADMIN_SAILOR,
  },

  {
    path: "/supply-requests",
    roles: ({ hasRole }) =>
      hasRole(UserRole.ADMIN) ||
      (hasRole(UserRole.USER) && !hasRole(UserRole.SAILOR)),
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/supplication/SupplyRequest")),
      },
      {
        path: ":id",
        element: lazy(() => import("@/pages/supplication/SupplyRequestDetail")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/supplication/SupplyRequestForm")),
      },
    ],
  },

  {
    path: "/posts",
    children: [
      {
        // View post
        path: ":id",
        element: lazy(() => import("@/pages/posts/PostDetail")),
      },
      {
        path: "create",
        roles: ["ADMIN"],
        element: lazy(() => import("@/pages/posts/PostForm")),
      },
      {
        path: "edit/:id", // edit post
        roles: ["ADMIN"],
        element: lazy(() => import("@/pages/posts/PostForm")),
      },
    ],
  },

  {
    path: "/recruitments",
    roles: ({ hasRole }) =>
      hasRole(UserRole.ADMIN) ||
      (hasRole(UserRole.USER) && !hasRole(UserRole.SAILOR)),
    children: [
      {
        index: true,
        element: lazy(
          () => import("@pages/posts/recruitments/CrewRecruitment"),
        ),
      },
      {
        path: "create",
        element: lazy(
          () => import("@pages/posts/recruitments/CreateRecruitment"),
        ),
      },
      {
        path: ":id",
        element: lazy(
          () => import("@pages/posts/recruitments/RecruitmentDetail"),
        ),
      },
      {
        path: "candidates/:candidateID",
        element: lazy(
          () => import("@/pages/candidates/CandidateProfileDetail"),
        ),
      },
      {
        path: "apply/:recruitmentId",
        element: lazy(
          () => import("@pages/posts/recruitments/ApplyRecruitment"),
        ),
      },
    ],
  },

  {
    path: "/courses",
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@pages/courses/CrewCourse")),
      },
      {
        path: ":id",
        element: lazy(() => import("@pages/courses/CourseDetail")),
      },
      {
        path: "create",
        element: lazy(() => import("@pages/courses/CourseForm")),
      },
    ],
  },
];
