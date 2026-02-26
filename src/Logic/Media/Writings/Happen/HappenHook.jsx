
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllHappensForOneAction, getFilterHappensAction } from '../../../../redux/actions/Media/Writings/HappenActions';
// export default function HappenHook() {
//     const dispatch=useDispatch();
//     const [loading,setloading]=useState(true);
// //authReducer
// const getData=async()=>{
//     if(localStorage.getItem("happenDay")||localStorage.getItem("happenMonth")||localStorage.getItem("happenYear")){
//         let day=localStorage.getItem("happenDay")?JSON.parse(localStorage.getItem("happenDay")).value:null
//         let month=localStorage.getItem("happenMonth")?JSON.parse(localStorage.getItem("happenMonth")).value:null
//         let year=localStorage.getItem("happenYear")?JSON.parse(localStorage.getItem("happenYear")).value:null
//         let data=`${day?'day='+day:'day='}&${month?'month='+month:'month='}&${year?'year=':'year='}`
//         setloading(true)
//         await dispatch(getFilterHappensAction(data,4,1))
//         setloading(false)


//     }else{
//         const today = new Date();

//         const day = today.getDate(); // 1-31
//         const month = today.getMonth() + 1; // 0-11 → +1 to get 1-12
//         const year = today.getFullYear(); // e.g., 2025

//         const data2 = `day=${day}&month=${month}&year=`;
//         console.log("data2",data2);
//         setloading(true)
//         await dispatch(getFilterHappensAction(data2,4,1))
//         setloading(false)

//     }
// }
// useEffect(()=>{
//     getData();
// },[])
// const res=useSelector(state=> state.HappenReducer.happensForOneData);
// const resFilter=useSelector(state=> state.HappenReducer.filterHappen);

// let happenData=[];
// try {
//     if(localStorage.getItem("happenDay")||localStorage.getItem("happenMonth")||localStorage.getItem("happenYear")){
//         if(resFilter){
//             if(resFilter.data){
//                 happenData.push(resFilter.data.media)

            
                
//             }
//         }
//     }else{
//         if(resFilter){
//             if(resFilter.data){
//                 happenData.push(resFilter.data.media)

//             }
//         } 
//     }

// } catch (e) {
//     console.log(e);
// }

// let pageCount=0;

// try {
//     if(localStorage.getItem("happenDay")||localStorage.getItem("happenMonth")||localStorage.getItem("happenYear")){
//         if(resFilter){
//             if(resFilter.pagination){
//                 pageCount=resFilter.pagination.totalPages
//             }
//         }
//     }else{
//         if(resFilter){

//             if(resFilter.pagination){
//                 pageCount=resFilter.pagination.totalPages
//             }
//         }
//     }
 
// } catch (error) {}


// const handleChangePage= async(count)=>{
//     if(localStorage.getItem("happenDay")||localStorage.getItem("happenMonth")||localStorage.getItem("happenYear")){
//         let day=localStorage.getItem("happenDay")?JSON.parse(localStorage.getItem("happenDay")).value:""
//         let month=localStorage.getItem("happenMonth")?JSON.parse(localStorage.getItem("happenMonth")).value:""
//         let year=localStorage.getItem("happenYear")?JSON.parse(localStorage.getItem("happenYear")).value:""
//         await dispatch(getFilterHappensAction(`${day?'day='+day:'day='}&${month?'month='+month:'month='}&${year?'year=':'year='}`,4,count))

//     }else{
//         const today = new Date();

//         const day = today.getDate(); // 1-31
//         const month = today.getMonth() + 1; // 0-11 → +1 to get 1-12
//         const year = today.getFullYear(); // e.g., 2025
//         const data2 = `day=${day}&month=${month}&year=`;

//         await dispatch(getFilterHappensAction(data2,4,count))

//     }
//     window.history.replaceState(null, null, ' ')
//     window.scrollTo(0, 0); 
// }
// return [happenData,pageCount,handleChangePage,getData,loading]
// }

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterHappensAction } from '../../../../redux/actions/Media/Writings/HappenActions';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to fetch "happenings" based on day and month filters.
 * - If day/month are stored in localStorage, use those values.
 * - Otherwise, default to today (new Date()).
 * - Optionally clears filters on unmount.
 *
 * Returns an array so you can destructure:
 * [
 *   [[...mediaItems]], // nested array for backward compatibility
 *   pageCount,
 *   handleChangePage,
 *   refetch,
 *   loading
 * ]
 */
export default function useHappen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const buildQueryString = () => {
    const storedDay = localStorage.getItem('happenDay');
    const storedMonth = localStorage.getItem('happenMonth');

    if (storedDay && storedMonth) {
      const day = JSON.parse(storedDay).value;
      const month = JSON.parse(storedMonth).value;
      return `day=${day}&month=${month}`;
    }

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    return `day=${day}&month=${month}`;
  };

  const getData = async (page = 1) => {
    const query = buildQueryString();
    setLoading(true);
    await dispatch(getFilterHappensAction(query, 4, page));
    setLoading(false);
  };
  const location = useLocation();

  useEffect(() => {
    getData(1);
    return () => {
      const pattern = /^\/happen\/[a-z0-9-]+$/i;

      if( location.pathname!= '/happen' || pattern.test(location.pathname)){
        localStorage.removeItem('happenDay');
        localStorage.removeItem('happenMonth');
      }
 
    };
  }, []);

  const resFilter = useSelector(state => state.HappenReducer.filterHappen);

  // get the media array
  const media =
    resFilter && resFilter.data && Array.isArray(resFilter.data.media)
      ? resFilter.data.media
      : [];

  // wrap in a nested array to match previous structure: [ [mediaItems] ]
  const happenData = [media];

  const pageCount =
    resFilter && resFilter.pagination
      ? resFilter.pagination.totalPages
      : 0;

  const handleChangePage = async newPage => {
    await getData(newPage);
    window.history.replaceState(null, null, ' ');
    window.scrollTo(0, 0);
  };


  return [happenData, pageCount, handleChangePage, getData, loading];
}
