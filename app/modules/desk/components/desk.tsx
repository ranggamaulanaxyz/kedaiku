import React, { createContext, useState } from "react";
import type { DeskAction } from "./list";

export interface DeskContext<TData> {
  baseUrl: string;
  saveHandler?: () => void;
  actions: DeskAction<TData>;
  setActions: React.Dispatch<React.SetStateAction<DeskAction<TData>>>;
}

export const DeskContext = createContext<DeskContext<any> | null>(null);

interface DeskProps {
  children: React.ReactNode;
  baseUrl: string;
}

export function Desk<TData>({ children, baseUrl }: DeskProps) {
  const [actions, setActions] = useState<DeskAction<TData>>({});

  const contextValue: DeskContext<TData> = {
    baseUrl: baseUrl,
    actions: actions,
    setActions: setActions,
  };

  return (
    <DeskContext.Provider value={contextValue}>{children}</DeskContext.Provider>
  );
}
