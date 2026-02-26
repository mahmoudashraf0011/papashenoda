import React, { useRef, useState, useContext, useEffect } from "react";
import "./SoundsSidebarContainer.css";
import SoundsSidebarCard from "./SoundsSidebarCard";
import SideApi from "./SideApi";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import RecentlySoundsContainer from "./RecentlySoundsContainer";
import { Link } from "react-router-dom";

export default function SoundsSidebarContainer() {
  const {
    sideMenu,
    setSideMenu,
    baseURL,
    fetchbook,
    setSide2,
    side2,
    hasMore,
    currentPage,
    setCurrentPage,
    itemsPerPage2,
    visibleItems2,
    setVisibleItems2,
    setAudioURL,
    setAudioId,
    audioList,
    setAudioList,
    currentAudioIndex,
    setCurrentAudioIndex,
    SendAudio,
    side,
    visibleItems,
    itemsPerPage,
    fetchlast,
    setVisibleItems,
    hasMoreBookmarks,
    hasMoreLately,
  } = useContext(UserContext);

  const token = localStorage.getItem("token_popeShounda");

  // const [page, setPage] = useState(0);
  // const [page2, setPage2] = useState(0);

  // const loading = useRef(false);
  // const loading2 = useRef(false);

  // const loadMoreItems = () => {
  //   if (loading.current) return;

  //   loading.current = true;
  //   const nextPage = page + 1;
  //   const startIndex = nextPage * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;

  //   setVisibleItems(prev => [
  //     ...prev,
  //     ...side.slice(startIndex, endIndex)
  //   ]);
  //   setPage(nextPage);
  //   loading.current = false;
  // };

  // const scrollDivRef = useRef(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const div = scrollDivRef.current;
  //     if (
  //       div &&
  //       div.scrollTop + div.clientHeight >= div.scrollHeight - 50 &&
  //       !loading.current &&
  //       visibleItems.length < side.length
  //     ) {
  //       loadMoreItems();
  //     }
  //   };

  //   const div = scrollDivRef.current;
  //   div?.addEventListener('scroll', handleScroll);

  //   return () => div?.removeEventListener('scroll', handleScroll);
  // }, [visibleItems, side]);

  useEffect(() => {
    if (sideMenu === "lately") {
      fetchlast();
    } else if (sideMenu === "bookmark") {
      fetchbook();
    }
  }, [sideMenu]);

  // const loadMoreItems2 = () => {
  //   if (loading2.current) return;

  //   loading2.current = true;
  //   const nextPage = page + 1;
  //   const startIndex = nextPage * itemsPerPage2;
  //   const endIndex = startIndex + itemsPerPage2;

  //   setVisibleItems2(prev => [
  //     ...prev,
  //     ...side2.slice(startIndex, endIndex)
  //   ]);
  //   setPage2(nextPage);
  //   loading2.current = false;
  // };

  // const scrollDivRef2 = useRef(null);

  // useEffect(() => {
  //   const handleScroll2 = () => {
  //     const div = scrollDivRef2.current;
  //     if (
  //       div &&
  //       div.scrollTop + div.clientHeight >= div.scrollHeight - 50 &&
  //       !loading2.current &&
  //       visibleItems2.length < side2.length
  //     ) {
  //       loadMoreItems2();
  //     }
  //   };

  //   const div = scrollDivRef2.current;
  //   div?.addEventListener('scroll', handleScroll2);

  //   return () => div?.removeEventListener('scroll', handleScroll2);
  // }, [visibleItems2, side2]);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handelMenuClick = (item) => {
    setSideMenu(item);
    console.log(item, "item");
    toggleMenu();
  };

  return (
    <div className="soundsSidebarContainer">
      {localStorage.getItem("token_popeShounda") ? (
        <div className="soundsSidebarHeader" onClick={toggleMenu}>
          <div className="soundsSidebarHeaderRight">
            <img
              src={`${process.env.PUBLIC_URL}/assets/sound-list.png`}
              alt=""
            />
            {sideMenu && sideMenu == "lately" ? (
              <h3 className="soundsSidebarHeaderTitle">
                تم الاستماع إليها مؤخراً
              </h3>
            ) : (
              <h3 className="soundsSidebarHeaderTitle"> المقاطع المفضلة</h3>
            )}
            <img
              className="play-btns-down-img"
              src={`${process.env.PUBLIC_URL}/assets/down2.png`}
              alt=""
            />
          </div>

          {menuVisible && (
            <div className="custom-menu5">
              <div
                className={
                  sideMenu === "bookmark"
                    ? `custom-menu-div-5`
                    : "custom-menu-div"
                }
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/sound-list.png`}
                  alt=""
                />
                <p onClick={() => handelMenuClick("bookmark")}>
                  قائمة المقاطع المفضلة
                </p>
              </div>
              <div
                className={
                  sideMenu === "lately"
                    ? `custom-menu-div-5`
                    : "custom-menu-div2"
                }
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/sound-list.png`}
                  alt=""
                />
                <p onClick={() => handelMenuClick("lately")}>
                  قائمة المقاطع المستمع إليها حديثاً
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="header-bottom-enter custom-menu-div2"
          style={{
            marginTop: "78px",
            width: "80%",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          تسجيل الدخول
        </Link>
      )}

      <InfiniteScroll
        dataLength={
          sideMenu === "lately" ? visibleItems.length : visibleItems2.length
        }
        next={sideMenu === "lately" ? fetchlast : fetchbook}
        hasMore={sideMenu === "lately" ? hasMoreLately : hasMoreBookmarks}
        height={400}
        className="scrolled"
      >
        {sideMenu === "lately"
          ? visibleItems.map((sid, index) => (
              <SoundsSidebarCard
                img={
                  sid.sharepoint_image
                    ? sid.image
                    : "/assets/default/sounds/Audio-DF.png"
                }
                key={index}
                title={sid.name}
                desc="قداسة البابا شنوده الثالث"
                onClick={() =>
                  SendAudio(
                    sid.url,
                    sid.id,
                    sid.sharepoint_image
                      ? sid.image
                      : "/assets/default/sounds/Audio-DF.png",
                    sid.name,
                    sid.bookmarkshow,
                    visibleItems,
                    index
                  )
                }
              />
            ))
          : visibleItems2.map((sid, index) => (
              <SoundsSidebarCard
                img={
                  sid.sharepoint_image
                    ? sid.image
                    : "/assets/default/sounds/Audio-DF.png"
                }
                key={index}
                title={sid.name}
                desc="قداسة البابا شنوده الثالث"
                onClick={() =>
                  SendAudio(
                    sid.url,
                    sid.id,
                    sid.sharepoint_image
                      ? sid.image
                      : "/assets/default/sounds/Audio-DF.png",
                    sid.name,
                    sid.bookmarkshow,
                    visibleItems2,
                    index
                  )
                }
              />
            ))}
      </InfiniteScroll>

      <div className="recently-appear-res">
        <RecentlySoundsContainer />
      </div>
    </div>
  );
}
