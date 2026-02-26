import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDocsAction, getDocsAttrAction, getDocsFilterAction } from '../../../../redux/actions/Media/Writings/DocsActions';


const fetchedForAttr = new Map();

export default function DocsHook() {

  const dispatch = useDispatch();
  const notFound = useRef()
  const [activePage, setActivePage] = useState(1);

  // selectors
  const res = useSelector(state => state.DocsReducer.docsData);
  const resFilter = useSelector(state => state.DocsReducer.docsAttrData);

  // helper to read raw localStorage key
  const getAttrRaw = () => localStorage.getItem('docsAttr');

  // unified getData that accepts raw attr string (deterministic)
  const getData = async (attrRaw = getAttrRaw(), force = false) => {
    setActivePage(1);

    const attrKey = attrRaw ?? 'null';

    if (!force && fetchedForAttr.get(attrKey)) {
      // quick store-based check to avoid skipping when store is already populated
      if (attrRaw) {
        if (resFilter && resFilter.data && Array.isArray(resFilter.data) && resFilter.data.length > 0) return;
      } else {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) return;
      }
      return;
    }

    // mark as fetched immediately to prevent races
    fetchedForAttr.set(attrKey, true);

    try {
      if (attrRaw) {
        let catID;
        try { catID = JSON.parse(attrRaw); } catch (e) { catID = attrRaw; }
        await dispatch(getDocsAttrAction(catID, 1, 12))
      } else {
        await dispatch(getAllDocsAction(1, 12))
      }
    } catch (err) {
      // allow retry later if there's an error
      fetchedForAttr.delete(attrKey);
      console.error(err);
    }
  }

  // run once on mount; listen for storage events to react to changes in other tabs
  useEffect(() => {
    const attrRaw = getAttrRaw();
    getData(attrRaw);

    const onStorage = (e) => {
      if (e.key === 'docsAttr') {
        const newRaw = e.newValue;
        setActivePage(1);
        // force refetch for the new value
        getData(newRaw, true);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []); // run only on mount/unmount

  // Keep your pagination DOM manipulation behavior, but respond to changes via storage events
  useEffect(() => {
    const applyActiveToPagination = () => {
      let allPages = document.querySelectorAll(".paginateGeneral .page-item")
      if (allPages[1]) {
        allPages[1].classList.add("active");
      }
    };

    // run once to apply classes
    applyActiveToPagination();

    const onStorage = (e) => {
      if (e.key === 'articlesNewsAttr') {
        applyActiveToPagination();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []); // run only on mount/unmount

  // ---------- original logic (kept intact, with small defensive checks) ----------
  let docsData = [];
  let filterAttrs = [];
  let filterCates = []
  try {
    if (getAttrRaw()) {
      if (resFilter) {
        if (resFilter.data) {
          docsData.push(resFilter.data)
          if (resFilter.data.length == 0) {
            if (notFound.current) {
              notFound.current.style.display = "block"
            }
          } else {
            if (notFound.current) {
              notFound.current.style.display = "none"
            }
          }

        }
        if (resFilter.addetionals) {
          filterAttrs = [...resFilter.addetionals.filterable_attrebutes]
          filterCates = [...resFilter.addetionals.filterable_categories]

        }
      }
    } else {
      if (res) {
        if (res.data) {
          docsData.push(res.data)
          if (res.data.length == 0) {
            if (notFound.current) {
              notFound.current.style.display = "block"
            }
          } else {
            if (notFound.current) {
              notFound.current.style.display = "none"
            }
          }
        }
        if (res.addetionals) {
          filterAttrs = [...res.addetionals.filterable_attrebutes]
          filterCates = [...res.addetionals.filterable_categories]

        }
      }
    }

  } catch (e) {
    console.log(e);
  }

  let pageCount = 0;

  try {
    if (getAttrRaw()) {
      if (resFilter) {
        if (resFilter.pagination) {
          pageCount = Math.ceil(resFilter.pagination.total_pages)
        }
      }
    } else {
      if (res) {
        if (res.pagination) {
          pageCount = Math.ceil(res.pagination.total_pages)
        }
      }
    }

  } catch (error) { }
  const handleChangePage = async (count) => {
    setActivePage(count)
    if (getAttrRaw()) {
      let cateID = JSON.parse(getAttrRaw())
      await dispatch(getDocsAttrAction(cateID, count, 12))
    } else {
      await dispatch(getAllDocsAction(count, 12))

    }
    window.history.replaceState(null, null, ' ')
    window.scrollTo(0, 0);
  }

  return [docsData, filterAttrs, filterCates, getData, notFound, handleChangePage, pageCount, activePage]
}
