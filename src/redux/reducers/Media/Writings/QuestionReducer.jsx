
import { GET_ALL_QUESTIONS, GET_Attr_QUESTIONS, GET_FILTER_QUESTIONS } from "../../../type";

const initial ={
    questionsData:[],
    questionsFilterData:[],
    questionsAttrData:[],
}

export const QuestionReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_QUESTIONS:
            return{
                    ...state,
                    questionsData:action.payload,
                    loading:false
                }
        
        case GET_FILTER_QUESTIONS:
            return{
                    ...state,
                    questionsFilterData:action.payload,
                    loading:false
                }
        case GET_Attr_QUESTIONS:
            return{
                    ...state,
                    questionsAttrData:action.payload,
                    loading:false
                }
        default:
            return state;
    }
}
