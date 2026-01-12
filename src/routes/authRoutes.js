import RoutePath from "@/constants/RoutePath";
import { lazy } from "react";

export const AuthRoutes = [
  {
    // Public
    path: RoutePath.Auth.Login,
    element: lazy(() => import("@pages/auth/LoginPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.Auth.SignUp,
    element: lazy(() => import("@pages/auth/SignUpPage")),
    layout: false,
  },

  {
    // Public
    path: RoutePath.Auth.VerifyEmailConfirmation,
    element: lazy(() => import("@pages/auth/VerifyEmailConfirmation")),
    layout: false,
  },
];

export default AuthRoutes;
