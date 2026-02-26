import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

// Module-scoped guards and de-duplication helpers
let __fetchAudio_inflight = null;
let __fetchAudio_lastCalledAt = 0;
let __provider_initialFetchDone = false;

export default function UserProvider({ children }) {
    // const baseURL = 'https://phcms.msol.dev/api';
    const baseURL = "https://popeshenoudatest.msol.dev/api";

    const [categoryId, setCategoryId] = useState({
        id: '',
        name: ''
    });
    const [audioURL, setAudioURL] = useState({
        url: '',
        image: '',
        name: '',
        bookmarkshow: '',
        id: ''
    });
    const [audioId, setAudioId] = useState(null);
    const token_popeShounda = typeof window !== 'undefined' ? localStorage.getItem('token_popeShounda') : null;
    const [recent, setRecent] = useState('');

    const [sideMenu, setSideMenu] = useState('bookmark');

    const fallbackImage = `${process.env.PUBLIC_URL}/assets/header-papa.png`;

    // Set fallback image if image fails to load
    const handleImageError = (e) => {
        e.target.src = fallbackImage;
    };

    const [pag2, setPag2] = useState(null);
    const [page2, setPage2] = useState(1);

    // -------------------------
    // Robust fetchAudio: dedupe multiple rapid calls & coalesce inflight requests
    // -------------------------
    const fetchAudio = (opts = {}) => {
        // normalize opts
        const lang = opts.lang || 'ar';
        const page = opts.page === undefined || opts.page === null ? page2 : opts.page;

        // If an identical request is currently in-flight, return the same promise
        if (__fetchAudio_inflight) {
            return __fetchAudio_inflight;
        }

        // If recently called (within 500ms) and no in-flight request, return resolved promise with current data
        const now = Date.now();
        if (now - __fetchAudio_lastCalledAt < 500) {
            return Promise.resolve({ data: { data: recent, pagination: pag2 } });
        }

        __fetchAudio_lastCalledAt = now;

        // Perform the request and keep the promise in module-scoped inflight var
        __fetchAudio_inflight = axios
            .get(`${baseURL}/get-latest-audio`, {
                params: { lang, page },
                headers: { 'Authorization': `Bearer ${token_popeShounda}` }
            })
            .then((response) => {
                // update local state
                setRecent(response.data.data);
                setPag2(response.data.pagination);

                // keep bookmarkshow for currently playing audio if exists
                const currentAudio = (response.data.data || []).find(audio => audio.id === audioURL.id);
                if (currentAudio) {
                    setAudioURL(prevAudioURL => ({
                        ...prevAudioURL,
                        bookmarkshow: currentAudio.bookmarkshow
                    }));
                }

                // clear inflight and return response
                __fetchAudio_inflight = null;
                return response;
            })
            .catch((error) => {
                __fetchAudio_inflight = null;
                // log but rethrow so callers can handle
                console.error("fetchAudio error:", error);
                throw error;
            });

        return __fetchAudio_inflight;
    };

    // ensure provider's page2 effect still triggers fetchAudio when page2 changes,
    // but the fetchAudio internal dedupe prevents immediate duplicate requests.
    useEffect(() => {
        // call fetchAudio whenever page2 changes
        fetchAudio({ page: page2 }).catch(() => { /* swallow here if needed */ });
    }, [page2]);

    const [visibleItems2, setVisibleItems2] = useState([]);

    const [currentPageLately, setCurrentPageLately] = useState(1); // Page for "lately"
    const [currentPageBookmarks, setCurrentPageBookmarks] = useState(1); // Page for "bookmarks"
    const [hasMoreLately, setHasMoreLately] = useState(true);
    const [hasMoreBookmarks, setHasMoreBookmarks] = useState(true);

    const fetchbook = () => {
        // Reset existing data
        setCurrentPageBookmarks(1);

        let allItems = [];
        let currentPage = 1;

        const fetchAllPages = () => {
            axios
                .get(`${baseURL}/bookmarks`, {
                    params: { media_type: '5', paginate: 'true', page: currentPage },
                    headers: { Authorization: `Bearer ${token_popeShounda}` },
                })
                .then((response) => {
                    const newItems = response.data.bookmarks || [];
                    const totalPages = response.data.pagination?.totalPages || 1;

                    // Add new items to the aggregated list
                    allItems = [...allItems, ...newItems];

                    // Check if more pages need to be fetched
                    if (currentPage < totalPages) {
                        currentPage += 1;
                        fetchAllPages(); // Fetch the next page
                    } else {
                        // Once all pages are fetched, update the state
                        setVisibleItems2(allItems);
                        setHasMoreBookmarks(false); // Disable infinite scroll
                    }
                })
                .catch((error) => {
                    console.error("Error fetching bookmarks:", error);
                });
        };

        fetchAllPages(); // Start fetching all pages
    };

    const [visibleItems, setVisibleItems] = useState([]);

    const fetchlast = () => {
        setCurrentPageLately(1);

        let allItems = [];
        let currentPage = 1;

        const fetchAllPages2 = () => {
            axios
                .get(`${baseURL}/last_listings`, {
                    params: { paginate: 'true', page: currentPage },
                    headers: { Authorization: `Bearer ${token_popeShounda}` },
                })
                .then((response) => {
                    const newItems = response.data.last_listings || [];
                    const totalPages = response.data.pagination?.totalPages || 1;

                    allItems = [...allItems, ...newItems];

                    if (currentPage < totalPages) {
                        currentPage += 1;
                        fetchAllPages2(); // Fetch the next page
                    } else {
                        setVisibleItems(allItems);
                        setHasMoreLately(false);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching last listings:", error);
                });
        };

        fetchAllPages2();
    };

    const [clicked, setClicked] = useState('');
    const [clickedFliter, setClickedFilter] = useState('');

    const [pag, setPag] = useState(null);
    const [page, setPage] = useState(1);

    const getClickedCategory = (p) => {
        if (localStorage.getItem("filterIds")) {
            let fi = JSON.parse(localStorage.getItem("filterIds"));
            let fb = JSON.parse(localStorage.getItem("filterValues"));
            getAudioFilter(fi, fb, 1);
        } else {
            console.log("paaaaaaaaaaa", page, categoryId.id);
            axios.get(`${baseURL}/get-audio-by-category?lang=ar&page=${p}&category_id=${categoryId.id}`,
                { headers: { 'Authorization': `Bearer ${token_popeShounda}` } }
            )
                .then((response) => {
                    setClicked(response.data.data);
                    setPag(response.data.pagination);
                    setClickedFilter(response.data);
                    const currentAudio2 = response.data.data?.media?.find(audio => audio.id === audioURL.id);
                    if (currentAudio2) {
                        setAudioURL(prevAudioURL => ({
                            ...prevAudioURL,
                            bookmarkshow: currentAudio2.bookmarkshow
                        }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const getAudioFilter = (id, e, page) => {
        console.log("page:", page);

        axios.get(`${baseURL}/get-audio-by-category?page=${page}&lang=ar&category_id=${categoryId.id}`, {
            params: { filter_ids: id, values: e },
            headers: { 'Authorization': `Bearer ${token_popeShounda}` }
        }
        )
            .then((response) => {
                setClicked(response.data.data);
                setPag(response.data.pagination);

            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [audioList, setAudioList] = useState([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(null);

    const [isUserInitiated, setIsUserInitiated] = useState(false); // Tracks if audio was clicked by user

    const SendAudio = (url, id, image, name, book, audioList, index) => {
        setAudioURL({
            url: url,
            image: image,
            name: name,
            bookmarkshow: book,
            id: id
        });

        setIsUserInitiated(true);
        sendAudioId(id)
        setAudioId(id);
        setAudioList(audioList);
        setCurrentAudioIndex(index);
    }

    const sendAudioId = (id) => {
        const token_popeShounda = localStorage.getItem('token_popeShounda');
        axios.post(`${baseURL}/last_listings`,
            { media_id: id }, { headers: { 'Authorization': `Bearer ${token_popeShounda}` } })
            .then((response) => {
                fetchlast();

            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Optional: run a single initial provider-level fetch once (survives StrictMode remount)
    useEffect(() => {
        if (!__provider_initialFetchDone) {
            __provider_initialFetchDone = true;
            fetchAudio({ page: 1 }).catch(() => { });
        }
    }, []);

    return (
        <UserContext.Provider value={{
            baseURL, categoryId, setCategoryId, setClicked, audioURL, setAudioURL, audioId, setAudioId, fetchAudio, recent, handleImageError, sideMenu, setSideMenu, fetchbook, clicked, getClickedCategory, visibleItems2, setVisibleItems2, audioList, setAudioList, currentAudioIndex, setCurrentAudioIndex, SendAudio, visibleItems, fetchlast, setVisibleItems, clickedFliter, getAudioFilter, isUserInitiated, setIsUserInitiated, pag, setPag, setPage, pag2, setPag2, setPage2, hasMoreBookmarks, hasMoreLately
        }}>
            {children}
        </UserContext.Provider>
    );
}
