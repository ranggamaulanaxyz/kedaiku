import { useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useNavigate, useNavigation } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "~/components/ui/context-menu";
import { toast } from "sonner";

const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface DataTableInnerProps<TData, TValue> extends DataTableProps<
  TData,
  TValue
> {
  containerWidth: number;
}

function DataTableInner<TData, TValue>({
  columns,
  data,
  containerWidth,
}: DataTableInnerProps<TData, TValue>) {
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );

  const navigate = useNavigate();

  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const colCount = columns.length;
  const calculatedDefaultSize =
    colCount > 0 && containerWidth > 0
      ? Math.floor(containerWidth / colCount)
      : 150;

  const columnIds = columns
    .map((c: any) => c.id || c.accessorKey || "")
    .join(",");

  useEffect(() => {
    setColumnSizing({});
  }, [columnIds]);

  useEffect(() => {
    if (Object.keys(rowSelection).length === 0) {
      setLastSelectedIndex(null);
    }
  }, [rowSelection]);

  const memoizedColumns = useMemo(() => {
    return [...columns];
  }, [columns, calculatedDefaultSize]);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: {
      columnSizing,
      rowSelection,
    },
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      size: calculatedDefaultSize,
      minSize: 40,
    },
  });

  const isSizingLess = table.getCenterTotalSize() < containerWidth;
  const tableWidth = isSizingLess ? "100%" : table.getCenterTotalSize();

  const openRows = (targetRow?: any) => {
    const selectedRows = table.getSelectedRowModel().rows;

    // If targetRow is not in selected rows, open just targetRow
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
      // Multi-selection: open each in a new tab
      selectedRows.forEach((r) => {
        console.log("test");
        window.open(`/app/partners/${(r.original as any).id}`, "_blank");
      });
    }
  };

  const copySelectedRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    // Format headers and rows
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
    <Table
      className="table-fixed outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: tableWidth,
      }}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="group relative truncate select-none"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`hover:bg-primary/50 absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none ${
                      header.column.getIsResizing() ? "bg-primary w-1" : ""
                    }`}
                  />
                )}
              </TableHead>
            ))}
            {isSizingLess && <TableHead className="p-0" />}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, rowIndex) => (
            <TableRow key={`skeleton-row-${rowIndex}`}>
              {table.getVisibleFlatColumns().map((column, colIndex) => (
                <TableCell
                  key={`skeleton-col-${colIndex}`}
                  style={{ width: column.getSize() }}
                >
                  <Skeleton className="my-1 h-4 w-[80%]" />
                </TableCell>
              ))}
              {isSizingLess && <TableCell className="p-0" />}
            </TableRow>
          ))
        ) : table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={
                table.getVisibleFlatColumns().length + (isSizingLess ? 1 : 0)
              }
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <ContextMenu key={row.id}>
              <ContextMenuTrigger asChild>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
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
                      // Toggle selection
                      row.toggleSelected(!row.getIsSelected());
                    } else {
                      // Single selection
                      table.resetRowSelection();
                      row.toggleSelected(true);
                    }
                    setLastSelectedIndex(currentIndex);
                  }}
                  onDoubleClick={() => openRows(row)}
                  onContextMenu={(e) => {
                    if (!row.getIsSelected()) {
                      table.resetRowSelection();
                      row.toggleSelected(true);
                      setLastSelectedIndex(row.index);
                    }
                  }}
                  className="cursor-pointer select-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="truncate"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {isSizingLess && <TableCell className="p-0" />}
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => openRows(row)}>
                  Open
                  {table.getSelectedRowModel().rows.length > 1
                    ? ` (${table.getSelectedRowModel().rows.length} items)`
                    : ""}
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={() => {
                    alert(
                      `Edit partner: ${(row.original as any).name || row.id}`,
                    );
                  }}
                >
                  Edit
                </ContextMenuItem>
                <ContextMenuItem onSelect={copySelectedRows}>
                  Copy
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={() => {
                    alert(
                      `Delete partner: ${(row.original as any).name || row.id}`,
                    );
                  }}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useSafeLayoutEffect(() => {
    if (!containerRef.current) return;

    // Measure layout width synchronously on client mount
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-full overflow-auto">
      {containerWidth > 0 ? (
        <DataTableInner
          columns={columns}
          data={data}
          containerWidth={containerWidth}
        />
      ) : (
        <div className="space-y-4 p-4">
          <div className="flex gap-4">
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </div>
  );
}
