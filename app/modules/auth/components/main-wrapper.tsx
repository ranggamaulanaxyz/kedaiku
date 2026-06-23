import type React from "react";

interface MainWrapperProps {
  children: React.ReactNode;
}
export default function MainWrapper({ children }: MainWrapperProps) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
