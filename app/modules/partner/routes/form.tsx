import { Fragment } from "react/jsx-runtime";
import { PartnerService } from "../service";
import type { Route } from "./+types/form";
import type { RouteHandle } from "~/modules/layout/types";

export const handle: RouteHandle = {
  breadcrumb: () => "Form",
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
  return <Fragment></Fragment>;
}
