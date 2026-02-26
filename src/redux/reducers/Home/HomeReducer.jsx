import { GET_HOME_DATA } from "../../type";

const initial ={
    homeData:[],
}

export const HomeReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_HOME_DATA:
            return{
                    ...state,
                    homeData:action.payload,
                    loading:false
                }
        
        default:
            return state;
    }
}
