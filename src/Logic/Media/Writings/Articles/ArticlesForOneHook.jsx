import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticlesForOneAction, getArticlesAttrForOneAction } from '../../../../redux/actions/Media/Writings/ArticlesActions';

// ---- module-scoped in-flight locks (survives StrictMode remount) ----
const inFlight = new Set();
const keyOf = (args) => JSON.stringify(args);
const runOnce = async (key, fn) => {
  if (inFlight.has(key)) return;     // skip duplicate call
  inFlight.add(key);
  try { await fn(); }
  finally { inFlight.delete(key); }  // allow future legit re-fetch
};
// --------------------------------------------------------------------

export default function ArticlesForOneHook(newspaper) {
  const dispatch = useDispatch();
  const notFound = useRef();
  const [activePage, setActivePage] = useState(1);

  const raw = JSON.parse(localStorage.getItem('articlesAttr') || 'null') || '';
  const result = typeof raw === 'string' ? raw.replace(/category_id=[^&]+&&/, '') : '';

  const getData = useCallback(async () => {
    setActivePage(1);

    const cateIDStr = localStorage.getItem('articlesNewsAttr');
    const cateID = cateIDStr ? JSON.parse(cateIDStr) : null;

    const key = keyOf({ type: 'init', newspaper, page: 1, cateID, result });

    await runOnce(key, async () => {
      if (cateID != null) {
        await dispatch(getArticlesAttrForOneAction(newspaper, 4, 1, cateID));
      } else {
        await dispatch(getAllArticlesForOneAction(newspaper, 4, 1, result));
      }
    });
  }, [dispatch, newspaper, result]);

  useEffect(() => {
    getData();
    // keep your original dependency
  }, [localStorage.getItem('articlesNewsAttr')]); 

  useEffect(() => {
    const allPages = document.querySelectorAll('.paginateGeneral .page-item');
    if (allPages[1]) allPages[1].classList.add('active');
  }, [localStorage.getItem('articlesNewsAttr')]);

  const res = useSelector(state => state.ArticlesReducer.articlesForOneData);
  const resFilter = useSelector(state => state.ArticlesReducer.articlesAttrForOne);

  let articlesForOneData = [];
  let filterGroup = [];
  let attrGroup = [];
  try {
    if (localStorage.getItem('articlesNewsAttr')) {
      if (resFilter?.data) {
        articlesForOneData.push(resFilter.data);
        if (notFound.current) notFound.current.style.display = resFilter.data.length === 0 ? 'block' : 'none';
      }
      if (resFilter?.addetionals) {
        filterGroup = [...resFilter.addetionals.filterable_categories];
        attrGroup = [...resFilter.addetionals.filterable_attrebutes];
      }
    } else {
      if (res?.data) {
        articlesForOneData.push(res.data);
        if (notFound.current) notFound.current.style.display = res.data.length === 0 ? 'block' : 'none';
      }
      if (res?.addetionals) {
        filterGroup = [...res.addetionals.filterable_categories];
        attrGroup = [...res.addetionals.filterable_attrebutes];
      }
    }
  } catch (e) { console.log(e); }

  let pageCount = 0;
  try {
    if (localStorage.getItem('articlesNewsAttr')) {
      if (resFilter?.pagination) {
        pageCount = Math.ceil(resFilter.pagination.total / resFilter.pagination.per_page);
      }
    } else if (res?.pagination) {
      pageCount = Math.ceil(res.pagination.total / res.pagination.per_page);
    }
  } catch {}

  const handleChangePage = async count => {
    setActivePage(count);

    const cateIDStr = localStorage.getItem('articlesNewsAttr');
    const cateID = cateIDStr ? JSON.parse(cateIDStr) : null;

    const key = keyOf({ type: 'page', newspaper, page: count, cateID, result });

    await runOnce(key, async () => {
      if (cateID != null) {
        await dispatch(getArticlesAttrForOneAction(newspaper, 4, count, cateID));
      } else {
        await dispatch(getAllArticlesForOneAction(newspaper, 4, count, result));
      }
    });

    window.history.replaceState(null, null, ' ');
    window.scrollTo(0, 0);
  };

  return [articlesForOneData, pageCount, filterGroup, attrGroup, handleChangePage, getData, notFound, activePage];
}
