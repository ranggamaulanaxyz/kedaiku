import React, { createContext } from "react";
import type { DeskAction } from "./list";

export interface DeskContext<TData> {
  name: string;
  saveHandler?: () => void;
  actions?: DeskAction<TData>;
}

export const DeskContext = createContext<DeskContext<any> | null>(null);

interface DeskProps<TData> {
  children: React.ReactNode;
  actions?: DeskAction<TData>;
}

export function Desk<TData>({ children, actions }: DeskProps<TData>) {
  const contextValue: DeskContext<TData> = {
    name: "Desk",
    actions: actions,
  };

  return (
    <DeskContext.Provider value={contextValue}>{children}</DeskContext.Provider>
  );
}
