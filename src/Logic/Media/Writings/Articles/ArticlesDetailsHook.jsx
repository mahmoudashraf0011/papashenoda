
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getOneArticleAction } from '../../../../redux/actions/Media/Writings/ArticlesActions';
import { useParams } from 'react-router-dom';
export default function ArticlesDetailsHook(id) {
    const dispatch=useDispatch();
    const ele=useParams()
    let check=false
//authReducer
const getData=async()=>{
    await dispatch(getOneArticleAction(id))

}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.ArticlesReducer.oneArticleData);

let oneArticleData=[];
try {
    if(res){
        if(res.data){
            oneArticleData.push(res.data)
            console.log(res.data);
            if(res.data.length==0){
                console.log("yes");
                setTimeout(() => {
                check=false
                if(ele.current){
                    ele.current.style.display="block"   
                }
                }, 1000);
      
                check=true
               }else{
                check=true
                console.log("no");

                if(ele.current){

                    ele.current.style.display="none"   
                }

               }     
        }
    }
} catch (e) {
    console.log(e);
}


return [oneArticleData,check,ele,getData]
}


