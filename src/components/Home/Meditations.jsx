import React, { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '../Utility/SectionHeader';
import './Meditations.css';
import './Responsive/HomeRes.css';

import HomeHook from '../../Logic/Home/HomeHook';
import { Link } from 'react-router-dom';
import SkeletonVideoCard1 from './SkeletonVideoCard1';

export default function Meditations() {
  const [mediaData, meditationsData, sayingsData, eventsData] = HomeHook();

  // --------------------------------------------------
  // YouTube: build embed URL (with playlist of all found YouTube IDs)
  // --------------------------------------------------
  const convertVideo = (video) => {
    const match = video.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    if (!match || !match[1]) {
      console.error('Invalid YouTube URL:', video);
      return null;
    }

    const videoID = match[1];
    let playlistIDs = [videoID];

    if (meditationsData?.[0] && Array.isArray(meditationsData[0])) {
      meditationsData[0].forEach((item) => {
        const itemMatch = item?.second_url?.match(/(?:youtu\.be\/|v=)([^&/]+)/);
        if (itemMatch?.[1]) {
          playlistIDs.push(itemMatch[1]);
        }
      });
    }

    const playlistParam = playlistIDs.join(',');
    const videoSrc = `https://www.youtube.com/embed/${videoID}?autoplay=0&loop=1&playlist=${playlistParam}&controls=1&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1`;

    return videoSrc;
  };

  // --------------------------------------------------
  // YouTube: availability check with caching + de-dupe
  // --------------------------------------------------
  const [availability, setAvailability] = useState({}); // url -> boolean
  const ytCacheRef = useRef(new Map()); // url -> boolean
  const ytInFlightRef = useRef(new Map()); // url -> Promise<boolean>

  function checkYouTubeOnce(videoUrl) {
    if (!videoUrl) return Promise.resolve(false);

    // Cached?
    if (ytCacheRef.current.has(videoUrl)) {
      return Promise.resolve(ytCacheRef.current.get(videoUrl));
    }

    // In-flight?
    if (ytInFlightRef.current.has(videoUrl)) {
      return ytInFlightRef.current.get(videoUrl);
    }

    const idMatch = videoUrl.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    if (!idMatch || !idMatch[1]) {
      ytCacheRef.current.set(videoUrl, false);
      setAvailability((prev) => ({ ...prev, [videoUrl]: false }));
      return Promise.resolve(false);
    }

    const videoId = idMatch[1];
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const p = new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const exists = !(img.width === 120 && img.height === 90);
        ytCacheRef.current.set(videoUrl, exists);
        setAvailability((prev) => {
          if (prev[videoUrl] === exists) return prev; // avoid unnecessary rerender
          return { ...prev, [videoUrl]: exists };
        });
        resolve(exists);
      };
      img.onerror = function () {
        ytCacheRef.current.set(videoUrl, false);
        setAvailability((prev) => {
          if (prev[videoUrl] === false) return prev;
          return { ...prev, [videoUrl]: false };
        });
        resolve(false);
      };
      img.src = thumbUrl;
    }).finally(() => {
      ytInFlightRef.current.delete(videoUrl);
    });

    ytInFlightRef.current.set(videoUrl, p);
    return p;
  }

  useEffect(() => {
    const list = meditationsData?.[0] || [];
    if (!list.length) return;

    const unique = Array.from(new Set(list.map((v) => v?.second_url).filter(Boolean)));
    if (!unique.length) return;

    unique.forEach((url) => {
      if (!ytCacheRef.current.has(url)) {
        checkYouTubeOnce(url);
      }
    });
  }, [meditationsData?.[0]]);

  // --------------------------------------------------
  // Vimeo: SINGLE-CALL-PER-URL with cache + in-flight dedupe
  // --------------------------------------------------
  const [validVimeoUrls, setValidVimeoUrls] = useState({}); // id -> embedUrl
  const [invalidVimeoIds, setInvalidVimeoIds] = useState({}); // id -> error

  const vimeoCacheRef = useRef(new Map()); // url -> { success, embedUrl?, error? }
  const vimeoInFlightRef = useRef(new Map()); // url -> Promise<result>

  async function fetchVimeoOnce(url) {
    if (!url) return { success: false, error: 'No URL' };

    if (vimeoCacheRef.current.has(url)) {
      return vimeoCacheRef.current.get(url);
    }
    if (vimeoInFlightRef.current.has(url)) {
      return vimeoInFlightRef.current.get(url);
    }

    const p = (async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          const out = { success: false, error: 'Video not embeddable or does not exist' };
          vimeoCacheRef.current.set(url, out);
          return out;
        }

        const data = await response.json();

        let embedUrl = null;
        if (data?.html) {
          const m = data.html.match(/player\.vimeo\.com\/video\/(\d+)/);
          if (m?.[1]) embedUrl = `https://player.vimeo.com/video/${m[1]}`;
        }
        if (!embedUrl) {
          const f = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
          if (f?.[1]) embedUrl = `https://player.vimeo.com/video/${f[1]}`;
        }

        const out = embedUrl
          ? { success: true, embedUrl }
          : { success: false, error: 'Video ID could not be extracted' };

        vimeoCacheRef.current.set(url, out);
        return out;
      } catch (err) {
        const out = { success: false, error: err?.message || 'Unknown error' };
        vimeoCacheRef.current.set(url, out);
        return out;
      } finally {
        vimeoInFlightRef.current.delete(url);
      }
    })();

    vimeoInFlightRef.current.set(url, p);
    return p;
  }

  // Stable signature of the set of Vimeo URLs present in the current list
  const vimeoUrlsSignature = useMemo(() => {
    const items = meditationsData?.[0] || [];
    const urls = items.map((v) => v?.url).filter(Boolean);
    return Array.from(new Set(urls)).sort().join('|');
  }, [meditationsData?.[0]]);

  useEffect(() => {
    const items = meditationsData?.[0] || [];
    if (!items.length) return;

    const uniqueUrls = Array.from(new Set(items.map((v) => v?.url).filter(Boolean)));
    if (!uniqueUrls.length) {
      setValidVimeoUrls({});
      setInvalidVimeoIds({});
      return;
    }

    let cancelled = false;
    (async () => {
      const toFetch = uniqueUrls.filter((u) => !vimeoCacheRef.current.has(u));
      if (toFetch.length) {
        await Promise.all(toFetch.map((u) => fetchVimeoOnce(u)));
      }
      if (cancelled) return;

      const nextValid = {};
      const nextInvalid = {};
      for (const video of items) {
        const u = video?.url;
        if (!u) continue;
        const res = vimeoCacheRef.current.get(u);
        if (!res) continue;
        if (res.success) nextValid[video.id] = res.embedUrl;
        else nextInvalid[video.id] = res.error || 'Unknown error';
      }

      setValidVimeoUrls(nextValid);
      setInvalidVimeoIds(nextInvalid);
    })();

    return () => {
      cancelled = true;
    };
  }, [vimeoUrlsSignature]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className='meditations'>
      <SectionHeader title='عظات' subtitle='وتأمــــــــــــــــــــــــــــــــــــلات' />

      <div className='Container'>
        <div className='meditations_items'>
          {!meditationsData?.[0] ? (
            <>
              <SkeletonVideoCard1 />
              <SkeletonVideoCard1 />
            </>
          ) : (
            meditationsData[0].map((video) => {
              const embedUrl = validVimeoUrls[video.id];
              return (
                <Link
                  to={`/displayvideo/${video.slug}`}
                  style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                  key={video.id}
                >
                  {embedUrl ? (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '500px' }}>
                      <iframe
                        className='display_video_frame_medition'
                        src={embedUrl}
                        frameBorder='0'
                        allow='autoplay; fullscreen; picture-in-picture'
                        allowFullScreen
                        style={{ pointerEvents: 'none' }}
                        title={video?.name || `vimeo-${video.id}`}
                      />
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  ) : video?.second_url && availability[video.second_url] ? (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '500px' }}>
                      <iframe
                        src={convertVideo(video.second_url)}
                        title={video?.name || `youtube-${video.id}`}
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        referrerPolicy='strict-origin-when-cross-origin'
                        allowFullScreen
                        style={{ pointerEvents: 'none' }}
                      />
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '500px' }}>
                      <video controls height={400} className='second_video'>
                        <source src={video?.third_url} type='video/mp4' />
                      </video>
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  )}

                  {/* Non-interactive overlay to prevent iframe capture */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1,
                    }}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div className='meditations_items_res' style={{ display: 'none' }}>
        {!meditationsData?.[0] ? (
          <>
            <SkeletonVideoCard1 />
            <SkeletonVideoCard1 />
          </>
        ) : (
          meditationsData[0]
            ?.slice(0, 1)
            .map((video) => {
              const embedUrl = validVimeoUrls[video.id];
              return (
                <Link
                  to={`/displayvideo/${video.slug}`}
                  style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                  key={`res-${video.id}`}
                >
                  {embedUrl ? (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100px' }}>
                      <iframe
                        className='display_video_frame_medition'
                        src={embedUrl}
                        frameBorder='0'
                        allow='autoplay; fullscreen; picture-in-picture'
                        allowFullScreen
                        style={{ pointerEvents: 'none', cursor: 'pointer' }}
                        title={video?.name || `vimeo-${video.id}`}
                      />
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  ) : video?.second_url && availability[video.second_url] ? (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100px' }}>
                      <iframe
                        src={convertVideo(video.second_url)}
                        title={video?.name || `youtube-${video.id}`}
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        referrerPolicy='strict-origin-when-cross-origin'
                        allowFullScreen
                        style={{ pointerEvents: 'none', cursor: 'pointer' }}
                      />
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100px' }}>
                      <video controls height={400} className='second_video'>
                        <source src={video?.third_url} type='video/mp4' />
                      </video>
                      {video?.third_url && (
                        <a
                          href={video.third_url}
                          download
                          className='video-download-btn'
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: 'absolute', insetInlineEnd: 12, top: 12, zIndex: 2 }}
                        >
                          تحميل ⬇
                        </a>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1,
                    }}
                  />
                </Link>
              );
            })
        )}
      </div>

      <Link className='more_btn' to={'/media/video'}>
        المزيد
      </Link>
    </div>
  );
}
