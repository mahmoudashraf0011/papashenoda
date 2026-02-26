import { useGetData } from "../../hooks/useGetData";
import { GET_RANDOM_QUOTE } from "../type";



const getRandomQuoteAction =  ()=> async (dispatch)=>{
    try{
        const response=await useGetData(`/remdom_quotes`);
        dispatch({
            type:GET_RANDOM_QUOTE,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_RANDOM_QUOTE,
            payload:e.response
        })
    }


}
export {getRandomQuoteAction}