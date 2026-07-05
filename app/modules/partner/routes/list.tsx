import { useState, useEffect } from "react";
import { DataTable } from "../components/table";
import { DataGrid } from "../components/grid";
import type { Route } from "./+types/list";
import { PartnerService } from "../service";
import type { ColumnDef } from "@tanstack/react-table";
import type { PartnerSchema } from "../schemas";
import { DataPagination } from "../components/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Grid2X2, Table2 } from "lucide-react";
import { useSidebar } from "~/components/ui/sidebar";
import { DataEmpty, DataNotFound } from "../components/empty";
import { useSearchParams } from "react-router";

export async function loader({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const page = Number(url.searchParams.get("page") || "1");
  const perPage = Number(url.searchParams.get("perPage") || "25");

  const partnerService = new PartnerService(context);
  const { partners, totalRecord } = await partnerService.getPartners(
    q,
    page,
    perPage,
  );

  return { partners, totalRecord, page, perPage };
}

export default function PartnerListRoute({ loaderData }: Route.ComponentProps) {
  const { partners, totalRecord, page, perPage } = loaderData;
  const { isMobile } = useSidebar();
  const [tab, setTab] = useState<string>("table");

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    setTab(isMobile ? "grid" : "table");
  }, [isMobile]);

  const columns: ColumnDef<PartnerSchema>[] = [
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
      accessorKey: "address2",
      header: "Alamat 2",
      enableResizing: true,
    },
    {
      accessorKey: "city",
      header: "Kota",
      enableResizing: true,
    },
    {
      id: "countryStateName",
      accessorFn: (row) => row.country?.name,
      header: "Provinsi",
      enableResizing: true,
    },
    {
      id: "countryName",
      accessorFn: (row) => row.countryState?.name,
      header: "Negara",
      enableResizing: true,
    },
  ];

  if (partners.length === 0) {
    return query ? <DataNotFound /> : <DataEmpty />;
  }

  return (
    <Tabs value={tab} onValueChange={setTab} asChild>
      <main className="px-4">
        <div className="flex justify-between gap-4 p-2">
          <div className="w-80">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid2X2 />
              </TabsTrigger>
              <TabsTrigger value="table">
                <Table2 />
              </TabsTrigger>
            </TabsList>
          </div>
          <div></div>
          <div className="flex items-center justify-between gap-1">
            <DataPagination totalRecord={totalRecord} perPage={perPage} />
          </div>
        </div>
        <TabsContent value="grid">
          <DataGrid columns={columns} data={partners} />
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={partners} />
        </TabsContent>
      </main>
    </Tabs>
  );
}
