import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { clearToken, getToken, saveToken } from "../../api/http";
import type { Role } from "../../api/types";

type AuthState = {
  token: string | null;
  role: Role | null;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setSession: (token: string, role: Role) => void;
  logout: () => void;
};

const ROLE_KEY = "vessel_market_role";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: getToken(),
    role: (localStorage.getItem(ROLE_KEY) as Role | null) ?? null
  }));

  const value = useMemo<AuthContextValue>(() => {
    return {
      ...auth,
      isAuthenticated: Boolean(auth.token),
      isAdmin: auth.role === "admin",
      setSession: (token, role) => {
        saveToken(token);
        localStorage.setItem(ROLE_KEY, role);
        setAuth({ token, role });
      },
      logout: () => {
        clearToken();
        localStorage.removeItem(ROLE_KEY);
        setAuth({ token: null, role: null });
      }
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
