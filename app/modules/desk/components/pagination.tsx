import { useEffect } from "react";
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

  const limit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;
  const maxOffset = totalRecords > 0 ? Math.max(1, totalRecords - limit + 1) : 1;
  const offset =
    isNaN(parsedOffset) || parsedOffset <= 0
      ? 1
      : parsedOffset > maxOffset
        ? maxOffset
        : parsedOffset;

  const prevOffset = Math.max(1, offset - limit);
  const nextOffset = offset + limit;

  const hasPrev = offset > 1;
  const hasNext = offset + limit <= totalRecords;

  useEffect(() => {
    const rawOffset = searchParams.get("offset");
    const rawLimit = searchParams.get("limit");

    const newParams = new URLSearchParams(searchParams);
    let changed = false;

    if (
      rawOffset === null ||
      isNaN(Number(rawOffset)) ||
      Number(rawOffset) <= 0 ||
      Number(rawOffset) > maxOffset ||
      Number(rawOffset) !== offset
    ) {
      newParams.set("offset", String(offset));
      changed = true;
    }

    if (
      rawLimit === null ||
      isNaN(Number(rawLimit)) ||
      Number(rawLimit) <= 0 ||
      Number(rawLimit) !== limit
    ) {
      newParams.set("limit", String(limit));
      changed = true;
    }

    if (changed) {
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, offset, limit, maxOffset]);

  const getPageUrl = (newOffset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", String(newOffset));
    params.set("limit", String(limit));
    return `?${params.toString()}`;
  };

  const handleOffsetChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    if (!isNaN(val) && val > 0) {
      const targetOffset = val > maxOffset ? maxOffset : val;
      const params = new URLSearchParams(searchParams);
      params.set("offset", String(targetOffset));
      setSearchParams(params);
    } else {
      e.currentTarget.value = String(offset);
    }
  };

  const handleLimitChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    if (!isNaN(val) && val >= offset) {
      const cappedVal = totalRecords > 0 ? Math.min(totalRecords, val) : val;
      const newLimit = cappedVal - offset + 1;
      const params = new URLSearchParams(searchParams);
      params.set("limit", String(newLimit));
      setSearchParams(params);
    } else {
      e.currentTarget.value = String(Math.min(totalRecords, offset + limit - 1));
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
          disabled={totalRecords === 0}
          className="h-8 w-12 [appearance:textfield] px-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span>-</span>
        <Input
          type="number"
          key={`limit-${offset}-${limit}`}
          defaultValue={Math.min(totalRecords, offset + limit - 1)}
          onBlur={handleLimitChange}
          onKeyDown={handleKeyDown}
          disabled={totalRecords === 0}
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
