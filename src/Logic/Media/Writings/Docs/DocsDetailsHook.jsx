
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDocsDetalisAction } from '../../../../redux/actions/Media/Writings/DocsActions';
export default function DocsDetailsHook(id) {
    const dispatch=useDispatch();
    const [activePage,setActivePage]=useState(1);
    const raw = JSON.parse(localStorage.getItem("docsAttr")) || "";

   let  result = raw.replace(/category_id=[^&]+&&/, '');
//authReducer
const getData=async()=>{
    await dispatch(getDocsDetalisAction(id,8,1,result))
}
useEffect(()=>{
    getData();
},[])
const res=useSelector(state=> state.DocsReducer.docsDetails);

let docsDetailsData=[];
let title="";
try {
    if(res){
        if(res.data){
                docsDetailsData.push(res.data.media)
                title=res.data.category_name
            
        }

    }
} catch (e) {
    console.log(e);
}


let pageCount=0;

try {
    if(res){
        if(res.pagination){
            pageCount=Math.ceil(res.pagination.total/res.pagination.per_page)
         
        }
    }
} catch (error) {}


const handleChangePage= async(count)=>{
await dispatch(getDocsDetalisAction(id,8,count,result));
setActivePage(count)
window.history.replaceState(null, null, ' ')
window.scrollTo(0, 0); 
}



return [docsDetailsData,title,pageCount,handleChangePage,activePage]
}

