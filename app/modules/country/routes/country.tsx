import { Desk } from "~/modules/desk/components/desk";
import { Outlet, useNavigate } from "react-router";
import type { DeskAction } from "~/modules/desk/components/list";
import type { CountrySchema } from "../schemas";
import { toast } from "sonner";

export default function CountryRoute() {
  const navigate = useNavigate();

  const actions: DeskAction<CountrySchema> = {
    open: {
      name: "Buka",
      callback: (row) => {
        navigate(`/app/countries/${row.original.id}`);
      },
    },
    delete: {
      name: "Hapus",
      callback: (row) => {
        toast("Yakin ingin menghapus data ini?", {
          action: {
            label: "Hapus",
            onClick: () => {
              console.log(row);
            },
          },
        });
      },
      isMulti: true,
      variant: "destructive",
    },
  };
  return (
    <Desk actions={actions}>
      <Outlet />
    </Desk>
  );
}
