
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDataAction } from '../../redux/actions/AuthAction';
export default function UsetDataHook() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);

//authReducer
const getData=async()=>{
    setLoading(true)
    // await dispatch(getUserDataAction())
    setLoading(false)

}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.AuthReducer.getUserData);


let userData=[];
try {
    if(res.data){
            userData.push(res.data)
        
    }
} catch (e) {
    console.log(e);
}

return [userData]
}


