import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaldo, Gasto } from "@/contexts/SaldoContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { History, Receipt, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExpenseHistoryProps {
  showAllUsers?: boolean;
}

export function ExpenseHistory({ showAllUsers = false }: ExpenseHistoryProps) {
  const { user } = useAuth();
  const { getGastosPorMes } = useSaldo();

  const gastos = getGastosPorMes();

  const currentDate = new Date(gastos.year, gastos.month - 1, 1);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Histórico de Gastos</CardTitle>
            <CardDescription>
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {gastos.histories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum gasto registrado neste mês</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gastos.histories.map((gasto, index) => (
              <div
                key={history + ""}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {gasto.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(gasto.expenseDate)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">
                    - {formatCurrency(gasto.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
