import { GET_ALL_WRITINGS } from "../../../type";



const initial ={
    writingsData:[],
}

export const WritingsReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_WRITINGS:
            return{
                    ...state,
                    writingsData:action.payload,
                    loading:false
                }
        
        default:
            return state;
    }
}
