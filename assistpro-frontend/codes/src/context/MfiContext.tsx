"use client";

import React, { createContext, useContext } from "react";

type MfiContextType = {
  mfi: string;
};

const MfiContext = createContext<MfiContextType | undefined>(undefined);

export const useMfi = () => {
  const context = useContext(MfiContext);
  if (!context) {
    throw new Error("useMfi must be used within an MfiProvider");
  }
  return context;
};

export const MfiProvider: React.FC<{ mfi: string; children: React.ReactNode }> = ({ mfi, children }) => (
  <MfiContext.Provider value={{ mfi }}>{children}</MfiContext.Provider>
);
