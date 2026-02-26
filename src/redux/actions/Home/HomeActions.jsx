import { useGetData } from "../../../hooks/useGetData";
import { GET_HOME_DATA } from "../../type";

const getHomeDataAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetData(`/get_home`);
        dispatch({
            type:GET_HOME_DATA,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_HOME_DATA,
            payload:e.response
        })
    }


}

export {getHomeDataAction}