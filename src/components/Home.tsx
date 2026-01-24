import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import { LoadingScreen } from "./LoadingScreen";

export const Home = () => {
  const { me } = useAuth();

  useEffect(() => {
    me();
  }, []);

  return (
    <>
      <LoadingScreen />
    </>
  );
};
