"use client";

import { Button } from "@/components/ui/button";

type ProductPaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function ProductPagination({
  page,
  total,
  limit,
  onPageChange,
}: ProductPaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(total / limit),
  );

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  if (total <= limit) {
    return null;
  }

  return (
    <nav
      aria-label="Product pagination"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-background/60 p-4"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!hasPreviousPage}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={!hasNextPage}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
