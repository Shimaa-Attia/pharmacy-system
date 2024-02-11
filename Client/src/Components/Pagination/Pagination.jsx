import React from 'react'

export default function Pagination({ currentPage, pagination ,handlePageChange }) {
  if (!pagination) return null;
  const totalPages = pagination.last_page;
  const maxVisiblePages = 3;

  let startPage = 1;
  let endPage = Math.min(totalPages, maxVisiblePages);

  if (currentPage > Math.floor(maxVisiblePages / 2)) {
    startPage = currentPage - Math.floor(maxVisiblePages / 2);
    endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        className={`btn ${currentPage === i ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="btn-group">
      <button
        className="btn btn-outline-primary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        السابق
      </button>
      {pages}
      <button
        className="btn btn-outline-primary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        التالي
      </button>
    </div>
  );
  
    return (
      <></>
   
    );
}
