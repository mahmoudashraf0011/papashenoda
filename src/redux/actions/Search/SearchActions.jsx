
import { useGetData } from "../../../hooks/useGetData";
import { GET_FULL_MORE_SEARCH_RESULT, GET_FULL_SEARCH_Filter_DATA, GET_FULL_SEARCH_RESULT, GET_SEARCH_Filter_DATA, GET_SEARCH_MORE, GET_SEARCH_RESULT } from "../../type";
const getSearchResultAction =  (word)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?search=${word}&lang=ar`);
        dispatch({
            type:GET_SEARCH_RESULT,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_SEARCH_RESULT,
            payload:e.response
        })
    }


}

const getSearchResultMoreAction =  (word,limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?search=${word}&lang=ar&per_page=${limit}&page=${page}&media_type_slug=${id}`);
        dispatch({
            type:GET_SEARCH_MORE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_SEARCH_MORE,
            payload:e.response
        })
    }


}

const getSearchMoreFilterAction =  (word,mediaID,cateID,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?search=${word}&lang=ar&media_type_slug=${mediaID}&category_id=${cateID}&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_SEARCH_Filter_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_SEARCH_Filter_DATA,
            payload:e.response
        })
    }


}

const getFullSearchResultAction =  (qs)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?${qs}`);
        dispatch({
            type:GET_FULL_SEARCH_RESULT,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FULL_SEARCH_RESULT,
            payload:e.response
        })
    }


}

const getFullSearchMoreResultAction =  (qs)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?${qs}`);
        dispatch({
            type:GET_FULL_MORE_SEARCH_RESULT,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FULL_MORE_SEARCH_RESULT,
            payload:e.response
        })
    }


}

const getFullSearchMoreResultFilterAction =  (qs)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/public-search?${qs}`);
        dispatch({
            type:GET_FULL_SEARCH_Filter_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FULL_SEARCH_Filter_DATA,
            payload:e.response
        })
    }


}


export {getSearchResultAction,getSearchResultMoreAction,getSearchMoreFilterAction,getFullSearchResultAction,getFullSearchMoreResultAction,getFullSearchMoreResultFilterAction}