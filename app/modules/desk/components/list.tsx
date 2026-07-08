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
import { Grid2X2, Table2, View } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import DeskPagination from "./pagination";
import DeskGridView from "./views/grid";
import { useDesk } from "~/hooks/use-desk";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { DeskTable } from "./views/table";
import { DeskContextMenu } from "./menu/context-menu";

const viewComponents: Record<
  string,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  grid: DeskGridView,
};

interface ViewComponentProps {
  mode: string;
  children: React.ReactNode;
}

function ViewComponent({ mode, children }: ViewComponentProps) {
  if (viewComponents[mode]) {
    const View = viewComponents[mode];
    return <View>{children}</View>;
  }
  return children;
}

interface DeskActionItem<TData> {
  name: string;
  callback: (row: Row<TData>) => void;
  isMulti?: boolean;
  variant?: "default" | "destructive";
}

interface DeskAction<TData> {
  [key: string]: DeskActionItem<TData>;
}

interface DeskListProps<TData, TValue> {
  fields: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    actions?: DeskAction<TData>;
    totalRecords: number;
  };
  children?: {
    key: string;
    Icon: React.ComponentType<any>;
    View: (
      row: Row<TData>,
      onRowClick: (e: React.MouseEvent, row: Row<TData>) => void,
    ) => React.ReactNode;
  }[];
}

function DeskList<TData, TValue>({
  fields,
  data,
  children,
  meta,
}: DeskListProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!tableContainerRef.current) return;

    // Measure layout width synchronously on client mount
    setContainerWidth(tableContainerRef.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(tableContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const memoizedFields = useMemo(() => {
    return [...fields];
  }, []);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    columns: memoizedFields,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );
  const handleRowClick = (e: React.MouseEvent, row: Row<TData>) => {
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
  };

  const views = useMemo(() => {
    return children ? children : [];
  }, [children, data]);

  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<string>("table");

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
        <div>
          <DeskPagination totalRecords={meta.totalRecords} />
        </div>
      </div>
      <TabsContent
        ref={tableContainerRef}
        value="table"
        className="overflow-auto rounded-xl border"
      >
        <DeskTable table={table} onRowClick={handleRowClick} />
      </TabsContent>
      {views.map((view) => {
        const isMultiSelected = table.getSelectedRowModel().rows.length > 1;
        return (
          <TabsContent key={view.key} value={view.key}>
            <ViewComponent mode={view.key}>
              {table.getRowModel().rows.map((row) => (
                <DeskContextMenu
                  key={row.id}
                  row={row}
                  isMultiSelected={isMultiSelected}
                >
                  {view.View(row, handleRowClick)}
                </DeskContextMenu>
              ))}
            </ViewComponent>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export { type DeskAction, DeskList };
