import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import { useParams } from 'react-router-dom';
import './VideoPlayerPage.scss'; // ستيل خاص بالصفحة

export default function VideoPlayerPage() {
  const { id } = useParams();
  const { baseURL } = useContext(UserContext);
  const [videoData, setVideoData] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // الحصول على التوكن إذا كان مطلوبًا
  const token_popeShounda = localStorage.getItem('token') || '';

  useEffect(() => {
    // جلب بيانات الفيديو بناءً على الـ ID
    axios.get(`${baseURL}/v2/video?id=${id}`, { 
      headers: { Authorization: `Bearer ${token_popeShounda}` }
    })
      .then((response) => {
        setVideoData(response.data);
        checkVideo(response.data.video);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, token_popeShounda, baseURL]);

  // تحويل رابط يوتيوب إلى embed
  const convertYouTubeUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
    const videoID = match ? match[1] : null;
    if (!videoID) return null;
    return `https://www.youtube.com/embed/${videoID}?autoplay=0&loop=1&controls=1&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1`;
  };

  // التحقق من نوع الفيديو (Vimeo / YouTube / Direct)
  const checkVideo = (video) => {
    if (!video) return;
    
    if (video.url && video.url.includes("vimeo.com")) {
      convertVimeoUrlAndCheck(video.url);
    } else if (video.second_url && (video.second_url.includes("youtube.com") || video.second_url.includes("youtu.be"))) {
      const match = video.second_url.match(/(?:youtu\.be\/|v=)([^&/]+)/);
      if (match && match[1]) {
        const id = match[1];
        const img = new Image();
        const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        
        img.onload = function () {
          if (img.width === 120 && img.height === 90) {
            setStatus(false);
          } else {
            setStatus(true);
            setVideoSrc(convertYouTubeUrl(video.second_url));
          }
          setLoading(false);
        };
        
        img.onerror = function () {
          setStatus(false);
          setLoading(false);
        };
        
        img.src = thumbUrl;
      } else {
        setStatus(false);
        setLoading(false);
      }
    } else if (video.third_url) {
      setStatus(false);
      setLoading(false);
    }
  };

  // معالجة رابط Vimeo
  const convertVimeoUrlAndCheck = async (url) => {
    if (!url.includes("vimeo.com")) {
      setError(true);
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        const embedHtml = data.html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(embedHtml, "text/html");
        const iframe = doc.querySelector("iframe");
        
        if (iframe) {
          const embedSrc = iframe.getAttribute("src");
          setVideoSrc(embedSrc);
          setError(false);
        } else {
          throw new Error("Iframe not found");
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Vimeo check failed:", err);
      setError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="video-player-loading">جاري تحميل الفيديو...</div>;
  }

  if (!videoData || !videoData.video) {
    return <div className="video-player-not-found">الفيديو غير موجود.</div>;
  }

  return (
    <div className="video-player-container">
      <div className="video-player-wrapper">
        {!error && videoSrc ? (
          // Vimeo
          <iframe
            className="video-player-frame"
            src={videoSrc}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : status && videoSrc ? (
          // YouTube
          <iframe
            className="video-player-frame"
            src={videoSrc}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          // Direct video
          <video controls className="video-player-direct">
            <source src={videoData.video.third_url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        )}
        
        {/* زر التحميل */}
        {videoData.video.third_url && (
          <a
            href={videoData.video.third_url}
            download
            className="video-player-download-btn"
          >
            ⬇ تحميل
          </a>
        )}
      </div>
    </div>
  );
}
