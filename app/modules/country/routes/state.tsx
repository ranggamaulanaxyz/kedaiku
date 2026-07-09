import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import type { CountryStateSchema } from "../schemas";
import { toast } from "sonner";
import type { DeskHandle } from "~/modules/desk/types";
import { useDesk } from "~/hooks/use-desk";

export const handle: DeskHandle = {
  rootPath: "/app/country/states",
  breadcrumb: "Provinsi",
};

export default function StateRoute() {
  const { baseUrl, setActions } = useDesk<CountryStateSchema>();
  const navigate = useNavigate();

  useEffect(() => {
    setActions({
      open: {
        name: "Buka",
        callback: (data) => {
          navigate(`${baseUrl}/${data.id}`);
        },
      },
      delete: {
        name: "Hapus",
        callback: (data) => {
          toast("Yakin ingin menghapus data ini?", {
            action: {
              label: "Hapus",
              onClick: () => {
                console.log(data);
              },
            },
          });
        },
        isMulti: true,
        variant: "destructive",
      },
    });
  }, [navigate, setActions, baseUrl]);

  return <Outlet />;
}
