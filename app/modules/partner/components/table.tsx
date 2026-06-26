import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function DataTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor HP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Rangga Maulana</TableCell>
            <TableCell>ranggamxyz@gmail.com</TableCell>
            <TableCell>081371837223</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
