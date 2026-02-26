import React, { useEffect, useState } from "react";
import "./DocsContainer.css";
import "../../Responsive/DocsRes.css";
import MediaHeader from "../../MediaHeader";
import DocsCard from "./DocsCard";
import DocsHook from "../../../../Logic/Media/Writings/Docs/DocsHook";
import DocsFilter from "./DocsFilter";
import Spinner from "../../../Utility/Spinner";
import VisitsOverlay from "../../../Visits/VisitsOverlay";
import DocOverlay from "./DocOverlay";
import Paginate from "../../../Utility/Paginate";
import SkeletonDocsSection from "./SkeletonDocsSection";
import DocsGalleryOverlay from "./DocsGalleryOverlay";
import SkeletonDocsSection1 from "./SkeletonDocsSection1";
export default function DocsContainer() {
  const [
    docsData,
    filterAttrs,
    filterCates,
    getData,
    notFound,
    handleChangePage,
    pageCount,
    activePage,
  ] = DocsHook();
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const [clickedImage, setClickedImage] = useState(null);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  const [overlayImgs, setOverlayImgs] = useState([]);
  const [clickedCategory, setClickedCategory] = useState("");
  const handleImageClick = (imgUrl, index, media, categoryValue, docId) => {
    setClickedImage(imgUrl);
    setClickedImageIndex(index);
    setOverlayImgs(media); // <- set the list of images for the Swiper
    setClickedCategory(categoryValue); // <- if you need to show category
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setClickedImage(null);
  };
  if (docsData[0]) {
    console.log("docs", docsData);
  }
  const [filter, setFilter] = useState();

  useEffect(() => {
    if (localStorage.getItem("docsAttr")) {
      setFilter(JSON.parse(localStorage.getItem("docsAttr")));
    }
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
    <div className="docsContainer">
      <div className="Container">
        <DocsFilter cates={filterCates} attrs={filterAttrs} />
      </div>
      {docsData && Array.isArray(docsData[0]) ? (
        docsData[0].map((item) => {
          return (
            <>
              <div className="Container">
                <MediaHeader
                  title={item.value}
                  src={`/docs/${item.category_slug}`}
                />

                <div className="docsItems">
                  {item.media
                    ? item.media.map((doc, index) => {
                        return (
                          <React.Fragment key={doc.id}>
                            <DocsCard
                              src={doc.image}
                              handleImageClick={() =>
                                handleImageClick(
                                  doc.image,
                                  index,
                                  item.media,
                                  item.value,
                                  doc.id
                                )
                              }
                            />
                            {isOverlayVisible && (
                              <DocsGalleryOverlay
                                mediaId={overlayImgs[clickedImageIndex]?.id} // نبعت الـ id بتاع الصورة
                                closeOverlay={closeOverlay}
                                cate={clickedCategory}
                                page={activePage}
                                patch={8}
                                currentIndex={clickedImageIndex}
                                filter={filter}
                              />
                            )}
                          </React.Fragment>
                        );
                      })
                    : ""}
                </div>
              </div>
            </>
          );
        })
      ) : (
        <>
          {Array.from({ length: 5 }).map((_, idx) =>
              isMobile ? <SkeletonDocsSection1 key={idx} /> : <SkeletonDocsSection key={idx} />
            )}
        </>
      )}
      {pageCount > 0 && (
        <Paginate
          pageCount={pageCount}
          onPress={handleChangePage}
          activePage={activePage}
        />
      )}
      <p className="noResult" ref={notFound} style={{ display: "none" }}>
        لا يوجد نتائج
      </p>
    </div>
  );
}
