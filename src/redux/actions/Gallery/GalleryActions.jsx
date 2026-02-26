import { useGetData } from "../../../hooks/useGetData";
import { GET_GALLERY_IMAGE, GET_HOME_DATA } from "../../type";

const getGalleryImageAction =  (id,page)=> async (dispatch)=>{
    try{
        const response=await useGetData(`/v2/get/images?slug=${id}&page=${page}`);
        dispatch({
            type:GET_GALLERY_IMAGE,
            payload:response,
            loading:true

        })
    }
    catch(e){
        dispatch({
            type:GET_GALLERY_IMAGE,
            payload:e.response
        })
    }


}

export {getGalleryImageAction}