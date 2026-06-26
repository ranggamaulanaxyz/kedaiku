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

const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface DataTableInnerProps<TData, TValue> extends DataTableProps<TData, TValue> {
  containerWidth: number;
}

function DataTableInner<TData, TValue>({
  columns,
  data,
  containerWidth,
}: DataTableInnerProps<TData, TValue>) {
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  const colCount = columns.length;
  const calculatedDefaultSize =
    colCount > 0 && containerWidth > 0
      ? Math.floor(containerWidth / colCount)
      : 150;

  const columnIds = columns.map((c: any) => c.id || c.accessorKey || "").join(",");

  useEffect(() => {
    setColumnSizing({});
  }, [columnIds]);

  const memoizedColumns = useMemo(() => {
    return [...columns];
  }, [columns, calculatedDefaultSize]);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      size: calculatedDefaultSize,
      minSize: 40,
    },
  });

  const isSizingLess = table.getCenterTotalSize() < containerWidth;
  const tableWidth = isSizingLess ? "100%" : table.getCenterTotalSize();

  return (
    <Table
      className="table-fixed"
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
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="truncate"
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            {isSizingLess && <TableCell className="p-0" />}
          </TableRow>
        ))}
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
    <div className="p-1">
      <div
        ref={containerRef}
        className="max-w-full overflow-auto rounded border"
      >
        {containerWidth > 0 ? (
          <DataTableInner
            columns={columns}
            data={data}
            containerWidth={containerWidth}
          />
        ) : (
          <div className="h-32 w-full animate-pulse bg-muted/50" />
        )}
      </div>
    </div>
  );
}
