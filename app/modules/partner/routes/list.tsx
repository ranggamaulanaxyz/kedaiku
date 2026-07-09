import { useMemo } from "react";
import { DeskList } from "~/modules/desk/components/list";
import type { PartnerSchema } from "../schemas";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Grid2X2 } from "lucide-react";
import { Item } from "~/components/ui/item";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/list";
import { PartnerService } from "../service";

export async function clientLoader({ url, context }: Route.ClientLoaderArgs) {
  const q = url.searchParams.get("q") || undefined;
  const offset = Number(url.searchParams.get("offset") || "1");
  const limit = Number(url.searchParams.get("limit") || "10");

  const partnerService = new PartnerService(context);
  const { partners, totalRecord } = await partnerService.getPartners(
    q,
    offset,
    limit,
  );

  return { partners, totalRecord };
}

const fields: ColumnDef<PartnerSchema>[] = [
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
  {
    accessorKey: "address",
    header: "Alamat",
    enableResizing: true,
  },
  {
    accessorKey: "city",
    header: "Kota",
    enableResizing: true,
  },
  {
    id: "countryStateName",
    accessorFn: (row) => row.countryState?.name,
    header: "Provinsi",
    enableResizing: true,
  },
  {
    id: "countryName",
    accessorFn: (row) => row.country?.name,
    header: "Negara",
    enableResizing: true,
  },
];

export default function PartnerList({ loaderData }: Route.ComponentProps) {
  const { partners, totalRecord } = loaderData;

  const views = useMemo(
    () => [
      {
        key: "grid",
        Icon: Grid2X2,
        View: (
          row: Row<PartnerSchema>,
          onRowClick: any,
          onRowDoubleClick: any,
        ) => (
          <Item
            variant="outline"
            data-state={row.getIsSelected() ? "selected" : undefined}
            className={cn(
              "cursor-pointer transition-all duration-200 select-none",
              row.getIsSelected()
                ? "bg-accent border-primary/40 ring-primary/20 shadow-sm ring-1"
                : "hover:bg-muted/50",
            )}
            onClick={(e) => onRowClick(e, row)}
            onDoubleClick={() => onRowDoubleClick(row)}
          >
            {row.original.name}
          </Item>
        ),
      },
    ],
    [],
  );

  return (
    <DeskList
      fields={fields}
      data={partners}
      meta={{ totalRecords: totalRecord }}
    >
      {views}
    </DeskList>
  );
}
