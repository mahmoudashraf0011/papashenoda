
import { useGetData } from "../../../../hooks/useGetData";
import { GET_ALL_WRITINGS } from "../../../type";

const getAllWritingsAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetData(`/get_all_written?lang=ar`);
        dispatch({
            type:GET_ALL_WRITINGS,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_WRITINGS,
            payload:e.response
        })
    }


}

export {getAllWritingsAction}



