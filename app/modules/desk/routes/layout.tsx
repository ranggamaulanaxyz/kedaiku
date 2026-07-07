import { Outlet } from "react-router";
import { Desk } from "../components/desk";

export default function DeskLayoutRoute() {
  return (
    <Desk>
      <Outlet />
    </Desk>
  );
}
