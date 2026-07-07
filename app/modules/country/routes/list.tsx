import { DeskList } from "~/modules/desk/components/list";
import type { CountrySchema } from "../schemas";
import type { ColumnDef } from "@tanstack/react-table";
import { data } from "react-router";
import { Grid2X2 } from "lucide-react";

export default function CountryList() {
  const fields: ColumnDef<CountrySchema>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      enableResizing: true,
    },
  ];
  return (
    <DeskList fields={fields} data={[{ id: "as", name: "Indonesia" }]}>
      {[
        {
          key: "grid",
          Icon: Grid2X2,
          View: (data) => <strong>{data.name}</strong>,
        },
      ]}
    </DeskList>
  );
}
