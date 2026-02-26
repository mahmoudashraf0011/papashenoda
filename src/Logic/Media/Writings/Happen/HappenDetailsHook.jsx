
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllHappensForOneAction, getOneHappenAction } from '../../../../redux/actions/Media/Writings/HappenActions';
export default function HappenDetailsHook(id) {
    const dispatch=useDispatch();

//authReducer
const getData=async()=>{
    await dispatch(getOneHappenAction(id))
}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.HappenReducer.happenDetails);

let oneHappenData=[];
let oneHappenRelatedData=[];
try {
    if(res){
        if(res.data){
            if(res.data.event){
                oneHappenData.push(res.data.event)
            }
            if(res.data.related_events){
                oneHappenRelatedData.push(res.data.related_events)
            }
        }

    }
} catch (e) {
    console.log(e);
}





return [oneHappenData,oneHappenRelatedData,getData]
}

