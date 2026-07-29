import type { FilterPagination } from "@/modules/shared/FilterType";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface PaginationProps extends FilterPagination {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationApp = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const currentPage = page;
  const siblingCount = 1;

  const generatePageNumbers = (): (number | "ellipsis")[] => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    const pages: (number | "ellipsis")[] = [1];

    if (showLeftEllipsis) {
      pages.push("ellipsis");
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push("ellipsis");
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i);
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = generatePageNumbers();

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (e: React.MouseEvent, p: number) => {
    e.preventDefault();
    if (p !== currentPage) onPageChange(p);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === currentPage}
                onClick={(e) => handlePageClick(e, p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationApp;