import React, { useRef, useState, useEffect } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import CopyToClipboard from 'react-copy-to-clipboard';
import CustomModal from './CustomModal';
import MultimediaShare from '../Utility/MultimediaShare';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function OneVideo({
  src,
  time,
  info,
  date,
  id,
  index,
  img,
  bookmarkshow,
  secondurl,
  video,

  // values/handlers passed from parent (DisplayVideo)
  fetchVideos,
  AddToBook,
  navigate,
  baseURL,
  token, // token_popeShounda passed from parent
  handleShareClick, // optional (you also have local handler)
  handleCopy, // optional
  copiedProductIds, // optional
}) {
  const [visibleModal, setVisibleModal] = useState(null); // Manage modal visibility
  const [copiedProductLocal, setCopiedProductLocal] = useState({}); // Local copied UI state

  const [isOverlayBlockMediaShare, setOverlayBlockMediaShare] = useState(false);
  const [videoID, setVideoID] = useState();
  const openMediaShareBlock = () => {
    document.body.classList.add('no-scroll');
    setOverlayBlockMediaShare(true);
  };
  const closeMediaShareBlock = () => {
    document.body.classList.remove('no-scroll');
    document.body.style.overflow = 'visible';
    setOverlayBlockMediaShare(false);
  };

  const [localBookmark, setLocalBookmark] = useState(bookmarkshow);

  // Optimistic bookmark update with API request
  let AddToBookLocal = (media_id, isBooked) => {
    // Optimistically update UI
    setLocalBookmark(!isBooked);

    // Use parent-provided AddToBook if available, otherwise call API directly
    if (typeof AddToBook === 'function') {
      AddToBook(media_id, isBooked);
      return;
    }

    // fallback to direct axios if parent didn't supply AddToBook
    const axiosRequest = isBooked
      ? axios.delete(`${baseURL}/bookmarks`, {
          data: { media_id },
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post(
          `${baseURL}/bookmarks`,
          { media_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

    axiosRequest
      .then(() => {
        if (typeof fetchVideos === 'function') fetchVideos();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  let checkLogin = localStorage.getItem('token') || '';
  const [status, setStatus] = useState(null);

  const checkVideo = (videoUrl) => {
    // Extract YouTube video ID
    const idMatch = videoUrl && videoUrl.match(/(?:\/embed\/|v=|youtu\.be\/)([^?&/]+)/);
    if (!idMatch || !idMatch[1]) {
      setStatus(false);
      return;
    }

    const videoId = idMatch[1];
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const imgObj = new Image();

    imgObj.onload = function () {
      if (imgObj.width === 120 && imgObj.height === 90) {
        setStatus(false); // Default placeholder thumbnail
      } else {
        setStatus(true);
      }
    };

    imgObj.onerror = function () {
      setStatus(false);
    };

    imgObj.src = thumbUrl;
  };

  useEffect(() => {
    // use src for check — keep original behavior that checked on id change
    checkVideo(src);
  }, [id, src]);

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideModal = modalRef.current && !modalRef.current.contains(event.target);
      const clickedShareCard = event.target.closest('.shareCard');
      if (clickedOutsideModal && !clickedShareCard) {
        setVisibleModal(null); // Close the modal
        setOverlayBlockMediaShare(false); // Close the share if needed
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function convertVimeoUrlAndCheck(url) {
      const match = url && url.match(/vimeo\.com\/.*?\/(\d+)/);
      if (!match || !match[1]) {
        // not a vimeo url — mark error false so YouTube fallback may work
        setError(true);
        return;
      }

      const videoId = match[1];
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;

      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(embedUrl)}`);
        if (response.ok) {
          setVideoSrc(embedUrl);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Vimeo check failed:', err);
        setError(true);
      }
    }

    if (src) {
      convertVimeoUrlAndCheck(src);
    } else if (video && video.url) {
      // if parent passes video object with .url (vimeo) check that
      convertVimeoUrlAndCheck(video.url);
    }
  }, [src, video]);

  function convertVimeoUrl(url) {
    const match = url && url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    } else {
      return null;
    }
  }

  // handle modal toggling inside this component (keeps local UI consistent)
  const handleShareClickLocal = (vid) => {
    setVisibleModal((prev) => (prev === vid ? null : vid));
  };

  const handleCopyLocal = (vid) => {
    setCopiedProductLocal((prev) => ({ ...prev, [vid]: true }));
    setVisibleModal(null);
    if (typeof handleCopy === 'function') handleCopy(vid);
    setTimeout(() => {
      setCopiedProductLocal((prev) => ({ ...prev, [vid]: false }));
    }, 2000);
  };

  return (
    <>
      <div style={{ position: 'relative', width: '31.5%', height: '343px' }} className={`oneVideo ${status}`}>
        {video && video.url ? (
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
            <iframe
              className="display_video_frame_medition"
              src={convertVimeoUrl(video.url)}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {secondurl && (
              <a href={secondurl} download className="video-download-btn" onClick={(e) => e.stopPropagation()}>
                ⬇ تحميل
              </a>
            )}
          </div>
        ) : status ? (
          <iframe
            className="video-video-frame"
            src={src}
            title={`YouTube video player ${info}`}
            frameBorder="0"
            allow="encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}>
            <video controls className="second_video">
              <source src={secondurl} type="video/mp4" />
            </video>
            {secondurl && (
              <a href={secondurl} download className="video-download-btn" onClick={(e) => e.stopPropagation()}>
                ⬇ تحميل
              </a>
            )}
          </div>
        )}

        <div className="videos-video-bottom-section">
          <div className="videos-video-bottom">
            <img src="/assets/dots.png" alt="" className="videos-video-dots" onClick={() => handleShareClickLocal(id)} />
            <div className="videos-video-archive3">
              <p className="videos-video-bottom-p">
                <Link
                  to={`/displayvideo/${video?.slug}`}
                  onClick={() => {
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                    }, 500);
                  }}
                >
                  {info}
                </Link>
              </p>

              {checkLogin ? (
                <img
                  src={localBookmark ? '/assets/bookmark-yellow.png' : '/assets/archive.png'}
                  alt=""
                  className="videos-video-archive"
                  onClick={() => AddToBookLocal(id, localBookmark)}
                />
              ) : (
                ''
              )}
            </div>

            <CustomModal key={index} isVisible={visibleModal === id}>
              <div ref={modalRef}>
                <p
                  className="video-share"
                  onClick={() => {
                    setOverlayBlockMediaShare(true);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  مشاركة
                </p>

                {/* copy link example inside modal */}
                <div style={{ marginTop: 8 }}>
                  <CopyToClipboard text={`https://popeshenoudasitetest.msol.dev/displayvideo/${video?.slug}`} onCopy={() => handleCopyLocal(id)}>
                    <button type="button">نسخ الرابط</button>
                  </CopyToClipboard>
                  {copiedProductLocal[id] && <span style={{ marginLeft: 8 }}>Copied!</span>}
                </div>
              </div>
            </CustomModal>
          </div>
        </div>

        {/* clickable overlay to navigate */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '240px',
            background: 'rgba(255, 255, 255, 0)',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (navigate) navigate(`/displayvideo/${video.slug}`);
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 2000);
          }}
        />
      </div>

      {/* MultimediaShare is rendered via portal */}
      {isOverlayBlockMediaShare &&
        ReactDOM.createPortal(
          <MultimediaShare closeOverlay={closeMediaShareBlock} text={`https://popeshenoudasitetest.msol.dev/displayvideo/${video.slug}`} />,
          document.getElementById('portal-root')
        )}

      <ToastContainer />
    </>
  );
}
