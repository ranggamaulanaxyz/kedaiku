import { Plus, Search } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import { LayoutHeader } from "~/modules/layout/components/header";
import type { RouteHandle } from "~/modules/layout/types";

export const handle: RouteHandle = {
  breadcrumb: () => "Kontak",
};

export default function PartnerRoute() {
  const handleSave = () => {};
  return (
    <Fragment>
      <LayoutHeader>
        <InputGroup>
          <InputGroupInput placeholder="Ketik disini untuk mencari..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={handleSave}>Simpan</Button>
        <Button asChild>
          <Link to="new">Tambah</Link>
        </Button>
      </LayoutHeader>
      <Outlet />
    </Fragment>
  );
}
