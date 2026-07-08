import { DeskList } from "~/modules/desk/components/list";
import type { CountrySchema } from "../schemas";
import type { ColumnDef } from "@tanstack/react-table";
import { Grid2X2 } from "lucide-react";
import { Item } from "~/components/ui/item";
import { cn } from "~/lib/utils";

export default function CountryList() {
  const fields: ColumnDef<CountrySchema>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      enableResizing: true,
    },
  ];

  return (
    <DeskList
      fields={fields}
      data={[
        { id: "as", name: "Indonesia" },
        { id: "as1", name: "Indonesia 2" },
      ]}
      meta={{ totalRecords: 1000 }}
    >
      {[
        {
          key: "grid",
          Icon: Grid2X2,
          View: (row, onRowClick, onRowDoubleClick) => (
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
      ]}
    </DeskList>
  );
}
