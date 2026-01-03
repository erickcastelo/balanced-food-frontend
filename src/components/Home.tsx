import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";

export const Home = () => {
  const { me } = useAuth();

  useEffect(() => {
    me();
  }, []);

  return <>Carregando</>;
};
