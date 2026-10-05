import styles from "../Pagination/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.pagination}>
      {/* THÔNG TIN */}
      <span>
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems}
      </span>

      {/* NÚT PHÂN TRANG */}
      <div className={styles.paginationButtons}>
        {/* PREVIOUS */}
        <button
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>

        {/* PAGE NUMBER */}
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              className={currentPage === page ? styles.current : ""}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}