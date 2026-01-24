import React from "react";
import { Wallet, Utensils, TrendingUp } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -right-20 w-60 h-60 bg-accent/30 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[15%] animate-float">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Wallet className="w-8 h-8 text-white/70" />
          </div>
        </div>
        <div
          className="absolute top-32 right-[20%] animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Utensils className="w-8 h-8 text-white/70" />
          </div>
        </div>
        <div
          className="absolute bottom-32 left-[25%] animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <TrendingUp className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo/Icon with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse scale-150" />
          <div className="relative p-6 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-2xl">
            <div className="p-4 bg-white rounded-full shadow-lg animate-spin-slow">
              <Wallet className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Saldo Refeição/Alimentação
          </h1>
          <p className="text-white/80 text-lg font-medium animate-fade-in">
            {"Carregando seus dados..."}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/80 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
