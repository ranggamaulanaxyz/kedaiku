import { ArrowUpRightIcon, FolderCode } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

function DataEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>Belum Ada Kontak</EmptyTitle>
        <EmptyDescription>
          Anda belum memiliki kontak. Mulailah dengan membuat kontak pertama
          Anda.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link to="/app/partners/new">Tambah Kontak</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function DataNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Hasil</EmptyTitle>
        <EmptyDescription>
          Anda belum memiliki kontak. Mulailah dengan membuat kontak pertama
          Anda.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link to="/app/partners/new">Tambah Kontak</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/app/partners">Hapus Filter</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { DataEmpty, DataNotFound };
