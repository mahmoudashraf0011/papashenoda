// video hook
import axios from 'axios';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../../components/Context/UserContext';

export default function VideosHooks() {
  const notFound = useRef();
  const notFoundRes = useRef();
  const { baseURL } = useContext(UserContext);
  const [videos, setVideos] = useState(null);
  const [categories, setCategories] = useState(null);
  const [attrs, setAttrs] = useState(null);
  const navigate = useNavigate();
  const [cateID, setCateID] = useState(null);
  const [page, setPage] = useState(1);
  const [pag, setPag] = useState(null);
  const [total, setTotal] = useState(null);
  const [totalF, setFTotal] = useState(null);
  const op = useRef(null);
  const token_popeShounda = localStorage.getItem("token_popeShounda");
  const [visibleModal, setVisibleModal] = useState(null);
  const [imgbm, setImgbk] = useState(null);
  const bookMarkRef = useRef();
  const [activePage, setActivePage] = useState(1);

  // NEW: prevent duplicate API calls for the same params (handles StrictMode double-run)
  const lastFetchKey = useRef('');

  const fetchVideos = async () => {
    const cate = localStorage.getItem("videosAttr") ? JSON.parse(localStorage.getItem("videosAttr")) : null;

    if (cate) {
      setCateID(cate);

      try {
        const token_popeShounda = localStorage.getItem("token_popeShounda");
        const response = await axios.get(
          `${baseURL}/v2/getmedia?slug=video&lang=ar&page=1&${cate}`,
          { headers: { Authorization: `Bearer ${token_popeShounda}` } }
        );

        const { data, pagination, addetionals } = response.data;

        setVideos(data);
        setPag(pagination);
        setFTotal(pagination.total_pages);
        setCategories(addetionals.filterable_categories);
        setAttrs(addetionals.filterable_attrebutes);

        if (data.media.length === 0 && JSON.parse(localStorage.getItem("videosAttr"))) {
          if (notFound.current) notFound.current.style.display = "block ";
          if (notFoundRes.current) notFoundRes.current.style.display = "block ";
        } else if (notFound.current) {
          notFound.current.style.display = "none";
          if (notFoundRes.current) notFoundRes.current.style.display = "none ";
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const adjustedPage = Math.min(page || 1, total || 1);

        const response = await axios.get(
          `${baseURL}/v2/getmedia?slug=video&lang=ar&page=${adjustedPage}`,
          { headers: { Authorization: `Bearer ${token_popeShounda}` } }
        );

        const { data, pagination, addetionals } = response.data;

        setVideos(data);
        setPag(pagination);
        setTotal(pagination.total_pages);
        setCategories(addetionals.filterable_categories);
        setAttrs(addetionals.filterable_attrebutes);

        if (data.media.length === 0) {
          if (notFound.current) notFound.current.style.display = "block ";
          if (notFoundRes.current) notFoundRes.current.style.display = "block ";
        } else if (notFound.current) {
          notFound.current.style.display = "none";
          if (notFoundRes.current) notFoundRes.current.style.display = "none ";
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ❌ REMOVED: the initial "call twice" culprit
  // useEffect(() => { fetchVideos(); }, [])

  // ✅ Single effect for both mount and changes, with a de-dupe key
  useEffect(() => {
    const rawAttr = localStorage.getItem("videosAttr") || '';
    const key = `${page}|${rawAttr}`;
    if (lastFetchKey.current === key) return; // same params -> skip duplicate call
    lastFetchKey.current = key;
    fetchVideos();
  }, [page, localStorage.getItem("videosAttr")]); // keep your original dependency style

  useEffect(() => {
    if (localStorage.getItem("videosAttr")) {
      setActivePage(1);
      setPage(1);
    }
  }, [localStorage.getItem("videosAttr")]);

  const handlePageChange = async (selectedPage) => {
    setPage(selectedPage);
    setActivePage(selectedPage);

    try {
      const response = await axios.get(
        `${baseURL}/v2/getmedia?slug=video&lang=ar&page=${selectedPage}&${cateID || ''}`,
        { headers: { Authorization: `Bearer ${token_popeShounda}` } }
      );
      const { data, pagination } = response.data;
      setVideos(data);
      setPag(pagination);
    } catch (error) {
      console.error(error);
    }
    window.history.replaceState(null, null, ' ');
    window.scrollTo(0, 0);
  };

  const AddToBook = (media_id, isBooked) => {
    const axiosRequest = isBooked
      ? axios.delete(`${baseURL}/bookmarks`, {
          data: { media_id },
          headers: { 'Authorization': `Bearer ${token_popeShounda}` }
        })
      : axios.post(`${baseURL}/bookmarks`,
          { media_id },
          { headers: { 'Authorization': `Bearer ${token_popeShounda}` } }
        );

    axiosRequest
      .then(() => { fetchVideos(); })
      .catch((error) => { console.log(error); });
  };

  const [copiedProductIds, setCopiedProductIds] = useState({});
  const handleCopy = (videoId) => {
    setCopiedProductIds(prev => ({ ...prev, [videoId]: true }));
    setVisibleModal(null);
    setTimeout(() => {
      setCopiedProductIds(prev => ({ ...prev, [videoId]: false }));
    }, 3000);
  };
  const handleShareClick = (videoId) => {
    setVisibleModal(prev => (prev === videoId ? null : videoId));
  };

  return [
    baseURL, videos, categories, attrs, cateID, navigate, pag, page, op,
    token_popeShounda, visibleModal, fetchVideos, handlePageChange, AddToBook,
    copiedProductIds, bookMarkRef, handleCopy, handleShareClick, setCategories,
    setVideos, notFound, notFoundRes, activePage, setVisibleModal
  ];
}
