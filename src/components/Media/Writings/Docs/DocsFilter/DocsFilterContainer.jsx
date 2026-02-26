import React, { useState } from "react";
import MediaHeader from "../../../MediaHeader";
import "./DocsFilterContainer.css";
import { Link, useParams } from "react-router-dom";
import DocsCard from "../DocsCard";
import DocsDetailsHook from "../../../../../Logic/Media/Writings/Docs/DocsDetailsHook";
import Paginate from "../../../../Utility/Paginate";
import DocsFilter from "../DocsFilter";
import DocsHook from "../../../../../Logic/Media/Writings/Docs/DocsHook";
import DocOverlay from "../DocOverlay";
import SkeletonDocsSection from "../SkeletonDocsSection";
import Spinner from "../../../../Utility/Spinner";
import SkeletonDocsSection1 from "./SkeletonDocsSection1";
export default function DocsFilterContainer() {
  const { id } = useParams();
  const [docsDetailsData, title, pageCount, handleChangePage,activePage] =
    DocsDetailsHook(id);
  const [docsData, filterAttrs, filterCates, getData] = DocsHook();
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const [clickedImage, setClickedImage] = useState(null);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  const [overlayImgs, setOverlayImgs] = useState([]);
  const [clickedCategory, setClickedCategory] = useState("");
  const handleImageClick = (imgUrl, index, media, categoryValue) => {
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
  return (
    <div className="docsFilterContainer">
      <div className="breadCrumbContainer">
        <div className="Container">
          <ul className="breadCrumb">
            <li>
              <Link>{title}</Link>
            </li>
            <li>
              <Link to={`/media/documents`}>وثائق بخط البابا</Link>
            </li>
            <li>
              <Link to={`/media/writings`}>مقالات وكتابات اخري</Link>
            </li>
            <li>
              <Link to={`/`}>الرئيسية</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="Container">
        {docsDetailsData && <MediaHeader title={title} />}

        <div className="docsItems">
          {docsDetailsData && Array.isArray(docsDetailsData[0]) ? (
            docsDetailsData[0].map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  {/* { docsDetailsData ? (
                    <>
                    <SkeletonDocsSection />
                    <SkeletonDocsSection />
                    <SkeletonDocsSection />
                    <SkeletonDocsSection />
                    </>
                  ) : ( */}
                  <DocsCard
                    src={item.image}
                    handleImageClick={() =>
                      handleImageClick(
                        item.image,
                        index,
                        docsDetailsData[0],
                        item.value
                      )
                    }
                  />

                  {isOverlayVisible && (
                    <DocOverlay
                      closeOverlay={closeOverlay}
                      img={clickedImage}
                      cate={title}
                      imgs={overlayImgs}
                      initialSlide={clickedImageIndex}
                      activePage={activePage}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
              <SkeletonDocsSection1 />
            </>
          )}
        </div>
      </div>
      {<Paginate pageCount={pageCount} onPress={handleChangePage} activePage={activePage} />}
    </div>
  );
}
