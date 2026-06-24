import { requireAuthMiddleware } from "~/modules/auth/middleware";
import type { Route } from "./+types/dashboard";
import SectionCards from "./components/section-cards";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export const handle = {
  breadcrumb: "Dashboard",
};

export default function DashboardRoute() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
      </div>
    </div>
  );
}
