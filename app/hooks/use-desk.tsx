import { useContext } from "react";
import { DeskContext } from "~/modules/desk/components/desk";

export function useDesk<TData>() {
  const context = useContext(DeskContext);
  if (!context) {
    throw new Error(
      "useDeskContext must be used within a Desk component/Provider",
    );
  }
  return context as DeskContext<TData>;
}

// interface DeskFormOptions<TData> {
//   defaultValues: TData;
// }

// export function useDeskForm<TData>({ defaultValues }: DeskFormOptions) {}
