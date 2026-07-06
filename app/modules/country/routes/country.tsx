import { Desk } from "~/components/desk/desk";
import { Outlet } from "react-router";

export default function CountryRoute() {
  return (
    <Desk>
      <Outlet />
    </Desk>
  );
}
