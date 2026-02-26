
import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_POEMS, GET_Attr_POEMS, GET_FILTER_POEMS, GET_ONE_POEM } from "../../../type";

const getAllPoemsAction =  (limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=poems&per_page=${limit}&page=${page}&lang=ar`);
        dispatch({
            type:GET_ALL_POEMS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_POEMS,
            payload:e.response
        })
    }


}
const getOnePoemsAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/poem?slug=${id}&lang=ar`);
        dispatch({
            type:GET_ONE_POEM,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ONE_POEM,
            payload:e.response
        })
    }


}
const getPoemsFilterAction =  (limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=poems&per_page=${limit}&page=${page}&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_POEMS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_POEMS,
            payload:e.response
        })
    }


}
const getPoemsAttrAction =  (limit,page,qus)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=poems&per_page=${limit}&page=${page}&lang=ar&${qus}`);
        dispatch({
            type:GET_Attr_POEMS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_Attr_POEMS,
            payload:e.response
        })
    }


}
export {getAllPoemsAction,getOnePoemsAction,getPoemsFilterAction,getPoemsAttrAction}