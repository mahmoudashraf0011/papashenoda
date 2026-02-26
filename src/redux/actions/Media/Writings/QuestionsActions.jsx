import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_QUESTIONS, GET_Attr_QUESTIONS, GET_FILTER_QUESTIONS } from "../../../type";

const getAllQuestionsAction =  (limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/14?per_page=${limit}&lang=ar&page=${page}`);
        dispatch({
            type:GET_ALL_QUESTIONS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_QUESTIONS,
            payload:e.response
        })
    }


}
const getQuestionsFilterAction =  (limit,page,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/14?per_page=${limit}&page=${page}&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_QUESTIONS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_QUESTIONS,
            payload:e.response
        })
    }


}
const getQuestionsAttrAction =  (limit,page,qus)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/14?per_page=${limit}&page=${page}&lang=ar&${qus}`);
        dispatch({
            type:GET_Attr_QUESTIONS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_Attr_QUESTIONS,
            payload:e.response
        })
    }


}
export {getAllQuestionsAction,getQuestionsFilterAction,getQuestionsAttrAction}