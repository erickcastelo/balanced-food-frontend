import React from 'react';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';

interface BalanceCardProps {
  valorInicial: number;
  totalGasto: number;
  saldoDisponivel: number;
}

export function BalanceCard({ valorInicial, totalGasto, saldoDisponivel }: BalanceCardProps) {
  const percentualGasto = (totalGasto / valorInicial) * 100;
  const isLowBalance = percentualGasto > 80;
  const isMediumBalance = percentualGasto > 50 && percentualGasto <= 80;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="gradient-hero rounded-2xl p-6 text-primary-foreground shadow-elevated animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-primary-foreground/70 text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(saldoDisponivel)}</h2>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isLowBalance ? 'bg-destructive' : isMediumBalance ? 'bg-warning' : 'bg-primary-foreground'
            }`}
            style={{ width: `${Math.min(percentualGasto, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-xs">Total Gasto</p>
              <p className="font-semibold">{formatCurrency(totalGasto)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/70 text-xs">Saldo Inicial</p>
              <p className="font-semibold">{formatCurrency(valorInicial)}</p>
            </div>
          </div>
        </div>
      </div>

      {isLowBalance && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/30 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-soft" />
          Atenção: Saldo abaixo de 20%
        </div>
      )}
    </div>
  );
}
