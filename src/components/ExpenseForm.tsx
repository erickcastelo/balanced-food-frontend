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
import {
  Receipt,
  Calculator,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { instance } from "@/lib/api";
import { formatInTimeZone } from "date-fns-tz";
import { formatDateTimeZone } from "@/utils/DateUtil";
import { format } from "date-fns";

export function ExpenseForm() {
  const [valor, setValor] = useState<number>(null);
  const [descricao, setDescricao] = useState("Supermercado");
  const [dataGasto, setDataGasto] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    saldoAtual: number;
    saldoAposSimulacao: number;
    percentualUsado: number;
  } | null>(null);

  const { user } = useAuth();
  const { simularGasto, fetchExpense, getSaldoAtual } = useSaldo();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!user) return;

      setIsLoading(true);

      const formatDate = formatDateTimeZone(dataGasto);

      const response = await instance.post("/expense", {
        amount: valor,
        description: descricao,
        expenseDate: formatDate,
      });

      if (response) {
        toast.success("Gasto registrado com sucesso!");
        setValor(null);
        setSimulationResult(null);
        await fetchExpense();
      } else {
        toast.error("Saldo insuficiente ou mês sem saldo configurado");
      }
    } catch (error) {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimular = async () => {
    if (isNaN(valor) || valor <= 0) {
      toast.error("Digite um valor válido para simular");
      return;
    }

    setIsSimulating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = simularGasto(valor);
    if (result) {
      setSimulationResult(result);
    } else {
      toast.error(
        "Não foi possível simular. Verifique se há saldo configurado para o mês."
      );
    }

    setIsSimulating(false);
  };

  const isFormValid = valor && descricao.length && dataGasto;
  const { valorInicial, saldoDisponivel } = getSaldoAtual();

  const error = valor > saldoDisponivel;

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Registrar Gasto</CardTitle>
            <CardDescription>
              Adicione um novo gasto de alimentação
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                disabled={valorInicial === 0}
                onValueChange={(value) => {
                  setValor(value ? parseFloat(value.replace(",", ".")) : null);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={dataGasto}
                onChange={(e) => setDataGasto(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="h-11"
                disabled={valorInicial === 0}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>O valor gasto não pode exceder o saldo disponível.</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Ex: Almoço no restaurante"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="h-11"
              minLength={3}
              disabled={valorInicial === 0}
              required
            />
          </div>
          {simulationResult && (
            <div className="p-4 rounded-xl bg-muted animate-fade-in space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calculator className="w-4 h-4" />
                Simulação de Gasto
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Saldo atual</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(simulationResult.saldoAtual)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Após o gasto</p>
                  <p
                    className={`font-semibold ${
                      simulationResult.saldoAposSimulacao < 0
                        ? "text-destructive"
                        : "text-success"
                    }`}
                  >
                    {formatCurrency(simulationResult.saldoAposSimulacao)}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    simulationResult.percentualUsado > 80
                      ? "bg-destructive"
                      : simulationResult.percentualUsado > 50
                      ? "bg-warning"
                      : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(
                      simulationResult.percentualUsado,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {simulationResult.percentualUsado.toFixed(1)}% do saldo
                utilizado
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleSimular}
              disabled={!valor || error || isSimulating}
            >
              {isSimulating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4" />
              )}
              Simular
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={!isFormValid || error || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Registrar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
