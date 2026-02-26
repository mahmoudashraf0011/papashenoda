import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPoemsAction, getPoemsAttrAction } from '../../../../redux/actions/Media/Writings/PoemsActions';

// Module-level map to record which poemsAttr keys have been fetched.
// This survives StrictMode double-mounts and prevents duplicate dispatches.
const fetchedForAttr = new Map();

export default function PoemsHook() {
  const dispatch = useDispatch();
  const notFound = useRef();
  const [activePage, setActivePage] = useState(1);

  // selectors (same as before)
  const res = useSelector(state => state.PoemsReducer.poemsData);
  const resFilter = useSelector(state => state.PoemsReducer.attrPoems);

  // Helper: returns the raw localStorage string key for poemsAttr
  const getAttrRaw = () => localStorage.getItem('poemsAttr');

  // unified getData that accepts the raw attr string (so we can call deterministically)
  const getData = async (attrRaw = getAttrRaw(), force = false) => {
    setActivePage(1);

    const attrKey = attrRaw ?? 'null';

    // If not forcing and we've already fetched for this attrKey, skip dispatch.
    // We also keep a basic store-check to be extra safe (if there's already data in redux, skip).
    if (!force && fetchedForAttr.get(attrKey)) {
      // quick store-based check to avoid skipping when store is empty (defensive)
      if (attrRaw) {
        if (resFilter && resFilter.data && Array.isArray(resFilter.data.data) && resFilter.data.data.length > 0) return;
      } else {
        if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) return;
      }
      // If store is empty but map says fetched, we still avoid re-fetch to prevent duplicate.
      return;
    }

    // mark as fetched immediately (prevents race duplicates)
    fetchedForAttr.set(attrKey, true);

    try {
      if (attrRaw) {
        // parse safely
        let cateID;
        try { cateID = JSON.parse(attrRaw); } catch (e) { cateID = attrRaw; }
        await dispatch(getPoemsAttrAction(6, 1, cateID));
      } else {
        await dispatch(getAllPoemsAction(6, 1));
      }
    } catch (err) {
      // on error, unmark so future attempts can retry
      fetchedForAttr.delete(attrKey);
      console.error(err);
    }
  }

  // useEffect runs once on mount. We intentionally DO NOT depend on localStorage.getItem(...)
  // to avoid unstable dependencies. Instead we read the value once and use a storage listener.
  useEffect(() => {
    // initial fetch for current attr
    const attrRaw = getAttrRaw();
    getData(attrRaw);

    // listen for storage events (other tabs) so we can re-fetch if poemsAttr changes elsewhere
    const onStorage = (e) => {
      if (e.key === 'poemsAttr') {
        const newRaw = e.newValue;
        // clear active page and fetch for the new attr; force fetch so map update happens
        setActivePage(1);
        // Optionally clear prior fetch mark for the old key so it can be re-fetched later:
        // fetchedForAttr.delete(e.oldValue ?? 'null');
        getData(newRaw, true);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
    // empty deps -> run only on mount/unmount
  }, []);

  // ---------- original logic unchanged (except small defensive checks) ----------
  let poemsData = [];
  let filterGroup = [];
  let attrGroup = [];

  try {
    if (getAttrRaw()) {
      if (resFilter) {
        if (resFilter.data && resFilter.data.data) {
          poemsData.push(resFilter.data.data)
          if (resFilter.data.data.length === 0) {
            if (notFound.current) notFound.current.style.display = "block"
          } else {
            if (notFound.current) notFound.current.style.display = "none"
          }
        }
        if (resFilter.addetionals && resFilter.addetionals.filterable_categories) {
          filterGroup = [...resFilter.addetionals.filterable_categories]
          attrGroup = [...resFilter.addetionals.filterable_attrebutes]
        }
      }
    } else {
      if (res) {
        if (res.data && res.data.data) {
          poemsData.push(res.data.data)
          if (res.data.data.length === 0) {
            if (notFound.current) notFound.current.style.display = "block"
          } else {
            if (notFound.current) notFound.current.style.display = "none"
          }
        }
        if (res.addetionals && res.addetionals.filterable_categories) {
          filterGroup = [...res.addetionals.filterable_categories]
          attrGroup = [...res.addetionals.filterable_attrebutes]
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  let pageCount = 0;
  try {
    if (getAttrRaw()) {
      if (resFilter && resFilter.data && resFilter.data.pagination) {
        pageCount = Math.ceil(resFilter.data.pagination.total / resFilter.data.pagination.per_page)
      }
    } else {
      if (res && res.data && res.data.pagination) {
        pageCount = Math.ceil(res.data.pagination.total / res.data.pagination.per_page)
      }
    }
  } catch (error) { }

  const handleChangePage = async (count) => {
    setActivePage(count)
    const attrRaw = getAttrRaw();
    if (attrRaw) {
      let cateID;
      try { cateID = JSON.parse(attrRaw); } catch (e) { cateID = attrRaw; }
      await dispatch(getPoemsAttrAction(6, count, cateID))
    } else {
      await dispatch(getAllPoemsAction(6, count))
    }
    window.history.replaceState(null, null, ' ')
    window.scrollTo(0, 0);
  }

  return [poemsData, pageCount, filterGroup, attrGroup, handleChangePage, getData, notFound, activePage]
}
