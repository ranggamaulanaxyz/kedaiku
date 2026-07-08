import { Outlet } from "react-router";
import { Desk } from "../components/desk";
import DeskLayout from "../components/layout";

export default function DeskLayoutRoute() {
  return (
    <Desk>
      <DeskLayout>
        <Outlet />
      </DeskLayout>
    </Desk>
  );
}
