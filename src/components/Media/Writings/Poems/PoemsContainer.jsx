import React, { useEffect, useState } from "react";
import "./PoemsContainer.css";
import "../../Responsive/PoemsRes.css";
import MediaHeader from "../../MediaHeader";
import PoemsCard from "./PoemsCard";
import PoemsHook from "../../../../Logic/Media/Writings/Poems/PoemsHook";
import Paginate from "../../../Utility/Paginate";
import Spinner from "../../../Utility/Spinner";
import SkeletonArticlesCard from "../../../../Pages/Media/Writings/Articles/SkeletonArticlesCard";
import SkeletonArticlesCard1 from "../../../../Pages/Media/Writings/Articles/SkeletonArticlesCard1";

export default function PoemsContainer() {
  const [
    poemsData,
    pageCount,
    filterGroup,
    attrGroup,
    handleChangePage,
    getData,
    notFound,
    activePage,
  ] = PoemsHook();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="PoemsContainer">
      <div className="Container">
        <MediaHeader title="قصائد" />
        <div className="PoemsItems">
          {poemsData && Array.isArray(poemsData[0]) ? (
            poemsData[0].map((item) => {
              return (
                <PoemsCard
                  src={`/poems/${item.slug}`}
                  title={item.name}
                  desc={item.poem}
                  key={item.id}
                  url={item.url}
                />
              );
            })
          ) : (
            <>
              {/* <SkeletonArticlesCard />
              <SkeletonArticlesCard />
              <SkeletonArticlesCard />
              <SkeletonArticlesCard /> */}
              {Array.from({ length: 6 }).map((_, idx) =>
                isMobile ? (
                  <SkeletonArticlesCard1 key={idx} />
                ) : (
                  <SkeletonArticlesCard key={idx} />
                )
              )}
            </>
          )}
        </div>
      </div>
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
