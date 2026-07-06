import React, { createContext } from "react";

interface DeskContext {
  name: string;
  saveHandler?: () => void;
}

const DeskContext = createContext<DeskContext | null>(null);

interface DeskProps {
  children: React.ReactNode;
}

function Desk({ children }: DeskProps) {
  const contextValue: DeskContext = {
    name: "Desk",
  };

  return (
    <DeskContext.Provider value={contextValue}>{children}</DeskContext.Provider>
  );
}

export { Desk, DeskContext };
