import { GET_CATEGORY_Filter_DATA, GET_DATA_BY_CATEGORY, GET_DATA_BY_CATEGORY_MORE } from "../../type";


const initial ={
    categoryData:[],
    categoryDataMore:[],
    categoryDataFilter:[]
}

export const CategoryReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_DATA_BY_CATEGORY:
            return{
                    ...state,
                    categoryData:action.payload,
                }
        case GET_DATA_BY_CATEGORY_MORE:
            return{
                    ...state,
                    categoryDataMore:action.payload,
                }
        case GET_CATEGORY_Filter_DATA:
            return{
                    ...state,
                    categoryDataFilter:action.payload,
                }

        default:
            return state;
    }
}
