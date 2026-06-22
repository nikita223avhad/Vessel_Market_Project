import { BarChart3, FileText, LogOut, Ship, TrendingUp, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../features/auth/AuthProvider";

const navItems = [
  { to: "/", label: "Overview", icon: BarChart3 },
  { to: "/vessels", label: "Vessels", icon: Ship },
  { to: "/market-data", label: "Market Data", icon: TrendingUp },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/users", label: "Users", icon: Users, adminOnly: true }
];

export function AppShell() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">VM</span>
          <div>
            <strong>Vessel Market</strong>
            <small>Performance Console</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems
            .filter((item) => !item.adminOnly || auth.isAdmin)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>

        <div className="sidebar-footer">
          <span className={`role-pill ${auth.role === "admin" ? "admin" : ""}`}>{auth.role ?? "guest"}</span>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
