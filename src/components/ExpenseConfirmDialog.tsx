import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowDown,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ExpenseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  valor: number;
  descricao: string;
  dataGasto: string;
  saldoAtual: number;
  saldoAposGasto: number;
  valorInicial: number;
}

export const ExpenseConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  valor,
  descricao,
  dataGasto,
  saldoAtual,
  saldoAposGasto,
  valorInicial,
}: ExpenseConfirmDialogProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  };

  const percentualAtual = ((valorInicial - saldoAtual) / valorInicial) * 100;
  const percentualAposGasto =
    ((valorInicial - saldoAposGasto) / valorInicial) * 100;
  const saldoInsuficiente = saldoAposGasto < 0;
  const saldoBaixo = saldoAposGasto >= 0 && saldoAposGasto < valorInicial * 0.2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            Confirmar Gasto
          </DialogTitle>
          <DialogDescription>
            Revise os detalhes antes de confirmar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Expense Details Card */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valor</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(valor)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Descrição</span>
              <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                {descricao}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data</span>
              <span className="text-sm text-foreground capitalize">
                {formatDate(dataGasto)}
              </span>
            </div>
          </div>

          {/* Balance Impact Visualization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingDown className="w-4 h-4" />
              Impacto no seu saldo
            </div>

            {/* Before and After Cards */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              {/* Before */}
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Saldo Atual
                </p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(saldoAtual)}
                </p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${100 - Math.min(percentualAtual, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-1 text-xs text-destructive font-medium">
                  <ArrowDown className="w-3 h-3" />
                  {formatCurrency(valor)}
                </div>
              </div>

              {/* After */}
              <div
                className={`p-3 rounded-xl border text-center transition-all ${
                  saldoInsuficiente
                    ? "bg-destructive/5 border-destructive/30"
                    : saldoBaixo
                      ? "bg-warning/5 border-warning/30"
                      : "bg-success/5 border-success/30"
                }`}
              >
                <p className="text-xs text-muted-foreground mb-1">Novo Saldo</p>
                <p
                  className={`text-lg font-bold ${
                    saldoInsuficiente
                      ? "text-destructive"
                      : saldoBaixo
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {formatCurrency(saldoAposGasto)}
                </p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      saldoInsuficiente
                        ? "bg-destructive"
                        : saldoBaixo
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{
                      width: `${Math.max(0, 100 - Math.min(percentualAposGasto, 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status Message */}
            {saldoInsuficiente ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">
                  Saldo insuficiente! Você ultrapassará o limite em{" "}
                  {formatCurrency(Math.abs(saldoAposGasto))}.
                </p>
              </div>
            ) : saldoBaixo ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Sparkles className="w-4 h-4 text-warning flex-shrink-0" />
                <p className="text-sm text-warning-foreground">
                  Atenção! Após esse gasto, restará apenas{" "}
                  {((saldoAposGasto / valorInicial) * 100).toFixed(0)}% do seu
                  saldo.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <p className="text-sm text-success">
                  Tudo certo! Você ainda terá{" "}
                  {((saldoAposGasto / valorInicial) * 100).toFixed(0)}% do saldo
                  disponível.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={saldoInsuficiente ? "destructive" : "hero"}
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading || saldoInsuficiente}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
