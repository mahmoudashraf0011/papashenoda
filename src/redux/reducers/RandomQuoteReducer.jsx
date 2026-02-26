
import { GET_RANDOM_QUOTE } from "../type"


const initial ={
    randomQuoteData:[],

}

export const RandomQuoteReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_RANDOM_QUOTE:
            return{
                    ...state,
                    randomQuoteData:action.payload,
                }

        default:
            return state;
    }
}
