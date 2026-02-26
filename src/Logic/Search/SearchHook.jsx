
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSearchMoreFilterAction, getSearchResultAction } from '../../redux/actions/Search/SearchActions';
import { useNavigate } from 'react-router-dom';
export default function SearchHook() {
    const [loading,setLoading]=useState(true);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const ele=useRef();
    let word=""
    if(localStorage.getItem("search")){
        word=localStorage.getItem("search")
    }


//authReducer
const getData=async ()=>{

    // if(localStorage.getItem("filterSearchCate")){
    //     let cateID=JSON.parse(localStorage.getItem("filterSearchCate"))
    //     setLoading(true)
    //     await dispatch(getSearchMoreFilterAction(word,cateID.code,6,1))
    //     setLoading(false)
    // }else{
    //     setLoading(true)
    //     await dispatch(getSearchResultAction(word))
    //     setLoading(false)
    // }
}


useEffect(()=>{
getData();
},[])
const res=useSelector(state=> state.SearchReducer.searchResult);
const resFilter=useSelector(state=> state.SearchReducer.searchResultMoreFilter);

let allData=[];
let check=false;
let count;

try {
    if(localStorage.getItem("filterSearchCate")){
        if(resFilter){
            if(resFilter.status=="success"){
                if(resFilter.data){     
                       allData=[...(resFilter.data)]                 
                }
                if(resFilter.addetionals){
                    count=resFilter.addetionals.general_count;
                }
              
    
            }
        }
    }else{
        if(res && loading==false){
            if(res.status=="success"){
                if(res.data){  
                    if(res.data.length==0 ){
                        setTimeout(() => {
                        check=false
                        if(ele.current){
                            ele.current.style.display="block"   
                        }
                        }, 300);
                        check=true
                       }else{
                        check=true
                        if(ele.current){
                            ele.current.style.display="none"   
                        }

                       }     
                       allData=[...(res.data)]   
          
                }
                if(res.addetionals){
                    count=res.addetionals.general_count;
                }
         
              
    
            }
            if(res.status==500 || res.status==400){
                setTimeout(() => {
                    check=false
                    if(ele.current){
                        ele.current.style.display="block"   
                    }
                    }, 300);
                    check=true
            }
        }
    }


} catch (error) {
    console.log(error);
}

     
        




return [allData,check,ele,count,getData]
}


