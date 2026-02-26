
import { GET_ALL_POEMS, GET_Attr_POEMS, GET_FILTER_POEMS, GET_ONE_POEM } from "../../../type";

const initial ={
    poemsData:[],
    onePoemData:[],
    filterPomes:[],
    attrPoems:[],
}

export const PoemsReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_POEMS:
            return{
                    ...state,
                    poemsData:action.payload,
                    loading:false
                }
        case GET_ONE_POEM:
            return{
                    ...state,
                    onePoemData:action.payload,
                    loading:false
                }
        case GET_FILTER_POEMS:
            return{
                    ...state,
                    filterPomes:action.payload,
                    loading:false
                }
        case GET_Attr_POEMS:
            return{
                    ...state,
                    attrPoems:action.payload,
                    loading:false
                }
        default:
            return state;
    }
}
