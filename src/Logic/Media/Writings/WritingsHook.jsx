import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllWritingsAction } from '../../../redux/actions/Media/Writings/WritingsActions';
export default function WritingsHook() {
    const dispatch=useDispatch();

//authReducer
const getData=async()=>{
    await dispatch(getAllWritingsAction())

}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.WritingsReducer.writingsData);

let writingsData=[];
try {
    if(res){
        if(res.data.media){
            writingsData.push(res.data.media)
        }
    }
} catch (e) {
    console.log(e);
}


return [writingsData]
}


