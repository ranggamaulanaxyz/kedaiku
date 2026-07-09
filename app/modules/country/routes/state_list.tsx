import { useMemo } from "react";
import { DeskList } from "~/modules/desk/components/list";
import type { CountryStateSchema } from "../schemas";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Grid2X2 } from "lucide-react";
import { Item } from "~/components/ui/item";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/state_list";
import { StateCountryService } from "../service";

export async function clientLoader({ url, context }: Route.ClientLoaderArgs) {
  const q = url.searchParams.get("q") || undefined;
  const stateCountryService = new StateCountryService(context);
  const states = await stateCountryService.getStates(undefined, q);

  return { states };
}

const fields: ColumnDef<CountryStateSchema>[] = [
  {
    accessorKey: "name",
    header: "Nama Provinsi",
    enableResizing: true,
  },
  {
    accessorKey: "country.name",
    header: "Negara",
    enableResizing: true,
  },
];

export default function StateList({ loaderData }: Route.ComponentProps) {
  const { states } = loaderData;

  const views = useMemo(
    () => [
      {
        key: "grid",
        Icon: Grid2X2,
        View: (
          row: Row<CountryStateSchema>,
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
            <div className="flex flex-col gap-1">
              <span className="font-medium">{row.original.name}</span>
              <span className="text-xs text-muted-foreground">
                {row.original.country?.name}
              </span>
            </div>
          </Item>
        ),
      },
    ],
    [],
  );

  return (
    <DeskList
      fields={fields}
      data={states}
      meta={{ totalRecords: states.length }}
    >
      {views}
    </DeskList>
  );
}
