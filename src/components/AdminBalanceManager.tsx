import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaldo } from "@/contexts/SaldoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Plus, Loader2, CheckCircle2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { instance } from "@/lib/api";

export function AdminBalanceManager() {
  const { user } = useAuth();
  const { saldosMensais, addSaldoMensal, updateSaldoMensal, getSaldoAtual } =
    useSaldo();

  const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [valorInicial, setValorInicial] = useState<number>(null);
  const [foodAmount] = useState<number>(630);
  const [mealAmount, setMealAmount] = useState<number>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const meses = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!user) return;

      setIsLoading(true);
      await instance.post("/balance", {
        month: parseInt(mes),
        year: parseInt(ano),
        totalAmount: valorInicial,
        foodAmount,
        mealAmount,
      });

      toast.success("Saldo criado com sucesso!");

      setValorInicial(null);
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (saldo: (typeof saldosMensais)[0]) => {
    setMes(saldo.mes.toString());
    setAno(saldo.ano.toString());
    setValorInicial(saldo.valorInicial);
    setEditingId(saldo.id);
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Gerenciar Saldo Mensal</CardTitle>
            <CardDescription>
              Configure o saldo inicial de cada mês
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mes">Mês</Label>
              <select
                id="mes"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {meses.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                min={new Date().getFullYear()}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorInicial">Valor Inicial (R$)</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                className={cn(
                  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                id="valorInicial"
                placeholder="0,00"
                onValueChange={(_, __, values) => {
                  setValorInicial(values?.float ?? null);
                }}
                onBlur={() => setMealAmount(valorInicial - 630)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foodAmount">Valor Refeição (R$)</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                className={cn(
                  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                id="foodAmount"
                value={mealAmount}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foodAmount">Valor Alimentação (R$)</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                className={cn(
                  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                id="foodAmount"
                value={foodAmount}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full sm:w-auto"
            disabled={!valorInicial || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingId ? "Atualizar Saldo" : "Criar Saldo"}
          </Button>
        </form>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Saldos Configurados
          </h4>
          <div className="space-y-3">
            {saldosMensais
              .sort((a, b) => b.ano - a.ano || b.mes - a.mes)
              .map((saldo, index) => {
                const info = getSaldoAtual();
                return (
                  <div
                    key={saldo.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <p className="font-medium">
                        {meses[saldo.mes - 1].label} {saldo.ano}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Inicial: {formatCurrency(saldo.valorInicial)} |
                        Disponível: {formatCurrency(info?.saldoDisponivel || 0)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(saldo)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
