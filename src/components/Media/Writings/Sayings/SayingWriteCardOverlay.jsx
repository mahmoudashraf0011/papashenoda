import { toPng } from 'html-to-image';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SayingShareContainer from './SayingShareContainer';
import { UserContext } from '../../../Context/UserContext';

export default function SayingWriteCardOverlay({ closeOverlay, img, desc, name, cate }) {
  const { baseURL } = useContext(UserContext);

  const [isOverlayDots, setIsOverlayDots] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const location = useLocation();
  const currentPath = `${window.location.origin}${location.pathname}${location.search}`;
  const op = useRef();

  // ---------- OneDrive / SharePoint helpers ----------
  // Normalize any SharePoint/OneDrive link to download.aspx
  function toSharePointDownload(u) {
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
  }

  // Convert OneDrive/SharePoint view links to the canonical download endpoint
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

  const directLink = img ? convertOneDriveLink(img) : null;

  // ---------- WhatsApp share ----------
  function shareOnWhatsApp() {
    const plainTextDesc = (desc || '').replace(/<[^>]+>/g, "");
    const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  // ---------- Download card as image (hide button first) ----------
  const cardRef = useRef(null);
  const buttonDownload = useRef();
  const generateImageWithoutButton = () => {
    if (cardRef.current && buttonDownload.current) {
      const prevDisplay = buttonDownload.current.style.display;
      buttonDownload.current.style.display = "none";
      toPng(cardRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${name || "card"}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image:", error);
        })
        .finally(() => {
          buttonDownload.current.style.display = prevDisplay || "block";
        });
    }
  };

  // ---------- Dots / Share overlays ----------
  const descRef = useRef(null);
  const [isOverlayBlockShare, setOverlayBlockShare] = useState(false);

  const handleOverlayToggle = (e) => {
    const event = e || { currentTarget: null };
    op.current?.toggle?.(event);
    setIsOverlayDots((prev) => !prev);
  };

  const openShareBlock = () => {
    document.body.classList.add("no-scroll");
    setOverlayBlockShare(true);
    if (isOverlayDots) handleOverlayToggle();
  };

  const closeShareBlock = () => {
    document.body.classList.remove("no-scroll");
    setOverlayBlockShare(false);
    setIsOverlayDots(false);
  };

  // ---------- Copy data ----------
  const copyData = async () => {
    try {
      const plainTextDesc = (desc || '').replace(/<[^>]+>/g, "");
      const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;
      await navigator.clipboard.writeText(message);
      toast.success("تم النسخ بنجاح");
    } catch (error) {
      toast.error("عذرا ..قم بالمحاولة لاحقا");
      console.error("Failed to copy:", error);
    }
  };

  useEffect(() => {
    if (descRef.current) {
      setIsOverflowing(descRef.current.scrollHeight > descRef.current.clientHeight);
    }
  }, [desc]);

  // ---------- Download utilities ----------
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

  function toPhcmsDownload(u) {
    try {
      const url = new URL(u, window.location.href);
      const baseNameWithExt = url.pathname.split('/').pop() || '';
      const id = baseNameWithExt.split('.')[0];
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

  const resolveDownloadUrl = (u) => {
    if (!u) return null;
    if (isSharePointUrl(u)) return convertOneDriveLink(u);
    if (isMSOLCdnUrl(u)) return toPhcmsDownload(u);
    return u;
  };

  const downloadFile = async (url, suggestedName) => {
    if (!url) return;

    // SharePoint/OneDrive → let server handle via download.aspx
    if (isSharePointUrl(url)) {
      const spUrl = toSharePointDownload(url);
      forceDownload(spUrl);
      return;
    }

    // Same-origin → try fetch→blob for proper filename
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
        // Fallback to forcing browser navigation download
        forceDownload(url);
        return;
      }
    }

    // Cross-origin (CORS allowed) → fetch→blob
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
    } catch {}

    // Last resort
    forceDownload(url);
    toast.info("تمت محاولة التحميل. لو لم يبدأ، فعِّل Content-Disposition أو أضف ?download=1 مدعومة من السيرفر.");
  };

  // Unified download handler: accepts a URL string
  const handleDownloadClick = (url, suggestedName) => {
    if (!url) return;
    const resolvedUrl = resolveDownloadUrl(url);
    console.log("Resolved URL:", resolvedUrl);
    const fallbackName = suggestedName || name || getFilenameFromUrl(resolvedUrl, 'file');
    downloadFile(resolvedUrl, sanitizeFileName(fallbackName));
  };

  return (
    <div className="saying overlay">
      <ToastContainer />
      {isOverlayDots && <div className='dots overlay' onClick={handleOverlayToggle}></div>}

      <div className="overlay-wrapper">
        <div className="overlayCard" ref={cardRef}>
          <div className="overlayCardImg">
            {/* Use the converted direct link if available */}
            {directLink ? (
              <img src={img} alt="Image from OneDrive" />
            ) : (
              <img src={img} alt="Image" />
            )}
          </div>

          <div className="overlayCardCardContent">
            <div>
              <img
                className="quoteOverlay quoteOverlayTop"
                src="/assets/overlayQStart.png"
                alt="img"
              />
              <p
                ref={descRef}
                dangerouslySetInnerHTML={{ __html: desc }}
                className='overlayCardDesc scrolled'
              />
              <img
                className="quoteOverlay quoteOverlayBottom"
                src="/assets/overlayQEnd.png"
                alt="img"
              />
              <div style={{ clear: "both" }}></div>
            </div>

            <div className="overlayCardSign">
              <div className='overlayCardSignRight'>
                <span className="overlayCardCategory">{cate}</span>
                <h3 className="overlayCardSignName"> {name} </h3>
              </div>
              <img src='/assets/sign.png' className='overlayCardSignImg' alt="sign" />
            </div>

            <img src="/assets/dots.png" alt="" onClick={handleOverlayToggle} className='dotsWrite' />

            <OverlayPanel ref={op} appendTo={document.body} dismissable>
              <button className="shareButton btnAction" onClick={openShareBlock}>
                <span>مشاركة</span>
                <img src='/assets/Share.png' alt="share" />
              </button>

              <img src='/assets/line.png' alt='line' />

              <button className="shareButton btnAction" onClick={copyData}>
                <span>نسخ</span>
                <img src='/assets/copy.png' alt="copy" />
              </button>

              <img src='/assets/line.png' alt='line' />

              <button
                ref={buttonDownload}
                type="button"
                className="downloadButton btnAction"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleDownloadClick(img, name);
                  op.current?.hide?.();
                  setIsOverlayDots(false);
                }}
              >
                تحميل
                <img src="/assets/download.png" alt="download" />
              </button>
            </OverlayPanel>

            {isOverlayBlockShare && (
              <SayingShareContainer
                closeOverlay={closeShareBlock}
                currentPath={currentPath}
                img={img}
                desc={desc}
                name={name}
                cate={cate}
                height="100%"
                onShareToWhatsApp={shareOnWhatsApp}
                onDownloadImage={generateImageWithoutButton}
              />
            )}
          </div>

          <img
            src="/assets/closing.png"
            alt=""
            className="overlay-cancel"
            onClick={closeOverlay}
          />
        </div>
      </div>
    </div>
  );
}
