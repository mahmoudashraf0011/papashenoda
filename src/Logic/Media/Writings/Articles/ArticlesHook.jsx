import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllArticlesAction,
  getArticlesAttrAction,
} from '../../../../redux/actions/Media/Writings/ArticlesActions';

// ✅ Module-level flag persists across StrictMode remounts in dev
let hasFetchedArticles = false;

export default function ArticlesHook() {
  const dispatch = useDispatch();
  const notFound = useRef();

  // ---- Fetcher (unchanged behavior) ----
  const getData = useCallback(async () => {
    const stored = localStorage.getItem('articlesAttr');
    if (stored) {
      const cateID = JSON.parse(stored);
      await dispatch(getArticlesAttrAction(cateID));
    } else {
      await dispatch(getAllArticlesAction());
    }
  }, [dispatch]);

  // ---- Run exactly once (dev + prod) ----
  useEffect(() => {
    if (hasFetchedArticles) return; // hard block the StrictMode second mount
    hasFetchedArticles = true;
    getData();
  }, [getData]);

  // ---- Redux selectors ----
  const res = useSelector((state) => state.ArticlesReducer.articlesData);
  const resFilter = useSelector((state) => state.ArticlesReducer.articlesAttr);

  // ---- Shaped outputs ----
  let articlesData = [];
  let filterGroup = [];
  let attrGroup = [];

  try {
    const stored = localStorage.getItem('articlesAttr');

    if (stored) {
      if (resFilter?.data) {
        articlesData.push(resFilter.data);
        if (notFound.current) {
          notFound.current.style.display =
            resFilter.data.length === 0 ? 'block' : 'none';
        }
      }
      if (resFilter?.addetionals) {
        filterGroup = [...resFilter.addetionals.filterable_categories];
        attrGroup = [...resFilter.addetionals.filterable_attrebutes];
      }
    } else {
      if (res?.data) {
        articlesData.push(res.data);
        if (notFound.current) {
          notFound.current.style.display =
            res.data.length === 0 ? 'block' : 'none';
        }
      }
      if (res?.addetionals) {
        filterGroup = [...res.addetionals.filterable_categories];
        attrGroup = [...res.addetionals.filterable_attrebutes];
      }
    }
  } catch (e) {
    console.log(e);
  }

  // Keep original return shape
  return [articlesData, filterGroup, attrGroup, notFound, getData];
}
