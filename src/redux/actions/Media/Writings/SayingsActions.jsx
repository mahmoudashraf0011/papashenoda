

import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_SAYINGS_PHOTO, GET_ALL_SAYINGS_WRITTEN, GET_ATTR_SAYINGS_PHOTO, GET_ATTR_SAYINGS_WRITTEN, GET_FILTER_SAYINGS_PHOTO, GET_FILTER_SAYINGS_WRITTEN } from "../../../type";

const getAllSayingsWrittenAction =  (limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/8?per_page=${limit}&page=${page}&lang=ar`);
        dispatch({
            type:GET_ALL_SAYINGS_WRITTEN,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_SAYINGS_WRITTEN,
            payload:e.response
        })
    }


}
const getSayingsWrittenFilterAction =  (limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/8?per_page=${limit}&page=${page}&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_SAYINGS_WRITTEN,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_SAYINGS_WRITTEN,
            payload:e.response
        })
    }


}
const getSayingsWrittenAttrAction =  (query,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/8?${query}&per_page=${limit}&page=${page}&lang=ar`);
        dispatch({
            type:GET_ATTR_SAYINGS_WRITTEN,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ATTR_SAYINGS_WRITTEN,
            payload:e.response
        })
    }
}
const getAllSayingsPhotoAction =  (limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/10?per_page=${limit}&page=${page}&lang=ar`);
        dispatch({
            type:GET_ALL_SAYINGS_PHOTO,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_SAYINGS_PHOTO,
            payload:e.response
        })
    }


}
const getSayingsPhotoFilterAction =  (limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/10?per_page=${limit}&page=${page}&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_SAYINGS_PHOTO,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_SAYINGS_PHOTO,
            payload:e.response
        })
    }
}
const getSayingsPhotoAttrAction =  (query,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/10?${query}&per_page=${limit}&page=${page}&lang=ar`);
        dispatch({
            type:GET_ATTR_SAYINGS_PHOTO,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ATTR_SAYINGS_PHOTO,
            payload:e.response
        })
    }
}
export {getAllSayingsWrittenAction,getAllSayingsPhotoAction,getSayingsWrittenFilterAction,getSayingsPhotoFilterAction,getSayingsPhotoAttrAction,getSayingsWrittenAttrAction}



