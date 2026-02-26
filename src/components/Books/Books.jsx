import React, { useContext, useEffect, useState } from "react";
import "./Books.scss";
import "./Books-res.scss";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import BooksSections from "./BooksSections";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

export default function Books() {
  window.addEventListener("hashchange", function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, " "); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);
  const { baseURL } = useContext(UserContext);
  const [searchVar, setSearchVar] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [searchPag, setSearchPag] = useState("");

  const sendSearch = (page, seach) => {
    console.log("seach", seach);
    axios
      .get(
        `${baseURL}/v2/getmedia?slug=books&page=${page}&search=${seach}&lang=ar`
      )
      .then((response) => {
        console.log(response.data.data);
        console.log(seach);
        setSearchInfo(response.data.data);
        setSearchPag(response.data.pagination);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchVar(newValue);
    console.log("new", newValue);
    console.log(newValue.length);
    if (e.target.value.length >= 3) {
      sendSearch(1, newValue);
    }
    if (e.target.value.length == 0) {
      sendEmpty();
      console.log("yes");
    }
  };
  const sendEmpty = () => {
    axios
      .get(`${baseURL}/v2/getmedia?slug=books&page=1&lang=ar`)
      .then((response) => {
        console.log(response.data.data);
        setSearchInfo(response.data.data);
        setSearchPag(response.data.pagination);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="books mediaBooks">
      <div className="books-wrapper">
        <div className="books-heade-cont-abs">
          <div className="books-head-ps">
            <p>إصدارات</p>
            <p>مركز</p>
            <p>معلم الأجيال</p>
          </div>
          <IconField iconPosition="right">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="...أبحث عن كتاب "
              onChange={handleInputChange}
              value={searchVar}
            />
          </IconField>
        </div>
        <div className="books-head-cont">
          <img className="books-head-imgpapa" src="/assets/pope.png" alt="" />
          <img className="books-head-imgsig" src="/assets/books-2.png" alt="" />

          <div className="book-head-imgmain-rel">
            <img
              className="books-head-imgplant"
              src="/assets/books-3.png"
              alt=""
            />
            <img
              className="books-head-imgmain"
              src="/assets/image_12.png"
              alt=""
            />
          </div>
          <img className="books-head-stand" src="/assets/books-5.png" alt="" />

          <div className="books-head-p-input">
            <div className="books-head-ps">
              <p>إصدارات</p>
              <p>مركز</p>
              <p>معلم الأجيال</p>
            </div>
            <IconField iconPosition="right">
              <InputIcon className="pi pi-search"> </InputIcon>
              <InputText
                placeholder="...أبحث عن كتاب "
                onChange={handleInputChange}
                value={searchVar}
              />
            </IconField>
          </div>
        </div>

        <BooksSections
          searchInfo={searchInfo}
          searchPag={searchPag}
          sendSearch={sendSearch}
          searchVar={searchVar}
        />
        {searchInfo.length < 1 && searchVar && (
          <p className="noResult" style={{ marginTop: "90px" }}>
            لا يوجد نتائج
          </p>
        )}
      </div>
    </div>
  );
}

