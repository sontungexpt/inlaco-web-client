// routes.js
import { lazy } from "react";

import HomePage from "@pages/HomePage";

import UserRole from "@/constants/UserRole";
import RoutePath from "@/constants/RoutePath";
import path from "node:path";

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
        element: lazy(() => import("@/pages/crews/CrewInfos")),
      },
      {
        path: "add/:candidateID",
        element: lazy(() => import("@pages/CrewProfileFormPage")),
      },
      // {
      //   path: ":id",
      //   element: lazy(() => import("@pages/CrewMemberDetail")),
      // },
      {
        path: ":id/profile",
        element: lazy(() => import("@/pages/crews/CrewProfile")),
      },
    ],
  },

  {
    path: "/mobilizations",
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/MobilizationPage")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/MobilizationFormPage")),
      },

      {
        path: ":id",
        element: lazy(() => import("@pages/MobilizationDetailPage")),
      },
      {
        path: "my-mobilizations",
        element: lazy(() => import("@pages/CrewMyMobilization")),
      },
    ],
  },
  {
    path: RoutePath.Contract.Index,
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/contracts/ContractPage")),
      },
      {
        path: ":id",
        element: lazy(() => import("@/pages/contracts/ContractDetailPage")),
      },
      {
        path: "form",
        element: lazy(() => import("@/pages/contracts/ContractFormPage")),
      },
    ],
  },
  {
    path: RoutePath.CrewContract.Root,
    roles: ADMIN_SAILOR,
    children: [
      {
        path: "form",
        element: lazy(
          () =>
            import("@/pages/contracts/ContractFormPage/CrewContractFormPage"),
        ),
      },
      {
        path: "application/:applicationId",
        element: lazy(
          () =>
            import(
              "@/pages/contracts/ContractDetailPage/CrewContractDetailPage"
            ),
        ),
      },
      {
        path: ":id/old-versions",
        element: lazy(() => import("@/pages/contracts/ContractOldVersionPage")),
      },
      // { path: ":id/create-addendum", element: CrewContractAddendum },
    ],
  },

  {
    path: RoutePath.SupplyContract.Root,
    roles: ADMIN_SAILOR,
    children: [
      {
        path: "create/:requestId",
        element: lazy(
          () =>
            import("@/pages/contracts/ContractFormPage/SupplyContractFormPage"),
        ),
      },
      {
        path: ":contractId/edit",
        element: lazy(
          () =>
            import("@/pages/contracts/ContractFormPage/SupplyContractFormPage"),
        ),
      },
      // { path: ":id/create-addendum", element: SupplyContractAddendum },
    ],
  },

  {
    path: "/template-contracts",
    element: lazy(() => import("@/pages/contracts/ContractTemplatePage")),
    roles: ADMIN_SAILOR,
  },

  {
    path: "/supply-requests",
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/SupplyRequestPage")),
        roles: [UserRole.ADMIN],
      },
      {
        path: ":id",
        element: lazy(() => import("@/pages/SupplyRequestDetailPage")),
        roles: [UserRole.ADMIN],
      },
      {
        path: "form",
        element: lazy(
          () => import("@/pages/supplication/CreateSupplyRequestPage"),
        ),
        roles: [UserRole.USER],
      },
    ],
  },

  {
    path: "/posts",
    children: [
      {
        // View post
        path: ":id",
        element: lazy(() => import("@/pages/PostDetailPage")),
      },
      {
        path: "create",
        roles: ["ADMIN"],
        element: lazy(() => import("@/pages/PostFormPage")),
      },
      {
        path: "edit/:id", // edit post
        roles: ["ADMIN"],
        element: lazy(() => import("@/pages/PostFormPage")),
      },
    ],
  },

  {
    path: "/recruitments",
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/recruitments/CrewRecruitmentPage")),
      },
      {
        path: "create",
        element: lazy(() => import("@/pages/PostFormPage")),
      },
      {
        path: ":id",
        element: lazy(
          () => import("@/pages/PostDetailPage/RecruitmentPostDetailPage"),
        ),
      },
      {
        path: "candidates/:candidateID",
        element: lazy(() => import("@/pages/CandidateProfileDetailPage")),
      },
      {
        path: "apply/:postId",
        element: lazy(() => import("@pages/recruitments/ApplyCVPage")),
      },
    ],
  },

  {
    path: "/courses",
    roles: ADMIN_SAILOR,
    children: [
      {
        index: true,
        element: lazy(() => import("@/pages/CrewCoursePage")),
      },
      {
        path: ":id",
        element: lazy(() => import("@pages/CourseDetailPage")),
      },
      {
        path: "create",
        element: lazy(() => import("@pages/CourseFormPage")),
      },
    ],
  },
];
