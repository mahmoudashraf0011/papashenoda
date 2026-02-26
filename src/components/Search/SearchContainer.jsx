import React, { useState, useRef, useEffect, useContext } from "react";
import "./SearchContainer.css";
import "../../Pages/Search/Responsive/SearchResponsive.css";
import SearchHook from "../../Logic/Search/SearchHook";
import SearchContainerHook from "../../Logic/Search/SearchContainerHook";

import { Link, useLocation, useParams } from "react-router-dom";
import CategoryHeader from "../Category/CategoryHeader";
import CatagorySayingWriteCard from "../Category/Categories/CatagorySayingWriteCard";
import OneBook1, { SkeletonBookCard } from "../Books/OneBook1";
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
import "./SearchContainer.css";
import VisitsOverlay from "../Visits/VisitsOverlay";
import SayingWriteCard from "../Media/Writings/Sayings/SayingWriteCard";
import Spinner from "../Utility/Spinner";
import DocOverlay from "../Media/Writings/Docs/DocOverlay";
import CategoryVisitOverlay from "../Category/CategoryVisitOverlay";
import CategoryFilter from "../Category/CategoryFilter";
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
import { toPng } from "html-to-image";
import { OverlayPanel } from "primereact/overlaypanel";
import SayingShareContainer from "../Media/Writings/Sayings/SayingShareContainer";
import SayingWriteCardOverlay from "../Media/Writings/Sayings/SayingWriteCardOverlay";
import FullSearchHook from "./../../Logic/Search/FullSearchHook";
import SkeletonQuestionCard from "../Media/Writings/Questions/SkeletonQuestionCard";
import SkeletonDocsSection from "../Media/Writings/Docs/SkeletonDocsSection";
import SkeletonHappenTopicContainer from "../Happen/SkeletonHappenTopicContainer";
import DocOverlayOutside from "../Media/Writings/Docs/DocOverlayOutside";
import CategoryVisitOverlayOutside from "./../Category/CategoryVisitOverlayOutside";
import SkeletonBookCardRes from "../Books/SkeletonBookCardRes";
import { faMinus, faPause, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../Context/UserContext";

export default function SearchContainer() {
  // const [,,ele,,getData]=SearchHook();
  const { baseURL } = useContext(UserContext);

  const [
    searchWord,
    cates,
    checkedCategories,
    prefered,
    searchValue,
    setSearchWord,
    getSearchWord,
    handleRecentClick,
    getCatesIDs,
    filterOptions,
    toggleMedia,
    generateMediaTypeQuery,
    setSearchValue,
    handleSearchChange,
    clearSearch,
    onSubmitSearch,
    allData,
    check,
    count,
    ele,
    defaultCates,
    selectedMedia,
    setSelectedMedia,
    restSearch,
    removeRecentItem,
  ] = FullSearchHook();
  let data = JSON.parse(localStorage.getItem("allData")) || "";

  const [
    categoryBookDataSearch,
    categoryGalleryDataSearch,
    categoryVideoDataSearch,
    categoryArticleDataSearch,
    categorySoundDataSearch,
    categorySayingsDataSearch,
    categoryPhotoSayingsDataSearch,
    categoryPoemsDataSearch,
    categoryQuestionsDataSearch,
    categoryHappenDataSearch,
    categoryDocsDataSearch,
  ] = SearchContainerHook(data);
  console.log("check", check);
  const { id } = useParams();
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
    console.log("asd", index);
    setOverlayVisible(true);
  };

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
        console.error("Invalid OneDrive URL or 'id' parameter missing.");
        return null;
      }
      const directLink = `https://popeshenoudaacademy-my.sharepoint.com/personal/msoul_zvf-eg_org/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(
        fileId
      )}`;
      return directLink;
    } catch (error) {
      console.error("Error processing OneDrive URL:", error.message);
      return null;
    }
  }
  // const directLink = img ? convertOneDriveLink(img) : null;

  // Copy Data
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
    } else {
      console.error("Card element not found for:", name);
    }
  };

  // more to read
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);
  const [isOverlayCard, setOverlayCard] = useState(false);
  const [isOverlayDots, setIsOverlayDots] = useState(false);
  const [isOverlayBlockShare, setOverlayBlockShare] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardOverlay = (item) => {
    setSelectedItem(item);
    document.body.classList.add("no-scroll");
    setOverlayCard(true);
    const header = document.querySelector(".header");
    header.style.zIndex = "1000";
  };
  const handleCardOverlayClose = () => {
    setSelectedItem(null);
    document.body.classList.remove("no-scroll");
    setOverlayCard(false);
  };

  const handleOverlayToggle = (e, item) => {
    setSelectedItem(item);
    console.log("sdddddddd", item);
    op.current.toggle(e); // Execute the toggle logic
    setIsOverlayDots((prev) => !prev); // Toggle overlay state
  };
  const openShareBlock = (item) => {
    document.body.classList.add("no-scroll");
    setOverlayBlockShare(true);
    const header = document.querySelector(".header");
    header.style.zIndex = "10000";
  };
  const closeShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockShare(false);
    setIsOverlayDots(false);
  };
  const playersRef = useRef([]); // Array of refs for all players
  const swiperPlayersRef = useRef([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [currentPlayingIndexRes, setCurrentPlayingIndexRes] = useState(null);

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
    if (nextIndex < categorySoundDataSearch[0].value.length) {
      // Ensure it doesn't exceed the length
      playersRef.current[nextIndex].audio.current.play();
      handlePlay(nextIndex);
    }
  };
  const handlePlayRes = (index) => {
    // Pause any currently playing audio
    if (currentPlayingIndexRes !== null && currentPlayingIndexRes !== index) {
      const previousPlayer = swiperPlayersRef.current[currentPlayingIndexRes];
      if (previousPlayer && previousPlayer.audio.current) {
        previousPlayer.audio.current.pause();
      }
    }

    // Set the current playing index
    setCurrentPlayingIndexRes(index);
  };

  const handlePrevRes = (index) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      swiperPlayersRef.current[prevIndex].audio.current.play();
      handlePlay(prevIndex);
    }
  };

  const handleNextRes = (index) => {
    const nextIndex = index + 1;
    if (nextIndex < categorySoundDataSearch[0].value.length) {
      // Ensure it doesn't exceed the length
      swiperPlayersRef.current[nextIndex].audio.current.play();
      handlePlay(nextIndex);
    }
  };

  //for saying photo
  // Original slides array
  const slides = Array.isArray(categoryPhotoSayingsDataSearch?.[0]?.value)
    ? categoryPhotoSayingsDataSearch[0].value.map((item) => ({
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // التحقق من حجم الشاشة
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // التحقق إذا كانت الشاشة أصغر من أو تساوي 768px
    };

    checkIfMobile(); // التحقق الأولي عند التحميل

    // إضافة مستمع للحجم عند تغير حجم النافذة
    window.addEventListener("resize", checkIfMobile);

    // تنظيف المستمع عند الخروج
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="searchContainer">
      <div className="Container">
        <CategoryFilter
          title={
            localStorage.getItem("searchValue")
              ? localStorage.getItem("searchValue")
              : ""
          }
        />
        <p className="countResult">
          عدد نتائج البحث :
          <span>
            {localStorage.getItem("searchCount")
              ? localStorage.getItem("searchCount")
              : 0}
          </span>
        </p>

        {categoryVideoDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryVideoDataSearch[0] && categoryVideoDataSearch[0].key
              }
              count={categoryVideoDataSearch[0].media_count}
              src={`/search/more/${categoryVideoDataSearch[0].media_type_slug}`}
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
                  categoryVideoDataSearch[0].value &&
                  categoryVideoDataSearch[0].value.slice(0, 6).map((item) => {
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
                    categoryVideoDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonLoadingVideo />
                    </>
                  ) : categoryVideoDataSearch[0].value ? (
                    categoryVideoDataSearch[0].value
                      .slice(0, 6)
                      .map((item, i) => {
                        return (
                          <SwiperSlide>
                            <CategoryVideoCard
                              item={item}
                              desc={item.name}
                              src={item.id}
                              key={item.id}
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
              {categoryVideoDataSearch[0].value.length > 5 ? (
                <a
                  href={`/search/more/${categoryVideoDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </a>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categorySoundDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categorySoundDataSearch[0] && categorySoundDataSearch[0].key
              }
              count={categorySoundDataSearch[0].media_count}
              src={`/search/more/${categorySoundDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className=" categorySoundData">
                {isLoading ? (
                  // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                  <>
                    <SkeletonCategorySoundCard />
                    <SkeletonCategorySoundCard />
                    <SkeletonCategorySoundCard />
                  </>
                ) : (
                  categorySoundDataSearch[0].value &&
                  categorySoundDataSearch[0].value
                    .slice(0, 6)
                    .map((item, index) => {
                      return (
                        <CategorySoundCard
                          key={item.id}
                          index={index}
                          audio={item.url}
                          title={item.name}
                          isPlaying={currentPlayingIndex === index}
                          hasPrev={index > 0} // Only show prev if there's a previous item
                          hasNext={
                            index <
                            categorySoundDataSearch[0].value.slice(0, 6)
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
                      );
                    })
                )}
              </div>
              <div
                className="categorySoundDataRes"
                style={{ display: "none" }}
                dir="rtl"
              >
                <Swiper
                  spaceBetween={20}
                  slidesPerView={
                    categorySoundDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonCategorySoundCard />
                      {/* <SkeletonCategorySoundCard />
                                                <SkeletonCategorySoundCard /> */}
                    </>
                  ) : categorySoundDataSearch[0].value ? (
                    [...categorySoundDataSearch[0].value.slice(0, 6)]
                      .reverse()
                      .map((item, index) => {
                        return (
                          <SwiperSlide>
                            <CategorySoundCard
                              key={item.id}
                              index={index}
                              audio={item.url}
                              title={item.name}
                              isPlaying={currentPlayingIndexRes === index}
                              hasPrev={index > 0} // Only show prev if there's a previous item
                              hasNext={
                                index <
                                categorySoundDataSearch[0].value.slice(0, 6)
                                  .length -
                                  1
                              } // Ensure next is calculated after slice
                              onPlay={handlePlayRes}
                              onPrev={handlePrevRes}
                              onNext={handleNextRes}
                              onRequestPlay={requestPlay}
                              ref={(el) =>
                                (swiperPlayersRef.current[index] = el)
                              } // Store refs
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
              {categorySoundDataSearch[0].value.length > 5 ? (
                <Link
                  to={`/search/more/${categorySoundDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </Link>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categoryBookDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={categoryBookDataSearch[0] && categoryBookDataSearch[0].key}
              count={categoryBookDataSearch[0].media_count}
              src={`/search/more/${categoryBookDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className="books-section-one-books categoryBooksData">
                {isLoading ? (
                  // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                  <>
                    <SkeletonBookCard />
                    <SkeletonBookCard />
                    <SkeletonBookCard />
                  </>
                ) : (
                  categoryBookDataSearch[0].value &&
                  categoryBookDataSearch[0].value.slice(0, 3).map((item) => {
                    return (
                      <OneBook1
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
                  className="books-head-stand2 books-head-stand3"
                  src="/assets/books-5.png"
                  alt="stand"
                />
              </div>
              <div
                className=" categoryBooksDataResIpad"
                style={{ display: "none" }}
              >
                {categoryBookDataSearch[0].value &&
                  categoryBookDataSearch[0].value.slice(0, 2).map((item) => {
                    return (
                      <OneBook1
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
                  className="books-head-stand2 books-head-stand3"
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
                  spaceBetween={20}
                  slidesPerView={
                    categoryBookDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonBookCardRes />
                      {/* <SkeletonBookCard />
                                                <SkeletonBookCard /> */}
                    </>
                  ) : categoryBookDataSearch[0].value ? (
                    categoryBookDataSearch[0].value.slice(0, 3).map((item) => {
                      return (
                        <SwiperSlide>
                          <OneBook1
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
                          <img
                            className="books-head-stand2 books-head-stand3"
                            src="/assets/books-5.png"
                            alt="stand"
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
              {categoryBookDataSearch[0] &&
              categoryBookDataSearch[0].value.length > 3 ? (
                <Link
                  to={`/search/more/${categoryBookDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </Link>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categoryArticleDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryArticleDataSearch[0] && categoryArticleDataSearch[0].key
              }
              count={categoryArticleDataSearch[0].media_count}
              src={`/search/more/${categoryArticleDataSearch[0].media_type_slug}`}
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
                  </>
                ) : (
                  categoryArticleDataSearch[0].value &&
                  categoryArticleDataSearch[0].value.slice(0, 4).map((item) => {
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
                    categoryArticleDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonArticleCard />
                      {/* <SkeletonArticleCard />
                                                <SkeletonArticleCard />
                                                <SkeletonArticleCard /> */}
                    </>
                  ) : categoryArticleDataSearch[0].value ? (
                    categoryArticleDataSearch[0].value
                      .slice(0, 6)
                      .map((item, i) => {
                        return (
                          <SwiperSlide>
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
                          </SwiperSlide>
                        );
                      })
                  ) : (
                    ""
                  )}

                  <div className="swiper-pagination"></div>
                </Swiper>
              </div>
              {categoryArticleDataSearch[0].value.length > 4 ? (
                <Link
                  to={`/search/more/${categoryArticleDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </Link>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categoryQuestionsDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryQuestionsDataSearch[0] &&
                categoryQuestionsDataSearch[0].key
              }
              count={categoryQuestionsDataSearch[0].media_count}
              src={`/search/more/${categoryQuestionsDataSearch[0].media_type_slug}`}
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
                  categoryQuestionsDataSearch[0].value &&
                  categoryQuestionsDataSearch[0].value
                    .slice(0, 3)
                    .map((item) => {
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
                    categoryQuestionsDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonQuestionCard />
                      {/* <SkeletonQuestionCard />
                                                <SkeletonQuestionCard /> */}
                    </>
                  ) : categoryQuestionsDataSearch[0].value ? (
                    categoryQuestionsDataSearch[0].value
                      .slice(0, 3)
                      .map((item, i) => {
                        return (
                          <SwiperSlide>
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
                              id={item.id}
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
              {categoryQuestionsDataSearch[0].value.length > 3 ? (
                <Link
                  to={`/search/more/${categoryQuestionsDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </Link>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categorySayingsDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categorySayingsDataSearch[0] && categorySayingsDataSearch[0].key
              }
              count={categorySayingsDataSearch[0].media_count}
              src={`/search/more/${categorySayingsDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className=" sayingsWriteItems">
                {categorySayingsDataSearch[0].value &&
                  categorySayingsDataSearch[0].value.slice(0, 2).map((item) => {
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
                    categorySayingsDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {categorySayingsDataSearch[0].value
                    ? categorySayingsDataSearch[0].value
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
                                        onClick={() => handleCardOverlay(item)}
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
                                      }} // update here
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
            </div>
            {categorySayingsDataSearch[0].value.length > 2 ? (
              <a
                href={`/search/more/${categorySayingsDataSearch[0].media_type_slug}`}
                className="more_btn"
                target="_blank"
              >
                المزيد
              </a>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}

        {categoryPhotoSayingsDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryPhotoSayingsDataSearch[0] &&
                categoryPhotoSayingsDataSearch[0].key
              }
              count={categoryPhotoSayingsDataSearch[0].media_count}
              src={`/search/more/${categoryPhotoSayingsDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div
                className="sayingsPhotoItems categoryPhotoSayingsData"
                dir="rtl"
              >
                {categoryPhotoSayingsDataSearch[0].value &&
                  categoryPhotoSayingsDataSearch[0].value
                    .slice(0, 4)
                    .map((item, idx) => {
                      return (
                        <div
                          onClick={() => {
                            openOverlay(idx);
                            setActiveIndex(idx);
                          }}
                        >
                          <SayingsPhotoCard
                            src={item.image}
                            key={item.id}
                            onClick={() => {
                              openOverlay(idx);
                              setActiveIndex(idx);
                            }}
                          />
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
                        {/* Left arrow: go to previous in reversedSlides (which is next in original) */}
                        <div
                          className={`docs-prev docs-arrow ${
                            activeIndex === reversedSlides.length - 1
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() => swiperRefPhoto.current.slideNext()}
                        >
                          <img src="/assets/happen-left.png" alt="Prev" />
                        </div>

                        <Swiper
                          onSwiper={(swiper) =>
                            (swiperRefPhoto.current = swiper)
                          }
                          slidesPerView={1}
                          spaceBetween={50}
                          initialSlide={activeIndex}
                          dir="rtl"
                          effect="coverflow"
                          modules={[EffectCoverflow]}
                          speed={800}
                          onSlideChange={(swiper) => {
                            console.log("Active Index:", swiper.activeIndex);
                            setActiveIndex(swiper.activeIndex);
                          }}
                        >
                          {reversedSlides.reverse().map((item, i) => (
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

                        {/* Right arrow: go to next in reversedSlides (which is previous in original) */}
                        <div
                          className={`docs-next docs-arrow ${
                            activeIndex === 0 ? "disabled" : ""
                          }`}
                          onClick={() => swiperRefPhoto.current.slidePrev()}
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
                    categoryPhotoSayingsDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {categoryPhotoSayingsDataSearch[0].value
                    ? categoryPhotoSayingsDataSearch[0].value
                        .slice(0, 3)
                        .map((item, idx) => {
                          return (
                            item.sharepoint_image && (
                              <SwiperSlide>
                                <div
                                  onClick={() => {
                                    openOverlay(idx);
                                    setActiveIndex(idx);
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
                              </SwiperSlide>
                            )
                          );
                        })
                    : ""}

                  <div className="swiper-pagination"></div>
                </Swiper>
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
                        {/* السهم الشمال (التالي في العرض) */}
                        <div
                          className={`docs-prev docs-arrow ${
                            activeIndex === reversedSlides.length - 1
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() => {
                            if (activeIndex !== reversedSlides.length - 1) {
                              swiperRefPhotoRes.current.slideNext();
                            }
                          }}
                        >
                          <img
                            src={
                              isMobile
                                ? "/assets/happen-left.png"
                                : "/assets/happen-right.png"
                            }
                            alt="Next"
                          />
                        </div>

                        <Swiper
                          onSwiper={(swiper) =>
                            (swiperRefPhotoRes.current = swiper)
                          }
                          slidesPerView={1}
                          spaceBetween={50}
                          initialSlide={activeIndex}
                          dir="rtl"
                          effect="coverflow"
                          modules={[EffectCoverflow]}
                          speed={800}
                          onSlideChange={(swiper) =>
                            setActiveIndex(swiper.activeIndex)
                          }
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

                        {/* السهم اليمين (السابق في العرض) */}
                        <div
                          className={`docs-next docs-arrow ${
                            activeIndex === 0 ? "disabled" : ""
                          }`}
                          onClick={() => {
                            if (activeIndex !== 0) {
                              swiperRefPhotoRes.current.slidePrev();
                            }
                          }}
                        >
                          <img
                            src={
                              isMobile
                                ? "/assets/happen-right.png"
                                : "/assets/happen-left.png"
                            }
                            alt="Previous"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {categoryPhotoSayingsDataSearch[0].value &&
              categoryPhotoSayingsDataSearch[0].value.length > 1 ? (
                <a
                  href={`/search/more/${categoryPhotoSayingsDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </a>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}
        {categoryGalleryDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryGalleryDataSearch[0] && categoryGalleryDataSearch[0].key
              }
              count={categoryGalleryDataSearch[0].media_count}
              src={`/search/more/${categoryGalleryDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className="visits-imgs-cont categoryGalleryData">
                {categoryGalleryDataSearch[0].value &&
                  categoryGalleryDataSearch[0].value
                    .slice(0, 3)
                    .map((item, i) => {
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
                    categoryGalleryDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {categoryGalleryDataSearch[0].value
                    ? categoryGalleryDataSearch[0].value
                        .slice(0, 3)
                        .map((item, i) => {
                          return (
                            <SwiperSlide>
                              <VisitsImg
                                info={item.description}
                                src={
                                  item.image != null
                                    ? item.image
                                    : "/assets/gallery-1.png"
                                }
                                key={item.id}
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
                  visitsImgs={
                    categoryGalleryDataSearch[0] &&
                    categoryGalleryDataSearch[0].value
                  }
                  currentIndex={currentIndex}
                />
              )}
              {categoryGalleryDataSearch[0].value.length > 3 && (
                <a
                  href={`/search/more/${categoryGalleryDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </a>
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categoryHappenDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryHappenDataSearch[0] && categoryHappenDataSearch[0].key
              }
              count={categoryHappenDataSearch[0].media_count}
              src={`/search/more/${categoryHappenDataSearch[0].media_type_slug}`}
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
                  categoryHappenDataSearch[0].value &&
                  categoryHappenDataSearch[0].value.slice(0, 2).map((item) => {
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
              {categoryHappenDataSearch[0].value.length > 2 && (
                <a
                  href={`/search/more/${categoryHappenDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </a>
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {categoryPoemsDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={
                categoryPoemsDataSearch[0] && categoryPoemsDataSearch[0].key
              }
              count={categoryPoemsDataSearch[0].media_count}
              src={`/search/more/${categoryPoemsDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className="PoemsItems categoryPoemsData">
                {categoryPoemsDataSearch[0].value &&
                  categoryPoemsDataSearch[0].value.slice(0, 3).map((item) => {
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
                    categoryPoemsDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {categoryPoemsDataSearch[0].value
                    ? categoryPoemsDataSearch[0].value
                        .slice(0, 3)
                        .map((item, i) => {
                          return (
                            <SwiperSlide>
                              <PoemsCard
                                src={`/poems/${item.slug}`}
                                title={item.name}
                                desc={item.poem}
                                key={item.id}
                              />
                            </SwiperSlide>
                          );
                        })
                    : ""}

                  <div className="swiper-pagination"></div>
                </Swiper>
              </div>
              {categoryPoemsDataSearch[0].value.length > 3 && (
                <a
                  href={`/search/more/${categoryPoemsDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </a>
              )}
            </div>
          </>
        ) : (
          ""
        )}
        {categoryDocsDataSearch[0] ? (
          <>
            <CategoryHeader
              cate={categoryDocsDataSearch[0] && categoryDocsDataSearch[0].key}
              count={categoryDocsDataSearch[0].media_count}
              src={`/search/more/${categoryDocsDataSearch[0].media_type_slug}`}
            />
            <div className="categoryRow">
              <div className="docsItems categoryDocsData">
                {isLoading ? (
                  // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                  <>
                    <SkeletonDocsSection />
                    <SkeletonDocsSection />
                    <SkeletonDocsSection />
                  </>
                ) : (
                  categoryDocsDataSearch[0].value &&
                  categoryDocsDataSearch[0].value
                    .slice(0, 4)
                    .map((item, index) => {
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
                                categoryDocsDataSearch[0].value,
                                localStorage.getItem("search")
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
                className="categoryDocsDataRes"
                style={{ display: "none" }}
                dir="rtl"
              >
                <Swiper
                  spaceBetween={20}
                  slidesPerView={
                    categoryDocsDataSearch[0].value.length > 1 ? 1.3 : 1
                  }
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  modules={[Autoplay, Pagination]}
                  speed={2000}
                >
                  {isLoading ? (
                    // عرض Skeleton بدلاً من البيانات الفعلية أثناء التحميل
                    <>
                      <SkeletonDocsSection />
                      <SkeletonDocsSection />
                      <SkeletonDocsSection />
                    </>
                  ) : categoryDocsDataSearch[0].value ? (
                    categoryDocsDataSearch[0].value
                      .slice(0, 3)
                      .map((item, index) => {
                        return (
                          <React.Fragment key={item.id}>
                            <SwiperSlide>
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
                                    categoryDocsDataSearch[0].value,
                                    localStorage.getItem("search")
                                  )
                                }
                              />
                              <p style={{ color: "#F8F3ED" }}> doc</p>
                            </SwiperSlide>
                          </React.Fragment>
                        );
                      })
                  ) : (
                    ""
                  )}

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

              {categoryDocsDataSearch[0].value.length > 3 ? (
                <Link
                  to={`/search/more/${categoryDocsDataSearch[0].media_type_slug}`}
                  className="more_btn"
                  target="_blank"
                >
                  المزيد
                </Link>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {localStorage.getItem("allData") ? (
          JSON.parse(localStorage.getItem("allData")).length == 0 && (
            <p className="noResult">لا يوجد نتائج</p>
          )
        ) : (
          <p className="noResult">لا يوجد نتائج</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
