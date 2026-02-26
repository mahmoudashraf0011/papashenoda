import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from '../Utility/SectionHeader';
import 'swiper/css';
import 'swiper/css/navigation';
import './Responsive/HomeRes.css';
import './Sayings.css';
import HomeHook from '../../Logic/Home/HomeHook';
import { Link, useLocation } from 'react-router-dom';

import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from "swiper/modules";
import SayingWriteCardOverlay from '../Media/Writings/Sayings/SayingWriteCardOverlay';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SayingShareContainer from '../Media/Writings/Sayings/SayingShareContainer';

export default function Sayings() {
  const [mediaData, meditationsData, sayingsData, eventsData] = HomeHook();

  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayDots, setIsOverlayDots] = useState(false);  // Declare the state for overlay visibility
  const [isOverlayCard, setOverlayCard] = useState(false);
  const [isOverlayBlockShare, setOverlayBlockShare] = useState(false);
  const [imageMore, setImgMore] = useState();
  const [descMore, setDescMore] = useState();
  const [nameMore, setNameMore] = useState();
  const op = useRef();

  const handleSwiperEvents = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
    setIsEnd(swiper.isEnd);
    setIsBeginning(swiper.activeIndex <= 1);
  };

  const downloadImage = () => {
    // sayingsData[0] is your array
    const list = sayingsData?.[0];
    if (!Array.isArray(list) || !list.length) {
      toast.error("لا توجد شرائح متاحة");
      return;
    }
  
    const item = list[currentIndex];
    if (!item) {
      toast.error("تعذر تحديد الشريحة الحالية");
      return;
    }
  
    // same logic you use when rendering the <img>
    const imageUrl = item.sharepoint_image != null
      ? item.image_url
      : "/assets/default/written/insideWritten.png";
  
    if (!imageUrl) {
      toast.error("لا يوجد رابط للصورة");
      return;
    }
  
    const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'image';
    downloadFile(imageUrl, fileName);
  };

  const handleCardOverlay = (item) => {
    setOverlayCard(true);
    const header = document.querySelector('.header');
    header.style.zIndex = '100';
    document.querySelector('.downloadApp').style.zIndex = '-1';
    document.body.style.overflow = 'hidden';

    // Store item data for overlay
    setDescMore(item.quote);
    setNameMore(item.name);
    setImgMore(item.sharepoint_image ? item.image_url : "/assets/default/written/insideWritten.png");
  };

  const handleCardOverlayClose = () => {
    setOverlayCard(false);
    const header = document.querySelector('.header');
    header.style.zIndex = '1000';
    document.body.style.overflow = 'visible';
    document.querySelector('.downloadApp').style.zIndex = '1';
  };

  const handleOverlayToggle = (e, item) => {
    op.current.toggle(e);
    setIsOverlayDots((prev) => !prev);  // Toggling the state of the overlay dots visibility
    const header = document.querySelector('.header');
    header.style.zIndex = '10000';

    // Store item data for overlay
    setDescMore(item.quote);
    setNameMore(item.name);
    setImgMore(item.sharepoint_image ? item.image_url : "/assets/default/written/insideWritten.png");
  };

  const openShareBlock = () => {
    document.body.classList.add("no-scroll");
    setOverlayBlockShare(true);
    setIsOverlayDots(false); // Close the dots overlay when sharing
    op.current.toggle(false);
    const header = document.querySelector('.header');
    header.style.zIndex = '100';
    document.querySelector('.downloadApp').style.zIndex = '-1';
    document.body.style.overflow = 'hidden';
  };

  const closeShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockShare(false);
    const header = document.querySelector('.header');
    header.style.zIndex = '1000';
    document.querySelector('.downloadApp').style.zIndex = '1';
    document.body.style.overflow = 'visible';
  };

  const copyData = async (desc, name, cate) => {
    try {
      const plainTextDesc = desc.replace(/<[^>]+>/g, "");
      const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;
      await navigator.clipboard.writeText(message);
      toast.success("تم النسخ بنجاح");
    } catch (error) {
      toast.error("عذرا ..قم بالمحاولة لاحقا");
    }
  };

  // Helper function to handle downloading
  const downloadFile = async (url, suggestedName) => {
    if (!url) return;

    if (isSharePointUrl(url)) {
      const spUrl = toSharePointDownload(url);
      forceDownload(spUrl);
      return;
    }

    if (isSameOrigin(url)) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = sanitizeFileName(suggestedName || getFilenameFromUrl(url, 'file'));
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      } catch (e) {
        forceDownload(url);
        return;
      }
    }

    try {
      const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = sanitizeFileName(suggestedName || getFilenameFromUrl(url, 'file'));
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      }
    } catch {
      forceDownload(url);
    }

    forceDownload(url);
    toast.info("تمت محاولة التحميل. لو لم يبدأ، فعِّل Content-Disposition أو أضف ?download=1 مدعومة من السيرفر.");
  };

  const forceDownload = (url) => {
    const dlUrl = (() => {
      try {
        const u = new URL(url, window.location.href);
        if (!/download\.aspx/i.test(u.pathname) && u.searchParams.get('download') !== '1') {
          u.searchParams.set('download', '1');
        }
        return u.toString();
      } catch {
        return url;
      }
    })();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = dlUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try { document.body.removeChild(iframe); } catch {}
    }, 60000);
  };

  const isSharePointUrl = (u) => {
    try {
      const x = new URL(u);
      return (
        x.hostname.includes('.sharepoint.com') ||
        x.hostname.includes('1drv.ms') ||
        /\/_layouts\/15\/download\.aspx/i.test(x.pathname)
      );
    } catch {
      return false;
    }
  };

  const toSharePointDownload = (u) => {
    try {
      const url = new URL(u);
      if (/\/_layouts\/15\/download\.aspx/i.test(url.pathname)) {
        if (!url.searchParams.get('download')) url.searchParams.set('download', '1');
        return url.toString();
      }

      const id = url.searchParams.get('id') || url.searchParams.get('SourceUrl');
      const uniqueId = url.searchParams.get('UniqueId');
      const base = `${url.origin}/_layouts/15/download.aspx`;
      const qs = new URLSearchParams();
      if (id) qs.set('SourceUrl', id);
      if (uniqueId) qs.set('UniqueId', uniqueId);
      qs.set('download', '1');
      return `${base}?${qs.toString()}`;
    } catch {
      return u;
    }
  };

  const isSameOrigin = (url) => {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  };

  const sanitizeFileName = (s, fall = 'file') => {
    const base = (s || '').toString().trim() || fall;
    return base.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 120);
  };

  const getFilenameFromUrl = (url, fallback = 'file') => {
    try {
      const u = new URL(url, window.location.href);
      const last = u.pathname.split('/').pop() || '';
      const name = decodeURIComponent((last.split('?')[0] || '').trim());
      return sanitizeFileName(name || fallback);
    } catch {
      return sanitizeFileName(fallback);
    }
  };

  return (
    <div className='sayings'>
      <SectionHeader title="اقوال" subtitle="البابا شنوده" />
      <Swiper
        navigation={{
          nextEl: ".arrow-front",
          prevEl: ".arrow-back",
        }}
        onSlideChange={(swiper) => handleSwiperEvents(swiper)}
        onInit={(swiper) => handleSwiperEvents(swiper)}
        modules={[Navigation, EffectFade]}
        effect="fade"
        className="mySwiper"
      >
        {sayingsData[0]
          ? sayingsData[0].map((item, index) => (
            <SwiperSlide className="SwiperSlide" key={index}>
              <div className="SwiperSlideItem one"></div>
              <div className="SwiperSlideItem two"></div>
              <div className="SwiperSlideItem three">
                <div className="sliderItems">
                  <div className="sliderContent">
                    <h2>{item.name}</h2>
                    <img
                      src="/assets/Sayings/q1.png"
                      alt="quote"
                      className="q1 quote"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: item.quote }}
                      className="sayingWriteCardDesc"
                    ></p>

                    <div className='moreWriteCard' dir='rtl'>
                      <img
                        src='/assets/moreWC.png'
                        alt='writeCard'
                        onClick={() => handleCardOverlay(item)}
                      />
                    </div>
                    <img className="sign" src="/assets/Sayings/sign.png" alt="sign" />
                  </div>
                  <div className="sliderBg">
                    <img
                      alt="siderBackground"
                      src={item.sharepoint_image != null ? item.image_url : "/assets/default/written/insideWritten.png"}
                    />
                  </div>
                  <img
                    src="/assets/dots.png"
                    alt=""
                    onClick={(e) => handleOverlayToggle(e, item)}
                    className='dotsWrite'
                  />
                  <OverlayPanel ref={op} appendTo={document.body} className="sayings-op">
                      <button
                        type="button"
                        className="shareButton btnAction"
                        onClick={(e) => {
                          e.stopPropagation();
                          op.current?.hide?.();        // <-- close overlay
                          openShareBlock();
                        }}
                      >
                        <span>مشاركة</span>
                        <img src='/assets/Share.png' alt="" />
                      </button>

                      <img src='/assets/line.png' alt='line' />

                      <button
                        type="button"
                        className="shareButton btnAction"
                        onClick={(e) => {
                          e.stopPropagation();
                          op.current?.hide?.();        // <-- close overlay
                          copyData(descMore, nameMore, "اقوال بابا شنوده الثالث");
                        }}
                      >
                        <span>نسخ</span>
                        <img src='/assets/copy.png' alt="" />
                      </button>

                      <img src='/assets/line.png' alt='line' />

                      <button
                        type="button"
                        className="shareButton btnAction"
                        onClick={(e) => {
                          e.stopPropagation();
                          op.current?.hide?.();        // <-- close overlay
                          downloadImage();
                        }}
                      >
                        <span>تحميل</span>
                        <img src='/assets/download.png' alt="" />
                      </button>
                    </OverlayPanel>
                </div>
              </div>
            </SwiperSlide>
          ))
          : ""
        }
      </Swiper>

      <div className={`arrow-back arrows ${currentIndex === 0 ? "disabled" : ""}`} style={{
        opacity: currentIndex === 0 ? 0.5 : 1,
        pointerEvents: currentIndex === 0 ? "none" : "auto",
      }}>
        <img src="/assets/arrow-prev.png" alt="Previous" />
      </div>

      <div className={`arrow-front arrows ${currentIndex === sayingsData[0]?.length - 1 ? "disabled" : ""}`} style={{
        opacity: currentIndex === sayingsData[0]?.length - 1 ? 0.5 : 1,
        pointerEvents: currentIndex === sayingsData[0]?.length - 1 ? "none" : "auto",
      }}>
        <img src="/assets/arrow-next.png" alt="Next" />
      </div>
      <Link to="/media/written-quotes-more" className='more_btn '>المزيد</Link>
      <div dir='rtl' className='moreSayingHome'>
        {isOverlayCard && <SayingWriteCardOverlay closeOverlay={handleCardOverlayClose} img={imageMore} desc={descMore} name={nameMore} cate={"اقوال بابا شنوده الثالث"} />}
        {isOverlayBlockShare && <SayingShareContainer closeOverlay={closeShareBlock} currentPath={window.location.href} img={imageMore} desc={descMore} name={nameMore} cate={"اقوال بابا شنوده الثالث"} height="70%" />}
      </div>

      <ToastContainer />
    </div>
  );
}
