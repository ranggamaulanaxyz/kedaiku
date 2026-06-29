import { Search } from "lucide-react";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import { LayoutHeader } from "~/modules/layout/components/header";

export default function PartnerLayoutRoute() {
  return (
    <Fragment>
      <LayoutHeader>
        <InputGroup>
          <InputGroupInput placeholder="Type contact name, email or phone number" />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </LayoutHeader>
      <Outlet />
    </Fragment>
  );
}
