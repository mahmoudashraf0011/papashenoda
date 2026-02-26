import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllSayingsPhotoAction,
  getAllSayingsWrittenAction,
  getSayingsPhotoAttrAction,
  getSayingsPhotoFilterAction,
  getSayingsWrittenAttrAction,
  getSayingsWrittenFilterAction
} from '../../../../redux/actions/Media/Writings/SayingsActions';
import { useLocation, useParams } from 'react-router-dom';

// Module-level promise cache to dedupe identical calls across remounts
const actionPromiseCache = new Map();

export default function SayingsDetailsHook() {
    const {id}=useParams();
    const notFound=useRef()
    const notFoundWrite=useRef()
    const dispatch = useDispatch();
    const [paginattion,setPagination]=useState(null)
    const [activePage,setActivePage]=useState(1);

    /**
     * callActionOnce
     * - actionCreator: function (the thunk action creator)
     * - args: arguments to the action creator
     *
     * This wraps dispatch(actionCreator(...args)) with a module-level promise cache keyed
     * by actionCreator.name + JSON.stringify(args). While an identical call is in-flight,
     * callers will get the same promise (no duplicate network calls).
     *
     * It also logs a short stack snippet so you can see who's dispatching.
     */
    const callActionOnce = (actionCreator, ...args) => {
        // safely build key (fall back if args can't be stringified)
        let argsKey;
        try { argsKey = JSON.stringify(args); } catch (e) { argsKey = String(args); }
        const key = `${actionCreator.name}::${argsKey}`;

        if (actionPromiseCache.has(key)) {
            // reuse in-flight promise
            return actionPromiseCache.get(key);
        }

        // capture short caller stack for debugging
        const err = new Error();
        const stack = (err.stack || '').split('\n').slice(2,6).join('\n');
        console.log(`[callActionOnce] dispatching ${key} — caller stack:\n${stack}`);

        // create the promise and cache it
        const p = (async () => {
            try {
                // dispatch the thunk; assume thunk returns a promise (typical redux-thunk)
                const res = await dispatch(actionCreator(...args));
                return res;
            } finally {
                // remove cache entry when resolved/rejected so future calls can refetch
                actionPromiseCache.delete(key);
            }
        })();

        actionPromiseCache.set(key, p);
        return p;
    };

    // authReducer
    const getData = async () => {
        if (id == "pictures-and-sayings") {
            setActivePage(1);
            if (localStorage.getItem("sayingPhotoAttr")) {
                const cateID = JSON.parse(localStorage.getItem("sayingPhotoAttr"));
                await callActionOnce(getSayingsPhotoAttrAction, cateID, 8, 1);
            } else {
                await callActionOnce(getAllSayingsPhotoAction, 8, 1);
            }
        }

        if (id == "written-quotes-more") {
            setActivePage(1);
            if (localStorage.getItem("sayingAttr")) {
                const cateID = JSON.parse(localStorage.getItem("sayingAttr"));
                await callActionOnce(getSayingsWrittenAttrAction, cateID, 4, 1);
            } else {
                await callActionOnce(getAllSayingsWrittenAction, 4, 1);
            }
        }
    }

    useEffect(()=>{
        getData();
    },[localStorage.getItem("sayingAttr"),localStorage.getItem("sayingPhotoAttr")])

    useEffect(()=>{
        let allPages=document.querySelectorAll(".paginateGeneral .page-item")
        if(allPages[1]){
            allPages[1].classList.add("active");
        }
    },[localStorage.getItem("sayingPhotoAttr"),localStorage.getItem("sayingAttr")])

    let resX=useSelector(state=> state.SayingsReducer.sayingsWritenData);
    let resY=useSelector(state=> state.SayingsReducer.sayingsPhotoData);
    let resXFilter=useSelector(state=> state.SayingsReducer.sayingsWrittenAttr);
    let resYFilter=useSelector(state=> state.SayingsReducer.sayingsPhotoAttr);

    let sayingsWrittenData=[];
    let sayingsWrittenFilter=[];
    let sayingsWrittenAttrs=[];
    try {
        if(localStorage.getItem("sayingAttr")){
            if(resXFilter){
                if(resXFilter.data){
                    sayingsWrittenData.push(resXFilter.data);
                }
                if(resXFilter.addetionals){
                    sayingsWrittenFilter=[...resXFilter.addetionals.filterable_categories]
                    sayingsWrittenAttrs=[...resXFilter.addetionals.filterable_attrebutes]
                }
            }
        }else{
            if(resX){
                if(resX.data){
                    sayingsWrittenData.push(resX.data);
                }
                if(resX.addetionals){
                    sayingsWrittenFilter=[...resX.addetionals.filterable_categories]
                    sayingsWrittenAttrs=[...resX.addetionals.filterable_attrebutes]
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

    let sayingsPhotoData=[];
    let sayingsPhotoFilter=[];
    let sayingsPhotoAttrs=[];
    try {
        if(localStorage.getItem("sayingPhotoAttr")){
            if(resYFilter){
                if(resYFilter.data){
                    sayingsPhotoData.push(resYFilter.data);
                }
                if(resYFilter.addetionals){
                    sayingsPhotoFilter=[...resYFilter.addetionals.filterable_categories]
                    sayingsPhotoAttrs=[...resYFilter.addetionals.filterable_attrebutes]
                }
            }
        }else{
            if(resY){
                if(resY.data){
                    sayingsPhotoData.push(resY.data);
                }
                if(resY.addetionals){
                    sayingsPhotoFilter=[...resY.addetionals.filterable_categories]
                    sayingsPhotoAttrs=[...resY.addetionals.filterable_attrebutes]
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

    let pageCountSW=0;
    try {
        if(localStorage.getItem("sayingAttr")){
            if(resXFilter){
                if(resXFilter.pagination){
                    if(resXFilter.pagination.total==0){
                        notFoundWrite.current.style.display="block"
                    }else{
                        pageCountSW=Math.ceil(resXFilter.pagination.total / resXFilter.pagination.per_page)
                        notFoundWrite.current.style.display="none"
                    }
                }
            }
        }else{
            if(resX){
                if(resX.pagination){
                    if(resX.pagination.total==0){
                        notFoundWrite.current.style.display="block"
                    }else{
                        pageCountSW=Math.ceil(resX.pagination.total / resX.pagination.per_page)
                        notFoundWrite.current.style.display="none"
                    }
                }
            }
        }
    } catch (error) {}

    const handleChangePageSW= async(count)=>{
        setActivePage(count)
        if(localStorage.getItem("sayingAttr")){
            let cateID=JSON.parse(localStorage.getItem("sayingAttr"))
            await callActionOnce(getSayingsWrittenAttrAction, cateID, 4, count)
        }else{
            await callActionOnce(getAllSayingsWrittenAction, 4, count)
        }
        window.history.replaceState(null, null, ' ')
        window.scrollTo(0, 0);
    }

    let pageCountSP=0;
    try {
        if(localStorage.getItem("sayingPhotoAttr")){
            if(resYFilter){
                if(resYFilter.pagination){
                    if(resYFilter.pagination.total==0){
                        notFound.current.style.display="block"
                    }else{
                        pageCountSP=Math.ceil(resYFilter.pagination.total / resYFilter.pagination.per_page)
                        notFound.current.style.display="none"
                    }
                }
            }
        }else{
            if(resY){
                if(resY.pagination){
                    if(resY.pagination.total==0){
                        notFound.current.style.display="block"
                    }else{
                        pageCountSP=Math.ceil(resY.pagination.total / resY.pagination.per_page)
                        notFound.current.style.display="none"
                    }
                }
            }
        }
    } catch (error) {}

    const handleChangePageSP= async(count)=>{
        setActivePage(count)
        if(localStorage.getItem("sayingPhotoAttr")){
            let cateID=JSON.parse(localStorage.getItem("sayingPhotoAttr"))
            await callActionOnce(getSayingsPhotoAttrAction, cateID, 8, count)
        }else{
            await callActionOnce(getAllSayingsPhotoAction, 8, count)
        }
        window.history.replaceState(null, null, ' ')
        window.scrollTo(0, 0);
    }

    return [sayingsWrittenData,sayingsPhotoData,sayingsWrittenFilter,sayingsPhotoFilter,pageCountSP,pageCountSW,sayingsPhotoAttrs,sayingsWrittenAttrs,handleChangePageSW,handleChangePageSP,getData,notFound,notFoundWrite,activePage]
}
