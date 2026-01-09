import RoutePath from "@/constants/RoutePath";
import { lazy } from "react";

export const PublicRoutes = [
  {
    // Public
    path: RoutePath.Login,
    element: lazy(() => import("@pages/auth/LoginPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.SignUp,
    element: lazy(() => import("@pages/auth/SignUpPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.VerifyEmailConfirmation,
    element: lazy(() => import("@pages/auth/VerifyEmailConfirmation")),
    layout: false,
  },
];

export default PublicRoutes;
