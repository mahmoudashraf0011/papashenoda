import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import { ReactReader } from 'react-reader';
import { Link } from 'react-router-dom';
import "./BooksCateMainRes.css"

export const SkeletonBookCard = () => (
  <div className="skeleton-book-card-container">
    <div className="skeleton-book-card">
      <div className="books-section-one-info">
        <Skeleton height={30} width="100%" style={{ marginBottom: '10px' }} />
        <Skeleton height={20} width="80%" style={{ marginBottom: '10px' }} />
        <div className="book-links">
          <Skeleton height={40} width="60%" style={{ marginBottom: '10px' }} />
          <Skeleton height={40} width="60%" style={{ marginBottom: '10px' }} />
        </div>
      </div>
      <Skeleton height={200} width="100%" className="skeleton-book-img" />
    </div>
  </div>
);
const styles = `
  .skeleton-book-card-container {
    display: flex;
    justify-content: center; /* Centering horizontally */
    align-items: center; /* Centering vertically */
    width: 100%;
    height: 100vh; /* Full viewport height */
    padding: 20px;
    box-sizing: border-box;  /* To ensure padding is included in the total width/height */
  }

  .skeleton-book-card {
    width: 90%; /* Increased width for each card */
    max-width: 500px; /* Max width to prevent too large cards */
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }

  .skeleton-book-img {
    margin-top: 15px;
    border-radius: 8px;
  }

  .books-section-one-info {
    padding: 15px 0;
  }

  .book-links {
    margin-top: 10px;
  }

  .skeleton-book-card-container .skeleton-book-card + .skeleton-book-card {
    margin-top: 20px;
  }
`;

export default function OneBook({ info, src, book, book_id, slug }) {
  const [showReader, setShowReader] = useState(false);

  const openReader = () => {
    if (book) {
      setShowReader(true);
    } else {
      alert("No book URL provided.");
    }
  };
  const getBook = () => {
    if (book) {
      const bookData = {
        info: info,
        book: book,
        book_id: book_id,
        slug: slug
      };

      // Store the book data in localStorage as a JSON string
      localStorage.setItem("book", JSON.stringify(bookData));
    }
  };
  // const getBook = () => {
  //     if (book && book_id) {
  //         const bookData = {
  //             info: info,
  //             book: book,
  //             book_id: book_id
  //         };
  //         localStorage.setItem("book", JSON.stringify(bookData));
  //     } else {
  //         console.error("Cannot store book data: book or book_id is missing", { book, book_id });
  //         alert("Book cannot be opened due to missing data.");
  //     }
  // };
  const sampleBookUrl = "https://s3.amazonaws.com/moby-dick/moby-dick.epub";
  const words = info.split(" ");
  const preview = words.slice(0, 5).join(" ");
  const rest = words.slice(5).join(" ");

  return (
    <div className="books-section-one-books-info" style={{ marginRight: "50%", gap: "60px" }}>
      <div className="books-section-one-info">
        {/* <div className="books-section-one-stars">
                    <img src="/assets/star.png" alt="" />
                    <img src="/assets/star.png" alt="" />
                    <img src="/assets/star.png" alt="" />
                </div> */}
        {/* <div className='books-section-one-save' style={{ direction: "rtl", marginTop: "12%" }}><p>
          <Link to={`/displayBook/${slug}`} onClick={getBook} style={{ cursor: "pointer" }}>{info}
          </Link></p>
        </div> */}
        <div
          style={{
            direction: "rtl",
            marginTop: "11%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            /* gap: "4px", */
          }}
        >
          <span>{info}</span>
          {words.length > 5 && (
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                position: "relative",
              }}
            >

              <span
                style={{
                  visibility: "hidden",
                  opacity: 0,
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  background: "#333",
                  color: "#fff",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  transition: "0.2s",
                  zIndex: 10,
                }}
                className="tooltip-text"
              >
                {info}
              </span>
            </span>
          )}

          <style>{`
        span:hover .tooltip-text {
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
        </div>


        <p className='books-section-one-save2' style={{ direction: "rtl" }}><Link to={`/displayBook/${slug}`} onClick={getBook} style={{ cursor: "pointer" }} >{info}</Link> </p>
        <div className="book-links">
          <Link to={`/displayBook/${slug}`} onClick={getBook}
            className="download-link books-section-one-download books-section-one-download-two">
            قراءة
          </Link>
          <a href={book} className="download-link books-section-one-download" style={{ marginBottom: "33%" }}> تحميل </a>

        </div>
        {/* <div className="book-links">
                    {book_id ? (
                        <Link to="/displayBook" onClick={getBook} className="download-link books-section-one-download books-section-one-download-two">
                            قراءة 
                        </Link>
                    ) : (
                        <span className="download-link disabled">قراءة (غير متاح)</span>
                    )}
                    <a href={book} className="download-link books-section-one-download"> تحميل </a>
                </div> */}


      </div>
      <a href={`/displayBook/${slug}`} target='_blank'>
        <img
          src={src}
          alt=""
          className="books-book"
          onClick={getBook}
          onError={(e) => {
            e.target.onerror = null; // Prevents looping if default image also fails
            e.target.src = "/assets/default/books/Book - inside.png"; // Replace with your fallback image path
          }}
          //style={{ cursor: "pointer",marginTop:"10%" }}
          style={{
            width:
              src === "/assets/default/books/Book - inside.png"
                ? "305px" // حجم الـ default
                : src === "/assets/main/books/Book - inside.png"
                  ? "400px" // حجم الـ main
                  : "auto",

            height:
              src === "/assets/default/books/Book - inside.png"
                ? "265px"
                : src === "/assets/main/books/Book - inside.png"
                  ? "350px"
                  : "auto",

            objectFit: "cover",
            marginTop: "11%", cursor: "pointer",
            marginBottom: "15%"
          }}
        />
      </a>


      {showReader && (
        <div className="reader-container">
          <button onClick={() => setShowReader(false)}>Close Reader</button>
          <ReactReader
            url={book} // Replace `book` temporarily with `sampleBookUrl`
            title={info}
            showToc={true}
            getRendition={(rendition) => {
              rendition.themes.default({
                '::selection': {
                  background: 'rgba(255,255,0, 0.3)'
                }
              });
            }}
            onClose={() => setShowReader(false)}
          />
        </div>
      )}
    </div>
  )
}
