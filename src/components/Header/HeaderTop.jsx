import React from "react";
import { Link } from "react-router-dom";

export default function HeaderTop({ closeDp }) {
  return (
    <div className="header-top" onMouseEnter={() => closeDp()}>
      <div className="header-right-abs-img">
        <img src={`${process.env.PUBLIC_URL}/assets/stars.png`} alt="" />
      </div>
      <div className="header-top-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/assets/image_2.png`}
          alt=""
          className="header-top-right-img"
        />
        <Link className="header-top-right-img2" to={"/"}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/image_2.png`}
            alt=""
            className=""
            style={{ cursor: "pointer" }}
          />
        </Link>

        <div className="header-ps">
          <p className="header-p">
            الموقع الرسمي لقداسة البابا شنوده الثالث (تجريبي)
          </p>
          {/* <p className='header-p'>مركز معلم الأجيال - لحفظ ونشر تراث البابا شنوده الثالث</p>
                    <p className='header-p'>كنيسة السيدة العذراء مريم بالزيتون</p> */}
        </div>

        <div className="header-ps-res" style={{ display: "none" }}>
          <p className="header-p">
            الموقع الرسمي لقداسة البابا شنوده الثالث (تجريبي)
          </p>
          {/* <p className='header-p'>مركز معلم الأجيال</p>
                    <p className='header-p'>لحفظ ونشر تراث البابا شنوده الثالث</p>
                    <p className='header-p'>كنيسة السيدة العذراء مريم بالزيتون</p> */}
        </div>

        <Link to="/">
          {" "}
          <img
            className="header-top-left-img"
            src={`${process.env.PUBLIC_URL}/assets/logo.png`}
            alt=""
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>
    </div>
  );
}
