// src/components/ui/Pagination.jsx
export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="rounded border border-deepPurple px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="rounded border border-deepPurple px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
