
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getOnePoemsAction } from '../../../../redux/actions/Media/Writings/PoemsActions';
export default function OnePoemHook(id) {
    const dispatch=useDispatch();
    const [loading,setLoading]=useState(true)

//authReducer
const getData=async()=>{
    setLoading(true)
    await dispatch(getOnePoemsAction(id))
    setLoading(false)


}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.PoemsReducer.onePoemData);

let onePoemData=[];
try {
    if(res){
        if(res.data){
            onePoemData.push(res.data)
            console.log(res);
        }
    }
} catch (e) {
    console.log(e);
}






return [onePoemData,loading]
}


