import { Routes, Route } from "react-router";
import React, { Suspense } from "react";
import { useAuthContext } from "./contexts/AuthContext";
import { MainLayout } from "./components/global";
import { AppRoutes } from "./routes";
import PageCircularProgress from "./components/common/PageCircularProgress";

const ProtectedRoute = ({ roles, children }) => {
  const { loading, hasRole, roles: userRoles } = useAuthContext();
  if (loading) {
    return null;
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
    <Suspense fallback={PageCircularProgress}>
      <Routes>{AppRoutes.map((route) => renderRoute(route))}</Routes>
    </Suspense>
  );
}
