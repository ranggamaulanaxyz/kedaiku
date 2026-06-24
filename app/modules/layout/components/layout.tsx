import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import LayoutSidebar from "./sidebar";
import { LayoutHeader } from "./header";
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <LayoutSidebar />
      <SidebarInset>
        <LayoutHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
