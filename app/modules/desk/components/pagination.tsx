import { useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface DeskPaginationProps {
  totalRecords: number;
}

export default function DeskPagination({ totalRecords }: DeskPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const parsedOffset = Number(searchParams.get("offset"));
  const parsedLimit = Number(searchParams.get("limit"));

  const offset = isNaN(parsedOffset) || parsedOffset <= 0 ? 1 : parsedOffset;
  const limit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

  const prevOffset = Math.max(1, offset - limit);
  const nextOffset = offset + limit;

  const hasPrev = offset > 1;
  const hasNext = offset + limit <= totalRecords;

  const getPageUrl = (newOffset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", String(newOffset));
    params.set("limit", String(limit));
    return `?${params.toString()}`;
  };

  const handleOffsetChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    if (!isNaN(val) && val > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("offset", String(val));
      setSearchParams(params);
    }
  };

  const handleLimitChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    if (!isNaN(val) && val > offset) {
      const newLimit = val - offset + 1;
      const params = new URLSearchParams(searchParams);
      params.set("limit", String(newLimit));
      setSearchParams(params);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
        <Input
          type="number"
          key={`offset-${offset}`}
          defaultValue={offset}
          onBlur={handleOffsetChange}
          onKeyDown={handleKeyDown}
          className="h-8 w-12 [appearance:textfield] px-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span>-</span>
        <Input
          type="number"
          key={`limit-${offset}-${limit}`}
          defaultValue={Math.min(totalRecords, offset + limit - 1)}
          onBlur={handleLimitChange}
          onKeyDown={handleKeyDown}
          className="h-8 w-16 [appearance:textfield] px-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="mx-0.5">/</span>
        <span className="text-foreground font-medium">{totalRecords}</span>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            text="Sebelumnya"
            to={hasPrev ? getPageUrl(prevOffset) : "#"}
            className={!hasPrev ? "pointer-events-none opacity-50" : ""}
            tabIndex={!hasPrev ? -1 : undefined}
            aria-disabled={!hasPrev}
          />
          <PaginationNext
            text="Selanjutnya"
            to={hasNext ? getPageUrl(nextOffset) : "#"}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
            tabIndex={!hasNext ? -1 : undefined}
            aria-disabled={!hasNext}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
