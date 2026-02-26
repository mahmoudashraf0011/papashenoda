import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Link, json, useNavigate } from "react-router-dom";
import LogoutHook from "../../Logic/Auth/LogoutHook";
import UsetDataHook from "../../Logic/Auth/UsetDataHook";
import SearchHook from "../../Logic/Search/SearchHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UserInfoHook from "../../Logic/Profile/UserInfoHook";
import NanbarHook from "../../Logic/NanbarHook";
import SearchComponent from "../Utility/SearchComponent";
export default function HeaderContent({
  openHeader1,
  openHeader2,
  setOpenHeaderOne,
  setOpenHeaderTwo,
  openHeaderOne,
  openHeaderTwo,
  closeDp,
}) {
  const [userInfo, loading] = UserInfoHook();
  const [profImg, setProfImg] = useState(
    userInfo[0] ? userInfo[0].image : null
  ); // Holds the fetched profile image
  const [iconProfile, setIconProfile] = useState(faChevronDown);
  const overlayRef = useRef();
  const [checkHead1, setCheckHead1] = useState(false);

  let word = "";
  const closeWrapper = () => {
    setOpenHeaderOne(false);
    setOpenHeaderTwo(false);
  };
  if (localStorage.getItem("search")) {
    word = localStorage.getItem("search");
  }

  const [value, onChangeSearch, onHandleSearch, onClickSearch] = NanbarHook();
  const [userData] = UsetDataHook();
  const [onSubmitLogout] = LogoutHook();
  const profileDP = useRef();

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [];

  useEffect(() => {
    if (showSearch == true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [showSearch]);

  const placeholderTemplate = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* <span>العربية</span> */}
      {/* <img
                src={`${process.env.PUBLIC_URL}/assets/egypt 1.png`}
                alt="Arabic flag"
                style={{ width: '20px', marginLeft: '5px' }}
            /> */}
    </div>
  );
  function isImage(file) {
    // Checking MIME type
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
    ];

    return validImageTypes.includes(file.type);
  }
  const triggerRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const onHandleProfile = () => {
    if (profileDP.current.style.display == "block") {
      profileDP.current.style.display = "none";
      setIconProfile(faChevronDown);
      overlayRef.current.style.display = "none";
    } else {
      profileDP.current.style.display = "block";
      setIconProfile(faChevronUp);
      overlayRef.current.style.display = "block";
      closeWrapper();
    }
    setDropdownVisible((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDP.current &&
        !profileDP.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleFun = () => {
    profileDP.current.style.display = "none";
  };
  const closeProfile = () => {
    if (profileDP.current) {
      profileDP.current.style.display = "none";
      setIconProfile(faChevronDown);
    }
  };
  // useEffect(() => {
  //     const pathname = window.location.pathname;
  //     if(/^\/articles\/\d+$/.test(pathname)){
  //         console.log("paaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  //     }else{
  //         console.log("no:::::::::::::::::::::::::::::::::::::::");
  //     }

  //     if (pathname === '/search' || /^\/search\/more\/[^\/]+$/.test(pathname) || /^\/poems\/[^\/]+$/.test(pathname) || /^\/articles\/[^\/]+$/.test(pathname)||/^\/displayvideo\/[^\/]+$/.test(pathname)  || /^\/displayBook/.test(pathname) || /^\/displayBook/.test(pathname) || /^\/displayBook/.test(pathname) ) {
  //         setShowSearch(true);
  //     } else {
  //         setShowSearch(false);
  //         localStorage.setItem("search", "");
  //     }
  // }, [window.location.pathname]);

  useEffect(() => {
    setCheckHead1(openHeaderTwo);
  }, [openHeaderTwo]);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setShowSearch(false);
    }
  });
  const closeSearch = () => {
    setShowSearch(false);
  };

  const navigate = useNavigate();
  const handleMoreHappen = () => {
    localStorage.removeItem("happenDay");
    localStorage.removeItem("happenMonth");
    localStorage.removeItem("happenYear");
    navigate("/happen");
  };
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSearch]);
  return (
    <>
      <div className="overlayLight" ref={overlayRef}></div>
      <div className="header-bottom-left">
        {localStorage.getItem("token_popeShounda") ? (
          <div className="userProfile">
            <div className="userProfileContent" onClick={onHandleProfile}>
              <FontAwesomeIcon icon={iconProfile} className="userProfileIcon" />
              <div className="userProfileImg">
                <img
                  src={
                    loading || userInfo[0]?.image == null
                      ? "/assets/profile/avatar.svg"
                      : userInfo[0]?.image
                  }
                  alt="profileImg"
                  style={{
                    padding:
                      userInfo[0] && userInfo[0]?.image == null ? "7px" : "0px", // Conditional padding
                  }}
                />
              </div>
              <div className="userProfileDropdown" ref={profileDP}>
                <div className="userProfileDropdownUp">
                  <div className="userProfileDropdownUpImg">
                    <img
                      src={
                        loading || userInfo[0]?.image == null
                          ? "/assets/profile/avatar.svg"
                          : userInfo[0]?.image
                      }
                      alt="profileImg"
                      style={{
                        padding:
                          userInfo[0] && userInfo[0]?.image == null
                            ? "10px"
                            : "0px", // Conditional padding
                      }}
                    />
                  </div>
                  <h3 className="userProfileDropdownUpTitle">
                    {userInfo[0] && userInfo[0].name}
                  </h3>
                </div>
                <div className="userProfileDropdownLine"></div>
                <div className="userProfileDropdownLinks">
                  <Link
                    to="/profileAccount"
                    className="userProfileDropdownLinksItem accountDP"
                  >
                    <div className="dropDownImg" />
                    <p>حسابى</p>
                  </Link>
                  <Link
                    to="/profileBookMark"
                    className="userProfileDropdownLinksItem subscribeDP"
                  >
                    <div className="dropDownImg" />
                    <p>الإشتراكات</p>
                  </Link>
                  <div
                    className="userProfileDropdownLinksItem logoutDP"
                    onClick={onSubmitLogout}
                  >
                    <div className="dropDownImg" />
                    <p>تسجيل الخروج</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" className="header-bottom-enter">
            تسجيل الدخول
          </Link>
        )}

        {/* <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                    placeholder={selectedCity ? null : placeholderTemplate()} /> */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <span className='header-bottom-left-p'>العربية</span> */}
          {/* <img
                        src={`${process.env.PUBLIC_URL}/assets/egypt 1.png`}
                        alt="Arabic flag"
                        style={{ width: '20px', marginLeft: '5px' }}
                    /> */}
        </div>
        <Link
          to="/contact"
          className="header-bottom-left-p"
          onClick={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
          onMouseEnter={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
        >
          تواصل معنا
        </Link>
        <Link
          to="/about"
          className="header-bottom-left-p"
          onClick={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
          onMouseEnter={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
        >
          عن المركز
        </Link>
      </div>
      <div className="header-bottom-right">
        {!showSearch && (
          <img
            src={`${process.env.PUBLIC_URL}/assets/search.png`}
            alt="Search Icon"
            onClick={() => {
              handleSearchClick();
              closeProfile();
            }}
            className="header-bottom-search-img"
          />
        )}

        {showSearch && (
          //                     <IconField iconPosition="right" id='close-btn'>
          //                         <InputIcon className="pi pi-search" onClick={onClickSearch} />
          //                         <InputText placeholder="ابحث" id="header-bottom-right-inputs" value={value} onChange={onChangeSearch} onKeyDown={onHandleSearch} />
          //                         <img
          //                             src="/assets/Groupclose.png"
          //                             alt="Close"
          //                             className="header-bottom-right-close"
          //                             onClick={() => {
          //                                 setShowSearch(false);
          //                                 const searchValue = localStorage.getItem("search");
          //                                 if (searchValue) {
          //                                 localStorage.setItem("search", "");
          //                                 }
          //                                 console.log("yes");
          //                             }}
          // />
          //                     </IconField>
          <div ref={wrapperRef}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/search.png`}
              alt="Search Icon"
              onClick={() => {
                handleSearchClick();
                closeProfile();
              }}
              className="header-bottom-search-img"
            />
            <SearchComponent
              closeSearch={() => closeSearch()}
              checkVisibility={setShowSearch}
            />
          </div>
        )}
        <Link
          to="/happen"
          className="header-bottom-left-p"
          onClick={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
            handleMoreHappen();
          }}
          onMouseEnter={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
        >
          سنكسار البابا
        </Link>
        {/* <Link to='/aboutpapa' className='header-bottom-left-p' onClick={()=>{
                    closeWrapper();
                    closeProfile();    
                    overlayRef.current.style.display = "none";
   
                    }}>سيرة البابا</Link> */}
        <div
          className="header-bottom-right-drop"
          onMouseEnter={() => {
            openHeader1();
            if (!openHeaderOne) {
              overlayRef.current.style.display = "block";
            } else {
              overlayRef.current.style.display = "none";
            }
            closeProfile();
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/arrow-down.png`}
            alt=""
            className="header-arrow-down"
          />
          <p className="header-bottom-left-p"> الميديا</p>
        </div>

        <div
          className="header-bottom-right-drop"
          onMouseEnter={() => {
            openHeader2();
            if (!checkHead1) {
              overlayRef.current.style.display = "block";
            } else {
              overlayRef.current.style.display = "none";
            }
            closeProfile();
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/arrow-down.png`}
            alt=""
            className="header-arrow-down"
          />
          <p className="header-bottom-left-p">كل ألاقسام</p>
        </div>
        <Link
          to="/"
          className="header-bottom-left-p"
          onClick={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
          onMouseEnter={() => {
            closeWrapper();
            closeProfile();
            overlayRef.current.style.display = "none";
          }}
        >
          الرئيسية
        </Link>
      </div>
    </>
  );
}
