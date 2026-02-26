// CategoryContainer.jsx
// category container
import React, { useState, useRef, useContext, useEffect } from "react";
import "./CategoryContainer.css";
import CategoryHeader from "./CategoryHeader";
import DataByCategoryHook from "../../Logic/Categories/DataByCategoryHook";
import { Link, useLocation, useParams } from "react-router-dom";
import SayingWriteCard from "../Media/Writings/Sayings/SayingWriteCard";
import OneBook, { SkeletonBookCard } from "../Books/OneBook";
import SayingsPhotoCard from "../Media/Writings/Sayings/SayingsPhotoCard";
import GalleryImg from "../Gallery/GalleryImg";
import ArticlesCard, {
  SkeletonArticleCard,
} from "../Media/Writings/Articles/ArticlesCard";
import VisitsImg from "../Visits/VisitsImg";
import EventCard from "../Home/EventCard";
import PoemsCard from "../Media/Writings/Poems/PoemsCard";
import CategoryVideoCard, {
  SkeletonLoadingVideo,
} from "./Categories/CategoryVideoCard";
import QuestionCard from "../Media/Writings/Questions/QuestionCard";
import DocsCard from "../Media/Writings/Docs/DocsCard";
import CategorySoundCard, {
  SkeletonCategorySoundCard,
} from "./Categories/CategorySoundCard";
import CatagorySayingWriteCard from "./Categories/CatagorySayingWriteCard";
import VisitsOverlay from "../Visits/VisitsOverlay";
import Spinner from "../Utility/Spinner";
import DocOverlay from "../Media/Writings/Docs/DocOverlay";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import CategoryVisitOverlay from "./CategoryVisitOverlay";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-flip";
import "swiper/css/autoplay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SayingShareContainer from "../Media/Writings/Sayings/SayingShareContainer";
import { toPng } from "html-to-image";
import { OverlayPanel } from "primereact/overlaypanel";
import SayingWriteCardOverlay from "../Media/Writings/Sayings/SayingWriteCardOverlay";
import SkeletonVideoCard from "../Home/SkeletonVideoCard";
import SkeletonVideosSection from "../Videos/SkeletonVideosSection";
import SkeletonQuestionCard from "../Media/Writings/Questions/SkeletonQuestionCard";
import SkeletonHappenTopicContainer from "../Happen/SkeletonHappenTopicContainer";
import SkeletonDocsSection from "../Media/Writings/Docs/SkeletonDocsSection";
import SkeletonArticlesCard from "../../Pages/Media/Writings/Articles/SkeletonArticlesCard";
import SkeletonSayingWriteCard from "../Media/Writings/Sayings/SkeletonSayingWriteCard";
import SkeletonBooksSection from "../Videos/SkeletonBooksSection";
import { faMinus, faPause, faPlus } from "@fortawesome/free-solid-svg-icons";
import DocOverlayOutside from "../Media/Writings/Docs/DocOverlayOutside";
import CategoryVisitOverlayOutside from "./CategoryVisitOverlayOutside";
import { SkeletonLoadingAudioCategRes } from "./Categories/SkeletonLoadingAudioCategRes";

export default function CategoryContainer({
  categoryBookData,
  categoryGalleryData,
  categoryVideoData,
  categoryArticleData,
  categorySoundData,
  categorySayingsData,
  categoryPhotoSayingsData,
  categoryPoemsData,
  categoryQuestionsData,
  categoryHappenData,
  categoryDocsData,
  handleImageClick,
  all,
  check,
  ele,
  loading,
  cate,
}) {


  // variables
  const { id } = useParams();
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { baseURL } = useContext(UserContext);
  const [visitsImgs, setVisitsImgs] = useState(null);
  const [ID, setID] = useState();
  const fetchVisits = (id) => {
    axios
      .get(`${baseURL}/get-images/${id}?lang=ar`)
      .then((response) => {
        setVisitsImgs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleImageClicked = (index) => {
    setCurrentIndex(index);
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

  const playersRef = useRef([]); // Array of refs for all players
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  const [iconShow, setIconShow] = useState(faPlus);
  const handlePlay = (id, isCategorySoundCard) => {
    // Pause any currently playing audio
    if (currentPlayingIndex !== id) {
      const previousPlayer = playersRef.current[currentPlayingIndex];
      if (previousPlayer && previousPlayer.audio.current) {
        previousPlayer.audio.current.pause();
      }
    }
    // Set the current playing id
    setCurrentPlayingIndex(id);
    // لو الصوت من CategorySoundCard
    if (isCategorySoundCard) {
      setIconShow(faPause); // وضع الايقونة على pause في CategorySoundCard
    } else {
      setIconShow(faMinus); // وضع الايقونة على minus في QuestionCard
    }
  };

  // 🔊 Track globally-active audio (category | question)
  const [activeAudio, setActiveAudio] = useState({
    type: null,
    id: null,
    ref: null,
  });

  // ✅ Parent: pause previous first, then just mark the new one (keep synchronous)
  const handleAudioPlay = (audioType, audioId, audioRef) => {
    if (activeAudio.ref && activeAudio.ref !== audioRef) {
      try {
        activeAudio.ref.pause();
      } catch {}
    }
    setActiveAudio({ type: audioType, id: audioId, ref: audioRef });
  };

  // ✅ Only clear the active audio if the same ref stopped
  // ⚠️ Fixed (functional setState) to avoid race when switching from Category → Question
  const handleAudioStop = (stoppedRef) => {
    setActiveAudio((prev) => {
      if (!stoppedRef) return { type: null, id: null, ref: null };
      if (prev && prev.ref === stoppedRef) {
        return { type: null, id: null, ref: null };
      }
      // If a different audio became active in the meantime, keep it.
      return prev;
    });
  };

  // 🔑 Synchronous gate so play() remains in the SAME user gesture
  const requestPlay = (audioType, audioId, audioRef) => {
    // good: pauses ALL category players, NOT the target
    playersRef.current.forEach((p) => {
      const el = p?.audio?.current;
      if (el && el !== audioRef) {
        try {
          el.pause();
        } catch {}
      }
    });

    // also pause previously active (if different from the new target)
    if (activeAudio.ref && activeAudio.ref !== audioRef) {
      try {
        activeAudio.ref.pause();
      } catch {}
    }
    setActiveAudio({ type: audioType, id: audioId, ref: audioRef });
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
    if (nextIndex < categorySoundData[0].value.length) {
      // Ensure it doesn't exceed the length
      playersRef.current[nextIndex].audio.current.play();
      handlePlay(nextIndex);
    }
  };
  // State to detect if mobile view is active
  const [isMobile, setIsMobile] = useState(false);

  // Handle resizing to determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 667);
    };

    handleResize(); // Check initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // sayings card ***********************************************
  const op = useRef();

  // get current path
  const location = useLocation();
  const currentPath = `${window.location.origin}${location.pathname}${location.search}`;

  // get image from on Drive
  function convertOneDriveLink(onedriveUrl) {
    try {
      const url = new URL(onedriveUrl);
      const fileId = url.searchParams.get("id");
      if (!fileId) {
        return null;
      }
      const directLink = `https://popeshenoudaacademy-my.sharepoint.com/personal/msoul_zvf-eg_org/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(
        fileId
      )}`;
      return directLink;
    } catch (error) {
      return null;
    }
  }
  // const directLink = img ? convertOneDriveLink(img) : null;

  // Copy Data
  const [selectedItem, setSelectedItem] = useState(null);
  const copyData = async (item) => {
    setSelectedItem(item);
    try {
      const plainTextDesc = selectedItem.quote.replace(/<[^>]+>/g, "");
      const message = `\n\n"${plainTextDesc || ""}"\n\n- ${
        selectedItem.name || ""
      } ${selectedItem.ref ? `(${selectedItem.ref})` : ""}`;
      await navigator.clipboard.writeText(message);
      toast.success("تم النسخ بنجاح");
    } catch (error) {
      toast.error("عذرا ..قم بالمحاولة لاحقا");
      console.error("Failed to copy:", error);
    }
  };
  // Download Card
  const cardRefs = useRef(new Map());
  const buttonDownload = useRef();
  const generateImageWithoutButton = (name) => {
    const cardElement = cardRefs.current.get(name);

    if (cardElement) {
      toPng(cardElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${name || "card"}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image:", error.message, error);
        });
    }
  };

  // more to read
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);
  const [isOverlayCard, setOverlayCard] = useState(false);
  const [isOverlayDots, setIsOverlayDots] = useState(false);
  const [isOverlayBlockShare, setOverlayBlockShare] = useState(false);

  const handleCardOverlay = (item) => {
    setSelectedItem(item);
    document.body.classList.add("no-scroll");
    setOverlayCard(true);
    const header = document.querySelector(".header");
    if (header) header.style.zIndex = "1000";
  };
  const handleCardOverlayClose = () => {
    setSelectedItem(null);
    document.body.classList.remove("no-scroll");
    setOverlayCard(false);
  };

  const handleOverlayToggle = (e, item) => {
    setSelectedItem(item);
    op.current.toggle(e);
    setIsOverlayDots((prev) => !prev);
    const header = document.querySelector(".header");
    if (header) header.style.zIndex = "10000";
  };
  const openShareBlock = (item) => {
    document.body.classList.add("no-scroll");
    setOverlayBlockShare(true);
  };
  const closeShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockShare(false);
    setIsOverlayDots(false);
  };

  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.update(); // Updates Swiper instance
    }
  }, [categoryDocsData]);

  //for saying photo
  // Original slides array
  const slides = Array.isArray(categoryPhotoSayingsData?.[0]?.value)
    ? categoryPhotoSayingsData[0].value.map((item) => ({
        image: item.image,
        id: item.id,
      }))
    : [];

  // Create reversed slides for inverted navigation
  const reversedSlides = slides.slice(0, 4).reverse();

  // Overlay state
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Swiper instance ref
  const swiperRefPhoto = useRef(null);
  const swiperRefPhotoRes = useRef(null);

  // Handlers
  // always Swiper (reversed) index
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  function openOverlay(originalIdx) {
    // map clicked index (original order) -> reversed order
    const start = reversedSlides.length - 1 - originalIdx;
    setActiveIndex(start);
    setOverlayOpen(true);

    // Make sure Swiper jumps to the right slide once it exists
    // (safe-guard if overlay renders before onSwiper fires)
    setTimeout(() => {
      const s = swiperRefPhoto.current;
      if (s) {
        s.slideTo(start, 0);
        setIsAtStart(s.isBeginning);
        setIsAtEnd(s.isEnd);
      }
    }, 0);
  }
function openOverlayRes(originalIdx) {
  const start = Math.max(0, reversedSlides.length - 1 - originalIdx);
  setActiveIndex(start); // still store swapped index if you're using reversed order throughout
  setOverlayOpen(true);

  setTimeout(() => {
    const s = swiperRefPhotoRes.current;
    if (s?.slideTo) {
      s.slideTo(start, 0);
      setIsAtStart(s.isBeginning);
      setIsAtEnd(s.isEnd);
    }
  }, 0);
}
  const closeOverlayPhoto = () => {
    setOverlayOpen(false);
  };

  const handleZoom = (e) => {
    e.target.classList.toggle("zoomed");
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // محاكاة جلب البيانات من API
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const checkDataLoading = (dataArray) => {
    return dataArray && dataArray.length > 0 && dataArray[0]?.value?.length > 0;
  };
  const [loadingStates, setLoadingStates] = useState({
    video: true,
    sound: true,
    book: true,
    article: true,
    questions: true,
    sayings: true,
    photoSayings: true,
    gallery: true,
    happen: true,
    poems: true,
    docs: true,
  });
  useEffect(() => {
    // تحديث حالات التحميل عندما تصل البيانات
    setLoadingStates((prev) => ({
      ...prev,
      video: !checkDataLoading(categoryVideoData),
      sound: !checkDataLoading(categorySoundData),
      book: !checkDataLoading(categoryBookData),
      article: !checkDataLoading(categoryArticleData),
      questions: !checkDataLoading(categoryQuestionsData),
      sayings: !checkDataLoading(categorySayingsData),
      photoSayings: !checkDataLoading(categoryPhotoSayingsData),
      gallery: !checkDataLoading(categoryGalleryData),
      happen: !checkDataLoading(categoryHappenData),
      poems: !checkDataLoading(categoryPoemsData),
      docs: !checkDataLoading(categoryDocsData),
    }));
  }, [
    categoryVideoData,
    categorySoundData,
    categoryBookData,
    categoryArticleData,
    categoryQuestionsData,
    categorySayingsData,
    categoryPhotoSayingsData,
    categoryGalleryData,
    categoryHappenData,
    categoryPoemsData,
    categoryDocsData,
  ]);

  // ====== Unified download handler ======

  // ---------- Helpers ----------

  // Function to check if the URL is a SharePoint URL
  const isSharePointUrl = (u) => {
    try {
      const x = new URL(u);
      return (
        x.hostname.includes(".sharepoint.com") ||
        x.hostname.includes("1drv.ms") ||
        /\/_layouts\/15\/download\.aspx/i.test(x.pathname)
      );
    } catch {
      return false;
    }
  };

  // Function to check if the URL is an MSOL CDN URL
  const isMSOLCdnUrl = (u) => {
    try {
      const x = new URL(u, window.location.href);
      return (
        /(^|\.)msol\.dev$/i.test(x.hostname) &&
        x.hostname.toLowerCase().includes("popeshenoudatest") &&
        x.pathname.startsWith("/media_files/")
      );
    } catch {
      return false;
    }
  };

  // Normalize any SharePoint/OneDrive link to download.aspx
  function toSharePointDownload(u) {
    try {
      const url = new URL(u);

      // Already on download.aspx → ensure download=1
      if (/\/_layouts\/15\/download\.aspx/i.test(url.pathname)) {
        if (!url.searchParams.get("download"))
          url.searchParams.set("download", "1");
        return url.toString();
      }

      // Support id/SourceUrl or UniqueId
      const id =
        url.searchParams.get("id") || url.searchParams.get("SourceUrl");
      const uniqueId = url.searchParams.get("UniqueId");

      const base = `${url.origin}/_layouts/15/download.aspx`;
      const qs = new URLSearchParams();
      if (id) qs.set("SourceUrl", id);
      if (uniqueId) qs.set("UniqueId", uniqueId);
      qs.set("download", "1");
      return `${base}?${qs.toString()}`;
    } catch {
      return u;
    }
  }

  // Convert OneDrive link to SharePoint download link
  function convertOneDriveLink(onedriveUrl) {
    try {
      if (!onedriveUrl) return null;
      const url = new URL(onedriveUrl);
      if (url.searchParams.get("download") === "1") return onedriveUrl;
      return toSharePointDownload(onedriveUrl);
    } catch {
      return null;
    }
  }

  // Convert MSOL CDN image URL to PHCMS download API
  function toPhcmsDownload(u) {
    try {
      const url = new URL(u, window.location.href);
      const baseNameWithExt = url.pathname.split("/").pop() || "";
      const id = baseNameWithExt.split(".")[0]; // Strip extension
      if (!id) return u;
      return `${baseURL}/download/media/${id}.jpg`;
    } catch {
      return u;
    }
  }

  // Sanitize file name for download
  const sanitizeFileName = (s, fall = "file") => {
    const base = (s || "").toString().trim() || fall;
    return base.replace(/[\\/:*?"<>|]+/g, "_").slice(0, 120);
  };

  // Extract filename from URL
  const getFilenameFromUrl = (url, fallback = "file") => {
    try {
      const u = new URL(url, window.location.href);
      const last = u.pathname.split("/").pop() || "";
      const name = decodeURIComponent((last.split("?")[0] || "").trim());
      return sanitizeFileName(name || fallback);
    } catch {
      return sanitizeFileName(fallback);
    }
  };

  // Check if URL is from the same origin
  const isSameOrigin = (url) => {
    try {
      return (
        new URL(url, window.location.href).origin === window.location.origin
      );
    } catch {
      return false;
    }
  };

  // Force download using iframe (does not open a new tab)
  const forceDownload = (url) => {
    const dlUrl = (() => {
      try {
        const u = new URL(url, window.location.href);
        if (
          !/download\.aspx/i.test(u.pathname) &&
          u.searchParams.get("download") !== "1"
        ) {
          u.searchParams.set("download", "1");
        }
        return u.toString();
      } catch {
        return url;
      }
    })();

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = dlUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 60000);
  };

  // Resolve the correct download URL based on SharePoint, MSOL, or default URL
  const resolveDownloadUrl = (u) => {
    if (!u) return null;
    if (isSharePointUrl(u)) return convertOneDriveLink(u);
    if (isMSOLCdnUrl(u)) return toPhcmsDownload(u);
    return u;
  };

  // Download file with various fallback mechanisms
  const downloadFile = async (url, suggestedName) => {
    if (!url) return;

    // Handle SharePoint / OneDrive download
    if (isSharePointUrl(url)) {
      const spUrl = toSharePointDownload(url);
      forceDownload(spUrl);
      return;
    }

    // Same origin → fetch and download using blob
    if (isSameOrigin(url)) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = sanitizeFileName(
          suggestedName || getFilenameFromUrl(url, "file")
        );
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      } catch (e) {
        // Fallback to iframe download
        forceDownload(url);
        return;
      }
    }

    // Cross-origin: Try CORS fetch → blob (if CORS is enabled on the server)
    try {
      const res = await fetch(url, { mode: "cors", credentials: "omit" });
      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = sanitizeFileName(
          suggestedName || getFilenameFromUrl(url, "file")
        );
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      }
    } catch {
      // Ignore errors
    }

    // No CORS → use iframe (prefer server with Content-Disposition header)
    forceDownload(url);
    toast.info(
      "تمت محاولة التحميل. لو لم يبدأ، فعِّل Content-Disposition أو أضف ?download=1 مدعومة من السيرفر."
    );
  };

  // ---------- Component for Handling Downloads ----------

  const handleDownloadClick = (item) => {
    // Resolving the download link
    const resolvedUrl = resolveDownloadUrl(item.image); // assuming item.image is the URL to download
    // Download file with the resolved URL and suggested filename
    downloadFile(
      resolvedUrl,
      `${sanitizeFileName(
        item.name || getFilenameFromUrl(resolvedUrl, "file")
      )}`
    );
  };

  return (
    <div className="categoryArticles categoryContainer">
      {all.length != 0 ? (
        <div className="Container">
          {/* Videos */}
          {categoryVideoData[0] ? (
            <>
              <CategoryHeader
                cate={categoryVideoData[0] && categoryVideoData[0].key}
                count={categoryVideoData[0].count}
                src={`/category/${id}/more/${categoryVideoData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className="categoryVideoData">
                  {loadingStates.video ? (
                    <>
                      <SkeletonLoadingVideo />
                      <SkeletonLoadingVideo />
                      <SkeletonLoadingVideo />
                    </>
                  ) : (
                    categoryVideoData[0].value &&
                    categoryVideoData[0].value.map((item) => {
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
                <div
                  className="categoryVideoDataRes"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryVideoData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {loadingStates.video ? (
                      <>
                        <SkeletonLoadingVideo />
                        {/* <SkeletonLoadingVideo />
                                                        <SkeletonLoadingVideo /> */}
                      </>
                    ) : categoryVideoData[0].value ? (
                      categoryVideoData[0].value.slice(0, 6).map((item, i) => {
                        return (
                          <SwiperSlide key={item.id}>
                            <CategoryVideoCard
                              item={item}
                              desc={item.name}
                              src={item.id}
                            />
                          </SwiperSlide>
                        );
                      })
                    ) : (
                      ""
                    )}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {categoryVideoData[0].value.length > 5 && (
                  <Link
                    to={`/category/${id}/more/${categoryVideoData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Sounds */}
          {categorySoundData[0] ? (
            <>
              {categorySoundData[0] && (
                <>
                  <CategoryHeader
                    cate={categorySoundData[0].key}
                    count={categorySoundData[0].count}
                    src={`/category/${id}/more/${categorySoundData[0].media_type_slug}`}
                  />

                  <div className="categoryRow">
                    {/* Desktop or Default View */}
                    {!isMobile && (
                      <div className="categorySoundData">
                        {loadingStates.sound ? (
                          <>
                            <SkeletonLoadingVideo />
                            <SkeletonLoadingVideo />
                            <SkeletonLoadingVideo />
                          </>
                        ) : (
                          categorySoundData[0].value &&
                          categorySoundData[0].value
                            .slice(0, 6)
                            .map((item, index) => (
                              <CategorySoundCard
                                key={item.id}
                                index={index}
                                audio={item.url}
                                title={item.name}
                                isPlaying={currentPlayingIndex === index}
                                hasPrev={index > 0}
                                hasNext={
                                  index <
                                  categorySoundData[0].value.slice(0, 6)
                                    .length -
                                    1
                                }
                                onPlay={handlePlay}
                                onPrev={handlePrev}
                                onNext={handleNext}
                                onAudioPlay={handleAudioPlay}
                                onAudioStop={handleAudioStop}
                                onRequestPlay={requestPlay}
                                activeAudio={activeAudio}
                                ref={(el) => (playersRef.current[index] = el)}
                              />
                            ))
                        )}
                      </div>
                    )}

                    {/* Mobile View */}
                    {isMobile && (
                      <div className="categorySoundDataRes" dir="rtl">
                        <Swiper
                          direction="horizontal"
                          spaceBetween={20}
                          slidesPerView={
                            categorySoundData[0].value.length > 1 ? 1.3 : 1
                          }
                          pagination={{
                            clickable: true,
                            el: ".swiper-pagination",
                          }}
                          modules={[Autoplay, Pagination]}
                          speed={2000}
                        >
                          {loadingStates.sound ? (
                          <>
                            <SkeletonLoadingAudioCategRes />
                            <SkeletonLoadingAudioCategRes />
                            <SkeletonLoadingAudioCategRes />
                          </>
                        ) : (
                          categorySoundData[0].value
                            ?.slice(0, 6)
                            .map((item, index) => (
                              <SwiperSlide key={item.id}>
                                <CategorySoundCard
                                  index={index}
                                  audio={item.url}
                                  title={item.name}
                                  isPlaying={currentPlayingIndex === index}
                                  hasPrev={index > 0}
                                  hasNext={
                                    index <
                                    categorySoundData[0].value.slice(0, 6)
                                      .length -
                                      1
                                  }
                                  onPlay={handlePlay}
                                  onPrev={handlePrev}
                                  onNext={handleNext}
                                  onAudioPlay={handleAudioPlay}
                                  onAudioStop={handleAudioStop}
                                  onRequestPlay={requestPlay}
                                  activeAudio={activeAudio}
                                  ref={(el) => (playersRef.current[index] = el)}
                                />
                              </SwiperSlide>
                            ))
                            )}
                          <div className="swiper-pagination"></div>
                        </Swiper>
                      </div>
                    )}

                    {categorySoundData[0].value.length > 5 && (
                      <Link
                        to={`/category/${id}/more/${categorySoundData[0].media_type_slug}`}
                        className="more_btn"
                        target="_blank"
                      >
                        المزيد
                      </Link>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            ""
          )}

          {/* Books */}
          {categoryBookData[0] ? (
            <div className="cateBook">
              <CategoryHeader
                cate={categoryBookData[0] && categoryBookData[0].key}
                count={categoryBookData[0].count}
                src={`/category/${id}/more/${categoryBookData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className=" categoryBooksData">
                  {isLoading ? (
                    <>
                      <SkeletonBookCard />
                      <SkeletonBookCard />
                      <SkeletonBookCard />
                    </>
                  ) : (
                    categoryBookData[0].value &&
                    categoryBookData[0].value.slice(0, 3).map((item) => {
                      return (
                        <OneBook
                          key={item.id}
                          src={
                            item.sharepoint_image
                              ? item.image
                              : "/assets/default/books/Book - inside.png"
                          }
                          info={item.name}
                          book={item.url}
                          book_id={item.id}
                          slug={item.slug}
                        />
                      );
                    })
                  )}
                  <img
                    className="books-head-stand2"
                    src="/assets/books-5.png"
                    alt="stand"
                  />
                </div>
                <div
                  className=" categoryBooksDataResIpad"
                  style={{ display: "none" }}
                >
                  {categoryBookData[0].value &&
                    categoryBookData[0].value.slice(0, 2).map((item) => {
                      return (
                        <OneBook
                          key={item.id}
                          src={
                            item.sharepoint_image
                              ? item.image
                              : "/assets/default/books/Book - inside.png"
                          }
                          info={item.name}
                          book={item.url}
                          book_id={item.id}
                          slug={item.slug}
                        />
                      );
                    })}
                  <img
                    className="books-head-stand2"
                    src="/assets/books-5.png"
                    alt="stand"
                  />
                </div>
                <div
                  className="categoryBooksDataCateRes"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={70}
                    slidesPerView={
                      categoryBookData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {isLoading ? (
                    <>
                      <SkeletonBookCard />
                      <SkeletonBookCard />
                      <SkeletonBookCard />
                    </>
                  ) : (
                    categoryBookData[0].value
                      ? categoryBookData[0].value.slice(0, 3).map((item) => {
                          return (
                            <SwiperSlide key={item.id}>
                              <OneBook
                                src={
                                  item.sharepoint_image
                                    ? item.image
                                    : "/assets/default/books/Book - inside.png"
                                }
                                info={item.name}
                                book={item.url}
                                book_id={item.id}
                                slug={item.slug}
                              />
                              <img
                                className="books-head-stand2"
                                src="/assets/books-5.png"
                                alt="stand"
                              />
                            </SwiperSlide>
                          );
                        })
                      : "")}
                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {categoryBookData[0] && categoryBookData[0].value.length > 3 ? (
                  <Link
                    to={`/category/${id}/more/${categoryBookData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Articles */}
          {categoryArticleData[0] ? (
            <>
              <CategoryHeader
                cate={categoryArticleData[0] && categoryArticleData[0].key}
                count={categoryArticleData[0].count}
                src={`/category/${id}/more/${categoryArticleData[0].media_type_slug}`}
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
                    categoryArticleData[0].value &&
                    categoryArticleData[0].value.slice(0, 4).map((item) => {
                      return (
                        <ArticlesCard
                          img={
                            item.sharepoint_image
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
                <div
                  className="categoryArticleDataResCate"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryArticleData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryArticleData[0].value
                      ? categoryArticleData[0].value
                          .slice(0, 6)
                          .map((item, i) => {
                            return (
                              <SwiperSlide key={item.id}>
                                <ArticlesCard
                                  img={
                                    item.image != null
                                      ? item.image
                                      : `/assets/media/writings/article/articleItem.png`
                                  }
                                  title={item.name}
                                  desc={item.description}
                                  src={`/articles/${item.slug}`}
                                  check={item.sharepoint_image}
                                />
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {categoryArticleData[0].value.length > 4 && (
                  <Link
                    to={`/category/${id}/more/${categoryArticleData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Questions */}
          {categoryQuestionsData[0] ? (
            <>
              <CategoryHeader
                cate={categoryQuestionsData[0] && categoryQuestionsData[0].key}
                count={categoryQuestionsData[0].count}
                src={`/category/${id}/more/${categoryQuestionsData[0].media_type_slug}`}
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
                    categoryQuestionsData[0].value &&
                    categoryQuestionsData[0].value.slice(0, 3).map((item) => {
                      return (
                        <QuestionCard
                          ques={item.question}
                          answer={item.answer}
                          audio={item.audio}
                          key={item.id}
                          checkAudio={true}
                          onAudioPlay={handleAudioPlay}
                          onAudioStop={handleAudioStop}
                          onRequestPlay={requestPlay}
                          activeAudio={activeAudio}
                          setActiveAudio={setActiveAudio}
                          id={item.id}
                        />
                      );
                    })
                  )}
                </div>
                <div
                  className="categoryQuestionsDataRes"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryQuestionsData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryQuestionsData[0].value
                      ? categoryQuestionsData[0].value
                          .slice(0, 3)
                          .map((item, i) => {
                            return (
                              <SwiperSlide key={item.id}>
                                <QuestionCard
                                  ques={item.question}
                                  answer={item.answer}
                                  audio={item.audio}
                                  checkAudio={true}
                                  onAudioPlay={handleAudioPlay}
                                  onAudioStop={handleAudioStop}
                                  onRequestPlay={requestPlay}
                                  activeAudio={activeAudio}
                                  setActiveAudio={setActiveAudio}
                                  id={item.id}
                                />
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {categoryQuestionsData[0].value.length > 3 && (
                  <Link
                    to={`/category/${id}/more/${categoryQuestionsData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Sayings (write) */}
          {categorySayingsData[0] ? (
            <>
              <CategoryHeader
                cate={categorySayingsData[0] && categorySayingsData[0].key}
                count={categorySayingsData[0].count}
                src={`/category/${id}/more/${categorySayingsData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className=" sayingsWriteItems">
                  {categorySayingsData[0].value &&
                    categorySayingsData[0].value.slice(0, 2).map((item) => {
                      return (
                        <SayingWriteCard
                          img={
                            item.image != null
                              ? item.image
                              : `/assets/media/writings/Sayings/img1.png`
                          }
                          desc={item.quote}
                          name={item.ref}
                          cate={item.name}
                          key={item.id}
                          checked={item.sharepoint_image}
                        />
                      );
                    })}
                </div>
                <div
                  className="sayingsWriteItemsCateRes"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categorySayingsData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categorySayingsData[0].value
                      ? categorySayingsData[0].value
                          .slice(0, 2)
                          .map((item, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <div
                                  className="sayingWriteCard"
                                  ref={(el) => {
                                    if (el) {
                                      cardRefs.current.set(item.name, el);
                                    } else {
                                      cardRefs.current.delete(item.name);
                                    }
                                  }}
                                >
                                  <div className="sayingWriteCardImg">
                                    {convertOneDriveLink(item.image) ? (
                                      <img
                                        src={convertOneDriveLink(item.image)}
                                        alt="Image from OneDrive"
                                      />
                                    ) : item.image ? (
                                      <img src={item.image} alt="Image" />
                                    ) : (
                                      <img
                                        src="/assets/media/writings/Sayings/img1.png"
                                        alt="Placeholder Image"
                                      />
                                    )}
                                  </div>
                                  <div className="sayingWriteCardContent">
                                    <img
                                      className="signQuote saywImg"
                                      src="/assets/media/writings/Sayings/q1.png"
                                      alt="img"
                                    />
                                    <div>
                                      <p
                                        ref={descRef}
                                        className={`sayingWriteCardDesc ${
                                          isExpanded ? "expanded" : ""
                                        }`}
                                        dangerouslySetInnerHTML={{
                                          __html: item.quote,
                                        }}
                                        style={{
                                          display: "-webkit-box",
                                          WebkitLineClamp: isExpanded
                                            ? "unset"
                                            : 3,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      ></p>

                                      <div className="moreWriteCard">
                                        <img
                                          src="/assets/moreWC.png"
                                          alt="writeCard"
                                          onClick={() =>
                                            handleCardOverlay(item)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div style={{ clear: "both" }}></div>
                                    <div className="sayingWriteCardSign">
                                      <div>
                                        <span className="sayingWriteCardCategory">
                                          {item.name}
                                        </span>
                                        <h3 className="sayingWriteCardSignName">
                                          {" "}
                                          {item.ref ? item.ref : ""}{" "}
                                        </h3>
                                      </div>
                                      <img
                                        src="/assets/sign.png"
                                        className="sayingWriteCardSignImg"
                                      />
                                    </div>
                                    <img
                                      src="/assets/dots.png"
                                      alt=""
                                      onClick={(e) =>
                                        handleOverlayToggle(e, item)
                                      }
                                      className="dotsWrite"
                                    />
                                    <OverlayPanel ref={op}>
                                      <button
                                        className="shareButton btnAction"
                                        onClick={() => {
                                          openShareBlock(item);
                                          op.current.hide();
                                          setIsOverlayDots(false);
                                        }}
                                      >
                                        <span>مشاركة</span>
                                        <img src="/assets/Share.png" />
                                      </button>
                                      <img src="/assets/line.png" alt="line" />
                                      <button
                                        className="shareButton btnAction"
                                        onClick={() => {
                                          copyData(item);
                                          op.current.hide();
                                          setIsOverlayDots(false);
                                        }}
                                      >
                                        <span>نسخ</span>
                                        <img src="/assets/copy.png" />
                                      </button>
                                      <img src="/assets/line.png" alt="line" />
                                      <button
                                        type="button"
                                        className="downloadButton btnAction"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          handleDownloadClick(item);
                                          op.current.hide();
                                          setIsOverlayDots(false);
                                        }}
                                      >
                                        تحميل
                                        <img
                                          src="/assets/download.png"
                                          alt="download"
                                        />
                                      </button>
                                    </OverlayPanel>
                                  </div>
                                </div>
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {isOverlayDots && (
                  <div
                    className="dots overlay"
                    onClick={(e) => handleOverlayToggle(e, selectedItem)}
                  ></div>
                )}
                {isOverlayCard && selectedItem && (
                  <SayingWriteCardOverlay
                    closeOverlay={handleCardOverlayClose}
                    img={selectedItem.image}
                    desc={selectedItem.quote}
                    name={selectedItem.ref}
                    cate={selectedItem.name}
                  />
                )}

                {isOverlayBlockShare && (
                  <SayingShareContainer
                    closeOverlay={closeShareBlock}
                    currentPath={currentPath}
                    desc={selectedItem.quote}
                    name={selectedItem.name}
                    cate={selectedItem.ref}
                  />
                )}
                {categorySayingsData[0].value.length > 2 && (
                  <Link
                    to={`/category/${id}/more/${categorySayingsData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Sayings Photos */}
          {categoryPhotoSayingsData[0] ? (
            <>
              <CategoryHeader
                cate={
                  categoryPhotoSayingsData[0] && categoryPhotoSayingsData[0].key
                }
                count={categoryPhotoSayingsData[0].count}
                src={`/category/${id}/more/${categoryPhotoSayingsData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className="sayingsPhotoItems categoryPhotoSayingsData">
                  {categoryPhotoSayingsData[0].value &&
                    categoryPhotoSayingsData[0].value
                      .slice(0, 4)
                      .map((item, idx) => {
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              openOverlay(idx);
                              setActiveIndex(idx);
                            }}
                          >
                            <SayingsPhotoCard src={item.image} />
                          </div>
                        );
                      })}
                  {/* Overlay with reversed navigation */}
           {isOverlayOpen && (
              <div className="overlay">
                <div className="overlay-wrapper" dir="ltr">
                  <img
                    src="/assets/close.png"
                    alt="Close"
                    className="visits-overlay-cancel"
                    onClick={closeOverlayPhoto}
                  />
                  <h2 className="overlayDocsImgCate">صور اقوال</h2>

                  <div className="overlayDocsContent">
                    {/* Prev */}
                      <div
                        className={`docs-prev docs-arrow ${
                          // use state for styling but don't rely on it to prevent the click
                          isAtStart ? "disabled" : ""
                        }`}
                        onClick={() => {
                          const s = swiperRefPhoto.current;
                          if (!s) return; // not ready yet
                          // check live swiper state (safer than relying only on `isAtStart`)
                          if (s.isBeginning) return;
                          s.slidePrev();
                          // update local react state from the live swiper after the slide starts
                          // small delay ensures swiper has updated internal indexes
                          setTimeout(() => {
                            setIsAtStart(s.isBeginning);
                            setIsAtEnd(s.isEnd);
                            // also convert active index back to your original-order semantics
                            const originalIndex = Math.max(0, reversedSlides.length - 1 - s.activeIndex);
                            setActiveIndex(originalIndex);
                          }, 50);
                        }}
                      >
                        <img src="/assets/happen-left.png" alt="Prev" />
                      </div>

                    <Swiper
                      onSwiper={(swiper) => {
                        swiperRefPhoto.current = swiper;
                        // map original activeIndex -> index inside reversedSlides
                        const reversedInitial =
                          Math.max(0, reversedSlides.length - 1 - (activeIndex ?? 0));
                        // jump to the computed starting slide in the reversed array
                        swiper.slideTo(reversedInitial, 0);
                        setIsAtStart(swiper.isBeginning);
                        setIsAtEnd(swiper.isEnd);
                      }}
                      // set initialSlide too (keeps SSR/client sync)
                      initialSlide={Math.max(0, reversedSlides.length - 1 - (activeIndex ?? 0))}
                      slidesPerView={1}
                      spaceBetween={50}
                      effect="coverflow"
                      modules={[EffectCoverflow]}
                      speed={800}
                      onSlideChange={(swiper) => {
                        // swiper.activeIndex is index inside reversedSlides
                        const reversedIndex = swiper.activeIndex;
                        const originalIndex = Math.max(
                          0,
                          reversedSlides.length - 1 - reversedIndex
                        );
                        // save the index in your original-order semantics
                        setActiveIndex(originalIndex);
                        setIsAtStart(swiper.isBeginning);
                        setIsAtEnd(swiper.isEnd);
                      }}
                    >
                      {reversedSlides.map((item, i) => (
                        <SwiperSlide key={item.id}>
                          <div className="overlayDocsImg">
                            <img
                              src={item.image}
                              alt={`Slide ${i + 1}`}
                              className="zoomable"
                              onClick={handleZoom}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

              {/* Next */}
                <div
                  className={`docs-next docs-arrow ${isAtEnd ? "disabled" : ""}`}
                  onClick={() => {
                    const s = swiperRefPhoto.current;
                    if (!s) return;
                    if (s.isEnd) return;
                    s.slideNext();
                    setTimeout(() => {
                      setIsAtStart(s.isBeginning);
                      setIsAtEnd(s.isEnd);
                      const originalIndex = Math.max(0, reversedSlides.length - 1 - s.activeIndex);
                      setActiveIndex(originalIndex);
                    }, 50);
                  }}
                >
                  <img src="/assets/happen-right.png" alt="Next" />
                </div>
                  </div>
                </div>
              </div>
            )}

                </div>
                <div
                  className="sayingsPhotoItemsCateRes"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryPhotoSayingsData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryPhotoSayingsData[0].value
                      ? categoryPhotoSayingsData[0].value
                          .slice(0, 4)
                          .map((item, idx) => {
                            return (
                              <SwiperSlide key={item.id}>
                                <div
                                  onClick={() => {
                                    openOverlayRes(idx);
                                    setActiveIndex(idx);
                                  }}
                                >
                                  <SayingsPhotoCard src={item.image} />
                                </div>
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                  {isOverlayOpen && (
                    <div className="overlay">
                      <div className="overlay-wrapper" dir="rtl">
                        <img
                          src="/assets/close.png"
                          alt="Close"
                          className="visits-overlay-cancel"
                          onClick={closeOverlayPhoto}
                        />
                        <h2 className="overlayDocsImgCate">صور اقوال</h2>

                        <div className="overlayDocsContent">
                     

                          {/* <div
                            className={`docs-next docs-arrow ${
                              activeIndex === 0 ? "disabled" : ""
                            } `}
                            onClick={() =>
                              swiperRefPhotoRes.current.slidePrev()
                            }
                          >
                            <img src="/assets/happen-left.png" alt="Next" />
                          </div>
                          <Swiper
                            onSwiper={(swiper) =>
                              (swiperRefPhotoRes.current = swiper)
                            }
                            dir="ltr"
                            initialSlide={3 - activeIndex}
                            slidesPerView={1}
                            spaceBetween={50}
                            effect="coverflow"
                            modules={[EffectCoverflow]}
                            speed={800}
                            onSlideChange={(swiper) =>
                              setActiveIndex(swiper.activeIndex)
                            }
                          >
                            {slides.map((item, i) => (
                              <SwiperSlide key={item.id}>
                                <div className="overlayDocsImg">
                                  <img
                                    src={item.image}
                                    alt={`Slide ${i + 1}`}
                                    className="zoomable"
                                    onClick={handleZoom}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`docs-next docs-arrow ${
                              activeIndex === reversedSlides.length - 1
                                ? "disabled"
                                : ""
                            }`}
                            onClick={() =>
                              swiperRefPhotoRes.current.slideNext()
                            }
                          >
                            <img src="/assets/happen-right.png" alt="Prev" />
                          </div> */}
                          {/* Prev */}
                          <div
                            className={`docs-prev docs-arrow ${
                              isAtStart ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (!isAtStart)
                                swiperRefPhotoRes.current?.slidePrev();
                            }}
                          >
                            <img src="/assets/happen-left.png" alt="Prev" />
                          </div>
                          <Swiper
                            onSwiper={(swiper) => {
                              swiperRefPhotoRes.current = swiper;
                              // jump to the computed starting slide
                              swiper.slideTo(activeIndex, 0);
                              setIsAtStart(swiper.isBeginning);
                              setIsAtEnd(swiper.isEnd);
                            }}
                            initialSlide={activeIndex} // aligned with reversedSlides
                            slidesPerView={1}
                            spaceBetween={50}
                            effect="coverflow"
                            modules={[EffectCoverflow]}
                            speed={800}
                            onSlideChange={(swiper) => {
                              setActiveIndex(swiper.activeIndex);
                              setIsAtStart(swiper.isBeginning);
                              setIsAtEnd(swiper.isEnd);
                            }}
                          >
                            {reversedSlides.map((item, i) => (
                              <SwiperSlide key={item.id}>
                                <div className="overlayDocsImg">
                                  <img
                                    src={item.image}
                                    alt={`Slide ${i + 1}`}
                                    className="zoomable"
                                    onClick={handleZoom}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          {/* Next */}
                          <div
                            className={`docs-next docs-arrow ${
                              isAtEnd ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (!isAtEnd) swiperRefPhotoRes.current?.slideNext();
                            }}
                          >
                            <img src="/assets/happen-right.png" alt="Next" />
                          </div>


                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {categoryPhotoSayingsData[0].value.length > 3 && (
                  <Link
                    to={`/category/${id}/more/${categoryPhotoSayingsData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Gallery */}
          {categoryGalleryData[0] ? (
            <>
              <CategoryHeader
                cate={categoryGalleryData[0] && categoryGalleryData[0].key}
                count={categoryGalleryData[0].count}
                src={`/category/${id}/more/${categoryGalleryData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className="visits-imgs-cont categoryGalleryData">
                  {categoryGalleryData[0].value &&
                    categoryGalleryData[0].value.slice(0, 3).map((item, i) => {
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
                <div
                  className="categoryGalleryDataResCate"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryGalleryData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryGalleryData[0].value
                      ? categoryGalleryData[0].value
                          .slice(0, 3)
                          .map((item, i) => {
                            return (
                              <SwiperSlide key={item.id}>
                                <VisitsImg
                                  info={item.description}
                                  src={
                                    item.image != null
                                      ? item.image
                                      : "/assets/gallery-1.png"
                                  }
                                  handleImageClick={() => handleImageClicked(i)}
                                />
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {isOverlayVisible && (
                  <CategoryVisitOverlayOutside
                    closeOverlay={closeOverlay}
                    visitsImgs={categoryGalleryData[0]}
                    currentIndex={currentIndex}
                  />
                )}

                {categoryGalleryData[0].value.length > 3 && (
                  <Link
                    to={`/category/${id}/more/${categoryGalleryData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Happen / Events */}
          {categoryHappenData[0] ? (
            <>
              <CategoryHeader
                cate={categoryHappenData[0] && categoryHappenData[0].key}
                count={categoryHappenData[0].count}
                src={`/category/${id}/more/${categoryHappenData[0].media_type_slug}`}
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
                    categoryHappenData[0].value &&
                    categoryHappenData[0].value.slice(0, 2).map((item) => {
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
                {categoryHappenData[0].value.length > 2 && (
                  <Link
                    to={`/category/${id}/more/${categoryHappenData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Poems */}
          {categoryPoemsData[0] ? (
            <>
              <CategoryHeader
                cate={categoryPoemsData[0] && categoryPoemsData[0].key}
                count={categoryPoemsData[0].count}
                src={`/category/${id}/more/${categoryPoemsData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className="PoemsItems categoryPoemsData">
                  {categoryPoemsData[0].value &&
                    categoryPoemsData[0].value.slice(0, 3).map((item) => {
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
                <div
                  className="categoryPoemsDataResCate PoemsItems"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={
                      categoryPoemsData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryPoemsData[0].value
                      ? categoryPoemsData[0].value
                          .slice(0, 3)
                          .map((item, i) => {
                            return (
                              <SwiperSlide key={item.id}>
                                <PoemsCard
                                  src={`/poems/${item.slug}`}
                                  title={item.name}
                                  desc={item.poem}
                                />
                              </SwiperSlide>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {categoryPoemsData[0].value.length > 3 && (
                  <Link
                    to={`/category/${id}/more/${categoryPoemsData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {/* Docs */}
          {categoryDocsData[0] ? (
            <>
              <CategoryHeader
                cate={categoryDocsData[0] && categoryDocsData[0].key}
                count={categoryDocsData[0].count}
                src={`/category/${id}/more/${categoryDocsData[0].media_type_slug}`}
              />
              <div className="categoryRow">
                <div className="docsItems categoryDocsData">
                  {isLoading ? (
                    <>
                      <SkeletonDocsSection />
                      <SkeletonDocsSection />
                      <SkeletonDocsSection />
                    </>
                  ) : (
                    categoryDocsData[0].value &&
                    categoryDocsData[0].value.slice(0, 4).map((item, index) => {
                      return (
                        <React.Fragment key={item.id}>
                          <DocsCard
                            src={
                              item.image != null
                                ? item.image
                                : `/assets/media/writings/docs/docs.png`
                            }
                            handleImageClick={() =>
                              handleImageClickDocs(
                                item.image,
                                index,
                                categoryDocsData[0].value,
                                cate
                              )
                            }
                          />
                        </React.Fragment>
                      );
                    })
                  )}
                  {isOverlayVisibleDocs && (
                    <DocOverlayOutside
                      closeOverlay={closeOverlayDocs}
                      img={clickedImage}
                      cate={clickedCategory}
                      imgs={overlayImgs}
                      initialSlide={clickedImageIndex}
                    />
                  )}
                </div>
                <div
                  className="categoryDocsDataRes docsItems"
                  style={{ display: "none" }}
                  dir="rtl"
                >
                  <Swiper
                    ref={swiperRef}
                    spaceBetween={20}
                    slidesPerView={
                      categoryDocsData[0].value.length > 1 ? 1.3 : 1
                    }
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    speed={2000}
                  >
                    {categoryDocsData[0].value
                      ? categoryDocsData[0].value
                          .slice(0, 4)
                          .map((item, index) => {
                            return (
                              <>
                                <SwiperSlide key={item.id}>
                                  <DocsCard
                                    src={
                                      item.image != null
                                        ? item.image
                                        : "/assets/media/writings/docs/docs.png"
                                    }
                                    handleImageClick={() =>
                                      handleImageClickDocs(
                                        item.image,
                                        index,
                                        categoryDocsData[0].value,
                                        cate
                                      )
                                    }
                                  />
                                  <p style={{ color: "#F8F3ED" }}> doc</p>
                                </SwiperSlide>
                              </>
                            );
                          })
                      : ""}

                    <div className="swiper-pagination"></div>
                  </Swiper>
                </div>
                {isOverlayVisibleDocs && (
                  <DocOverlayOutside
                    closeOverlay={closeOverlayDocs}
                    img={clickedImage}
                    cate={clickedCategory}
                    imgs={overlayImgs}
                    initialSlide={clickedImageIndex}
                  />
                )}
                {categoryDocsData[0].value.length > 3 && (
                  <Link
                    to={`/category/${id}/more/${categoryDocsData[0].media_type_slug}`}
                    className="more_btn"
                    target="_blank"
                  >
                    المزيد
                  </Link>
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        <>""</>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>
          <SkeletonVideosSection />
          <SkeletonVideosSection />
          <SkeletonArticlesCard />
          <SkeletonQuestionCard />
          <SkeletonQuestionCard />
          <SkeletonQuestionCard />
          <SkeletonBooksSection />
          <SkeletonDocsSection />
        </p>
      ) : all.length === 0 && check ? (
        <p className="noResult" style={{ textAlign: "center" }} ref={ele}>
          لا يوجد نتائج
        </p>
      ) : null}
      <ToastContainer />
    </div>
  );
}
