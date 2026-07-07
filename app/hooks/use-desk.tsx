import { useContext } from "react";
import { DeskContext } from "~/modules/desk/components/desk";

export function useDesk() {
  const context = useContext(DeskContext);
  if (!context) {
    throw new Error(
      "useDeskContext must be used within a Desk component/Provider",
    );
  }
  return context;
}
