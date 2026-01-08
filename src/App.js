import { Routes, Outlet, Route, Navigate } from "react-router";
import React, { Suspense } from "react";
import { useAuthContext } from "./contexts/AuthContext";
import { PageCircularProgress } from "./components/common";
import { AppRoutes } from "./routes";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailConfirmation from "./pages/auth/VerifyEmailConfirmation";

function AuthGuard() {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <PageCircularProgress />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RoleGuard({ allowedRoles }) {
  const { hasRole, roles: userRoles } = useAuthContext();
  if (!allowedRoles) return <Outlet />;
  const allowed =
    typeof allowedRoles === "function"
      ? allowedRoles(hasRole, userRoles)
      : allowedRoles.some((r) => hasRole(r));
  if (!allowed) return <div>Unauthorized</div>;
  return <Outlet />;
}

function LayoutRoute({ layout }) {
  if (layout === "blank") return <Outlet />;
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

const ProtectedRoute = ({ roles, children }) => {
  const {
    isLoading,
    isAuthenticated,
    hasRole,
    roles: userRoles,
  } = useAuthContext();
  if (isLoading) {
    return <PageCircularProgress />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (!roles) {
    return children;
  } else if (
    (typeof roles === "function" && !roles(hasRole, userRoles)) ||
    (roles.length > 0 && !roles.some((r) => hasRole(r)))
  ) {
    return <div>Unauthorized</div>;
  }
  return children;
};

export const buildRoutes = (routes) =>
  routes.map((route, idx) => {
    const Element = route.element;

    return (
      <Route
        key={route.path || `route-${idx}`}
        path={route.path}
        index={route.index}
      >
        {/* Layout */}
        <Route element={<LayoutRoute layout={route.layout} />}>
          {/* Role */}
          <Route element={<RoleGuard allowedRoles={route.roles} />}>
            {/* Actual page */}
            {Element && <Route index={route.index} element={<Element />} />}
            {(route.childrens || route.children) &&
              buildRoutes(route.childrens || route.children)}
          </Route>
        </Route>
      </Route>
    );
  });

const renderRoute = (route, parentLayout = MainLayout) => {
  // 1) Xác định layout của route hiện tại
  const CurrentLayout =
    route.layout === false ? React.Fragment : route.layout || parentLayout;
  const Element = route.element;

  // 2) Nếu có children → render đệ quy
  if (route.children && route.children.length > 0) {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          // element is the parent layout
          Element ? (
            <CurrentLayout>
              <Element />
            </CurrentLayout>
          ) : undefined
        }
      >
        {/* ĐỆ QUY CON */}
        {route.children.map((child) => renderRoute(child, CurrentLayout))}
      </Route>
    );
  }

  // 3) Không có children → route thường
  return (
    <Route
      index={route.index}
      path={route.path}
      element={
        // element as element role
        <CurrentLayout>
          <ProtectedRoute roles={route.roles}>
            <Element />
          </ProtectedRoute>
        </CurrentLayout>
      }
    />
  );
};

export default function App() {
  return (
    <Suspense fallback={<PageCircularProgress />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/verify-email-confirmation"
          element={<VerifyEmailConfirmation />}
        />
        {AppRoutes.map((route) => renderRoute(route))}
      </Routes>
    </Suspense>
  );
}
