import { useSearchParams, useNavigate, useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Field, FieldLabel } from "~/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface DataPaginationProps {
  totalRecord: number;
  perPage: number;
}

function DataPagination({ totalRecord, perPage }: DataPaginationProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = Number(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalRecord / perPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("perPage", value);
    params.set("page", "1"); // Reset to page 1
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const fromRecord = totalRecord === 0 ? 0 : (page - 1) * perPage + 1;
  const toRecord = Math.min(page * perPage, totalRecord);

  return (
    <div className="flex items-center gap-6">
      <span className="text-muted-foreground text-sm whitespace-nowrap">
        Menampilkan {fromRecord}-{toRecord} dari {totalRecord}
      </span>

      <Field orientation="horizontal" className="w-fit">
        <FieldLabel
          htmlFor="rows-per-page"
          className="text-muted-foreground text-sm text-nowrap"
        >
          Baris per halaman
        </FieldLabel>
        <Select value={String(perPage)} onValueChange={handlePerPageChange}>
          <SelectTrigger className="w-20" id="rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page - 1);
              }}
              style={{
                pointerEvents: page <= 1 ? "none" : "auto",
                opacity: page <= 1 ? 0.5 : 1,
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm font-medium whitespace-nowrap">
              Halaman {page} dari {totalPages || 1}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page + 1);
              }}
              style={{
                pointerEvents: page >= totalPages ? "none" : "auto",
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { DataPagination };
