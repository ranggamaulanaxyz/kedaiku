import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useMatches } from "react-router";
import { Breadcrumbs } from "./breadcrumbs";

interface DeskHeaderProps {
  children?: React.ReactNode;
}

export function DeskHeader({ children }: DeskHeaderProps) {
  const matches = useMatches();
  const hasBreadcrumbs = matches.some(
    (match) =>
      match.handle &&
      ((match.handle as any).breadcrumb ||
        (match.handle as any).handleBreadcrumbs),
  );

  return (
    <header className="sticky top-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {hasBreadcrumbs && (
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        )}
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
