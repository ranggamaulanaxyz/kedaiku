import { Field, FieldLabel } from "~/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DataTable } from "../components/table";
import type { Route } from "./+types/list";
import { PartnerService } from "../service";
import type { ColumnDef } from "@tanstack/react-table";
import type { PartnerSchema } from "../schemas";
import type { RouteHandle } from "~/modules/layout/types";

export const handle: RouteHandle = {
  handleBreadcrumbs: () => "Partners",
};

export async function loader({ context }: Route.LoaderArgs) {
  const partnerService = new PartnerService(context);
  const partners = await partnerService.getPartners();

  return { partners };
}

export default function PartnerListRoute({ loaderData }: Route.ComponentProps) {
  const { partners } = loaderData;
  const columns: ColumnDef<PartnerSchema>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableResizing: true,
    },
    {
      accessorKey: "name",
      header: "Nama",
      enableResizing: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableResizing: true,
    },
  ];
  return (
    <main>
      <div className="flex justify-between gap-4 border-b p-2">
        <div></div>
        <div></div>
        <div className="flex items-center justify-between gap-1">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="rows-per-page" className="text-nowrap">
              Rows per page
            </FieldLabel>
            <Select defaultValue="25">
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={partners} />
      </div>
    </main>
  );
}
