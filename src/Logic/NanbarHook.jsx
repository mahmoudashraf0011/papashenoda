

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import SearchHook from './Search/SearchHook';
export default function NanbarHook() {
    const [allData,check,ele,count,getData]=SearchHook();
    const [value,setValue]=useState(localStorage.getItem("search")?localStorage.getItem("search"):"");
    const [loading,setLoading]=useState();
    const dispatch=useDispatch();
    const navigate=useNavigate();
// methods 
const onChangeSearch=(e)=>{

    setValue(e.target.value);
    localStorage.setItem("search",e.target.value)
}

useEffect(()=>{
    setValue(localStorage.getItem("search"))
},[localStorage.getItem("search")])
//authReducer
const onHandleSearch=async (event)=>{

    if (event.key === "Enter") {
        if(value=="" && localStorage.getItem("search")){
            localStorage.setItem("search","")
            
        }
        getData();
        navigate("/search")
    }
}

const onClickSearch=async ()=>{
    if(value=="" && localStorage.getItem("search")){
        localStorage.removeItem("search")
    }
    navigate("/search")
    getData()
    }



return [value,onChangeSearch,onHandleSearch,onClickSearch]
}


