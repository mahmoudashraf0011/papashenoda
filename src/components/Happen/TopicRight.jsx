import React, { useEffect, useState } from "react";
import SkeletonTopicRight from "./SkeletonTopicRight";
import SkeletonTopicRightRes from "./SkeletonTopicRightRes";
import SkeletonHappenTopicContainerRes from "./SkeletonHappenTopicContainerRes";
import SkeltonTopLeft from "./SkeltonTopLeft";

export default function TopicRight({ data }) {
  const [shouldContain, setShouldContain] = useState(false);

  useEffect(() => {
    if (data[0]?.image) {
      const img = new Image();
      img.src = data[0].image;
      img.onload = () => {
        if (img.width < 900) {
          setShouldContain(true);
        }
      };
    }
  }, [data[0]]);
  console.log(data);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="topic-right-side">
      {/* 
            <img src={data[0] && data[0].sharepoint_image ? data[0].image : "/assets/default/happen/outSide.png"} alt="" className={`visits-head-img ${shouldContain ? 'vistis-object-fit-contain' : ''}`} />
            {shouldContain && (
                <img className="visits-head-img-blur" src={data[0].sharepoint_image ? data[0].image : "/assets/default/happen/outSide.png"} />
            )}
            <div className="topic-right-ps" dangerouslySetInnerHTML={{ __html: data[0] ? data[0].event : "" }}></div>
            */}

      {data[0] ? (
        <>
          {/* <img
                        src={data[0].sharepoint_image ? data[0].image : "/assets/default/happen/outSide.png"}
                        alt=""
                        className={`visits-head-img ${shouldContain ? 'vistis-object-fit-contain' : ''}`}
                    />
                    {shouldContain && (
                        <img
                            className="visits-head-img-blur"
                            src={data[0].sharepoint_image ? data[0].image : "/assets/default/happen/outSide.png"}
                            alt="blurred"
                        />
                    )} */}
          <div className="image-container" style={{ position: "relative",width:"100%" }}>
            <img
            style={{ width:"100%"  }}
              src={
                data[0].sharepoint_image
                  ? data[0].image
                  : "/assets/default/happen/outSide.png"
              }
              alt=""
              className={`visits-head-img ${
                shouldContain ? "vistis-object-fit-contain" : ""
              }`}
            />
            {shouldContain && (
              <img
                className="visits-head-img-blur"
                src={
                  data[0].sharepoint_image
                    ? data[0].image
                    : "/assets/default/happen/outSide.png"
                }
                alt="blurred"
              />
            )}
            {/* زر التحميل */}
            {data[0].sharepoint_image && (
              <a
                href={
                  data[0].sharepoint_image
                    ? data[0].image
                    : "/assets/default/happen/outSide.png"
                }
                download
                className="download-btn"
                onClick={(e) => e.stopPropagation()} // Prevent parent click
                style={{
                  position: "absolute",
                  top: "10px", // لضبط الزر في الأعلى
                  right: "100px", // لضبط الزر في اليمين
                  backgroundColor: "rgba(255, 255, 255, 0.7)", // خلفية شفافة قليلًا
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "18px",
                  color: "#000",
                  textDecoration: "none",
                  zIndex: 1, // لضمان أن الزر في الأعلى
                }}
              >
                ⬇ تحميل
              </a>
            )}
          </div>
          <div
            className="topic-right-ps"
            dangerouslySetInnerHTML={{ __html: data[0]?.event }}
          ></div>
        </>
      ) : (
        // عرض Skeleton أثناء التحميل
        /* <SkeletonTopicRight /> */
        <>
            {Array.from({ length: 1 }).map((_, idx) =>
              isMobile ? <SkeltonTopLeft key={idx} /> : <SkeletonTopicRight key={idx} />
            )}
        </>
      )}
    </div>
  );
}
