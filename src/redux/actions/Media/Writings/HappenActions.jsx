
import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_HAPPENS, GET_ALL_HAPPENS_FOR_ONE, GET_FILTER_HAPPEN, GET_ONE_HAPPEN } from "../../../type";

const getAllHappensAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/15?per_page=4&lang=ar&page=1`);
        dispatch({
            type:GET_ALL_HAPPENS,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_HAPPENS,
            payload:e.response
        })
    }


}

const getAllHappensForOneAction =  (limit=2,page=1)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/getmedia/15?per_page=${limit}&lang=ar&page=${page}`);
        dispatch({
            type:GET_ALL_HAPPENS_FOR_ONE,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_HAPPENS_FOR_ONE,
            payload:e.response
        })
    }


}

const getOneHappenAction =  (id)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/get/day/happend?slug=${id}&lang=ar`);
        dispatch({
            type:GET_ONE_HAPPEN,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_ONE_HAPPEN,
            payload:e.response
        })
    }


}
const getFilterHappensAction =  (query,limit,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/filter_day_happend?${query}&per_page=${limit}&lang=ar&page=${page}`);
        dispatch({
            type:GET_FILTER_HAPPEN,
            payload:response,
        })
    }
    catch(e){
        dispatch({
            type:GET_FILTER_HAPPEN,
            payload:e.response
        })
    }


}
export {getAllHappensAction,getAllHappensForOneAction,getOneHappenAction,getFilterHappensAction}