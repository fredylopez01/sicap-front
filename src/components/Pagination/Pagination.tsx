import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./Pagination.css";
import { IPagination } from "../../interfaces/Pagination";
import { FiltersRecord } from "@/interfaces";

interface PaginationProps {
  pagination: IPagination;
  setFilters: React.Dispatch<React.SetStateAction<FiltersRecord>>;
}

export function Pagination({ pagination, setFilters }: PaginationProps) {
  const { totalPages, currentPage, totalRecords } = pagination;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilters((prev: any) => ({ ...prev, page }));
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <span>({totalRecords} registros)</span>
      </div>

      <div className="pagination-buttons">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Primera página"
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="pagination-current">{currentPage}</span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Siguiente"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
