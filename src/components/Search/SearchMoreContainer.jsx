import React, { useState, useRef, useEffect, useContext } from "react";
import "./SearchMoreContainer.css";
import { Link, useParams } from "react-router-dom";
import CategoryHeader from "../Category/CategoryHeader";
import CatagorySayingWriteCard from "../Category/Categories/CatagorySayingWriteCard";
import OneBook1, { SkeletonBookCard } from "../Books/OneBook1";
import "./SearchContainer.css";
import "../../Pages/Search/Responsive/SearchResponsive.css";

import SectionHeader from "../Utility/SectionHeader";
import SearchMoreHook from "../../Logic/Search/SearchMoreHook";
import Paginate from "../Utility/Paginate";
import SayingsPhotoCard from "../Media/Writings/Sayings/SayingsPhotoCard";
import VisitsImg from "../Visits/VisitsImg";
import ArticlesCard, {
  SkeletonArticleCard,
} from "../Media/Writings/Articles/ArticlesCard";
import EventCard from "../Home/EventCard";
import PoemsCard from "../Media/Writings/Poems/PoemsCard";
import CategoryVideoCard, {
  SkeletonLoadingVideo,
} from "../Category/Categories/CategoryVideoCard";
import QuestionCard from "../Media/Writings/Questions/QuestionCard";
import DocsCard from "../Media/Writings/Docs/DocsCard";
import CategorySoundCard, {
  SkeletonCategorySoundCard,
} from "../Category/Categories/CategorySoundCard";
import SayingWriteCard from "../Media/Writings/Sayings/SayingWriteCard";
import VisitsOverlay from "../Visits/VisitsOverlay";
import SearchMoreFilter from "./SearchMoreFilter";
import DocOverlay from "../Media/Writings/Docs/DocOverlay";
import CategoryVisitOverlay from "../Category/CategoryVisitOverlay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Utility/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import axios from "axios";
import SkeletonSayingWriteCard from "../Media/Writings/Sayings/SkeletonSayingWriteCard";
import SkeletonQuestionCard from "../Media/Writings/Questions/SkeletonQuestionCard";
import SkeletonHappenTopicContainer from "../Happen/SkeletonHappenTopicContainer";
import SkeletonDocsSection from "../Media/Writings/Docs/SkeletonDocsSection";
import OneBook3 from "../Books/OneBook3";
import SkeletonArticlesCard from "../../Pages/Media/Writings/Articles/SkeletonArticlesCard";
import SkeletonArticlesCard1 from "../../Pages/Media/Writings/Articles/SkeletonArticlesCard1";
import PictureSayingsSearchOverlay from "./PictureSayingsSearchOverlay";
import { SkeletonDocumentCard } from "../Category/CategoryMore/SkeletonDocumentCard";
import "../Search/SkeletonLoading/skeletonVideo.css";

export default function SearchMoreContainer() {
  let word = "";
  if (localStorage.getItem("search")) {
    word = localStorage.getItem("search");
  }
  const { id } = useParams();
  const [
    searchMoreData,
    pageCount,
    handleChangePage,
    getData,
    activePage,
    loading,
    currentPage,
  ] = SearchMoreHook(word, id);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleImageClick = () => {
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };
  const [isOverlayVisibleDocs, setOverlayVisibleDocs] = useState(false);

  const [clickedImage, setClickedImage] = useState(null);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  const [overlayImgs, setOverlayImgs] = useState([]);
  const [clickedCategory, setClickedCategory] = useState("");

  const handleImageClickDocs = (imgUrl, index, media, categoryValue) => {
    setClickedImage(imgUrl);
    setClickedImageIndex(index);
    setOverlayImgs(media);
    setClickedCategory(categoryValue);
    setOverlayVisibleDocs(true);
    document.body.style.overflow = "hidden";
  };

  const closeOverlayDocs = () => {
    setOverlayVisibleDocs(false);
    setClickedImage(null);
    document.body.style.overflow = "auto";
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleImageClicked = (index) => {
    setCurrentIndex(index);
    setOverlayVisible(true);
  };

  const playersRef = useRef([]); // Array of refs for all players
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  const handlePlay = (index) => {
    // Pause any currently playing audio
    if (currentPlayingIndex !== null && currentPlayingIndex !== index) {
      const previousPlayer = playersRef.current[currentPlayingIndex];
      if (previousPlayer && previousPlayer.audio.current) {
        previousPlayer.audio.current.pause();
      }
    }

    // Set the current playing index
    setCurrentPlayingIndex(index);
  };

  const handlePrev = (index) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      playersRef.current[prevIndex].audio.current.play();
      handlePlay(prevIndex);
    }
  };

  const handleNext = (index) => {
    const nextIndex = index + 1;
    if (nextIndex < searchMoreData[0][0].value.length) {
      // Ensure it doesn't exceed the length
      playersRef.current[nextIndex].audio.current.play();
      handlePlay(nextIndex);
    }
  };

  //for saying photo
  // Original slides array
  let slides;
  let reversedSlides;
  // Overlay state
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);
  const PER_PAGE = 8;

  // Swiper instance ref
  if (id == "pictures-and-sayings") {
    slides = Array.isArray(searchMoreData?.[0]?.[0].value)
      ? searchMoreData[0][0].value.map((item) => ({
          image: item.image,
          id: item.id,
        }))
      : [];

    // Create reversed slides for inverted navigation
    reversedSlides = slides.slice().reverse();
  }

  // Handlers
  const openOverlay = (index) => {
    // calculate index in reversedSlides
    const revIndex = slides.length - 1 - index;
    setActiveIndex(revIndex);
    setOverlayOpen(true);
  };

  const closeOverlayPhoto = () => {
    setOverlayOpen(false);
  };

  const handleZoom = (e) => {
    e.target.classList.toggle("zoomed");
  };

  // check overlap of sounds
  let isAudioPlaying = false;
  const allAudios = document.querySelectorAll("audio");

  allAudios.forEach((audio) => {
    audio.addEventListener("play", () => {
      isAudioPlaying = true;

      // Stop all other audio
      allAudios.forEach((otherAudio) => {
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
        }
      });
    });

    audio.addEventListener("pause", () => {
      isAudioPlaying = false;
    });

    audio.addEventListener("ended", () => {
      isAudioPlaying = false;
    });
  });
  const [isLoading, setIsLoading] = useState(true);

  // افترض أنك تجلب البيانات هنا:
  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      // عندما تكتمل عملية التحميل، غير الحالة إلى false
      setIsLoading(false);
    }, 2000); // 2 ثانية كمثال للتحميل
  }, []);

  // get search result

  let defaultData = {};

  if (localStorage.getItem("allFilter")) {
    defaultData = JSON.parse(localStorage.getItem("allFilter"));
  }

  const safeSearchWord = defaultData.searchWord
    ? `search=${defaultData.searchWord}&`
    : "";
  const safeQueryStringOfCates = defaultData.queryStringOfCates
    ? defaultData.queryStringOfCates + "&"
    : "";
  const safeQueryStringMedia = defaultData.queryStringMedia
    ? defaultData.queryStringMedia + "&"
    : "";
  const safeSearchValue = defaultData.searchValue
    ? `key_words[]=${defaultData.searchValue}&`
    : "";

  const [activeAudio, setActiveAudio] = useState({
    type: null, // 'question' أو 'category'
    id: null, // معرف الصوت النشط
    ref: null, // مرجع عنصر الصوت
  });
  const handleAudioPlay = (audioType, audioId, audioRef) => {
    // إذا كان هناك صوت نشط بالفعل من نوع آخر، أوقفه فوراً
    if (activeAudio.ref && activeAudio.ref !== audioRef) {
      // إيقاف الصوت النشط الحالي
      activeAudio.ref.pause();

      // إعادة تعيين الأيقونات في QuestionCard أو CategorySoundCard
      if (activeAudio.type === "category") {
        const categoryPlayers = document.querySelectorAll(".rhap_container");
        categoryPlayers.forEach((player) => {
          const playButton = player.querySelector(".rhap_play-pause-button");
          if (playButton) {
            const playSvg = playButton.querySelector(".rhap_play-icon");
            const pauseSvg = playButton.querySelector(".rhap_pause-icon");
            if (playSvg) playSvg.style.display = "block";
            if (pauseSvg) pauseSvg.style.display = "none";
          }
        });
      } else if (activeAudio.type === "question") {
        const prevPlayIcons = document.querySelectorAll(
          `.questionCard .playIcon`
        );
        prevPlayIcons.forEach((icon) => {
          if (
            icon.closest(".questionCard").dataset.audioId === activeAudio.id
          ) {
            icon.src = "/assets/playing.png"; // إعادة الأيقونة إلى حالتها الأصلية
          }
        });
      }
    }

    // تعيين الصوت الجديد كصوت نشط
    setActiveAudio({
      type: audioType,
      id: audioId,
      ref: audioRef,
    });

    // تشغيل الصوت الجديد فورًا
    setTimeout(() => {
      if (audioRef && typeof audioRef.play === "function") {
        audioRef.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
      }
    }, 10); // تأخير صغير للتزامن بشكل صحيح
  };
  const handleAudioStop = () => {
    if (activeAudio.ref) {
      activeAudio.ref.pause();

      // إعادة تعيين أيقونات QuestionCard إذا كان الصوت النشط من نوع question
      if (activeAudio.type === "question") {
        const playIcons = document.querySelectorAll(`.questionCard .playIcon`);
        playIcons.forEach((icon) => {
          if (
            icon.closest(".questionCard").dataset.audioId === activeAudio.id
          ) {
            icon.src = "/assets/playing.png";
          }
        });
      }

      setActiveAudio({
        type: null,
        id: null,
        ref: null,
      });
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ====== Render ======
  return (
    <div className="searchMoreContainer">
      <div className="Container">
        <SearchMoreFilter
          cates={
            searchMoreData[0]
              ? searchMoreData[0][0] &&
                searchMoreData[0][0].filterable_categories &&
                searchMoreData[0][0].filterable_categories
              : ""
          }
        />

        {loading ? (
          ""
        ) : (
          <>
            {id == "written-quotes" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className="sayingsWriteItems">
                    {isLoading ? (
                      <>
                        <SkeletonSayingWriteCard />
                        <SkeletonSayingWriteCard />
                        <SkeletonSayingWriteCard />
                      </>
                    ) : (
                      searchMoreData[0][0].value &&
                      searchMoreData[0][0].value.map((item) => {
                        return (
                          <SayingWriteCard
                            img={item.image}
                            desc={item.quote}
                            name={item.ref}
                            cate={item.name}
                            key={item.id}
                            checked={item.sharepoint_image}
                          />
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "books" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryBooksData">
                  <div key={`book-${Math.random() * 10}`} className="">
                    {searchMoreData[0][0] &&
                      Array.from(
                        {
                          length: Math.ceil(
                            searchMoreData[0][0].value.length / 3
                          ),
                        },
                        (_, i) => (
                          <div
                            key={`book-group-${i}`}
                            style={{ position: "relative" }}
                          >
                            <div>
                              {isLoading ? (
                                <>
                                  {/* <SkeletonBookCard />
                                  <SkeletonBookCard />
                                  <SkeletonBookCard /> */}
                                  {Array.from({ length: 5 }).map((_, idx) =>
                                    isMobile ? (
                                      <SkeletonBookCard key={idx} />
                                    ) : (
                                      <>
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                searchMoreData[0][0].value
                                  .slice(i * 3, i * 3 + 3)
                                  .map((subbook, subIndex) => (
                                    <OneBook3
                                      key={subbook.id}
                                      src={
                                        subbook.sharepoint_image
                                          ? subbook.image
                                          : "/assets/default/books/Book - inside.png"
                                      }
                                      info={subbook.name}
                                      book={subbook.url}
                                      book_id={subbook.id}
                                      slug={subbook.slug}
                                    />
                                  ))
                              )}
                              <img
                                className="books-head-stand1"
                                src="/assets/books-5.png"
                                alt="stand"
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                <div
                  className=" categoryBooksDataMoreResIpad"
                  style={{ display: "none" }}
                >
                  <div key={`book-${Math.random() * 10}`} className="">
                    {searchMoreData[0][0] &&
                      Array.from(
                        {
                          length: Math.ceil(
                            searchMoreData[0][0].value.length / 2
                          ),
                        },
                        (_, i) => (
                          <div
                            key={`book-group-${i}`}
                            style={{ position: "relative" }}
                          >
                            <div className="items">
                              {isLoading ? (
                                <>
                                  {/*  <SkeletonBookCard />
                                  <SkeletonBookCard />
                                  <SkeletonBookCard /> */}
                                  {Array.from({ length: 5 }).map((_, idx) =>
                                    isMobile ? (
                                      <SkeletonBookCard key={idx} />
                                    ) : (
                                      <>
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                searchMoreData[0][0].value
                                  .slice(i * 2, i * 2 + 2)
                                  .map((subbook, subIndex) => (
                                    <OneBook1
                                      key={subbook.id}
                                      src={
                                        subbook.sharepoint_image
                                          ? subbook.image
                                          : "/assets/default/books/Book - inside.png"
                                      }
                                      info={subbook.name}
                                      book={subbook.url}
                                      book_id={subbook.id}
                                      slug={subbook.slug}
                                    />
                                  ))
                              )}
                              <img
                                className="books-head-stand1"
                                src="/assets/books-5.png"
                                alt="stand"
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                <div
                  className=" categoryBooksDataMoreResPhone"
                  style={{ display: "none" }}
                >
                  <div key={`book-${Math.random() * 10}`} className="">
                    {searchMoreData[0][0] &&
                      Array.from(
                        {
                          length: Math.ceil(
                            searchMoreData[0][0].value.length / 1
                          ),
                        },
                        (_, i) => (
                          <div
                            key={`book-group-${i}`}
                            style={{ position: "relative" }}
                          >
                            <div className="items">
                              {isLoading ? (
                                <>
                                  {/* <SkeletonBookCard />
                                  <SkeletonBookCard />
                                  <SkeletonBookCard /> */}
                                  {Array.from({ length: 5 }).map((_, idx) =>
                                    isMobile ? (
                                      <SkeletonBookCard key={idx} />
                                    ) : (
                                      <>
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                        <SkeletonBookCard key={idx} />
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                searchMoreData[0][0].value
                                  .slice(i * 1, i * 1 + 1)
                                  .map((subbook, subIndex) => (
                                    <OneBook1
                                      key={subbook.id}
                                      src={
                                        subbook.sharepoint_image
                                          ? subbook.image
                                          : "/assets/default/books/Book - inside.png"
                                      }
                                      info={subbook.name}
                                      book={subbook.url}
                                      book_id={subbook.id}
                                      slug={subbook.slug}
                                    />
                                  ))
                              )}
                              <img
                                className="books-head-stand1"
                                src="/assets/books-5.png"
                                alt="stand"
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                <Paginate
                  pageCount={pageCount}
                  onPress={handleChangePage}
                  activePage={activePage}
                />
              </>
            ) : (
              ""
            )}

            {id == "video" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className="categoryVideoData">
                    {isLoading ? (
                      <>
                        {/* <div className="skeleton-container">
                          <SkeletonLoadingVideo />
                          <SkeletonLoadingVideo />
                          <SkeletonLoadingVideo />
                        </div> */}
                        {Array.from({ length: 5 }).map((_, idx) =>
                          isMobile ? (
                            <SkeletonLoadingVideo key={idx} />
                          ) : (
                            <>
                              <SkeletonLoadingVideo key={idx} />
                              <SkeletonLoadingVideo key={idx} />
                              <SkeletonLoadingVideo key={idx} />
                            </>
                          )
                        )}
                      </>
                    ) : (
                      searchMoreData[0][0] &&
                      searchMoreData[0][0].value.map((item) => {
                        return (
                          <CategoryVideoCard
                            item={item}
                            desc={item.name}
                            src={item.id}
                            key={item.id}
                          />
                        );
                      })
                    )}
                  </div>

                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "event-gallery" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className="visits-imgs-cont categoryGalleryData">
                    {searchMoreData[0][0] &&
                      searchMoreData[0][0].value.map((item, i) => {
                        return (
                          <VisitsImg
                            info={item.description}
                            src={
                              item.image != null
                                ? item.image
                                : `/assets/gallery-1.png`
                            }
                            key={item.id}
                            handleImageClick={() => handleImageClicked(i)}
                          />
                        );
                      })}
                  </div>
                  {isOverlayVisible && (
                    <CategoryVisitOverlay
                      closeOverlay={closeOverlay}
                      visitsImgs={searchMoreData[0][0]}
                      index={currentIndex}
                      pag={currentPage}
                      filterPhotos={
                        safeSearchWord +
                        safeQueryStringOfCates +
                        safeQueryStringMedia +
                        safeSearchValue
                      }
                    />
                  )}
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "article" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className="articleItems categoryArticleData">
                    {isLoading ? (
                      <>
                        <SkeletonArticleCard />
                        <SkeletonArticleCard />
                        <SkeletonArticleCard />
                      </>
                    ) : (
                      searchMoreData[0][0] &&
                      searchMoreData[0][0].value.map((item) => {
                        return (
                          <ArticlesCard
                            img={
                              item.image != null
                                ? item.image
                                : `/assets/media/writings/article/articleItem.png`
                            }
                            title={item.name}
                            desc={item.description}
                            src={`/articles/${item.slug}`}
                            key={item.id}
                            check={item.sharepoint_image}
                          />
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "audio" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className=" categorySoundData">
                    {isLoading ? (
                      <>
                        {/* <div className="skeleton-container">
                          <SkeletonCategorySoundCard />
                          <SkeletonCategorySoundCard />
                          <SkeletonCategorySoundCard />
                        </div> */}
                        {Array.from({ length: 5 }).map((_, idx) =>
                          isMobile ? (
                            <SkeletonCategorySoundCard key={idx} />
                          ) : (
                            <>
                              <SkeletonCategorySoundCard key={idx} />
                              <SkeletonCategorySoundCard key={idx} />
                              <SkeletonCategorySoundCard key={idx} />
                            </>
                          )
                        )}
                      </>
                    ) : (
                      searchMoreData[0][0] &&
                      searchMoreData[0][0].value.map((item, index) => {
                        return (
                          <CategorySoundCard
                            key={item.id}
                            index={index}
                            audio={item.url}
                            title={item.name}
                            isPlaying={currentPlayingIndex === index}
                            hasPrev={index > 0}
                            hasNext={
                              index < searchMoreData[0][0].value.length - 1
                            }
                            onPlay={handlePlay}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            onAudioPlay={handleAudioPlay}
                            onAudioStop={handleAudioStop}
                            activeAudio={activeAudio}
                            ref={(el) => (playersRef.current[index] = el)}
                          />
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "pictures-and-sayings" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={searchMoreData[0][0].media_count}
                />
                <div className="categoryRow">
                  <div className="sayingsPhotoItems categoryPhotoSayingsData">
                    {isLoading ? (
                      <>
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                      </>
                    ) : (
                      searchMoreData[0][0].value &&
                      searchMoreData[0][0].value.map((item, idx) => {
                        return (
                          item.sharepoint_image && (
                            <div
                              key={item.id}
                              onClick={() => {
                                const page = Number(activePage ?? 1);
                                const absoluteIndex =
                                  (page - 1) * PER_PAGE + idx;
                                setInitialIndex(absoluteIndex);
                                setOverlayOpen(true);
                              }}
                            >
                              <SayingsPhotoCard
                                src={
                                  item.image != null
                                    ? item.image
                                    : "/assets/media/writings/Sayings/img1.png"
                                }
                              />
                            </div>
                          )
                        );
                      })
                    )}

                    {/* Overlay with reversed navigation */}
                    {isOverlayOpen && (
                      <PictureSayingsSearchOverlay
                        closeOverlayPhoto={closeOverlayPhoto}
                        initialIndex={initialIndex}
                        activePage={activePage} // ✅ هنا أضفنا الـ activePage الفعلي
                        perPage={PER_PAGE}
                        handleZoom={handleZoom}
                      />
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "poems" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={searchMoreData[0][0].media_count}
                />
                <div className="categoryRow">
                  <div className=" PoemsItems categoryPoemsData">
                    {searchMoreData[0][0].value &&
                      searchMoreData[0][0].value.map((item) => {
                        return (
                          <PoemsCard
                            src={`/poems/${item.slug}`}
                            title={item.name}
                            desc={item.poem}
                            key={item.id}
                          />
                        );
                      })}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "questions-answers" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={
                    searchMoreData[0][0] && searchMoreData[0][0].media_count
                  }
                />
                <div className="categoryRow">
                  <div className="questionsItems categoryQuestionsData">
                    {isLoading ? (
                      <>
                        <SkeletonQuestionCard />
                        <SkeletonQuestionCard />
                        <SkeletonQuestionCard />
                      </>
                    ) : (
                      searchMoreData[0][0] &&
                      searchMoreData[0][0].value.map((item) => {
                        return (
                          <QuestionCard
                            ques={item.question}
                            answer={item.answer}
                            audio={item.audio}
                            key={item.id}
                            checkAudio={item.sharepoint_uodated}
                            onAudioPlay={handleAudioPlay}
                            onAudioStop={handleAudioStop}
                            activeAudio={activeAudio}
                            setActiveAudio={setActiveAudio}
                          />
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "happen" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={searchMoreData[0][0].media_count}
                />
                <div className="categoryRow">
                  <div className="eventsItems categoryHappenData">
                    {isLoading ? (
                      <>
                        <SkeletonHappenTopicContainer />
                        <SkeletonHappenTopicContainer />
                        <SkeletonHappenTopicContainer />
                      </>
                    ) : (
                      searchMoreData[0][0].value &&
                      searchMoreData[0][0].value.slice(0, 2).map((item) => {
                        return (
                          <EventCard
                            date={item.date}
                            title={item.name}
                            desc={item.event}
                            img={
                              item.image != null
                                ? item.image
                                : `/assets/media/writings/article.png`
                            }
                            key={item.id}
                          />
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {id == "documents" ? (
              <>
                <CategoryHeader
                  cate={searchMoreData[0][0] && searchMoreData[0][0].key}
                  count={searchMoreData[0][0].media_count}
                />
                <div className="categoryRow">
                  <div className="docsItems categoryDocsData">
                    {isLoading ? (
                      <>
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                        <SkeletonDocumentCard />
                      </>
                    ) : (
                      searchMoreData[0][0].value &&
                      searchMoreData[0][0].value.map((item, index) => {
                        return (
                          <React.Fragment key={item.id}>
                            <DocsCard
                              src={
                                item.image != null
                                  ? item.image
                                  : `/assets/media/writings/docs/docs.png`
                              }
                              key={item.id}
                              handleImageClick={() =>
                                handleImageClickDocs(
                                  item.image,
                                  index,
                                  searchMoreData[0][0].value,
                                  localStorage.getItem("search")
                                )
                              }
                            />
                            {isOverlayVisibleDocs && (
                              <DocOverlay
                                closeOverlay={closeOverlayDocs}
                                img={clickedImage}
                                cate={clickedCategory}
                                imgs={overlayImgs}
                                initialSlide={clickedImageIndex}
                                activePage={activePage}
                              />
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                  <Paginate
                    pageCount={pageCount}
                    onPress={handleChangePage}
                    activePage={activePage}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
