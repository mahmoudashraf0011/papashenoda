import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getHomeDataAction } from '../../redux/actions/Home/HomeActions';

// ✅ Singleton guards at module scope (survive re-renders/remounts)
let _homeFetchDone = false;
let _homeFetchInFlight = null;

export default function HomeHook() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);

    // also keep a component-level guard (covers StrictMode double-invoke)
    const didFetch = useRef(false);

    const getData = async () => {
        // if already finished once, don't call again
        if (_homeFetchDone) { setLoading(false); return; }

        // if another instance already started the same fetch, await it
        if (_homeFetchInFlight) {
            try { await _homeFetchInFlight; } finally { setLoading(false); }
            return;
        }

        setLoading(true);
        // mark in-flight once, share the same promise across mounts
        _homeFetchInFlight = dispatch(getHomeDataAction());
        try {
            await _homeFetchInFlight;
            _homeFetchDone = true;
        } catch (e) {
            // do not flip _homeFetchDone on error; allow retry next mount/manual
            console.log(e);
        } finally {
            _homeFetchInFlight = null;
            setLoading(false);
        }
    };

    useEffect(()=>{
        if (didFetch.current) return;
        didFetch.current = true;
        getData();
    },[]);

    const res=useSelector(state=> state.HomeReducer.homeData);

    let mediaData=[];
    let total;
    try {
        if(res.data){
            if(res.data){
                mediaData.push(res.data.media);
                total=res.data.count_of_written;
            }
        }
    } catch (e) {
        console.log(e);
    }

    let meditationsData =[];
    try {
        if(res.data){
            if(res.data.video){
                meditationsData.push(res.data.video)
            }
        }
    } catch (e) {
        console.log(e);
    }

    let sayingsData =[];
    try {
        if(res.data){
            if(res.data.quotes){
                sayingsData.push(res.data.quotes)
            }
        }
    } catch (e) {
        console.log(e);
    }

    let eventsData =[];
    try {
        if(res.data){
            if(res.data.on_this_day){
                eventsData.push(res.data.on_this_day)
            }
        }
    } catch (e) {
        console.log(e);
    }
    return [mediaData,meditationsData,sayingsData,eventsData,total,loading]
}
