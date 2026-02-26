import { GET_ALL_HAPPENS, GET_ALL_HAPPENS_FOR_ONE, GET_FILTER_HAPPEN, GET_ONE_HAPPEN } from "../../../type"


const initial ={
    happensData:[],
    happensForOneData:[],
    happenDetails:[],
    filterHappen:[]
}

export const HappenReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_HAPPENS:
            return{
                    ...state,
                    happensData:action.payload,
                }
        case GET_ALL_HAPPENS_FOR_ONE:
            return{
                    ...state,
                    happensForOneData:action.payload,               
                 }
        case GET_ONE_HAPPEN:
                return{
                    ...state,
                    happenDetails:action.payload,               
                    } 
        case GET_FILTER_HAPPEN:
            return{
                ...state,
                filterHappen:action.payload,               
                } 

        default:
            return state;
    }
}
