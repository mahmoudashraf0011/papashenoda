import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CatagorySayingWriteCard from "../Categories/CatagorySayingWriteCard";
import CategoryHeader from "../CategoryHeader";
import DataByCategoryHook from "../../../Logic/Categories/DataByCategoryHook";
import "./CategoryMoreContainer.css";
import "../../../Pages/Category/Responsive/CategoryRes.css";
import "../../../Pages/Category/Responsive/CategoryRes.css";
import CatagoryFilter from "../CategoryFilter";
import OneBook, { SkeletonBookCard } from "../../Books/OneBook";
import VisitsImg from "../../Visits/VisitsImg";
import CategoryVideoCard, {
  SkeletonLoadingVideo,
} from "../Categories/CategoryVideoCard";
import CategorySoundCard, {
  SkeletonCategorySoundCard,
} from "../Categories/CategorySoundCard";
import SayingsPhotoCard from "../../Media/Writings/Sayings/SayingsPhotoCard";
import PoemsCard from "../../Media/Writings/Poems/PoemsCard";
import QuestionCard from "../../Media/Writings/Questions/QuestionCard";
import EventCard from "../../Home/EventCard";
import ArticlesCard, {
  SkeletonArticleCard,
} from "../../Media/Writings/Articles/ArticlesCard";
import DocsCard from "../../Media/Writings/Docs/DocsCard";
import DataByCategoryMoreHook from "../../../Logic/Categories/DataByCategoryMoreHook";
import Paginate from "../../Utility/Paginate";
import SayingWriteCard from "../../Media/Writings/Sayings/SayingWriteCard";
import VisitsOverlay from "../../Visits/VisitsOverlay";
import DocOverlay from "../../Media/Writings/Docs/DocOverlay";
import CategoryVisitOverlay from "../CategoryVisitOverlay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import SkeletonVideosSection from "../../Videos/SkeletonVideosSection";
import SkeletonQuestionCard from "../../Media/Writings/Questions/SkeletonQuestionCard";
import SkeletonHappenTopicContainer from "../../Happen/SkeletonHappenTopicContainer";
import SkeletonDocsSection from "../../Media/Writings/Docs/SkeletonDocsSection";
import SkeletonSayingWriteCard from "../../Media/Writings/Sayings/SkeletonSayingWriteCard";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import OneBookC from "../../Books/OneBookC";
import SkeletonArticlesCard from "../../../Pages/Media/Writings/Articles/SkeletonArticlesCard";
import SkeletonVisitsSection from "../../Visits/SkeletonVisitsSection";
import SkeletonArticlesCard1 from "../../../Pages/Media/Writings/Articles/SkeletonArticlesCard1";
import PictureSayingsCateOverlay from "./PictureSayingsCateOverlay";
import { SkeletonDocumentCard } from "./SkeletonDocumentCard";
import { SkeletonLoadingAudioRes } from "../Categories/SkeletonLoadingAudioRes";
export default function CategoryMoreContainer({
  title,
  data,
  pageCount,
  handleChangePage,
  cate,
  activePage,
}) {
  const { mediaID } = useParams();
  const { baseURL } = useContext(UserContext);

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
   // Make sure we clear overlay state and restore page scroll
  setOverlayVisibleDocs(false);
  setClickedImage(null);
  setClickedImageIndex(null); // clear index so next open is clean
  setOverlayImgs([]); // optional, clear media list
  setClickedCategory(null);
  document.body.style.overflow = "auto";
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleImageClicked = (index) => {
    setCurrentIndex(index);
    console.log("ind", index);
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
    if (nextIndex < data[0].value.length) {
      // Ensure it doesn't exceed the length
      playersRef.current[nextIndex].audio.current.play();
      handlePlay(nextIndex);
    }
  };

  //for saying photo
  // Original slides array
  let slides;
  let reversedSlides;
  if (mediaID == "pictures-and-sayings") {
    slides = Array.isArray(data?.[0]?.value)
      ? data[0].value.map((item) => ({ image: item.image, id: item.id }))
      : [];

    // Create reversed slides for inverted navigation
    reversedSlides = slides.slice().reverse();
  }

  // Overlay state
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Swiper instance ref
  const swiperRefPhoto = useRef(null);

  // Handlers
  const openOverlay = (index) => {
    // calculate index in reversedSlides
    console.log("slides", slides);
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

  const PER_PAGE = 8; // MUST match server per_page for pictures-and-sayings
  const [isPicsOverlayOpen, setPicsOverlayOpen] = useState(false);
  const [picsInitialIndex, setPicsInitialIndex] = useState(0);

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

  return (
    <div className="CategoryMoreContainer">
      <div className="Container">
        {Array.isArray(data) &&
        data.length > 0 &&
        Array.isArray(data[0].value) &&
        data[0].value.length > 0 ? (
          mediaID == "written-quotes" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className=" sayingsWriteItems">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonSayingWriteCard />
                      <SkeletonSayingWriteCard />
                      <SkeletonSayingWriteCard />
                      <SkeletonSayingWriteCard />
                      <SkeletonSayingWriteCard />
                      <SkeletonSayingWriteCard />
                    </>
                  ) : (
                    data[0].value &&
                    data[0].value.map((item) => {
                      return (
                        <SayingWriteCard
                          img={
                            item.sharepoint_image
                              ? item.image
                              : "/assets/default/written/insideWritten.png"
                          }
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "books" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />

              <div className="categoryBooksData" style={{width:"100% !important"}}>
                <div key={`book-${Math.random() * 10}`} className="" style={{ width:"1000px" }}>
                  {data[0].value &&
                    Array.from(
                      { length: Math.ceil(data[0].value.length / 3) },
                      (_, i) => (
                        <div
                          key={`book-group-${i}`}
                          style={{ position: "relative" }}
                        >
                          <div>
                            {!isLoading ? (
                              // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                              <>
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                              </>
                            ) : (
                              data[0].value
                                .slice(i * 3, i * 3 + 3)
                                .map((subbook, subIndex) => (
                                  <OneBookC
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
                <div key={`book-${Math.random() * 10}`} className="" >
                  {data[0].value &&
                    Array.from(
                      { length: Math.ceil(data[0].value.length / 2) },
                      (_, i) => (
                        <div
                          key={`book-group-${i}`}
                          style={{ position: "relative" }}
                        >
                          <div className="items">
                            {isLoading ? (
                              // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                              <>
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                              </>
                            ) : (
                              data[0].value
                                .slice(i * 2, i * 2 + 2)
                                .map((subbook, subIndex) => (
                                  <OneBook
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
                  {data[0].value &&
                    Array.from(
                      { length: Math.ceil(data[0].value.length / 1) },
                      (_, i) => (
                        <div
                          key={`book-group-${i}`}
                          style={{ position: "relative" }}
                        >
                          <div className="items">
                            {isLoading ? (
                              // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                              <>
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                                <SkeletonBookCard />
                              </>
                            ) : (
                              data[0].value
                                .slice(i * 1, i * 1 + 1)
                                .map((subbook, subIndex) => (
                                  <OneBook
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
              <Paginate pageCount={pageCount} onPress={handleChangePage} />
            </>
          ) : mediaID == "video" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="categoryVideoData">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonLoadingVideo />
                      <SkeletonLoadingVideo />
                      <SkeletonLoadingVideo />
                    </>
                  ) : (
                    data[0] &&
                    data[0].value.map((item) => {
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "event-gallery" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="visits-imgs-cont categoryGalleryData">
                  {data[0].value &&
                    data[0].value.map((item, i) => {
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
                {isOverlayVisible && (
                  <CategoryVisitOverlay
                    closeOverlay={closeOverlay}
                    visitsImgs={data[0]}
                    index={currentIndex}
                  />
                )}
              </div>
            </>
          ) : mediaID == "article" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="articleItems categoryArticleData">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonArticleCard />
                      <SkeletonArticleCard />
                      <SkeletonArticleCard />
                      <SkeletonArticleCard />
                      <SkeletonArticleCard />
                      <SkeletonArticleCard />
                    </>
                  ) : (
                    data[0].value &&
                    data[0].value.map((item) => {
                      return (
                        <ArticlesCard
                          img={
                            item.sharepoint_image
                              ? item.image
                              : "/assets/default/articles/Articles - inside.png"
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "audio" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="categorySoundData">
                  {
                    // إذا كانت البيانات في حالة تحميل
                    isLoading ? (
                      // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                      <>
                        {Array.from({ length: 5 }).map((_, idx) =>
                          isMobile ? (
                            <>
                              <SkeletonLoadingAudioRes key={idx} />
                            </>
                          ) : (
                            <SkeletonCategorySoundCard key={idx} />
                          )
                        )}
                      </>
                    ) : (
                      // عرض CategorySoundCard بعد تحميل البيانات
                      data[0].value &&
                      [...data[0].value].reverse().map((item, index) => {
                        return (
                          <CategorySoundCard
                            key={item.id}
                            index={index}
                            audio={item.url}
                            title={item.name}
                            isPlaying={currentPlayingIndex === index}
                            hasPrev={index > 0} // Only show prev if there's a previous item
                            hasNext={
                              index < data[0].value.slice(0, 6).length - 1
                            } // Ensure next is calculated after slice
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
                    )
                  }
                </div>
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "pictures-and-sayings" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="sayingsPhotoItems categoryPhotoSayingsData">
                  {
                    // إذا كانت البيانات في حالة تحميل
                    isLoading ? (
                      // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                      <>
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                        <SkeletonArticlesCard1 />
                      </>
                    ) : (
                      data[0].value &&
                      data[0].value.map((item, idx) => {
                        return (
                          item.sharepoint_image && (
                            <div
                              onClick={() => {
                                // absolute 0-based index across ALL results
                                const page = Number(activePage ?? 1);
                                const absoluteIndex =
                                  (page - 1) * PER_PAGE + idx;
                                setPicsInitialIndex(absoluteIndex);
                                setPicsOverlayOpen(true);
                                // optional: lock body scroll
                                document.body.style.overflow = "hidden";
                              }}
                            >
                              <SayingsPhotoCard
                                src={
                                  item.image != null
                                    ? item.image
                                    : `/assets/media/writings/Sayings/img1.png`
                                }
                                key={item.id}
                              />
                            </div>
                          )
                        );
                      })
                    )
                  }
                  {/* Overlay with reversed navigation */}
                  {/* Overlay */}
                  {isPicsOverlayOpen && (
                    <PictureSayingsCateOverlay
                      closeOverlayPhoto={() => {
                        setPicsOverlayOpen(false);
                        document.body.style.overflow = "auto";
                      }}
                      initialIndex={picsInitialIndex}
                      activePage={activePage} // pass paginate page
                      perPage={PER_PAGE} // keep in sync with server
                      handleZoom={handleZoom}
                    />
                  )}
                </div>
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "poems" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className=" PoemsItems categoryPoemsData">
                  {data[0].value &&
                    data[0].value.map((item) => {
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "questions-answers" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="questionsItems categoryQuestionsData">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonQuestionCard />
                      <SkeletonQuestionCard />
                      <SkeletonQuestionCard />
                    </>
                  ) : (
                    data[0].value &&
                    data[0].value.map((item) => {
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
                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "happen" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="eventsItems categoryHappenData">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonHappenTopicContainer />
                      <SkeletonHappenTopicContainer />
                      <SkeletonHappenTopicContainer />
                    </>
                  ) : (
                    data[0].value &&
                    data[0].value.map((item) => {
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

                <Paginate pageCount={pageCount} onPress={handleChangePage} />
              </div>
            </>
          ) : mediaID == "documents" ? (
            <>
              <CategoryHeader
                cate={data[0] && data[0].key}
                count={data[0].count}
              />
              <div className="categoryRow">
                <div className="docsItems categoryDocsData">
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
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
                    data[0].value &&
                    data[0].value.map((item, index) => {
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
                                data[0].value,
                                cate
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
                <Paginate pageCount={pageCount} onPress={handleChangePage}  activePage={activePage}/>
              </div>
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
