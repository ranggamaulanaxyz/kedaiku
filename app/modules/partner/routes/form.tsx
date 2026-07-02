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
  const { success, validatedData, error } = await partnerService.validate(data);
  if (success) {
    if (params.id === "new") {
      const partner = await partnerService.createPartner(validatedData);
      return { partner };
    }
    const partner = await partnerService.updatePartner(
      params.id,
      validatedData,
    );
    return { partner };
  }

  console.log(data);

  return {
    partner: null,
    error: {
      fieldErrors: error,
    },
  };
}

export async function clientAction({
  request,
  context,
  serverAction,
}: Route.ClientActionArgs) {
  const partnerService = new PartnerService(context);
  const formData = await request.clone().formData();
  const rawData = Object.fromEntries(formData);
  const data = snakecaseKeys(rawData, { deep: true });
  const { success, error } = await partnerService.validate(data);
  if (success) {
    return await serverAction();
  }
  return {
    success,
    error: {
      fieldErrors: error,
    },
  };
}

export default function PartnerFormRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const error = {
    fieldErrors: actionData?.error?.fieldErrors || {},
  };
  return (
    <main className="p-4">
      <Card>
        <CardContent>
          <DataForm error={error} />
        </CardContent>
      </Card>
    </main>
  );
}
