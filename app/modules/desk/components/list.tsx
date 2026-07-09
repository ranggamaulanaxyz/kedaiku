import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
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
import { Table2 } from "lucide-react";
import { useSearchParams } from "react-router";
import DeskPagination from "./pagination";
import DeskGridView from "./views/grid";
import { useDesk } from "~/hooks/use-desk";
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

export interface DeskActionItem<TData> {
  name: string;
  callback: (data: TData, row?: Row<TData>) => void;
  isMulti?: boolean;
  variant?: "default" | "destructive";
}

export interface DeskAction<TData> {
  [key: string]: DeskActionItem<TData>;
}

interface DeskListProps<TData, TValue> {
  fields: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    totalRecords: number;
  };
  children?: {
    key: string;
    Icon: React.ComponentType<any>;
    View: (
      row: Row<TData>,
      onRowClick: (e: React.MouseEvent, row: Row<TData>) => void,
      onRowDoubleClick: (row: Row<TData>) => void,
    ) => React.ReactNode;
  }[];
}

function DeskList<TData, TValue>({
  fields,
  data,
  children,
  meta,
}: DeskListProps<TData, TValue>) {
  const { baseUrl, actions } = useDesk<TData>();
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

  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const colCount = fields.length;
  const calculatedDefaultSize =
    colCount > 0 && containerWidth > 0
      ? Math.floor(containerWidth / colCount)
      : 150;

  const columnIds = fields
    .map((c: any) => c.id || c.accessorKey || "")
    .join(",");

  const storageKey = `desk-col-sizing:${baseUrl}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setColumnSizing(JSON.parse(stored));
      } else {
        setColumnSizing({});
      }
    } catch (e) {
      console.error(e);
      setColumnSizing({});
    }
  }, [columnIds, storageKey]);

  useEffect(() => {
    if (Object.keys(columnSizing).length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(columnSizing));
      } catch (e) {
        console.error(e);
      }
    }
  }, [columnSizing, storageKey]);

  const memoizedFields = useMemo(() => {
    return [...fields];
  }, [fields, calculatedDefaultSize]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    columns: memoizedFields,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      columnSizing,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      size: calculatedDefaultSize,
      minSize: 40,
    },
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
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

  const handleRowDoubleClick = (row: Row<TData>) => {
    if (actions?.open) {
      actions.open.callback(row.original, row);
    }
  };

  const views = useMemo(() => {
    return children ? children : [];
  }, [children, data]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const defaultView = useMemo(() => {
    const hasGrid = views.some((view) => view.key === "grid");
    return isMobile && hasGrid ? "grid" : "table";
  }, [isMobile, views]);

  const viewMode = useMemo(() => {
    const currentParam = searchParams.get("view");
    const isValidView =
      currentParam === "table" || views.some((v) => v.key === currentParam);
    return isValidView ? currentParam! : defaultView;
  }, [searchParams, views, defaultView]);

  const setViewMode = (newVal: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newVal);
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const currentParam = searchParams.get("view");
    const isValidView =
      currentParam === "table" || views.some((v) => v.key === currentParam);
    if (!isValidView) {
      const params = new URLSearchParams(searchParams);
      params.set("view", defaultView);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, defaultView, views]);

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
        <DeskTable
          table={table}
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClick}
          containerWidth={containerWidth}
        />
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
                  {view.View(row, handleRowClick, handleRowDoubleClick)}
                </DeskContextMenu>
              ))}
            </ViewComponent>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

export { DeskList };
