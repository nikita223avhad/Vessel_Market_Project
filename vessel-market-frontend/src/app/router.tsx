import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../features/auth/AuthProvider";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { MarketDataPage } from "../features/market-data/MarketDataPage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { UsersPage } from "../features/users/UsersPage";
import { VesselsPage } from "../features/vessels/VesselsPage";

function ProtectedRoute() {
  const auth = useAuth();
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const auth = useAuth();
  return auth.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

function PublicOnlyRoute() {
  const auth = useAuth();
  return auth.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/vessels", element: <VesselsPage /> },
          { path: "/market-data", element: <MarketDataPage /> },
          { path: "/reports", element: <ReportsPage /> },
          {
            element: <AdminRoute />,
            children: [{ path: "/users", element: <UsersPage /> }]
          }
        ]
      }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);
