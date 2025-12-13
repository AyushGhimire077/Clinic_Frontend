interface PaginationProps {
  currentPage: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPages?: number; // optional, default 5
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPages = 5,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const half = Math.floor(maxPages / 2);
  let start = Math.max(0, currentPage - half);
  let end = Math.min(totalPages - 1, start + maxPages - 1);

  if (end - start < maxPages - 1) {
    start = Math.max(0, end - maxPages + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg ${
            currentPage === page
              ? "bg-primary text-white"
              : "border border-border hover:bg-surface"
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
      >
        Last
      </button>
    </div>
  );
};
