import { Routes, Outlet, Route, Navigate } from "react-router";
import { Fragment, lazy, Suspense } from "react";
import { useAuthContext } from "./contexts/auth.context";
import { PageCircularProgress } from "./components/common";
import { AppRoutes, AuthRoutes, ErrorRoutes } from "./routes";
import MainLayout from "./layout/MainLayout";

function AuthGuard({ children = <Outlet /> }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleGuard({ allowedRoles, children = <Outlet /> }) {
  const { includesRole, roles: userRoles, includesAllRoles } = useAuthContext();
  if (!allowedRoles) return children;

  const allowed =
    typeof allowedRoles === "function"
      ? allowedRoles({
          hasRole: includesRole,
          includesRole: includesRole,
          userRoles,
          hasRoles: includesAllRoles,
        })
      : allowedRoles.some((r) => includesRole(r));

  if (!allowed) return <Navigate to="/403" replace />;
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
        {buildRoutes(ErrorRoutes, true)}
        {buildRoutes(AuthRoutes, true)}
        {buildRoutes(AppRoutes)}

        {/* fallback */}
        <Route path="*" element={lazy(() => import("@/pages/E404Page"))} />
      </Routes>
    </Suspense>
  );
}
