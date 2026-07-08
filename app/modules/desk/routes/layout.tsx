import { Outlet, useLocation, useMatch, useMatches } from "react-router";
import { Desk } from "../components/desk";
import DeskLayout from "../components/layout";
import type { DeskHandle } from "../types";

export default function DeskLayoutRoute() {
  const matches = useMatches();
  const rootPath = (
    matches.find((match) => (match.handle as DeskHandle)?.rootPath)
      ?.handle as DeskHandle
  )?.rootPath;

  return (
    <Desk baseUrl={rootPath || "#"}>
      <DeskLayout>
        <Outlet />
      </DeskLayout>
    </Desk>
  );
}
