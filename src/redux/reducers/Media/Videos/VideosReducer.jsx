import { GET_ATTR_VIDEOS, GET_FILTER_VIDEOS } from "../../../type";



const initial ={
    videosFilterData:[],
    videosAttrData:[],
}

export const VideosReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_FILTER_VIDEOS:
            return{
                    ...state,
                    videosFilterData:action.payload,
                }
    case GET_ATTR_VIDEOS:
        return{
                ...state,
                videosAttrData:action.payload,
            }

        default:
            return state;
    }
}
