import { useGetData, useGetDataWithToken } from "../../../../hooks/useGetData";
import { GET_FILTER_BOOKS, GET_FILTER_VIDEOS } from "../../../type";

const getFilterVideosAction =  (limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetDataWithToken(`/getmedia/3?per_page=${limit}&page=${page}&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_VIDEOS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_VIDEOS,
            payload:e.response
        })
    }


}
