import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getHomeDataAction } from '../../redux/actions/Home/HomeActions';
import { getGalleryImageAction } from '../../redux/actions/Gallery/GalleryActions';
export default function GalleryHook(slug) {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);

//authReducer
const getData=async()=>{
    setLoading(true)
    console.log("sluggggg",slug);
    await dispatch(getGalleryImageAction(slug,1))
    setLoading(false)

}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.GalleryReducer.galleryDate);

let galleryData=[];
try {
    if(res){
        if(res.data.images){
            galleryData=res.data.images;
        }
    }
} catch (e) {
    console.log(e);
}




return [galleryData]
}


