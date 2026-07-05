import { useRef, useState, useEffect, useMemo } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useNavigate } from "react-router";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "~/components/ui/context-menu";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataGrid<TData, TValue>({
  columns,
  data,
}: DataGridProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );

  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(rowSelection).length === 0) {
      setLastSelectedIndex(null);
    }
  }, [rowSelection]);

  const memoizedColumns = useMemo(() => {
    return [...columns];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const openRows = (targetRow?: Row<TData>) => {
    const selectedRows = table.getSelectedRowModel().rows;

    if (targetRow && !targetRow.getIsSelected()) {
      navigate(`/app/partners/${(targetRow.original as any).id}`);
      return;
    }

    if (selectedRows.length === 0) {
      if (targetRow) {
        navigate(`/app/partners/${(targetRow.original as any).id}`);
      }
      return;
    }

    if (selectedRows.length === 1) {
      navigate(`/app/partners/${(selectedRows[0].original as any).id}`);
    } else {
      selectedRows.forEach((r) => {
        window.open(`/app/partners/${(r.original as any).id}`, "_blank");
      });
    }
  };

  const selectRow = (e: React.MouseEvent, row: Row<TData>) => {
    const rows = table.getRowModel().rows;
    const currentIndex = row.index;

    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const newSelection: Record<string, boolean> = {};

      if (e.metaKey || e.ctrlKey) {
        Object.assign(newSelection, rowSelection);
      }

      for (let i = start; i <= end; i++) {
        newSelection[rows[i].id] = true;
      }
      setRowSelection(newSelection);
    } else if (e.metaKey || e.ctrlKey) {
      row.toggleSelected(!row.getIsSelected());
    } else {
      table.resetRowSelection();
      row.toggleSelected(true);
    }
    setLastSelectedIndex(currentIndex);
  };

  const resetSelectedRow = (row: Row<TData>) => {
    if (!row.getIsSelected()) {
      table.resetRowSelection();
      row.toggleSelected(true);
      setLastSelectedIndex(row.index);
    }
  };

  const copySelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const headers = table
      .getVisibleFlatColumns()
      .map((col) => {
        const def = col.columnDef;
        return typeof def.header === "string"
          ? def.header
          : String((def as any).accessorKey || col.id);
      })
      .join("\t");

    const rowsText = selectedRows
      .map((row) => {
        return row
          .getVisibleCells()
          .map((cell) => {
            return String(cell.getValue() ?? "");
          })
          .join("\t");
      })
      .join("\n");

    const textToCopy = `${headers}\n${rowsText}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success(
          `Copied ${selectedRows.length} row${selectedRows.length > 1 ? "s" : ""} to clipboard`,
        );
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      const selectedRows = table.getSelectedRowModel().rows;
      if (selectedRows.length > 0) {
        e.preventDefault();
        copySelectedRows();
      }
    }
  };

  return (
    <div
      ref={gridRef}
      className="outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {table.getRowModel().rows.map((row) => {
          const partner = row.original as any;
          const isSelected = row.getIsSelected();
          return (
            <ContextMenu key={row.id}>
              <ContextMenuTrigger asChild>
                <Item
                  variant="outline"
                  onClick={(e) => selectRow(e, row)}
                  onDoubleClick={() => openRows(row)}
                  onContextMenu={() => resetSelectedRow(row)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 select-none",
                    isSelected
                      ? "bg-accent border-primary/40 ring-primary/20 shadow-sm ring-1"
                      : "hover:bg-muted/50",
                  )}
                >
                  <ItemMedia>
                    <Avatar>
                      <AvatarImage src="https://github.com/evilrabbit.png" />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{partner.name}</ItemTitle>
                    <ItemDescription>
                      <span>{partner.email}</span>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions></ItemActions>
                </Item>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {table.getSelectedRowModel().rows.length <= 1 && (
                  <ContextMenuItem onSelect={() => openRows(row)}>
                    Buka
                  </ContextMenuItem>
                )}
                <ContextMenuItem onSelect={copySelectedRows}>
                  Salin
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={() => {
                    alert(`Delete partner: ${partner.name || row.id}`);
                  }}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  Hapus
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
}
