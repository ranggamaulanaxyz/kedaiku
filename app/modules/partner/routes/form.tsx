import { PartnerService } from "../service";
import type { Route } from "./+types/form";
import type { RouteHandle } from "~/modules/layout/types";
import DataForm from "../components/form";
import { Card, CardContent } from "~/components/ui/card";
import snakecaseKeys from "snakecase-keys";
import { PartnerSchema } from "../schemas";
import { id } from "zod/locales";

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

export async function action({ request, params, context }: Route.ActionArgs) {
  const partnerService = new PartnerService(context);
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const data = snakecaseKeys(rawData, { deep: true });
  const result = await PartnerSchema.omit({ id: true }).safeParseAsync(data);
  if (result.success) {
    const partner = await partnerService.createPartner(result.data);
    return { partner };
  }

  return {
    partner: null,
    error: {
      fieldErrors: { email: [{ message: "Format email tidak benar!" }] },
    },
  };
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
