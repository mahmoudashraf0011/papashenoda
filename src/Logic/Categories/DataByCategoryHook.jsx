import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataByCategoryAction } from '../../redux/actions/Categories/CategoryActions';

export default function DataByCategoryHook(newID) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false); 

    // Keep track of last fetched id to avoid duplicate calls (e.g. StrictMode double-mount)
    const lastFetchedRef = useRef(null);

    // authReducer
    const getData = async (id) => {
        // guard: don't call when id is falsy (prevents slug=undefined)
        if (!id) return;

        // If we've already fetched this id, skip (avoids duplicate calls)
        if (lastFetchedRef.current === id) return;

        setLoading(true); 
        try {
            await dispatch(getDataByCategoryAction(id));
            lastFetchedRef.current = id;
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); 
        }
    }

    // Only trigger effect when newID changes and is truthy
    useEffect(() => {
        // if newID is falsy, don't call — prevents slug=undefined
        if (!newID) return;
        getData(newID);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newID]);

    const res = useSelector(state => state.CategoryReducer.categoryData);
    const [check, setCheck] = useState()
    // 1 => كتب
    // 2 => معرض الحدث
    // 3 => فيديو
    // 4 => مقالة
    // 5 => صوتي
    // 8 => اقوال مكتوبة
    // 10 => صور و اقوال
    // 12 => قصائد
    // 14 => اسئلة واجوبة
    // 15 => حدث في مثل هذا اليوم
    // 16 => وثائق

    let categoryBookData = [];
    let categoryGalleryData = [];
    let categoryVideoData = [];
    let categoryArticleData = [];
    let categorySoundData = [];
    let categorySayingsData = [];
    let categoryPhotoSayingsData = [];
    let categoryPoemsData = [];
    let categoryQuestionsData = [];
    let categoryHappenData = [];
    let categoryDocsData = [];
    let categoryPath = [];
    let categoryTitle = [];
    let all = []
    const ele = useRef()

    try {
        if (res) {
            if (res.data) {
                categoryPath = res.data.path
                categoryTitle = res.data.category_title.name
                res.data.media.map((item) => {
                    if (item.media_type_id == 1) {
                        categoryBookData.push(item)
                    }
                    if (item.media_type_id == 2) {
                        categoryGalleryData.push(item)
                    }
                    if (item.media_type_id == 3) {
                        categoryVideoData.push(item)
                    }
                    if (item.media_type_id == 4) {
                        categoryArticleData.push(item)
                    }

                    if (item.media_type_id == 5) {
                        categorySoundData.push(item)
                    }
                    if (item.media_type_id == 8) {
                        categorySayingsData.push(item)
                    }
                    if (item.media_type_id == 10) {
                        categoryPhotoSayingsData.push(item)
                    }
                    if (item.media_type_id == 12) {
                        categoryPoemsData.push(item)
                    }
                    if (item.media_type_id == 14) {
                        categoryQuestionsData.push(item)
                    }
                    if (item.media_type_id == 15) {
                        categoryHappenData.push(item)
                    }
                    if (item.media_type_id == 16) {
                        categoryDocsData.push(item)
                    }

                })
                if (res.data) {
                    all = [...res.data.media]
                }
            }
        }
    }
    catch (e) {
        console.log(e);
    }
    useEffect(() => {
        if (!loading && res && res.data) {
            if (Array.isArray(res.data.media) && res.data.media.length === 0) {
                setCheck(true);
                if (ele.current) {
                    ele.current.style.display = "block";
                }
            } else {
                setCheck(false);
                if (ele.current) {
                    ele.current.style.display = "none";
                }
            }
        }
    }, [loading, res]);

    return [categoryBookData, categoryGalleryData, categoryVideoData, categoryArticleData, categorySoundData, categorySayingsData, categoryPhotoSayingsData, categoryPoemsData, categoryQuestionsData, categoryHappenData, categoryDocsData, categoryTitle, categoryPath, all, check, ele, loading]
}
