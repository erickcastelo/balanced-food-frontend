import React from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { SaldoProvider } from "@/contexts/SaldoContext";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { Home } from "@/components/Home";

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!user) {
    return <Home />;
  }

  return (
    <SaldoProvider>
      <Dashboard />
    </SaldoProvider>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
