
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataByCategoryMoreAction } from '../../redux/actions/Categories/CategoryActions';
export default function DataByCategoryMoreHook(id,mediaID) {
    const dispatch=useDispatch();

//authReducer
const getData=async()=>{
    console.log("id:",id);
    console.log("id:",mediaID);
    if(mediaID == "pictures-and-sayings" || mediaID =="documents"){
        await dispatch(getDataByCategoryMoreAction(id,mediaID,8,1))

    }else{
        await dispatch(getDataByCategoryMoreAction(id,mediaID,6,1))

    }

}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.CategoryReducer.categoryDataMore);


let categoryMoreData=[];
let title=[];
let path=[];
try {
    if(res){
        if(res.data){
            console.log("categoryMoreData",categoryMoreData);
            categoryMoreData=res.data.media
            path=res.data.path
            title = res.data?.category_title?.name ?? "";
            console.log("path",path,title);
            console.log("res",res);
        }
    }
} catch (e) {
    console.log(e);
}

let pageCount=0;
let activePage=1;

try {
    if(res){
        if(res.pagination){
            pageCount=Math.ceil(res.pagination.total/res.pagination.per_page)
            activePage=res.pagination.current_page
        }
    }
} catch (error) {}


const handleChangePage= async(count)=>{
    if(mediaID == "pictures-and-sayings" || mediaID =="documents"){
        await dispatch(getDataByCategoryMoreAction(id,mediaID,8,count))

    }else{
        await dispatch(getDataByCategoryMoreAction(id,mediaID,6,count))

    }
    window.history.replaceState(null, null, ' ')
    window.scrollTo(0, 0); 
}

return [categoryMoreData,pageCount,handleChangePage,title,path,activePage]
}


