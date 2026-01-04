import React from "react";
import { useAuth, UserProfile } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Utensils, LogOut, User, Shield } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  const getTitle = () => {
    if (user?.role === "admin") return "Total";

    if (user.role === UserProfile.USER_FOOD_VOUCHER) return "Alimentação";

    if (user.role === UserProfile.USER_MEAL_VOUCHER) return "Refeição";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{`Saldo ${getTitle()}`}</h1>
              <p className="text-xs text-muted-foreground">
                Controle de gastos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              {user?.role === "admin" ? (
                <Shield className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{user?.name}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
