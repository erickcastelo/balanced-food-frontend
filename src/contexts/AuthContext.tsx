import { instance } from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import Cookies from "js-cookie";

export enum UserProfile {
  ADMIN = "admin",
  USER_MEAL_VOUCHER = "user_meal_voucher",
  USER_FOOD_VOUCHER = "user_food_voucher",
}

export interface User {
  id: number;
  name: string;
  role: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  me: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userWithToken, setUserWithToken] = useState<{
    user: User | null;
    token: string;
  }>({
    user: null,
    token: Cookies.get("TOKEN")?.replace("Bearer ", "") || "",
  });

  const login = useCallback(
    async (email: string, senha: string): Promise<boolean> => {
      const response = await instance.post("/login", {
        userId: email,
        password: senha,
      });

      const { token: tokenResponse } = response.data;

      if (tokenResponse) {
        Cookies.set("TOKEN", `Bearer ${tokenResponse}`, { expires: 90 });
        setUserWithToken((prev) => {
          return {
            ...prev,
            token: tokenResponse,
          };
        });
        return true;
      }

      return false;
    },
    []
  );

  const me = useCallback(async () => {
    const response = await instance.get(`/me/${userWithToken.token}`);
    const { id, name, role } = response.data;
    const user: User = { id, name, role };
    setUserWithToken((prev) => {
      return {
        ...prev,
        user,
      };
    });
  }, [userWithToken.token]);

  const logout = useCallback(() => {
    setUserWithToken((prev) => {
      return {
        ...prev,
        user: null,
        token: "",
      };
    });
    Cookies.remove("TOKEN");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: userWithToken.user,
        isAuthenticated: !!userWithToken.token,
        login,
        logout,
        me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
