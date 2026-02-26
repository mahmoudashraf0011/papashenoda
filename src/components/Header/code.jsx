import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UserInfoHook from "../../Logic/Profile/UserInfoHook";
import NanbarHook from "../../Logic/NanbarHook";
import LogoutHook from "../../Logic/Auth/LogoutHook";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import HomeHook from "../../Logic/Home/HomeHook";
import SearchComponent from "../Utility/SearchComponent";
export default function HeaderRes() {
  const [mediaData, meditationsData, sayingsData, eventsData, total] =
    HomeHook();

  const { baseURL } = useContext(UserContext);
  const overlayRef = useRef();
  const profileDP = useRef();

  const [userInfo, loading] = UserInfoHook();
  const [value, onChangeSearch, onHandleSearch, onClickSearch] = NanbarHook();
  const [onSubmitLogout] = LogoutHook();

  const [profImg, setProfImg] = useState(
    userInfo[0] ? userInfo[0]?.image : null
  ); // Holds the fetched profile image
  const [iconProfile, setIconProfile] = useState(faChevronDown);
  const triggerRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const onHandleProfile = () => {
    const homeElement = document.querySelector(".Home");

    if (profileDP.current.style.display === "block") {
      profileDP.current.style.display = "none";
      setIconProfile(faChevronDown);
      overlayRef.current.style.display = "none";
      if (homeElement) {
        homeElement.classList.remove("zIndexLow"); // Remove the class
      }
    } else {
      profileDP.current.style.display = "block";
      setIconProfile(faChevronUp);
      overlayRef.current.style.display = "block";
      if (homeElement) {
        homeElement.classList.add("zIndexLow"); // Add the class
      }
    }
    setDropdownVisible((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDP.current &&
        !profileDP.current.contains(event.target) && // 👈 Not inside dropdown
        triggerRef.current &&
        !triggerRef.current.contains(event.target) // 👈 Not on toggle button
      ) {
        setDropdownVisible(false); // 👈 Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const [categories, setCategories] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const CategoryToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const other = useRef();

  const MediaToggle = () => {
    setIsMediaOpen(!isMediaOpen);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/categories?lang=ar`)
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [info, setInfo] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/show_header/ar`)
      .then((response) => {
        setInfo(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };
  const [showSearch, setShowSearch] = useState(false);
  const [accordionState, setAccordionState] = useState({});
  const [accordionStateChild, setAccordionStateChild] = useState({});
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setShowSearch(false);
    }
  });
  const closeSearch = () => {
    setShowSearch(false);
  };

  useEffect(() => {
    if (showSearch == true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [showSearch]);

  const navigate = useNavigate();

  const handleMoreHappen = () => {
    localStorage.removeItem("happenDay");
    localStorage.removeItem("happenMonth");
    localStorage.removeItem("happenYear");
    navigate("/happen");
  };

  return (
    <>
      <div className="overlayLight" ref={overlayRef}></div>
      <div className="headerRes-left">
        <div style={{ display: "flex", alignItems: "center" }}>
          {localStorage.getItem("token") ? (
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
                    src={
                      loading || userInfo[0]?.image == null
                        ? "/assets/profile/avatar.svg"
                        : userInfo[0]?.image
                    }
                    alt="profileImg"
                    style={{
                      padding:
                        userInfo[0] && userInfo[0]?.image == null
                          ? "7px"
                          : "0px", // Conditional padding
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
            ""
          )}
          {/* <span className='header-bottom-left-p'>العربية</span> */}
          {/* <img
                        src={`${process.env.PUBLIC_URL}/assets/egypt 1.png`}
                        alt="Arabic flag"
                        style={{ width: '20px', marginLeft: '5px' }}
                    /> */}
        </div>
      </div>
      <div className="headerRes-right">
        {!showSearch && (
          <img
            src={`${process.env.PUBLIC_URL}/assets/search.png`}
            alt="Search Icon"
            onClick={() => {
              handleSearchClick();
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
          <>
            <img
              src={`${process.env.PUBLIC_URL}/assets/search.png`}
              alt="Search Icon"
              onClick={() => {
                handleSearchClick();
              }}
              className="header-bottom-search-img"
            />
            <SearchComponent closeSearch={() => closeSearch()} />
          </>
        )}

        <img
          src={`${process.env.PUBLIC_URL}/assets/header-ham.png`}
          alt="ham Icon"
          className="header-bottom-ham-img"
          onClick={toggleOverlay}
        />
      </div>

      {isOverlayOpen && (
        <div className="header-overlay">
          <div className="header-overlay-content">
            <img
              src={`${process.env.PUBLIC_URL}/assets/close-res.png`}
              onClick={toggleOverlay}
              alt=""
              className="header-overlay-close"
            />
            {!localStorage.getItem("token") ? (
              <Link
                className="header-overlay-signup"
                to={"/login"}
                onClick={toggleOverlay}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/header-profile.png`}
                  alt=""
                />
                <p>تسجيل الدخول</p>
              </Link>
            ) : (
              <div className="header-overlay-signup" onClick={onSubmitLogout}>
                <div className="dropDownImg" />
                <p>تسجيل الخروج</p>
              </div>
            )}

            <div
              className={`header-overlay-sections ${
                isCategoriesOpen ? "header-overlay-sections-blue" : ""
              }`}
              onClick={() => CategoryToggle()}
            >
              <img
                src={
                  isCategoriesOpen
                    ? `${process.env.PUBLIC_URL}/assets/up-res.png`
                    : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`
                }
                alt=""
                className="header-arrow-down"
              />
              <p>كل ألاقسام</p>
            </div>
            {isCategoriesOpen &&
              categories &&
              categories.map((child, index) =>
                child.children && child.children.length > 0 ? (
                  <Accordion
                    multiple
                    className="accordion-right"
                    key={child.id}
                    activeIndex={accordionState[child.id] || []}
                    onTabChange={(e) => {
                      setAccordionState((prev) => ({
                        ...prev,
                        [child.id]: e.index,
                      }));
                    }}
                  >
                    <AccordionTab
                      header={
                        <>
                          <img
                            src={
                              (accordionState[child.id] || []).includes(0)
                                ? `${process.env.PUBLIC_URL}/assets/up-res.png`
                                : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`
                            }
                            alt=""
                            className="pi pi-chevron-down custom-static-icon"
                          />
                          {/* <Link className="header-acc-align" to={`/category/${child.slug}`} >
                                                        {child.name}
                                                        <img
                                                            className="header-acc-res-img"
                                                            src={
                                                                (accordionState[child.id] || []).includes(0) 
                                                                    ? child.image_icon_hover
                                                                    : child.image_icon
                                                            }                                                            
                                                            alt=""
                                                        />
                                                    </Link> */}
                          <p className="header-acc-align">
                            {child.name}
                            <img
                              className="header-acc-res-img"
                              src={
                                (accordionState[child.id] || []).includes(0)
                                  ? child.image_icon_hover
                                  : child.image_icon
                              }
                              alt=""
                            />
                          </p>
                        </>
                      }
                    >
                      <Link
                        to={`/category/${child.slug}`}
                        className="header-bottom-right-dropInfo-topic-headunderline"
                        onClick={() => {
                          toggleOverlay();
                          setDropdownVisible();
                        }}
                      >
                        عرض الكل
                      </Link>
                      {child.children.map((subchild) =>
                        subchild.children && subchild.children.length > 0 ? (
                          <Accordion
                            multiple
                            className="accordion-right"
                            key={subchild.id}
                            activeIndex={accordionStateChild[subchild.id] || []}
                            onTabChange={(e) => {
                              setAccordionStateChild((prev) => ({
                                ...prev,
                                [subchild.id]: e.index,
                              }));
                            }}
                          >
                            <AccordionTab
                              header={
                                <>
                                  {/* <i className="pi pi-chevron-down custom-static-icon" /> */}
                                  <img
                                    src={
                                      (
                                        accordionStateChild[subchild.id] || []
                                      ).includes(0)
                                        ? `${process.env.PUBLIC_URL}/assets/up-res.png`
                                        : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`
                                    }
                                    alt=""
                                    className="pi pi-chevron-down custom-static-icon"
                                  />

                                  <p
                                    className="m-0 header-non-acc-p p-0"
                                    style={{ width: "fit-content" }}
                                    onClick={toggleOverlay}
                                  >
                                    {subchild.name}
                                  </p>
                                </>
                              }
                            >
                              <Link
                                to={`/category/${subchild.slug}`}
                                style={{
                                  textAlign: "right",
                                  color: "#000",
                                  textDecoration: "underline",
                                  padding: "5px 10px",
                                }}
                                onClick={() => {
                                  toggleOverlay();
                                  setDropdownVisible();
                                }}
                              >
                                عرض الكل
                              </Link>
                              {subchild.children.map((nestedChild) => (
                                <Link
                                  onClick={toggleOverlay}
                                  to={`/category/${nestedChild.slug}`}
                                  className="m-0 header-non-acc-p2"
                                  key={nestedChild.id}
                                >
                                  {nestedChild.name}
                                </Link>
                              ))}
                            </AccordionTab>
                          </Accordion>
                        ) : (
                          <Link
                            to={`/category/${subchild.slug}`}
                            onClick={toggleOverlay}
                            className="m-0 header-non-acc-p2"
                            key={subchild.id}
                          >
                            {subchild.name}
                          </Link>
                        )
                      )}
                    </AccordionTab>
                  </Accordion>
                ) : (
                  <div className="accordion-right" style={{ margin: "8px" }}>
                    <Link
                      className="header-acc-align"
                      to={`/category/${child.slug}`}
                      onClick={toggleOverlay}
                    >
                      {child.name}
                      <img
                        className="header-acc-res-img"
                        src={child.image_icon}
                        alt=""
                      />
                    </Link>
                  </div>
                )
              )}

            {/* <div className={`header-overlay-sections ${isMediaOpen ? 'header-overlay-sections-blue' : ''}`} onClick={() => MediaToggle()}>
                            <img src={isMediaOpen ? `${process.env.PUBLIC_URL}/assets/up-res.png` : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`} alt="" className='header-arrow-down' />
                            <p>الميديا</p>
                        </div>
                        <div className="header-bottom-right-big-cont">
                            {isMediaOpen && info && info.mediaTypes && info.mediaTypes.map((mediatype) => (
                                <Link className='header-bottom-right-link' to={mediatype.id == 4 ? `/media/writings` : `/media/${mediatype.slug}`} style={{ cursor: "pointer", boxShadow: '' }} onClick={toggleOverlay}>
                                    <div className="header-bottom-right-dropInfo2-imgInfo">
                                        <img className='header-bottom-right-dropInfo2-img' src={mediatype.image} alt="" />
                                        <div className="header-bottom-right-dropInfo2-img-abs">
                                            <img className='header-bottom-right-dropInfo2-img-abs-img' src={mediatype.image_icon} alt="" />
                                        </div>
                                        <div className="header-bottom-right-dropInfo2-img-info">
                                            <p className='header-bottom-right-dropInfo2-img-p2'>({mediatype.count})</p>
                                            <p className='header-bottom-right-dropInfo2-img-p'>{mediatype.name} </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {isMediaOpen &&(
                                <Link to={`/media/writings`} style={{cursor:"pointer",boxShadow:'',width:"100%"}} onClick={toggleOverlay} ref={other}> 
                                    <div className="header-bottom-right-dropInfo2-imgInfo">
                                        <img className='header-bottom-right-dropInfo2-img' src="/assets/MediaGallery/1.png" alt="" style={{objectFit:"cover",objectPosition:"center",objectPosition:"0 -167px"}} />
                                        <div className="header-bottom-right-dropInfo2-img-abs">
                                            <img className='header-bottom-right-dropInfo2-img-abs-img' src={`/assets/MediaGallery/icon5.png`} alt="" />
                                        </div>
                                        <div className="header-bottom-right-dropInfo2-img-info">
                                            <p className='header-bottom-right-dropInfo2-img-p2'>({total})</p>
                                            <p className='header-bottom-right-dropInfo2-img-p'>مقالات وكتابات اخرى</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>  */}
            <div
              className={`header-overlay-sections ${
                isMediaOpen ? "header-overlay-sections-blue" : ""
              }`}
              onClick={() => MediaToggle()}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  isMediaOpen
                    ? `${process.env.PUBLIC_URL}/assets/up-res.png`
                    : `${process.env.PUBLIC_URL}/assets/header-res-arrow.png`
                }
                alt=""
                className="header-arrow-down"
                style={{ marginBottom: "10px", display: "block" }}
              />
              <p>الميديا</p>
            </div>
            <div
              className="header-bottom-right-big-cont"
              style={{
                flexDirection: "row",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "15px",
                direction: "rtl",
                padding: "10px",
              }}
            >
              {isMediaOpen &&
                info &&
                info.mediaTypes &&
                info.mediaTypes.map((mediatype, index) => (
                  <Link
                    className="header-bottom-right-link"
                    to={
                      mediatype.id === 4
                        ? `/media/writings`
                        : `/media/${mediatype.slug}`
                    }
                    style={{
                      cursor: "pointer",
                      boxShadow: "none",
                      width: "calc(50% - 15px)",
                      flexGrow: 1,
                      marginBottom: "15px",
                    }}
                    onClick={toggleOverlay}
                    key={index}
                  >
                    <div
                      className="header-bottom-right-dropInfo2-imgInfo"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        className="header-bottom-right-dropInfo2-img"
                        src={mediatype.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        className="header-bottom-right-dropInfo2-img-abs"
                        style={{
                          position: "absolute",
                          top: "5%",
                          right: "5%",
                        }}
                      >
                        <img
                          className="header-bottom-right-dropInfo2-img-abs-img"
                          src={mediatype.image_icon}
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      </div>
                      <div
                        className="header-bottom-right-dropInfo2-img-info"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        <p
                          className="header-bottom-right-dropInfo2-img-p2"
                          style={{
                            margin: 0,
                          }}
                        >
                          ({mediatype.count})
                        </p>
                        <p
                          className="header-bottom-right-dropInfo2-img-p"
                          style={{
                            margin: 0,
                          }}
                        >
                          {mediatype.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              {isMediaOpen && (
                <Link
                  to={`/media/writings`}
                  style={{
                    cursor: "pointer",
                    boxShadow: "none",
                    width: "100%",
                  }}
                  onClick={toggleOverlay}
                >
                  <div
                    className="header-bottom-right-dropInfo2-imgInfo"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      className="header-bottom-right-dropInfo2-img"
                      src="/assets/MediaGallery/1.png"
                      alt=""
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        objectPosition: "0 -167px",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <div
                      className="header-bottom-right-dropInfo2-img-abs"
                      style={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                      }}
                    >
                      <img
                        className="header-bottom-right-dropInfo2-img-abs-img"
                        src={`/assets/MediaGallery/icon5.png`}
                        alt=""
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </div>
                    <div
                      className="header-bottom-right-dropInfo2-img-info"
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "20px",
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      <p
                        className="header-bottom-right-dropInfo2-img-p2"
                        style={{
                          margin: 0,
                        }}
                      >
                        ({total})
                      </p>
                      <p
                        className="header-bottom-right-dropInfo2-img-p"
                        style={{
                          margin: 0,
                        }}
                      >
                        مقالات وكتابات اخرى
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {isMediaOpen && info && (
              <div className="header-bottom-right-dropInfo2-lines-topics">
                <div className="header-bottom-right-dropInfo2-line"></div>
                <p className="header-bottom-right-dropInfo2-topics">
                  مواضيع قد تهمك
                </p>
                <div className="header-bottom-right-dropInfo2-line"></div>
              </div>
            )}
            <div className="header-bottom-right-dropInfo2-topicsInfo">
              {isMediaOpen &&
                info &&
                info.categories &&
                info.categories.map((category) => (
                  <Link
                    to={`/category/${category.slug}`}
                    className="header-bottom-right-dropInfo2-topic"
                    onClick={toggleOverlay}
                  >
                    {" "}
                    {category.name}{" "}
                  </Link>
                ))}
            </div>
            {/* <Link className='header-overlay-p' to={'/aboutpapa'} onClick={toggleOverlay}>سيرة البابا</Link> */}
            <Link
              className="header-overlay-p"
              to="/happen"
              onClick={() => {
                toggleOverlay();
                handleMoreHappen();
              }}
            >
              سنكسار البابا
            </Link>
            <Link
              className="header-overlay-p"
              to={"/about"}
              onClick={toggleOverlay}
            >
              عن المركز
            </Link>
            <Link
              className="header-overlay-p"
              to={"/contact"}
              onClick={toggleOverlay}
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      )}
    </>
  );
}