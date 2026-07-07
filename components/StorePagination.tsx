import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildStoreQuery, StoreQueryState } from "@/lib/store";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

export default function StorePagination({
  basePath,
  currentPage,
  totalPages,
  queryState,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  queryState: StoreQueryState;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) =>
    `${basePath}${buildStoreQuery(queryState, { page: String(page) })}#featured`;

  return (
    <Pagination className="px-5 pb-24 md:px-16 md:pb-40">
      <PaginationContent dir="ltr">
        <PaginationItem>
          <PaginationPrevious
            text="قبلی"
            href={currentPage > 1 ? hrefFor(currentPage - 1) : undefined}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-40" : undefined}
          />
        </PaginationItem>

        {getPageNumbers(currentPage, totalPages).map((page, i) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={hrefFor(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            text="بعدی"
            href={currentPage < totalPages ? hrefFor(currentPage + 1) : undefined}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-40" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
