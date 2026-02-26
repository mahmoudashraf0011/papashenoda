import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../../redux/actions/AuthAction';

export default function LogoutHook() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);

//authReducer
const onSubmitLogout=async (e)=>{
    e.preventDefault();
    setLoading(true)
    await dispatch(logoutAction())
    setLoading(false)

}
const res=useSelector(state=> state.AuthReducer.logoutUser);

useEffect(()=>{
if(loading==false){
    if(res){
        console.log(res);
        if(res.status==200){
                localStorage.removeItem("token_popeShounda")
                localStorage.removeItem("user_popeShounda")
                localStorage.removeItem("pass_popeShounda")

            setTimeout(() => {
                window.location.replace('/login');
            }, 1000);
        }
    setLoading("true")
}
}
},[loading])

  return [onSubmitLogout]
}
