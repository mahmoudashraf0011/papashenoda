
import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_ARTICLES, GET_ALL_ARTICLES_FOR_ONE, GET_ATTR_ARTICLES, GET_ATTR_ARTICLES_FOR_ONE, GET_FILTER_ARTICLES, GET_FILTER_ARTICLES_FOR_ONE, GET_ONE_ARTICLE } from "../../../type";

const getAllArticlesAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=article&lang=ar`);
        dispatch({
            type:GET_ALL_ARTICLES,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_ARTICLES,
            payload:e.response
        })
    }


}
const getArticlesFilterAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=article&lang=ar&category_id=${id}`);
        dispatch({
            type:GET_FILTER_ARTICLES,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_ARTICLES,
            payload:e.response
        })
    }


}
const getArticlesAttrAction =  (qs)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/getmedia?slug=article&${qs}`);
        dispatch({
            type:GET_ATTR_ARTICLES,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ATTR_ARTICLES,
            payload:e.response
        })
    }


}
const getAllArticlesForOneAction =  (title,limit=2,page=1,query)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/articles?newspaper=${title}&per_page=${limit}&page=${page}&${query}`);
        dispatch({
            type:GET_ALL_ARTICLES_FOR_ONE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_ARTICLES_FOR_ONE,
            payload:e.response
        })
    }


}
const getArticlesFilterForOneAction =  (title,limit=2,page=1,id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/articles?newspaper=${title}&per_page=${limit}&page=${page}&category_id=${id}`);
        dispatch({
            type:GET_FILTER_ARTICLES_FOR_ONE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_ARTICLES_FOR_ONE,
            payload:e.response
        })
    }


}
const getArticlesAttrForOneAction =  (title,limit,page,qus)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/articles?newspaper=${title}&per_page=${limit}&page=${page}&${qus}`);
        dispatch({
            type:GET_ATTR_ARTICLES_FOR_ONE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ATTR_ARTICLES_FOR_ONE,
            payload:e.response
        })
    }


}
const getOneArticleAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/article?slug=${id}&lang=ar`);
        dispatch({
            type:GET_ONE_ARTICLE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ONE_ARTICLE,
            payload:e.response
        })
    }


}
export {getAllArticlesAction,getAllArticlesForOneAction,getOneArticleAction,getArticlesFilterAction,getArticlesFilterForOneAction,getArticlesAttrAction,getArticlesAttrForOneAction}