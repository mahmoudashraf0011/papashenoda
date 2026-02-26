
import useDeleteData from "../../../hooks/useDeleteData";
import { useGetDataWithToken } from "../../../hooks/useGetData";
import { usePostData } from "../../../hooks/usePostData";
import { ADD_BOOKMARK_DATA, DELETE_BOOKMARK_DATA, GET_BOOKMARK_DATA, GET_ONE_BOOKMARK_DATA } from "../../type";



const getBookMarkDataAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetDataWithToken(`/bookmark_mediatype`);
        dispatch({
            type:GET_BOOKMARK_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_BOOKMARK_DATA,
            payload:e.response
        })
    }


}
const getOneBookMarkDataAction =  (id,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetDataWithToken(`/bookmarks?media_type=${id}&lang=ar&per_page=${limit}&page=${page}&paginate=true`);
        dispatch({
            type:GET_ONE_BOOKMARK_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ONE_BOOKMARK_DATA,
            payload:e.response
        })
    }


}
const addBookmarkAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/bookmarks`,data);
        dispatch({
            type:ADD_BOOKMARK_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:ADD_BOOKMARK_DATA,
            payload:e.response
        })
    }


}

const deleteBookMarkAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useDeleteData(`/bookmarks?media_id=${id}`);
        dispatch({
            type:DELETE_BOOKMARK_DATA,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:DELETE_BOOKMARK_DATA,
            payload:e.response
        })
    }


}
export {getBookMarkDataAction,addBookmarkAction,deleteBookMarkAction,getOneBookMarkDataAction}