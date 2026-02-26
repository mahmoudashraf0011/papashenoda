import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllQuestionsAction, getQuestionsAttrAction, getQuestionsFilterAction } from '../../../redux/actions/Media/Writings/QuestionsActions';

// Module-level map to remember which qusAttr keys we already fetched for.
// This survives StrictMode double-mounts and prevents duplicate fetches.
const fetchedForAttr = new Map();

export default function QuestionsHook() {
  const dispatch = useDispatch();
  const notFound = useRef();

  const [activePage, setActivePage] = useState(1);

  // selectors
  const res = useSelector(state => state.QuestionReducer.questionsData);
  const resFilter = useSelector(state => state.QuestionReducer.questionsAttrData);

  // helper to read raw localStorage key
  const getAttrRaw = () => localStorage.getItem('qusAttr');

  // unified getData that accepts raw attr string (deterministic)
  const getData = async (attrRaw = getAttrRaw(), force = false) => {
    setActivePage(1);

    const attrKey = attrRaw ?? 'null';

    // If not forcing and we've already fetched for this attrKey, skip dispatch.
    if (!force && fetchedForAttr.get(attrKey)) {
      // Give a quick store-check to avoid skipping when store already has real data
      if (attrRaw) {
        if (resFilter && resFilter.media && Array.isArray(resFilter.media) && resFilter.media.length > 0) return;
      } else {
        if (res && res.media && Array.isArray(res.media) && res.media.length > 0) return;
      }
      // otherwise avoid re-fetch to prevent duplicates
      return;
    }

    // mark as fetched immediately to prevent races
    fetchedForAttr.set(attrKey, true);

    try {
      if (attrRaw) {
        let cateID;
        try { cateID = JSON.parse(attrRaw); } catch (e) { cateID = attrRaw; }
        await dispatch(getQuestionsAttrAction(10, 1, cateID));
      } else {
        await dispatch(getAllQuestionsAction(10, 1));
      }
    } catch (err) {
      // on error allow retry later
      fetchedForAttr.delete(attrKey);
      console.error(err);
    }
  }

  // run once on mount; use storage listener to react to changes in other tabs
  useEffect(() => {
    const attrRaw = getAttrRaw();
    getData(attrRaw);

    const onStorage = (e) => {
      if (e.key === 'qusAttr') {
        const newRaw = e.newValue;
        setActivePage(1);
        // force fetch for the new value so map updates
        getData(newRaw, true);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []); // run only on mount/unmount

  // ---------- original logic (kept intact, with small defensive checks) ----------
  let questionsData = [];
  let filterGroup = []
  let attrGroup = []
  try {
    if (getAttrRaw()) {
      if (resFilter) {
        if (resFilter.data) {
          questionsData.push(resFilter.data.media)
          if (resFilter.data.media.length == 0) {
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
          filterGroup = [...resFilter.addetionals.filterable_categories]
          attrGroup = [...resFilter.addetionals.filterable_attrebutes]
        }
      }
    } else {
      if (res) {
        if (res.data) {
          questionsData.push(res.data.media)
          if (res.data.media.length == 0) {
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
      if (resFilter) {
        if (resFilter.pagination) {
          pageCount = Math.ceil(resFilter.pagination.total_items / 10)
        }
      }
    } else {
      if (res) {
        if (res.pagination) {
          pageCount = Math.ceil(res.pagination.total_items / 10)
        }
      }
    }
  } catch (error) { }

  const handleChangePage = async (count) => {
    setActivePage(count)

    if (getAttrRaw()) {
      let cateID = JSON.parse(getAttrRaw())
      await dispatch(getQuestionsAttrAction(10, count, cateID))
    } else {
      await dispatch(getAllQuestionsAction(10, count))
    }
    window.history.replaceState(null, null, ' ')
    window.scrollTo(0, 0);
  }

  return [questionsData, filterGroup, attrGroup, handleChangePage, pageCount, getData, notFound, activePage]
}
