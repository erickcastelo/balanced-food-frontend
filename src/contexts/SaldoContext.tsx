import { instance } from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

export interface SaldoMensal {
  id: number;
  mes: number;
  ano: number;
  valorInicial: number;
  criadoPor: number;
  criadoEm: Date;
}

export interface Gasto {
  id: number;
  usuarioId: number;
  saldoId: number;
  valor: number;
  descricao: string;
  dataGasto: Date;
  criadoEm: Date;
}

interface SimulacaoResult {
  saldoAtual: number;
  valorSimulado: number;
  saldoAposSimulacao: number;
  percentualUsado: number;
}

interface SaldoContextType {
  saldosMensais: SaldoMensal[];
  gastos: Gasto[];
  getSaldoAtual: () => {
    valorInicial: number;
    totalGasto: number;
    saldoDisponivel: number;
  } | null;
  addSaldoMensal: (
    mes: number,
    ano: number,
    valorInicial: number,
    adminId: number
  ) => void;
  updateSaldoMensal: (id: number, valorInicial: number) => void;
  addGasto: (
    usuarioId: number,
    valor: number,
    descricao: string,
    dataGasto: Date
  ) => boolean;
  simularGasto: (valor: number) => SimulacaoResult | null;
  getGastosPorMes: (mes: number, ano: number, usuarioId?: number) => Gasto[];
}

const SaldoContext = createContext<SaldoContextType | undefined>(undefined);

// Mock data
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const initialSaldos: SaldoMensal[] = [
  {
    id: 1,
    mes: currentMonth,
    ano: currentYear,
    valorInicial: 800,
    criadoPor: 1,
    criadoEm: new Date(currentYear, currentMonth - 1, 1),
  },
  {
    id: 2,
    mes: currentMonth - 1 || 12,
    ano: currentMonth - 1 ? currentYear : currentYear - 1,
    valorInicial: 750,
    criadoPor: 1,
    criadoEm: new Date(currentYear, currentMonth - 2, 1),
  },
];

const initialGastos: Gasto[] = [
  {
    id: 1,
    usuarioId: 2,
    saldoId: 1,
    valor: 45.5,
    descricao: "Almoço - Restaurante Central",
    dataGasto: new Date(currentYear, currentMonth - 1, 5),
    criadoEm: new Date(),
  },
  {
    id: 2,
    usuarioId: 2,
    saldoId: 1,
    valor: 32.0,
    descricao: "Lanche da tarde",
    dataGasto: new Date(currentYear, currentMonth - 1, 6),
    criadoEm: new Date(),
  },
  {
    id: 3,
    usuarioId: 2,
    saldoId: 1,
    valor: 58.9,
    descricao: "Almoço executivo",
    dataGasto: new Date(currentYear, currentMonth - 1, 8),
    criadoEm: new Date(),
  },
  {
    id: 4,
    usuarioId: 2,
    saldoId: 1,
    valor: 28.5,
    descricao: "Café e salgado",
    dataGasto: new Date(currentYear, currentMonth - 1, 10),
    criadoEm: new Date(),
  },
  {
    id: 5,
    usuarioId: 3,
    saldoId: 1,
    valor: 52.0,
    descricao: "Almoço - Buffet",
    dataGasto: new Date(currentYear, currentMonth - 1, 7),
    criadoEm: new Date(),
  },
];

type ExpenseResponse = {
  amount: number;
  totalExpenses: number;
};

export function SaldoProvider({ children }: { children: ReactNode }) {
  const [saldosMensais, setSaldosMensais] =
    useState<SaldoMensal[]>(initialSaldos);
  const [gastos, setGastos] = useState<Gasto[]>(initialGastos);

  const [expense, setExpense] = useState<ExpenseResponse>({
    amount: 0,
    totalExpenses: 0,
  });

  const fetchExpense = useCallback(async () => {
    const response = (await instance.get("/expense")).data;
    setExpense(() => ({
      amount: response.amount,
      totalExpenses: response.totalExpenses,
    }));
  }, []);

  useEffect(() => {
    fetchExpense();
  }, []);

  const getSaldoAtual = useCallback(() => {
    return {
      valorInicial: expense.amount,
      totalGasto: expense.totalExpenses,
      saldoDisponivel: expense.amount - expense.totalExpenses,
    };
  }, [expense.totalExpenses, expense.amount]);

  const addSaldoMensal = useCallback(
    (mes: number, ano: number, valorInicial: number, adminId: number) => {
      const newSaldo: SaldoMensal = {
        id: Math.max(...saldosMensais.map((s) => s.id), 0) + 1,
        mes,
        ano,
        valorInicial,
        criadoPor: adminId,
        criadoEm: new Date(),
      };
      setSaldosMensais((prev) => [...prev, newSaldo]);
    },
    [saldosMensais]
  );

  const updateSaldoMensal = useCallback((id: number, valorInicial: number) => {
    setSaldosMensais((prev) =>
      prev.map((s) => (s.id === id ? { ...s, valorInicial } : s))
    );
  }, []);

  const addGasto = useCallback(
    (
      usuarioId: number,
      valor: number,
      descricao: string,
      dataGasto: Date
    ): boolean => {
      const mes = dataGasto.getMonth() + 1;
      const ano = dataGasto.getFullYear();
      const saldo = saldosMensais.find((s) => s.mes === mes && s.ano === ano);

      if (!saldo) return false;

      const saldoInfo = getSaldoAtual(mes, ano);
      if (!saldoInfo || saldoInfo.saldoDisponivel < valor) return false;

      const newGasto: Gasto = {
        id: Math.max(...gastos.map((g) => g.id), 0) + 1,
        usuarioId,
        saldoId: saldo.id,
        valor,
        descricao,
        dataGasto,
        criadoEm: new Date(),
      };

      setGastos((prev) => [...prev, newGasto]);
      return true;
    },
    [saldosMensais, gastos, getSaldoAtual]
  );

  const simularGasto = useCallback(
    (valor: number): SimulacaoResult | null => {
      const saldoInfo = getSaldoAtual(currentMonth, currentYear);
      if (!saldoInfo) return null;

      const saldoAposSimulacao = saldoInfo.saldoDisponivel - valor;
      const percentualUsado =
        ((saldoInfo.valorInicial - saldoAposSimulacao) /
          saldoInfo.valorInicial) *
        100;

      return {
        saldoAtual: saldoInfo.saldoDisponivel,
        valorSimulado: valor,
        saldoAposSimulacao,
        percentualUsado,
      };
    },
    [getSaldoAtual]
  );

  const getGastosPorMes = useCallback(
    (mes: number, ano: number, usuarioId?: number): Gasto[] => {
      const saldo = saldosMensais.find((s) => s.mes === mes && s.ano === ano);
      if (!saldo) return [];

      return gastos
        .filter(
          (g) =>
            g.saldoId === saldo.id && (!usuarioId || g.usuarioId === usuarioId)
        )
        .sort(
          (a, b) =>
            new Date(b.dataGasto).getTime() - new Date(a.dataGasto).getTime()
        );
    },
    [saldosMensais, gastos]
  );

  return (
    <SaldoContext.Provider
      value={{
        saldosMensais,
        gastos,
        getSaldoAtual,
        addSaldoMensal,
        updateSaldoMensal,
        addGasto,
        simularGasto,
        getGastosPorMes,
      }}
    >
      {children}
    </SaldoContext.Provider>
  );
}

export function useSaldo() {
  const context = useContext(SaldoContext);
  if (context === undefined) {
    throw new Error("useSaldo must be used within a SaldoProvider");
  }
  return context;
}
