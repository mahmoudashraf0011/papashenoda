import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import './OneArticleContainer.css';
import MediaHeader from '../../MediaHeader';
import { useNavigate, useParams } from 'react-router-dom';
import ArticlesDetailsHook from '../../../../Logic/Media/Writings/Articles/ArticlesDetailsHook';
import Spinner from '../../../Utility/Spinner';
import { ReactReader } from 'react-reader';
import { UserContext } from '../../../Context/UserContext';

export default function OneArticleContainer() {
  const { baseURL } = useContext(UserContext);
  const API_BASE = baseURL; // مثال: https://popeshenoudatest.msol.dev
  const navigate = useNavigate();
  const { id } = useParams(); // slug من الراوتر، مثال: "christmas-sermon"

  // موجودة في مشروعك
  const [oneArticleData, check, ele, getData] = ArticlesDetailsHook(id);

  // حالة عرض وتحكّم
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null); // استجابة الAPI كاملة
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // إجمالي عدد المقالات (من الAPI)
  const articlesCount = bundle?.data?.articles_count ?? null;

  // كاش للردود حسب الslug لتسريع التنقل
  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);

  // bookId لازم يكون هو الـ id من الراوتر علشان الـ iframe يبقى:
  // https://popeshenoudatest.msol.dev/api/open-epub?slug=${bookId}
  const [bookId, setBookID] = useState(null);

  const getKey = (slug) => `article:${slug}`;

  const fetchBundle = useCallback(
    async (slug, { useCache = true, setAsCurrent = true } = {}) => {
      if (!slug) return null;

      const cacheKey = getKey(slug);
      if (useCache && cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        if (setAsCurrent) setBundle(cached);
        return cached;
      }

      // إلغاء أي طلب قديم
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (setAsCurrent) {
          setLoading(true);
          setError(null);
        }

        const url = `${API_BASE}/v2/get/next/previous/article?article_slug=${encodeURIComponent(slug)}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // حفظ في الكاش
        cacheRef.current.set(cacheKey, data);
        if (setAsCurrent) setBundle(data);

        // Prefetch للـ previous & next
        const nextSlug = data?.data?.next?.media_slug;
        const prevSlug = data?.data?.previous?.media_slug;

        if (nextSlug && !cacheRef.current.has(getKey(nextSlug))) {
          fetch(`${API_BASE}/v2/get/next/previous/article?article_slug=${encodeURIComponent(nextSlug)}`)
            .then(async (r) => {
              if (r.ok) {
                const d = await r.json();
                cacheRef.current.set(getKey(nextSlug), d);
              }
            })
            .catch(() => {});
        }
        if (prevSlug && !cacheRef.current.has(getKey(prevSlug))) {
          fetch(`${API_BASE}/v2/get/next/previous/article?article_slug=${encodeURIComponent(prevSlug)}`)
            .then(async (r) => {
              if (r.ok) {
                const d = await r.json();
                cacheRef.current.set(getKey(prevSlug), d);
              }
            })
            .catch(() => {});
        }

        return data;
      } catch (err) {
        if (setAsCurrent) setError(err.message || 'حدث خطأ أثناء جلب البيانات');
        return null;
      } finally {
        if (setAsCurrent) setLoading(false);
      }
    },
    [API_BASE]
  );

  // حمّل الباندل واضبط bookId عند تغيّر الslug (id)
  useEffect(() => {
    setBookID(id); // مهم علشان الـ iframe src يكون بالصيغة المطلوبة
    fetchBundle(id, { useCache: true, setAsCurrent: true });

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [id, fetchBundle]);

  // تحديث عنوان الصفحة
  useEffect(() => {
    const name = bundle?.data?.current?.name;
    if (name) document.title = name + ' | المقالات';
  }, [bundle]);

  const closeWrapper = () => {
    if(localStorage.getItem("articleRoute")){
      let rout=localStorage.getItem("articleRoute")
      navigate(rout);

    }
  };

  // المعروض حاليًا
  const current = bundle?.data?.current || null;
  const nextMeta = bundle?.data?.next || null;
  const prevMeta = bundle?.data?.previous || null;

  // مصدر الـ iframe (حسب طلبك)
  const iframeSrc = bookId
    ? `https://popeshenoudatest.msol.dev/api/open-epub?slug=${encodeURIComponent(bookId)}`
    : '';

  // تنقّل سلس مع تحديث URL + prefetch
  const handleNavigateToSlug = async (slug) => {
    if (!slug || isNavigating) return;
    setIsNavigating(true);

    const cached = cacheRef.current.get(getKey(slug));
    if (cached) setBundle(cached); // إحساس فوري

    await fetchBundle(slug, { useCache: true, setAsCurrent: true });

    // حدّث المسار -> هيحدّث bookId تلقائيًا عبر useEffect
    navigate(`/articles/${slug}`);
    setIsNavigating(false);
  };

  const goNext = () => {
    if (nextMeta?.media_slug) handleNavigateToSlug(nextMeta.media_slug);
  };
  const goPrev = () => {
    if (prevMeta?.media_slug) handleNavigateToSlug(prevMeta.media_slug);
  };

  // اختصارات الكيبورد ← / →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        goNext(); // RTL: يمين = التالي
      } else if (e.key === 'ArrowLeft') {
        goPrev(); // RTL: يسار = السابق
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextMeta, prevMeta]);

  return (
    <div style={{ position: 'relative' }}>
      {/* زر إغلاق */}
      <button
      className='close_article_icon'
        onClick={closeWrapper}
        style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          background: '#fff',
          border: 'none',
          color: '#000',
          fontSize: '22px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: '0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        aria-label="إغلاق"
        title="إغلاق"
      >
        ✕
      </button>

      {/* منطقة القارئ */}
      <div className="display_article_iframe_block">
        {loading && (
          <div className="overlay-loading">
            <div className="loader" />
            <div className="loader-text">جارِ تحميل المقال…</div>
          </div>
        )}
        {error && (
          <div className="overlay-error">
            حدث خطأ في جلب المقال. {String(error)}
          </div>
        )}
        {!error && (
          <iframe
            key={bookId || 'blank'}
            className="display_book_iframe"
            src={iframeSrc}
            allowFullScreen
            style={{
              width: '100%',
              height: '100vh',
              border: 'none',
              borderRadius: '12px',
            }}
            title={current?.name || 'قارئ المقال'}
          ></iframe>
        )}
      </div>

      {/* شريط التنقل السفلي الاحترافي (سنتر) */}
      <div className="article-swipe" role="group" aria-label="التنقل بين المقالات">
        <button
          className="as-btn"
          onClick={goPrev}
          disabled={!prevMeta?.media_slug || isNavigating}
          aria-label="المقالة السابقة"
          title={prevMeta?.name ? `المقالة السابقة: ${prevMeta.name}` : 'لا يوجد مقالة سابقة'}
        >
      
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>السابق</span>
        </button>

        <div className="as-divider" aria-hidden="true" />

        <div className="as-center">
          <div className="as-title" title={current?.name || ''}>
            {current?.name || '—'}
          </div>
          <div className="as-meta">
            {current?.newspaper ? <span>{current.newspaper}</span> : null}
            {current?.year ? <span>• {current.year}</span> : null}
            {typeof articlesCount === 'number' ? <span>• {articlesCount} مقال</span> : null}
          </div>
        </div>

        <div className="as-divider" aria-hidden="true" />

        <button
          className="as-btn"
          onClick={goNext}
          disabled={!nextMeta?.media_slug || isNavigating}
          aria-label="المقالة التالية"
          title={nextMeta?.name ? `المقالة التالية: ${nextMeta.name}` : 'لا يوجد مقالة تالية'}
        >
          <span>التالي</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="as-hint" aria-hidden="true">
          ← / → للتنقّل
        </div>
      </div>
    </div>
  );
}
