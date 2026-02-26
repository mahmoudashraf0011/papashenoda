import { GET_GALLERY_IMAGE } from "../../type";

const initial ={
    galleryDate:[],
}

export const GalleryReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_GALLERY_IMAGE:
            return{
                    ...state,
                    galleryDate:action.payload,
                    loading:false
                }
        
        default:
            return state;
    }
}
