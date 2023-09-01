import LoadingScreen from "./components/loaders/LoadingScreen";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import DashboardLayout from "./pages/dashboard";
import { Navigate } from "react-router-dom";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
}; // dashboards

const Dashboard = Loadable(
  lazy(() => import("./pages/dashboard/dashboard"))
);
const Account = Loadable(lazy(() => import("./pages/account")));
const Deals = Loadable(lazy(() => import("./pages/deals")));
const DealDetails = Loadable(lazy(() => import("./pages/deals/DealDetails")));
const Org = Loadable(lazy(() => import("./pages/org")));
const routes = () => {
  return [
    {
      path: "/",
      element: <ProtectedRoute component={DashboardLayout} />,
      children: authRoutes,
    },
  ];
};

const authRoutes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute component={Dashboard} />,
  },
  {
    path: "/deals",
    element: <ProtectedRoute component={Deals} />,
  },
  {
    path: "/deals/:id",
    element: <ProtectedRoute component={DealDetails} />,
  },
  {
    path:"/org",
    element:<ProtectedRoute component={Org} />
  },
  {
    path: "/account",
    element: <ProtectedRoute component={Account} />
  }
];

export default routes;
