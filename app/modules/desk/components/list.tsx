import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type HeaderGroup,
  type Table as ReactTable,
  type Row,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useIsMobile } from "~/hooks/use-mobile";
import { Grid2X2, Table2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface DeskTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
}

function DeskTableHeader<TData>({ headerGroups }: DeskTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

interface DeskTableBodyProps<TData> {
  rows: Row<TData>[];
}
function DeskTableBody<TData>({ rows }: DeskTableBodyProps<TData>) {
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

interface DeskTableProps<TData> {
  table: ReactTable<TData>;
}

function DeskTable<TData>({ table }: DeskTableProps<TData>) {
  return (
    <Table>
      <DeskTableHeader headerGroups={table.getHeaderGroups()} />
      <DeskTableBody rows={table.getRowModel().rows} />
    </Table>
  );
}

interface DeskListProps<TData, TValue> {
  fields: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: {
    key: string;
    Icon: React.ComponentType<any>;
    View: (data: TData) => React.ReactNode;
  }[];
}

function DeskList<TData, TValue>({
  fields,
  data,
  children,
}: DeskListProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<string>("table");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
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

  const memoizedFields = useMemo(() => {
    return [...fields];
  }, []);

  const table = useReactTable({
    columns: memoizedFields,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });

  const views = useMemo(() => {
    return children ? children : [];
  }, [children, data]);

  useEffect(() => {
    const hasGrid = views.some((view) => view.key === "grid");
    setViewMode(isMobile && hasGrid ? "grid" : "table");
  }, [isMobile, views]);

  return (
    <Tabs value={viewMode} onValueChange={setViewMode}>
      <div className="flex items-center justify-between">
        <div>
          <TabsList>
            <TabsTrigger value="table">
              <Table2 />
            </TabsTrigger>
            {views.map((view) => {
              const Icon = view.Icon;
              return (
                <TabsTrigger key={view.key} value={view.key}>
                  <Icon className="h-4 w-4" />
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>
      <div ref={containerRef} className="overflow-auto">
        <TabsContent value="table">
          <DeskTable table={table} />
        </TabsContent>
        {views.map((view) => (
          <TabsContent key={view.key} value={view.key}>
            {data.map((value) => view.View(value))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

export { DeskList };
