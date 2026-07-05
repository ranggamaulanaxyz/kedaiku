import { PartnerService } from "../service";
import type { Route } from "./+types/form";
import type { RouteHandle } from "~/modules/layout/types";
import DataForm from "../components/form";
import { Card, CardContent } from "~/components/ui/card";
import snakecaseKeys from "snakecase-keys";
import { PartnerSchema } from "../schemas";
import { id } from "zod/locales";
import camelcaseKeys from "camelcase-keys";
import { redirect } from "react-router";
import { toast } from "sonner";

export const handle: RouteHandle = {
  breadcrumb: (match) => {
    if (match.params?.id === "new") return "Tambah";
    return match.loaderData.partner?.name || match.loaderData.partner?.id;
  },
};

export async function clientLoader({
  params,
  context,
}: Route.ClientLoaderArgs) {
  const isCreate = params.id === "new";
  const partnerService = new PartnerService(context);
  const partner = isCreate
    ? null
    : await partnerService.getPartnerById(params.id);
  const countries = await partnerService.getCountries();
  const countryStates = await partnerService.getCountryStates();
  return { isCreate, partner, countries, countryStates };
}

export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const partnerService = new PartnerService(context);

  if (request.method === "DELETE") {
    partnerService.deletePartner(params.id);
  }

  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const data = camelcaseKeys(rawData, { deep: true });
  const { success, validatedData, error } = await partnerService.validate(data);
  if (success) {
    if (params.id === "new") {
      const partner = await partnerService.createPartner(validatedData);
      if (partner) {
        toast.success("Partner berhasil disimpan");
        return redirect(`/app/partners/${partner.id}`);
      }
      return {
        state: "error",
        error: {
          formErrors: [{ message: "Gagal menyimpan data." }],
        },
      };
    }
    const partner = await partnerService.updatePartner(
      params.id,
      validatedData,
    );
    if (partner) {
      toast.success("Partner berhasil disimpan");
    }
    return { state: "saved", partner };
  }

  return {
    state: "error",
    partner: null,
    error: {
      fieldErrors: error,
    },
  };
}

export default function PartnerFormRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { isCreate, partner, countries, countryStates } = loaderData;
  const error = {
    formErrors: actionData?.error?.formErrors || [],
    fieldErrors: actionData?.error?.fieldErrors || {},
  };
  const actionState = actionData?.state === "saved" ? "saved" : "idle";
  return (
    <main className="p-4">
      <Card>
        <CardContent>
          <DataForm
            state={isCreate ? "create" : actionState}
            data={{ partner, countryStates, countries }}
            error={error}
          />
        </CardContent>
      </Card>
    </main>
  );
}
