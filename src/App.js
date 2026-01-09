import { Routes, Outlet, Route, Navigate } from "react-router";
import React, { Fragment, lazy, Suspense } from "react";
import { useAuthContext } from "./contexts/AuthContext";
import { PageCircularProgress } from "./components/common";
import { AppRoutes, PublicRoutes } from "./routes";
import MainLayout from "./layout/MainLayout";

function AuthGuard({ children = <Outlet /> }) {
  const { isLoading, isAuthenticated } = useAuthContext();

  console.log("render AuthGuard");
  if (isLoading) {
    return <PageCircularProgress />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  console.log("render AuthGuard child");
  return children;
}

function RoleGuard({ allowedRoles, children = <Outlet /> }) {
  const { hasRole, roles: userRoles, hasRoles } = useAuthContext();
  if (!allowedRoles) return children;
  console.log("render RoleGuard");

  const allowed =
    typeof allowedRoles === "function"
      ? allowedRoles({ hasRole, userRoles, hasRoles })
      : allowedRoles.some((r) => hasRole(r));
  if (!allowed) return <div>Unauthorized</div>;
  return children;
}

export const buildRoutes = (routes, pub = false) => {
  const walk = (routes, pub = false, level = 0, parentHasLayout = false) => {
    return routes.map((route, i) => {
      const needAuth =
        route.public !== true && !(route.public === undefined && pub);

      const hasOwnLayout = typeof route.layout === "function";

      let Layout = Fragment;

      if (hasOwnLayout) {
        // Con có layout riêng → dùng layout của nó
        Layout = route.layout;
      } else if (parentHasLayout) {
        // Cha đã có layout → KHÔNG render thêm layout
        Layout = Fragment;
      } else if (route.layout !== false) {
        // Không ai có layout → dùng layout mặc định
        Layout = MainLayout;
      }

      const Element = route.element;
      const OptionalAuthGuard = needAuth ? AuthGuard : Fragment;

      const elementNode = (
        <Layout>
          <OptionalAuthGuard>
            <RoleGuard allowedRoles={route.roles}>
              {Element && <Element />}
            </RoleGuard>
          </OptionalAuthGuard>
        </Layout>
      );

      if (!route.children || route.children.length === 0) {
        return (
          <Route
            key={`${level}-${i}`}
            index={route.index}
            path={route.path || ""}
            element={elementNode}
          />
        );
      }

      return (
        <Route key={`${level}-${i}`} path={route.path} element={elementNode}>
          {walk(
            route.children,
            pub,
            level + 1,
            hasOwnLayout || (!parentHasLayout && Layout !== Fragment),
          )}
        </Route>
      );
    });
  };

  return walk(routes, pub);
};

export default function App() {
  return (
    <Suspense fallback={<PageCircularProgress />}>
      <Routes>
        {buildRoutes(PublicRoutes, true)}
        {buildRoutes(AppRoutes)}

        {/* fallback */}
        <Route path="*" element={lazy(() => import("@/pages/E404"))} />
      </Routes>
    </Suspense>
  );
}
