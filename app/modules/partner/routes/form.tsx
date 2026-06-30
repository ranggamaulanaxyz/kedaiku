import { Fragment } from "react/jsx-runtime";
import { PartnerService } from "../service";
import type { Route } from "./+types/form";
import type { RouteHandle } from "~/modules/layout/types";
import { useNavigation } from "react-router";
import DataForm from "../components/form";
import { Card, CardContent } from "~/components/ui/card";

export const handle: RouteHandle = {
  breadcrumb: (match) => {
    if (match.params?.id === "new") return "Tambah";
    return match.loaderData.partner?.name || match.loaderData.partner?.id;
  },
};

export async function loader({ params, context }: Route.LoaderArgs) {
  if (params.id === "new") {
    return { partner: null };
  }

  const partnerService = new PartnerService(context);
  const partner = await partnerService.getPartnerById(params.id);
  return { partner };
}

export default function PartnerFormRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="p-4">
      <Card>
        <CardContent>
          <DataForm />
        </CardContent>
      </Card>
    </main>
  );
}
