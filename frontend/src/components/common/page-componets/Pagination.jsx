import React from "react";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import ReactPaginate from "react-paginate";

const Pagination = ({ currentPage, rowsPerPage, totalPages, onPageChange }) => {
  const handlePageClick = (e) => {
    onPageChange(e.selected); // Send the selected page to the parent
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<FiChevronsRight />}
      onPageChange={handlePageClick}
      pageRangeDisplayed={2}
      pageCount={totalPages}
      forcePage={currentPage} // Keeps current page synced
      previousLabel={<FiChevronsLeft />}
      containerClassName="wb-pagination"
      pageClassName="pagination-item"
      pageLinkClassName="pagination-link"
      activeClassName="pagination-link-active"
      previousLinkClassName="prev"
      nextLinkClassName="next"
      disabledClassName="disabled"
    />
  );
};

export default Pagination;
