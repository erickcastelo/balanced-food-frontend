import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaldo } from "@/contexts/SaldoContext";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { AdminBalanceManager } from "@/components/AdminBalanceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Receipt, Settings, Users } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { getSaldoAtual } = useSaldo();

  const currentDate = new Date();
  const saldoInfo = getSaldoAtual();

  const isAdmin = user?.perfil === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          {saldoInfo ? (
            <BalanceCard
              valorInicial={saldoInfo.valorInicial}
              totalGasto={saldoInfo.totalGasto}
              saldoDisponivel={saldoInfo.saldoDisponivel}
            />
          ) : (
            <div className="gradient-hero rounded-2xl p-6 text-primary-foreground shadow-elevated animate-fade-in">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Sem saldo configurado</h2>
                  <p className="text-primary-foreground/70">
                    {isAdmin
                      ? "Configure o saldo do mês na aba Configurações"
                      : "Aguarde o administrador configurar o saldo do mês"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isAdmin ? (
          <Tabs defaultValue="gastos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger
                value="gastos"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Gastos</span>
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Todos Gastos</span>
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gastos" className="space-y-6 mt-6">
              <ExpenseForm />
              <ExpenseHistory />
            </TabsContent>

            <TabsContent value="historico" className="mt-6">
              <ExpenseHistory showAllUsers />
            </TabsContent>

            <TabsContent value="config" className="mt-6">
              <AdminBalanceManager />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <ExpenseForm />
            <ExpenseHistory />
          </div>
        )}
      </main>
    </div>
  );
}
