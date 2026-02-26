
import { Value } from "sass";
import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_DOCS, GET_ATTR_DOCS, GET_DOCS_ATTR_Details, GET_DOCS_Details, GET_FILTER_DOCS } from "../../../type";

const getAllDocsAction =  (page,limit)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=documents&lang=ar&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_ALL_DOCS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_DOCS,
            payload:e.response
        })
    }


}
const getDocsFilterAction =  (id,txt,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=documents&filter_ids[]=${id}&values[]=${txt}&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_FILTER_DOCS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_DOCS,
            payload:e.response
        })
    }


}

const getDocsAttrAction =  (qus,page,limit)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=documents&${qus}&per_page=${limit}&page=${page}`);
        dispatch({
            type:GET_ATTR_DOCS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ATTR_DOCS,
            payload:e.response
        })
    }


}

const getDocsDetalisAction =  (id,limit,page,data)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/document/by/category?slug=${id}&lang=ar&per_page=${limit}&page=${page}&${data}`);
        dispatch({
            type:GET_DOCS_Details,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_DOCS_Details,
            payload:e.response
        })
    }


}
const getDocsDetalisAttrAction =  (id,limit,page,qus)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/document/by/category?slug=${id}&lang=ar&per_page=${limit}&page=${page}&${qus}`);
        dispatch({
            type:GET_DOCS_ATTR_Details,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_DOCS_ATTR_Details,
            payload:e.response
        })
    }


}
export {getAllDocsAction,getDocsDetalisAction,getDocsFilterAction,getDocsAttrAction,getDocsDetalisAttrAction}