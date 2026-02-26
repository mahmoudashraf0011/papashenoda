import { GET_ALL_DOCS, GET_ATTR_DOCS, GET_DOCS_ATTR_Details, GET_DOCS_Details, GET_FILTER_DOCS } from "../../../type"


const initial ={
    docsData:[],
    docsFilterData:[],
    docsAttrData:[],
    docsDetails:[],
    docsDetailsAttr:[],
}

export const DocsReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_DOCS:
            return{
                    ...state,
                    docsData:action.payload,
                }
        case GET_FILTER_DOCS:
            return{
                    ...state,
                    docsFilterData:action.payload,
                }
        case GET_ATTR_DOCS:
            return{
                    ...state,
                    docsAttrData:action.payload,
                }
        case GET_DOCS_Details:
            return{
                    ...state,
                    docsDetails:action.payload,               
                 }
        case GET_DOCS_ATTR_Details:
                return{
                ...state,
                docsDetailsAttr:action.payload,               
                }

        default:
            return state;
    }
}
