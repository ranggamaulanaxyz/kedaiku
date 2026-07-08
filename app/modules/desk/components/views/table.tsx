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
  onRowClick: (e: React.MouseEvent, row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  isMultiSelected?: boolean;
}
function DeskTableBody<TData>({
  rows,
  onRowClick,
  onRowDoubleClick,
  isMultiSelected,
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
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
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
}

function DeskTable<TData>({
  table,
  onRowClick,
  onRowDoubleClick,
}: DeskTableProps<TData>) {
  const isMultiSelected = table.getSelectedRowModel().rows.length > 1;
  return (
    <Table>
      <DeskTableHeader headerGroups={table.getHeaderGroups()} />
      <DeskTableBody
        rows={table.getRowModel().rows}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        isMultiSelected={isMultiSelected}
      />
    </Table>
  );
}

export { DeskTable };
