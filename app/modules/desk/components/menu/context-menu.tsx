import type { Row } from "@tanstack/react-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useDesk } from "~/hooks/use-desk";

interface DeskContextProps<TData> {
  row: Row<TData>;
  children: React.ReactNode;
  isMultiSelected?: boolean;
}

function DeskContextMenu<TData>({
  children,
  row,
  isMultiSelected,
}: DeskContextProps<TData>) {
  const { actions } = useDesk<TData>();

  if (!actions) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          {actions &&
            Object.entries(actions)
              .filter(([_, action]) => !isMultiSelected || action.isMulti)
              .map(([id, action]) => (
                <ContextMenuItem
                  key={id}
                  onClick={() => action.callback(row.original, row)}
                  variant={action.variant}
                >
                  {action.name}
                </ContextMenuItem>
              ))}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export { DeskContextMenu };
