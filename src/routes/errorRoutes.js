import RoutePath from "@/constants/RoutePath";
import { lazy } from "react";

export const ErrorRoutes = [
  {
    // Public
    path: RoutePath.E403,
    element: lazy(() => import("@pages/E403Page")),
    layout: false,
    public: true,
  },
];

export default ErrorRoutes;
