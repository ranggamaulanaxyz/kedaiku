import {
  flexRender,
  type HeaderGroup,
  type Table as ReactTable,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeskContextMenu } from "../menu/context-menu";

interface DeskTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
  isSizingLess?: boolean;
}

function DeskTableHeader<TData>({ headerGroups, isSizingLess }: DeskTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
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
  );
}

interface DeskTableBodyProps<TData> {
  rows: Row<TData>[];
  onRowClick: (e: React.MouseEvent, row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  isMultiSelected?: boolean;
  isSizingLess?: boolean;
}
function DeskTableBody<TData>({
  rows,
  onRowClick,
  onRowDoubleClick,
  isMultiSelected,
  isSizingLess,
}: DeskTableBodyProps<TData>) {
  return (
    <TableBody>
      {rows.map((row) => (
        <DeskContextMenu
          key={row.id}
          row={row}
          isMultiSelected={isMultiSelected}
        >
          <TableRow
            data-state={row.getIsSelected() && "selected"}
            onClick={(e) => onRowClick(e, row)}
            onDoubleClick={() => onRowDoubleClick?.(row)}
            className="cursor-pointer select-none"
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
        </DeskContextMenu>
      ))}
    </TableBody>
  );
}

interface DeskTableProps<TData> {
  table: ReactTable<TData>;
  onRowClick: (e: React.MouseEvent, row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  containerWidth?: number;
}

function DeskTable<TData>({
  table,
  onRowClick,
  onRowDoubleClick,
  containerWidth = 0,
}: DeskTableProps<TData>) {
  const isMultiSelected = table.getSelectedRowModel().rows.length > 1;
  const isSizingLess = containerWidth > 0 ? table.getCenterTotalSize() < containerWidth : false;
  const tableWidth = isSizingLess ? "100%" : table.getCenterTotalSize();

  return (
    <Table
      className="table-fixed outline-none"
      style={{
        width: tableWidth,
      }}
    >
      <DeskTableHeader
        headerGroups={table.getHeaderGroups()}
        isSizingLess={isSizingLess}
      />
      <DeskTableBody
        rows={table.getRowModel().rows}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        isMultiSelected={isMultiSelected}
        isSizingLess={isSizingLess}
      />
    </Table>
  );
}

export { DeskTable };
