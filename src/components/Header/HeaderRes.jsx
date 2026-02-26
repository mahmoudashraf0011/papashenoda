// HeaderRes.js
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UserInfoHook from "../../Logic/Profile/UserInfoHook";
import NanbarHook from "../../Logic/NanbarHook";
import LogoutHook from "../../Logic/Auth/LogoutHook";
import HomeHook from "../../Logic/Home/HomeHook";
import SearchComponent from "../Utility/SearchComponent";

export default function HeaderRes({ categories = [], showInfo = {} }) {
  const [mediaData, meditationsData, sayingsData, eventsData, total] = HomeHook();
  const { baseURL } = useContext(UserContext);
  const overlayRef = useRef();
  const profileDP = useRef();

  const [userInfo, loading] = UserInfoHook();
  
  // استخدم localStorage مباشرة علشان التحديث الفوري
  const getUserFromStorage = () => {
    if (localStorage.getItem("user_popeShounda")) {
      return JSON.parse(localStorage.getItem("user_popeShounda"));
    }
    return null;
  };

  const [currentUser, setCurrentUser] = useState(getUserFromStorage());
  const [currentImage, setCurrentImage] = useState(
    currentUser?.image || "/assets/profile/avatar.svg"
  );

  const [value, onChangeSearch, onHandleSearch, onClickSearch] = NanbarHook();
  const [onSubmitLogout] = LogoutHook();

  const [iconProfile, setIconProfile] = useState(faChevronDown);
  const triggerRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // تحديث فوري من localStorage
  useEffect(() => {
    const updateFromStorage = () => {
      const userData = getUserFromStorage();
      setCurrentUser(userData);
      setCurrentImage(userData?.image || "/assets/profile/avatar.svg");
    };

    // تحديث أولي
    updateFromStorage();

    // اسمع لتغيرات في localStorage
    const handleStorageChange = () => {
      updateFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // اعمل interval check كل ثانية
    const interval = setInterval(updateFromStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // كمان استمع لتغيرات الـ userInfo
  useEffect(() => {
    if (userInfo[0]) {
      setCurrentUser(userInfo[0]);
      setCurrentImage(userInfo[0]?.image || "/assets/profile/avatar.svg");
    }
  }, [userInfo]);

  const onHandleProfile = () => {
    const homeElement = document.querySelector(".Home");
    if (profileDP.current.style.display === "block") {
      profileDP.current.style.display = "none";
      setIconProfile(faChevronDown);
      overlayRef.current.style.display = "none";
      if (homeElement) homeElement.classList.remove("zIndexLow");
    } else {
      profileDP.current.style.display = "block";
      setIconProfile(faChevronUp);
      overlayRef.current.style.display = "block";
      if (homeElement) homeElement.classList.add("zIndexLow");
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
        profileDP.current.style.display = "none";
        setIconProfile(faChevronDown);
        overlayRef.current.style.display = "none";
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const toggleOverlay = () => setIsOverlayOpen((v) => !v);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const CategoryToggle = () => setIsCategoriesOpen((v) => !v);

  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const MediaToggle = () => setIsMediaOpen((v) => !v);

  // NOTE: showInfo is received from parent (no internal axios get for /show_header)
  const info = showInfo || {};

  const [showSearch, setShowSearch] = useState(false);
  const handleSearchClick = () => setShowSearch((s) => !s);
  const [accordionState, setAccordionState] = useState({});
  const [accordionStateChild, setAccordionStateChild] = useState({});
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setShowSearch(false);
  });
  const closeSearch = () => setShowSearch(false);

  useEffect(() => {
    document.body.style.overflow = showSearch ? "hidden" : "visible";
  }, [showSearch]);

  const navigate = useNavigate();
  const handleMoreHappen = () => {
    localStorage.removeItem("happenDay");
    localStorage.removeItem("happenMonth");
    localStorage.removeItem("happenYear");
    navigate("/happen");
  };

  // دالة لإغلاق البروفايل dropdown
  const closeProfile = () => {
    if (profileDP.current) {
      profileDP.current.style.display = "none";
      setIconProfile(faChevronDown);
      overlayRef.current.style.display = "none";
    }
  };

  return (
    <>
      <div className="overlayLight" ref={overlayRef}></div>
        <div className="headerRes-left">
         <div style={{ display: "flex", alignItems: "center" }}>
           {localStorage.getItem("token_popeShounda") ? (
             <div className="userProfile">
               <div
                 className="userProfileContent"
                 onClick={onHandleProfile}
                 ref={triggerRef}
               >
                 <FontAwesomeIcon
                   icon={iconProfile}
                   className="userProfileIcon"
                 />
                 <div className="userProfileImg">
                   <img
                     key={currentImage} // مهم علشان يforce re-render للصورة
                     src={currentImage}
                     alt="profileImg"
                     style={{
                       padding: currentImage === "/assets/profile/avatar.svg" ? "7px" : "0px",
                     }}
                     onError={(e) => {
                       // إذا الصورة مش بتظهر، استخدم الـ avatar
                       e.target.src = "/assets/profile/avatar.svg";
                       e.target.style.padding = "7px";
                     }}
                   />
                 </div>
                 <div className="userProfileDropdown" ref={profileDP}>
                   <div className="userProfileDropdownUp">
                     <div className="userProfileDropdownUpImg">
                       <img
                         key={currentImage} // مهم علشان يforce re-render للصورة
                         src={currentImage}
                         alt="profileImg"
                         style={{
                           padding: currentImage === "/assets/profile/avatar.svg" ? "10px" : "0px",
                         }}
                         onError={(e) => {
                           e.target.src = "/assets/profile/avatar.svg";
                           e.target.style.padding = "10px";
                         }}
                       />
                     </div>
                     <h3 className="userProfileDropdownUpTitle">
                       {currentUser?.name || (userInfo[0] && userInfo[0].name)}
                     </h3>
                   </div>
                   <div className="userProfileDropdownLine"></div>
                   <div className="userProfileDropdownLinks">
                     <Link
                       to="/profileAccount"
                       className="userProfileDropdownLinksItem accountDP"
                       onClick={closeProfile}
                     >
                       <div className="dropDownImg" />
                       <p>حسابى</p>
                     </Link>
                     <Link
                       to="/profileBookMark"
                       className="userProfileDropdownLinksItem subscribeDP"
                       onClick={closeProfile}
                     >
                       <div className="dropDownImg" />
                       <p>الإشتراكات</p>
                     </Link>
                     <div
                       className="userProfileDropdownLinksItem logoutDP"
                       onClick={() => {
                         onSubmitLogout();
                         closeProfile();
                       }}
                     >
                       <div className="dropDownImg" />
                       <p>تسجيل الخروج</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           ) : (
             ""
           )}

         </div>
       </div>

      <div className="headerRes-right">
        {!showSearch && (
          <img src={`${process.env.PUBLIC_URL}/assets/search.png`} alt="Search Icon" onClick={handleSearchClick} className="header-bottom-search-img" />
        )}
        {showSearch && (
          <>
            <img src={`${process.env.PUBLIC_URL}/assets/search.png`} alt="Search Icon" onClick={handleSearchClick} className="header-bottom-search-img" />
            <SearchComponent closeSearch={() => closeSearch()} />
          </>
        )}

        <img src={`${process.env.PUBLIC_URL}/assets/header-ham.png`} alt="ham Icon" className="header-bottom-ham-img" onClick={toggleOverlay} />
      </div>

      {isOverlayOpen && (
        <div className="header-overlay">
          <div className="header-overlay-content">
            <img src={`${process.env.PUBLIC_URL}/assets/close-res.png`} onClick={toggleOverlay} alt="" className="header-overlay-close" />
            {!localStorage.getItem("token_popeShounda") ? (
              <Link className="header-overlay-signup" to={"/login"} onClick={toggleOverlay}>
                <img src={`${process.env.PUBLIC_URL}/assets/header-profile.png`} alt="" />
                <p>تسجيل الدخول</p>
              </Link>
            ) : (
              <div className="header-overlay-signup" onClick={onSubmitLogout}>
                <div className="dropDownImg" />
                <p>تسجيل الخروج</p>
              </div>
            )}

            <div className={`header-overlay-sections ${isCategoriesOpen ? "header-overlay-sections-blue" : ""}`} onClick={() => CategoryToggle()}>
              <img src={isCategoriesOpen ? `${process.env.PUBLIC_URL}/assets/up-res.png` : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`} alt="" className="header-arrow-down" />
              <p>كل ألاقسام</p>
            </div>

            {isCategoriesOpen && categories && categories.map((child) =>
              child.children && child.children.length > 0 ? (
                <Accordion multiple className="accordion-right" key={child.id} activeIndex={accordionState[child.id] || []} onTabChange={(e) => setAccordionState((prev) => ({ ...prev, [child.id]: e.index }))}>
                  <AccordionTab header={
                    <>
                      <img src={(accordionState[child.id] || []).includes(0) ? `${process.env.PUBLIC_URL}/assets/up-res.png` : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`} alt="" className="pi pi-chevron-down custom-static-icon" />
                      <p className="header-acc-align">{child.name}<img className="header-acc-res-img" src={(accordionState[child.id] || []).includes(0) ? child.image_icon_hover : child.image_icon} alt="" /></p>
                    </>
                  }>
                    <Link to={`/category/${child.slug}`} className="header-bottom-right-dropInfo-topic-headunderline" onClick={() => { toggleOverlay(); }}>
                      عرض الكل
                    </Link>
                    {child.children.map((subchild) => subchild.children && subchild.children.length > 0 ? (
                      <Accordion multiple className="accordion-right" key={subchild.id} activeIndex={accordionStateChild[subchild.id] || []} onTabChange={(e) => setAccordionStateChild((prev) => ({ ...prev, [subchild.id]: e.index }))}>
                        <AccordionTab header={
                          <>
                            <img src={(accordionStateChild[subchild.id] || []).includes(0) ? `${process.env.PUBLIC_URL}/assets/up-res.png` : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`} alt="" className="pi pi-chevron-down custom-static-icon" />
                            <p className="m-0 header-non-acc-p p-0" style={{ width: "fit-content" }} onClick={() => { }}>{subchild.name}</p>
                          </>
                        }>
                          <Link to={`/category/${subchild.slug}`} style={{ textAlign: "right", color: "#000", textDecoration: "underline", padding: "5px 10px" }} onClick={() => toggleOverlay()}>عرض الكل</Link>
                          {subchild.children.map(nestedChild => <Link onClick={() => toggleOverlay()} to={`/category/${nestedChild.slug}`} className="m-0 header-non-acc-p2" key={nestedChild.id}>{nestedChild.name}</Link>)}
                        </AccordionTab>
                      </Accordion>
                    ) : (
                      <Link to={`/category/${subchild.slug}`} onClick={() => toggleOverlay()} className="m-0 header-non-acc-p2" key={subchild.id}>{subchild.name}</Link>
                    ))}
                  </AccordionTab>
                </Accordion>
              ) : (
                <div className="accordion-right" style={{ margin: "8px" }} key={child.id}>
                  <Link className="header-acc-align" to={`/category/${child.slug}`} onClick={() => toggleOverlay()}>
                    {child.name}
                    <img className="header-acc-res-img" src={child.image_icon} alt="" />
                  </Link>
                </div>
              )
            )}

            <div className={`header-overlay-sections ${isMediaOpen ? "header-overlay-sections-blue" : ""}`} onClick={() => MediaToggle()} style={{ cursor: "pointer" }}>
              <img src={isMediaOpen ? `${process.env.PUBLIC_URL}/assets/up-res.png` : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`} alt="" className="header-arrow-down" style={{ marginBottom: "10px", display: "block" }} />
              <p>الميديا</p>
            </div>

            <div className="header-bottom-right-big-cont" style={{ flexDirection: "row", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "15px", direction: "rtl", padding: "10px" }}>
              {isMediaOpen && info && info.mediaTypes && info.mediaTypes.map((mediatype, index) => (
                <Link className="header-bottom-right-link" to={mediatype.id === 4 ? `/media/writings` : `/media/${mediatype.slug}`} style={{ cursor: "pointer", boxShadow: "none", width: "calc(50% - 15px)", flexGrow: 1, marginBottom: "15px" }} onClick={() => toggleOverlay()} key={index}>
                  <div className="header-bottom-right-dropInfo2-imgInfo" style={{ position: "relative", overflow: "hidden", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
                    <img className="header-bottom-right-dropInfo2-img" src={mediatype.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div className="header-bottom-right-dropInfo2-img-abs" style={{ position: "absolute", top: "5%", right: "5%" }}>
                      <img className="header-bottom-right-dropInfo2-img-abs-img" src={mediatype.image_icon} alt="" style={{ width: "30px", height: "30px" }} />
                    </div>
                    <div className="header-bottom-right-dropInfo2-img-info" style={{ position: "absolute", bottom: "10px", left: "10px", color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "5px 10px", borderRadius: "5px" }}>
                      <p className="header-bottom-right-dropInfo2-img-p2" style={{ margin: 0 }}>({mediatype.count})</p>
                      <p className="header-bottom-right-dropInfo2-img-p" style={{ margin: 0 }}>{mediatype.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {isMediaOpen && (
                <Link to={`/media/writings`} style={{ cursor: "pointer", boxShadow: "none", width: "100%" }} onClick={() => toggleOverlay()}>
                  <div className="header-bottom-right-dropInfo2-imgInfo" style={{ position: "relative", overflow: "hidden", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
                    <img className="header-bottom-right-dropInfo2-img" src="/assets/MediaGallery/1.png" alt="" style={{ objectFit: "cover", objectPosition: "center", objectPosition: "0 -167px", width: "100%", height: "100%" }} />
                    <div className="header-bottom-right-dropInfo2-img-abs" style={{ position: "absolute", top: "5%", right: "5%" }}>
                      <img className="header-bottom-right-dropInfo2-img-abs-img" src={`/assets/MediaGallery/icon5.png`} alt="" style={{ width: "30px", height: "30px" }} />
                    </div>
                    <div className="header-bottom-right-dropInfo2-img-info" style={{ position: "absolute", bottom: "10px", left: "20px", color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "5px 10px", borderRadius: "5px" }}>
                      <p className="header-bottom-right-dropInfo2-img-p2" style={{ margin: 0 }}>({total})</p>
                      <p className="header-bottom-right-dropInfo2-img-p" style={{ margin: 0 }}>مقالات وكتابات اخرى</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {isMediaOpen && info && (
              <div className="header-bottom-right-dropInfo2-lines-topics">
                <div className="header-bottom-right-dropInfo2-line"></div>
                <p className="header-bottom-right-dropInfo2-topics">مواضيع قد تهمك</p>
                <div className="header-bottom-right-dropInfo2-line"></div>
              </div>
            )}

            <div className="header-bottom-right-dropInfo2-topicsInfo">
              {isMediaOpen && info && info.categories && info.categories.map((category) => (
                <Link to={`/category/${category.slug}`} className="header-bottom-right-dropInfo2-topic" onClick={() => toggleOverlay()} key={category.id}>{category.name}</Link>
              ))}
            </div>

            <Link className="header-overlay-p" to="/happen" onClick={() => { toggleOverlay(); handleMoreHappen(); }}>سنكسار البابا</Link>
            <Link className="header-overlay-p" to={"/about"} onClick={() => toggleOverlay()}>عن المركز</Link>
            <Link className="header-overlay-p" to={"/contact"} onClick={() => toggleOverlay()}>تواصل معنا</Link>
          </div>
        </div>
      )}
    </>
  );
}