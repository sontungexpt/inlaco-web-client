import { lazy } from "react";
// routes.js

import HomePage from "@pages/HomePage";

import CrewMobilization from "@pages/crewMobilization";
import CreateMobilization from "@pages/mobilization/CreateMobilization";
import MobilizationDetail from "@pages/mobilizationDetail";

import SupplyContract from "@/pages/contracts/SupplyContract";
import SupplyContractForm from "@/pages/contracts/SupplyContractForm";
import SupplyContractDetail from "@pages/contracts/SupplyContractDetail";
// import SupplyContractAddendum from "@pages/supplyContractAddendum";

import CrewRecruitment from "@pages/posts/recruitments/CrewRecruitment";
import CandidateProfileDetail from "@/pages/candidates/CandidateProfileDetail";
import ApplyRecruitment from "@pages/posts/recruitments/ApplyRecruitment";
import CreateRecruitment from "@pages/posts/recruitments/CreateRecruitment";
import RecruitmentDetail from "@pages/posts/recruitments/RecruitmentDetail";

import CrewCourse from "@pages/courses/CrewCourse";
import CreateCourse from "@pages/courses/CreateCourse";
import CourseDetail from "@pages/courses/CourseDetail";
import UserRole from "@/constants/UserRole";
import RoutePath from "@/constants/RoutePath";
import CreatePost from "@/pages/posts/CreatePost";
import PostDetail from "@/pages/posts/PostDetail";
import UpdatePost from "@/pages/posts/UpdatePost";

// import CrewContractAddendum from "@pages/crewContractAddendum";

const CrewContract = lazy(() => import("@/pages/contracts/CrewContract"));
const CrewContractForm = lazy(
  () => import("@/pages/contracts/CrewContractForm"),
);
const CrewContractDetail = lazy(
  () => import("@/pages/contracts/CrewContractDetail"),
);

const E404 = lazy(() => import("@/pages/E404"));
const LoginPage = lazy(() => import("@pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("@pages/auth/SignUpPage"));
const VerifyEmailConfirmation = lazy(
  () => import("@pages/auth/VerifyEmailConfirmation"),
);

const CrewInfos = lazy(() => import("@pages/CrewInfos"));
const AddCrewMember = lazy(() => import("@pages/AddCrewMember"));
const CrewMyMobilization = lazy(() => import("@pages/CrewMyMobilization"));
const CrewMemberDetail = lazy(() => import("@pages/CrewMemberDetail"));
const CrewProfile = lazy(() => import("@pages/CrewProfile"));
const TemplateContract = lazy(
  () => import("@/pages/contracts/ContractTemplate"),
);

const SupplyRequest = lazy(() => import("@/pages/supplication/SupplyRequest"));
const SupplyRequestDetail = lazy(
  () => import("@/pages/supplication/SupplyRequestDetail"),
);
const CreateSupplyRequest = lazy(
  () => import("@/pages/supplication/CreateSupplyRequest"),
);

const ADMIN_SAILOR = [UserRole.ADMIN, UserRole.SAILOR];

// layout === false => no layout
// layout === null => default to MainLayout
// layout === any other value => custom layout
//
// roles === null => no access control
// roles === [...] => access control
export const AppRoutes = [
  // Public Routes
  {
    // Public
    path: RoutePath.Login,
    element: LoginPage,
    layout: false,
  },

  {
    // Public
    path: RoutePath.SignUp,
    element: SignUpPage,
    layout: false,
  },

  {
    // Public
    path: RoutePath.VerifyEmailConfirmation,
    element: VerifyEmailConfirmation,
    layout: false,
  },

  // Authenticated Routes
  {
    // Public
    path: RoutePath.Home,
    element: HomePage,
  },

  {
    path: RoutePath.CrewRoot,
    roles: ADMIN_SAILOR,
    children: [
      { index: true, element: CrewInfos },
      { path: "add/:candidateID", element: AddCrewMember },
      { path: ":id", element: CrewMemberDetail },
      { path: "my-profile", element: CrewProfile },
    ],
  },

  {
    path: "/mobilizations",
    roles: ADMIN_SAILOR,
    children: [
      { index: true, element: CrewMobilization },
      { path: "create", element: CreateMobilization },
      { path: ":id", element: MobilizationDetail },
      { path: "my-mobilizations", element: CrewMyMobilization },
    ],
  },

  {
    path: "/crew-contracts",
    roles: ADMIN_SAILOR,
    children: [
      { index: true, element: CrewContract },
      { path: "form", element: CrewContractForm },
      { path: ":id", element: CrewContractDetail },
      // { path: ":id/create-addendum", element: CrewContractAddendum },
    ],
  },

  {
    path: "/supply-contracts",
    roles: ADMIN_SAILOR,
    children: [
      { index: true, element: SupplyContract },
      { path: "create/:id", element: SupplyContractForm },
      { path: ":id", element: SupplyContractDetail },
      // { path: ":id/create-addendum", element: SupplyContractAddendum },
    ],
  },

  {
    path: "/template-contracts",
    element: TemplateContract,
    roles: ADMIN_SAILOR,
  },

  {
    path: "/supply-requests",
    roles: (hasRole) =>
      hasRole(UserRole.ADMIN) ||
      (hasRole(UserRole.USER) && !hasRole(UserRole.SAILOR)),
    children: [
      { index: true, element: SupplyRequest },
      { path: ":id", element: SupplyRequestDetail },
      { path: "create", element: CreateSupplyRequest },
    ],
  },

  {
    path: "/posts",
    children: [
      {
        // View post
        path: ":id",
        element: PostDetail,
      },
      {
        path: "create",
        roles: ["ADMIN"],
        element: CreatePost,
      },
      {
        path: "edit/:id",
        roles: ["ADMIN"],
        element: UpdatePost,
      },
    ],
  },

  {
    path: "/recruitment",
    roles: (hasRole) =>
      hasRole(UserRole.ADMIN) ||
      (hasRole(UserRole.USER) && !hasRole(UserRole.SAILOR)),
    children: [
      {
        index: true,
        element: CrewRecruitment,
      },
      {
        path: "create",
        element: CreateRecruitment,
      },
      {
        path: ":id",
        element: RecruitmentDetail,
      },
      {
        path: "candidates/:candidateID",
        element: CandidateProfileDetail,
      },
      { path: "apply/:recruitmentId", element: ApplyRecruitment },
    ],
  },

  {
    path: "/courses",
    roles: ADMIN_SAILOR,
    children: [
      { index: true, element: CrewCourse },
      { path: ":id", element: CourseDetail },
      { path: "create", element: CreateCourse },
    ],
  },

  // fallback
  {
    path: "*",
    element: E404,
    layout: false,
  },
];
