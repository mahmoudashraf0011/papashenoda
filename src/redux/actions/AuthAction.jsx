import { useGetData, useGetDataWithToken } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
import { CREATE_USER, FORGET_PASSWORD, GET_USER_DATA, LOGIN_USER, LOGIN_WITH_GOOGLE, LOGOUT_USER, REST_PASSWORD } from "../type";

const createUserAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/register?lang=ar`,data);
        dispatch({
            type:CREATE_USER,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:CREATE_USER,
            payload:e.response
        })
    }


}

const loginUserAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/auth/login?lang=ar`,data);
        dispatch({
            type:LOGIN_USER,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:LOGIN_USER,
            payload:e.response
        })
    }


}

const loginUserWithGoogleAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/auth/google`,data);
        dispatch({
            type:LOGIN_WITH_GOOGLE,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:LOGIN_WITH_GOOGLE,
            payload:e.response
        })
    }


}
const logoutAction =  ()=> async (dispatch)=>{
    try{
        const response=await usePostData(`/auth/logout`);
        dispatch({
            type:LOGOUT_USER,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:LOGOUT_USER,
            payload:e.response
        })
    }


}
const forgetPassAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/password/forgot`,data);
        dispatch({
            type:FORGET_PASSWORD,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:FORGET_PASSWORD,
            payload:e.response
        })
    }


}

const restPassAction =  (data)=> async (dispatch)=>{
    try{
        const response=await usePostData(`/password/reset`,data);
        dispatch({
            type:REST_PASSWORD,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:REST_PASSWORD,
            payload:e.response
        })
    }


}
const getUserDataAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetDataWithToken(`/auth/user`);
        dispatch({
            type:GET_USER_DATA,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_USER_DATA,
            payload:e.response
        })
    }


}
export {createUserAction,loginUserAction,logoutAction,forgetPassAction,restPassAction,getUserDataAction,loginUserWithGoogleAction}