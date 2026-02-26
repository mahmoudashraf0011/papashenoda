import { useGetData } from "../../../hooks/useGetData";
import { GET_CATEGORY_Filter_DATA, GET_DATA_BY_CATEGORY, GET_DATA_BY_CATEGORY_MORE } from "../../type";

const getDataByCategoryAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/get/by/category/slug?slug=${id}`);
        dispatch({
            type:GET_DATA_BY_CATEGORY,
            payload:response,
        })
    
    }
    
    catch(e){
        dispatch({
            type:GET_DATA_BY_CATEGORY,
            payload:e.response
        })
    }
}
const getDataByCategoryMoreAction =  (id,mediaID,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/get/by/category/slug?slug=${id}&lang=ar&media_type_slug=${mediaID}&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_DATA_BY_CATEGORY_MORE,
            payload:response,
        })
    }
    
    catch(e){
        dispatch({
            type:GET_DATA_BY_CATEGORY_MORE,
            payload:e.response
        })
    }
}
const getDataByCategoryFilterAction =  (id,mediaID,cateID,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/get-by-category/${id}?lang=ar&media_type_id=${mediaID}category_id=${cateID}&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_CATEGORY_Filter_DATA,
            payload:response,
        })
    }
    
    catch(e){
        dispatch({
            type:GET_CATEGORY_Filter_DATA,
            payload:e.response
        })
    }
}
export {getDataByCategoryAction,getDataByCategoryMoreAction,getDataByCategoryFilterAction}