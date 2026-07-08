import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DeskSidebar from "./sidebar";
import { DeskHeader } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DeskLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DeskSidebar />
      <SidebarInset className="min-w-0">
        <DeskHeader />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
