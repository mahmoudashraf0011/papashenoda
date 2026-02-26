import { GET_ALL_SAYINGS_PHOTO, GET_ALL_SAYINGS_WRITTEN, GET_ATTR_SAYINGS_PHOTO, GET_ATTR_SAYINGS_WRITTEN, GET_FILTER_SAYINGS_PHOTO, GET_FILTER_SAYINGS_WRITTEN } from "../../../type";

const initial ={
    sayingsWritenData:[],
    sayingsPhotoData:[],
    sayingsWritenFilter:[],
    sayingsPhotoFilter:[],
    sayingsPhotoAttr:[],
    sayingsWrittenAttr:[]
}

export const SayingsReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_SAYINGS_WRITTEN:
            return{
                    ...state,
                    sayingsWritenData:action.payload,
                }
        case GET_ALL_SAYINGS_PHOTO:
            return{
                    ...state,
                    sayingsPhotoData:action.payload,               
                 }
        case GET_FILTER_SAYINGS_WRITTEN:
        return{
                    ...state,
                    sayingsWritenFilter:action.payload,               
                }
        case GET_FILTER_SAYINGS_PHOTO:
            return{
                    ...state,
                    sayingsPhotoFilter:action.payload,               
                }
        case GET_ATTR_SAYINGS_WRITTEN:
            return{
                    ...state,
                    sayingsWrittenAttr:action.payload,               
                }
        case GET_ATTR_SAYINGS_PHOTO:
            return{
                    ...state,
                    sayingsPhotoAttr:action.payload,               
                }

        default:
            return state;
    }
}
