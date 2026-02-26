import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Paginate({ pageCount, onPress, activePage }) {
  const [currentPage, setCurrentPage] = useState(0); // Default to 0-indexed initial page

  const convertToArabicNumbers = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number
      .toString()
      .split("")
      .map((digit) => arabicNumbers[parseInt(digit, 10)])
      .join("");
  };

  // Set the initial active page from the `activePage` prop
  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage - 1); // Convert 1-indexed `activePage` to 0-indexed
    }
  }, [activePage]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected); // Update the internal state
    onPress(e.selected + 1); // Pass 1-indexed page to the parent component
  };

  return (
    <div className="paginate paginateGeneral">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <>
            <span className="nextText">التالي</span>
            <FontAwesomeIcon icon={faArrowLeft} className="nextIcon" />
          </>
        }
        previousLabel={
          <>
            <FontAwesomeIcon icon={faArrowRight} className="prevIcon" />
            <span className="prevText">السابق</span>
          </>
        }
        onPageChange={handlePageClick}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        forcePage={currentPage} // Force the initial page (then managed internally)
        containerClassName="pagination justify-content-center p-3"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link_arrow page-link"
        nextLinkClassName="page-link_arrow_next page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
        renderOnZeroPageCount={null}
        pageLabelBuilder={(page) => convertToArabicNumbers(page)}
      />
    </div>
  );
}