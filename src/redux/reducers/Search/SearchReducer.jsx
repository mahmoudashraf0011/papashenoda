import { GET_DATA_BY_CATEGORY, GET_FULL_SEARCH_Filter_DATA, GET_SEARCH_DATA, GET_SEARCH_Filter_DATA, GET_SEARCH_MORE, GET_SEARCH_RESULT } from "../../type";
import { GET_FULL_MORE_SEARCH_RESULT, GET_FULL_SEARCH_RESULT } from './../../type';


const initial ={
    searchResult:[],
    searchResultMore:[],
    searchResultMoreFilter:[],
    searchFullResult:[],
    searchFullMoreResult:[],
    searchFullResultMoreFilter:[],


}

export const SearchReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_SEARCH_RESULT:
            return{
                    ...state,
                    searchResult:action.payload,
                }
        case GET_SEARCH_MORE:
            return{
                    ...state,
                    searchResultMore:action.payload,
                }
        case GET_SEARCH_Filter_DATA:
            return{
                ...state,
                searchResultMoreFilter:action.payload,
            }
        case GET_FULL_SEARCH_RESULT:
            return{
                ...state,
                searchFullResult:action.payload,
            }
        case GET_FULL_MORE_SEARCH_RESULT:
            return{
                ...state,
                searchFullMoreResult:action.payload,
            }
        case GET_FULL_SEARCH_Filter_DATA:
            return{
                ...state,
                searchFullResultMoreFilter:action.payload,
            }
        default:
            return state;
    }
}
