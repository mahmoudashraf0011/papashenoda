// sayingWriteCard
import React, { useEffect, useRef, useState,useContext } from 'react';
import { toPng } from "html-to-image";
import { OverlayPanel } from 'primereact/overlaypanel';
import SayingWriteCardOverlay from './SayingWriteCardOverlay';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SayingShareContainer from './SayingShareContainer';
import { useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { UserContext } from '../../../Context/UserContext';

const TOAST_CONTAINER_ID = "saying-write-card";
const COPY_SUCCESS_TOAST_ID = "copy-success";

export default function SayingWriteCard({ img, desc, name, cate, checked }) {
  const { baseURL } = useContext(UserContext);

  const op = useRef(null);

  // get current path
  const location = useLocation();
  const currentPath = `${window.location.origin}${location.pathname}${location.search}`;

  // ---------- Helpers ----------
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

  // Detect MSOL CDN URL like:
  // https://popeshenoudatest.msol.dev/media_files/17465278826819e68a47a86.JPG
  const isMSOLCdnUrl = (u) => {
    try {
      const x = new URL(u, window.location.href);
      return (
        /(^|\.)msol\.dev$/i.test(x.hostname) &&
        x.hostname.toLowerCase().includes('popeshenoudatest') &&
        x.pathname.startsWith('/media_files/')
      );
    } catch {
      return false;
    }
  };

  // Normalize any SharePoint/OneDrive link to download.aspx
  function toSharePointDownload(u) {
    try {
      const url = new URL(u);

      // already on download.aspx → ensure download=1
      if (/\/_layouts\/15\/download\.aspx/i.test(url.pathname)) {
        if (!url.searchParams.get('download')) url.searchParams.set('download', '1');
        return url.toString();
      }

      // support id/SourceUrl or UniqueId
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
  }

  function convertOneDriveLink(onedriveUrl) {
    try {
      if (!onedriveUrl) return null;
      const url = new URL(onedriveUrl);
      if (url.searchParams.get('download') === '1') return onedriveUrl;
      return toSharePointDownload(onedriveUrl);
    } catch {
      return null;
    }
  }

  function toPhcmsDownload(u) {
    try {
      const url = new URL(u, window.location.href);
      const baseNameWithExt = url.pathname.split('/').pop() || '';
      const id = baseNameWithExt.split('.')[0]; // strip extension
      if (!id) return u;
      return `${baseURL}/download/media/${id}.jpg`;
    } catch {
      return u;
    }
  }

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

  const isSameOrigin = (url) => {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  };

  // تحميل بالقوة باستخدام iframe (لا يفتح تبويب)
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

  // --- Download link resolver ---
  // SharePoint → download.aspx
  // MSOL CDN  → PHCMS download API
  // Else      → original url
  const resolveDownloadUrl = (u) => {
    if (!u) return null;
    if (isSharePointUrl(u)) return convertOneDriveLink(u);
    if (isMSOLCdnUrl(u))   return toPhcmsDownload(u);
    return u;
  };

  // Copy Data
  const copyData = async () => { 
    const plainTextDesc = (desc || '').replace(/<[^>]+>/g, "");
    const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;

    try {
      await navigator.clipboard.writeText(message);
      // استخدم containerId ثابت و toastId لمنع تكرارات/تعارض
      toast.success("تم النسخ بنجاح"/* , {
        containerId: TOAST_CONTAINER_ID,
        toastId: COPY_SUCCESS_TOAST_ID,
      } */);
    } catch (error) {
      toast.error("عذرا ..قم بالمحاولة لاحقا"/* , {
        containerId: TOAST_CONTAINER_ID,
      } */);
      console.error("Failed to copy:", error);
    }
  };

  // Download snapshot of the card itself
  const cardRef = useRef(null);
  const generateImageWithoutButton = () => {
    if (!cardRef.current) return;
    toPng(cardRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${sanitizeFileName(name || "card")}.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  // ====== Unified download handler ======
  const downloadFile = async (url, suggestedName) => {
    if (!url) return;

    // SharePoint / OneDrive → استخدم download.aspx + iframe
    if (isSharePointUrl(url)) {
      const spUrl = toSharePointDownload(url);
      forceDownload(spUrl);
      return;
    }

    // نفس الأصل → fetch + blob + a[download]
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
        // fallback
        forceDownload(url);
        return;
      }
    }

    // Cross-Origin:
    // 1) جرّب CORS fetch → blob (لو السيرفر مفعّل CORS)
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
      // ignore
    }

    // 2) مفيش CORS → استخدم iframe (يُفضّل أن يكون السيرفر مرجع Content-Disposition)
    forceDownload(url);
    toast.info("تمت محاولة التحميل. لو لم يبدأ، فعِّل Content-Disposition أو أضف ?download=1 مدعومة من السيرفر.", {
      containerId: TOAST_CONTAINER_ID,
    });
  };

  // more to read
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);
  const [isOverlayCard, setOverlayCard] = useState(false);
  const [isOverlayDots, setIsOverlayDots] = useState(false);
  const [isOverlayBlockShare, setOverlayBlockShare] = useState(false);

  const handleCardOverlay = () => {
    setOverlayCard(true);
    const header = document.querySelector('.header');
    if (header) header.style.zIndex = '1000';
    document.body.style.overflow = 'hidden';
  };

  const handleCardOverlayClose = () => {
    setOverlayCard(false);
    document.body.style.overflow = 'visible';
  };

  useEffect(() => {
    if (descRef.current) {
      setIsOverflowing(descRef.current.scrollHeight > descRef.current.clientHeight);
    }
  }, [desc]);

  const handleOverlayToggle = (e) => {
    op.current.toggle(e);
    setIsOverlayDots((prev) => !prev);
    const header = document.querySelector('.header');
    if (header) header.style.zIndex = '10000';
    setTimeout(() => {
      const overlay = op.current?.getElement?.();
      if (overlay) {
        const currentTop = parseFloat(overlay.style.top) || overlay.offsetTop;
        const currentLeft = parseFloat(overlay.style.left) || overlay.offsetLeft;
        overlay.style.top = `${currentTop + 20}px`;
        overlay.style.left = `${currentLeft - 11}px`;
        overlay.classList.add("shareDp");
      }
    }, 0);
  };

  const openShareBlock = () => {
    document.body.classList.add("no-scroll");
    setOverlayBlockShare(true);
    setIsOverlayDots(false);
    op.current.toggle(false);
    document.body.style.overflow = 'hidden';
  };

  const closeShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockShare(false);
    document.body.style.overflow = 'visible';
  };

  // Display image src:
  // - For MSOL CDN keep original (good for <img>)
  // - For SharePoint we already have a working direct link via download.aspx if needed
  const directSharePointLink = img && isSharePointUrl(img) ? convertOneDriveLink(img) : null;
  const displayImgSrc = checked
    ? (isMSOLCdnUrl(img) ? img : (directSharePointLink || img))
    : "/assets/default/written/insideWritten.png";

  // Download target resolves per rules (SP → download.aspx, MSOL → PHCMS API, else original)
  const downloadTarget = resolveDownloadUrl(img);

  // New function to close overlay and setOverlayCard to false
  const closeOverlayPanelAndReset = () => {
    op.current.hide();
    setIsOverlayDots(false);
  };

  // Handler that avoids the race between toast + overlay close
  const handleCopyAndClose = async () => {
    await copyData();
    // أعطِ التوست فرصة للتسجيل قبل إغلاق الـoverlay
    setTimeout(() => {
      closeOverlayPanelAndReset();
    }, 0);
  };

  return (
    <div className="sayingWriteCard" ref={cardRef}>
      {/* Toast container ثابت داخل نفس الكومبوننت مع containerId */}
      {/* <ToastContainer
        containerId={TOAST_CONTAINER_ID}
        position="top-center"
        rtl
      /> */}

      {isOverlayDots && <div className='dots overlay' onClick={handleOverlayToggle}></div>}

      <div className="sayingWriteCardImg">
        <img
          src={displayImgSrc}
          alt="saying"
        />
      </div>

      <div className="sayingWriteCardContent">
        <img
          className="signQuote saywImg"
          src="/assets/media/writings/Sayings/q1.png"
          alt="quote"
        />
        <div>
          <p
            ref={descRef}
            className={`sayingWriteCardDesc ${isExpanded ? "expanded" : ""}`}
            dangerouslySetInnerHTML={{ __html: desc }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: isExpanded ? "unset" : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          ></p>
          <div style={{ clear: "both" }}></div>

          <div className='moreWriteCard'>
            <img src='/assets/moreWC.png' alt='writeCard' onClick={handleCardOverlay} />
            {isOverlayCard && (
              <SayingWriteCardOverlay
                closeOverlay={handleCardOverlayClose}
                img={displayImgSrc}
                desc={desc}
                name={name}
                cate={cate}
              />
            )}
          </div>
        </div>

        <div style={{ clear: "both" }}></div>

        <div className="sayingWriteCardSign">
          <div>
            <span className="sayingWriteCardCategory">{cate}</span>
            <h3 className="sayingWriteCardSignName"> {name} </h3>
          </div>
          <img src='/assets/sign.png' className='sayingWriteCardSignImg' alt="sign" />
        </div>

        <img src="/assets/dots.png" alt="more" onClick={handleOverlayToggle} className='dotsWrite' />

        <OverlayPanel ref={op}>
          <button className="shareButton btnAction" onClick={() => { openShareBlock() }}>
            <span>مشاركة</span>
            <img src='/assets/Share.png' alt="share" />
          </button>
          <img src='/assets/line.png' alt='line' />
          <button className="shareButton btnAction" onClick={handleCopyAndClose}>
            <span>نسخ</span>
            <img src='/assets/copy.png' alt="copy" />
          </button>
          <img src='/assets/line.png' alt='line' />

          <button
            type="button"
            className="downloadButton btnAction"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              downloadFile(
                downloadTarget,
                `${sanitizeFileName(name || getFilenameFromUrl(downloadTarget || '', 'image'))}`
              );
              closeOverlayPanelAndReset(); // Close overlay when download is triggered
            }}
          >
            تحميل
            <img src="/assets/download.png" alt="download" />
          </button>
        </OverlayPanel>

        {isOverlayBlockShare &&
          ReactDOM.createPortal(
            <SayingShareContainer
              closeOverlay={(closeShareBlock)}
              currentPath={currentPath}
              img={img}
              desc={desc}
              name={name}
              cate={cate}
              height="65%"
            />,
            document.getElementById('portal-root')
          )
        }
      </div>
    </div>
  );
}
