import React, { useEffect, useState } from "react";
import "./Happen.scss";
import "./Responsive/HappenRes.css";
import HappenTopic from "./HappenTopic";
import HappenSwiper from "./HappenSwiper";
import HappenHead from "./HappenHead";
import HappenHook from "../../Logic/Media/Writings/Happen/HappenHook";
import Paginate from "./../Utility/Paginate.jsx";
import Spinner from "../Utility/Spinner.jsx";
import { Link } from "react-router-dom";
import SkeletonHappenTopicContainer from "./SkeletonHappenTopicContainer.jsx";
import SkeletonHappenTopicContainerRes from "./SkeletonHappenTopicContainerRes.jsx";
export default function Happen() {
  const [happenData, pageCount, handleChangePage, getData, loading] =
    HappenHook();
  window.addEventListener("hashchange", function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, " "); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="happenParent">
      <div className="breadCrumbContainer">
        <div className="Container">
          <ul className="breadCrumb">
            <li>
              <Link to={`/happen`}>حدث في مثل هذا اليوم</Link>
            </li>
            <li>
              <Link to={`/`}>الرئيسية</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="happenBg" style={{ display: "none" }}>
        <p className="happenBgDesc">حدث في مثل هذا اليوم</p>
        <img className="happenBgImg" src="/assets/eventBg2.png" alt="event" />
      </div>
      <div className="happen">
        <div className="happen-wrapper">
          <HappenHead />

          <HappenSwiper happenData={happenData} />
          {loading == false && happenData[0].length == 0 ? (
            <p className="noResult" style={{ paddingTop: "120px" }}>
              لا يوجد نتائج
            </p>
          ) : (
            ""
          )}
          <div className="happen-topics">
            {/* {
                            happenData && Array.isArray(happenData[0]) && happenData[0].length != 0 || loading == false ? happenData[0].map((item) => {
                                return (
                                    <HappenTopic img={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"} date={item.day_happened.date} desc={item.day_happened.event} id={item.id} check={item.sharepoint_image} slug={item.slug} />
                                )
                            }) : ""
                        } */}
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, idx) =>
                  isMobile ? (
                    <SkeletonHappenTopicContainerRes key={idx} />
                  ) : (
                    <SkeletonHappenTopicContainer key={idx} />
                  )
                )}
              </>
            ) : /* <SkeletonHappenTopicContainer /> */
            happenData &&
              Array.isArray(happenData[0]) &&
              happenData[0].length !== 0 ? (
              happenData[0].map((item) => (
                <HappenTopic
                  key={item.id}
                  img={
                    item.sharepoint_image
                      ? item.image
                      : "/assets/default/happen/outSide.png"
                  }
                  date={item.day_happened.date}
                  desc={item.day_happened.event}
                  id={item.id}
                  check={item.sharepoint_image}
                  slug={item.slug}
                />
              ))
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {pageCount > 0 && (
        <Paginate pageCount={pageCount} onPress={handleChangePage} />
      )}
    </div>
  );
}
