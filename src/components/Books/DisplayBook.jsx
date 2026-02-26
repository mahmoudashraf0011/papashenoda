import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader';
import { useNavigate } from 'react-router-dom';
import Footer from './../Footer/Footer';
import Header from './../Header/Header';
import './DisplayBook.css'

export default function DisplayBook() {
  const [book, setBook] = useState(null);
  const [info, setInfo] = useState(null);
  const [bookID, setBookId] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // إضافة state لحجم الشاشة

  const [showReader, setShowReader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const bookData = localStorage.getItem("book");
    if (bookData) {
      try {
        const bookItem = JSON.parse(bookData);
        console.log("Parsed book item:", bookItem);

        setBook(bookItem.book);
        setInfo(bookItem.info);
        setBookId(bookItem.slug)
        setShowReader(true);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      alert("No book URL provided.");
      console.log("Navigating to home...");
      navigate("/");
    }
  }, []);
  console.log("cat", book);
  const closeWrapper = () => {
    // Trigger the parent to hide this component
    navigate(-1)
  };
  /* const closeWrapper = () => {
    // محاولة إغلاق النافذة/التبويب الحالي
    if (window.history.length > 1) {
      // إذا كان هناك صفحة سابقة في التاريخ، ارجع لها
      navigate(-1);
    } else {
      // إذا لم يكن هناك تاريخ، حاول إغلاق النافذة
      window.close();

      // إذا فشل إغلاق النافذة، ارجع للصفحة الرئيسية
      setTimeout(() => {
        if (!window.closed) {
          navigate("/");
        }
      }, 300);
    }
  }; */

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    background: '#fff',
    border: 'none',
    color: '#000',
    fontSize: '22px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: '0.3s',
    // Conditional styling based on screen size (mobile)
    left: screenWidth <= 430 ? '0px' : 'unset',  // Left for mobile, right for desktop
    right: screenWidth <= 430 ? 'unset' : '92%'  // Right for desktop, unset for mobile
  };

  return (
    <div className='displayBookContainer'>
      < Header />
      <div style={{ position: 'relative' }}>
        {/* Close Button */}
        <button
          className='btnVVBG'
          onClick={closeWrapper} // Replace with your actual close function
          /* style={{
            position: 'absolute',
            top: '12px',
            right: '45px',
            background: '#fff',
            border: 'none',
            color: '#000',
            fontSize: '20px',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: '0.3s',
          }} */
          style={closeButtonStyle}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ✕
        </button>

        <div className="display_article_iframe_block">
          <iframe className='display_book_iframe'
            src={`https://popeshenoudatest.msol.dev/api/v2/open-epub?slug=${bookID}`}

            allowFullScreen
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>

  )
}
