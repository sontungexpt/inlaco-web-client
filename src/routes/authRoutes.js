import RoutePath from "@/constants/RoutePath";
import { lazy } from "react";

export const AuthRoutes = [
  {
    // Public
    path: RoutePath.Auth.Login,
    element: lazy(() => import("@/pages/LoginPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.Auth.SignUp,
    element: lazy(() => import("@/pages/SignUpPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.Auth.VerifyEmailConfirmation,
    element: lazy(() => import("@/pages/VerifyEmailConfirmationPage")),
    layout: false,
  },
];

export default AuthRoutes;
