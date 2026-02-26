import useDeleteData from "../../../hooks/useDeleteData";
import { useGetDataWithToken } from "../../../hooks/useGetData";
import { usePatchData, usePatchDataWithDifferentFormat } from "../../../hooks/usePatchData";
import { usePostData, usePostDataWithDifferentFormat } from "../../../hooks/usePostData";
import { DELETE_USER_IMG, GET_USER_INFO, UPDATE_USER_IMG, UPDATE_USER_INFO } from "../../type";


const getUserInfoAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetDataWithToken(`/auth/user`);
        dispatch({
            type:GET_USER_INFO,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_USER_INFO,
            payload:e.response
        })
    }


}

const updateUserInfoAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/auth/user/info/update`,data);
        dispatch({
            type:UPDATE_USER_INFO,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:UPDATE_USER_INFO,
            payload:e.response
        })
    }


}
const updateImageUserAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostDataWithDifferentFormat(`/auth/user/image/update`,data);
        dispatch({
            type:UPDATE_USER_IMG,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:UPDATE_USER_IMG,
            payload:e.response
        })
    }


}

const deleteImageUserAction =  ()=> async (dispatch)=>{
    try{
        const response=await useDeleteData(`/auth/user/image/delete`);
        dispatch({
            type:DELETE_USER_IMG,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:DELETE_USER_IMG,
            payload:e.response
        })
    }


}
export {getUserInfoAction,updateUserInfoAction,updateImageUserAction,deleteImageUserAction}