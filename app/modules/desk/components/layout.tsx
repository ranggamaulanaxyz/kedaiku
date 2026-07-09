import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DeskSidebar from "./sidebar";
import { DeskHeader } from "./header";
import { DeskSearch } from "./search";
import { useDesk } from "~/hooks/use-desk";
import { Button } from "~/components/ui/button";
import { Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router";
import {
  BlockerAlert,
  ButtonWithAlert,
} from "./alert";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DeskLayout({ children }: LayoutProps) {
  const {
    saveHandler,
    discardHandler,
    isDirty,
    isEditMode,
    isCreateMode,
    baseUrl,
    blocker,
  } = useDesk();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DeskSidebar />
      <SidebarInset className="min-w-0">
        <DeskHeader>
          <div className="flex items-center gap-2">
            <DeskSearch />
          </div>
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Fragment>
                <Button onClick={saveHandler}>Simpan</Button>
                {isDirty ? (
                  <ButtonWithAlert
                    title="Apa kamu yakin?"
                    description="Perubahan saat ini akan hilang jika kamu membatalkannya"
                    variant="outline"
                    onClick={discardHandler}
                  >
                    Batalkan
                  </ButtonWithAlert>
                ) : (
                  <Button variant="outline" onClick={discardHandler}>
                    Batalkan
                  </Button>
                )}
              </Fragment>
            ) : (
              <Button asChild>
                <Link to={`${baseUrl}/new`}>Tambah</Link>
              </Button>
            )}
          </div>
        </DeskHeader>
        <div className="p-4">{children}</div>
      </SidebarInset>
      <BlockerAlert
        title="Perubahan belum disimpan"
        description="Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
        blocker={blocker}
      />
    </SidebarProvider>
  );
}
