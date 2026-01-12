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

const Guarded = ({ needAuth, allowedRoles, children }) => {
  const Auth = needAuth ? AuthGuard : Fragment;
  return (
    <Auth>
      <RoleGuard allowedRoles={allowedRoles}>{children}</RoleGuard>
    </Auth>
  );
};

const resolveLayout = (route, hasParentLayout) => {
  if (typeof route.layout === "function") return route.layout;
  if (route.layout === false || hasParentLayout) return Fragment;
  return MainLayout;
};

export const buildRoutes = (routes, pub = false) => {
  const walk = (routes, level = 0, hasParentLayout = false) => {
    return routes.map((route, i) => {
      const needAuth =
        route.public !== true && !(route.public === undefined && pub);

      const Layout = resolveLayout(route, hasParentLayout);
      const RouteElement = route.element;

      const element = (
        <Layout>
          <Guarded needAuth={needAuth} allowedRoles={route.roles}>
            {RouteElement && <RouteElement />}
          </Guarded>
        </Layout>
      );
      const key = `${level}-${i}`;
      if (!route.children?.length) {
        return (
          <Route
            key={key}
            index={route.index}
            path={route.path || ""}
            element={element}
          />
        );
      }

      return (
        <Route key={key} path={route.path} element={element}>
          {walk(
            route.children,
            level + 1,
            hasParentLayout || Layout !== Fragment,
            // hasOwnLayout || (!hasParentLayout && Layout !== Fragment),
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
