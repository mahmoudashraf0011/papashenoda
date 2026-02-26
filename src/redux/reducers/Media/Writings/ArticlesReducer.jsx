import { GET_ALL_ARTICLES, GET_ALL_ARTICLES_FOR_ONE, GET_ATTR_ARTICLES, GET_ATTR_ARTICLES_FOR_ONE, GET_FILTER_ARTICLES, GET_FILTER_ARTICLES_FOR_ONE, GET_ONE_ARTICLE } from "../../../type";


const initial ={
    articlesData:[],
    articlesForOneData:[],
    oneArticleData:[],
    articlesFilter:[],
    articlesFilterForOne:[],
    articlesAttr:[],
    articlesAttrForOne:[]
}

export const ArticlesReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_ALL_ARTICLES:
            return{
                    ...state,
                    articlesData:action.payload,
                }
        case GET_ALL_ARTICLES_FOR_ONE:
            return{
                    ...state,
                    articlesForOneData:action.payload,               
                 }
        case GET_ONE_ARTICLE:
                return{
                    ...state,
                    oneArticleData:action.payload,               
                    } 
        case GET_FILTER_ARTICLES:
            return{
                ...state,
                articlesFilter:action.payload,               
                } 
        case GET_FILTER_ARTICLES_FOR_ONE:
            return{
                ...state,
                articlesFilterForOne:action.payload,               
                } 
        case GET_ATTR_ARTICLES:
            return{
                ...state,
                articlesAttr:action.payload,               
                } 
        case GET_ATTR_ARTICLES_FOR_ONE:
            return{
                ...state,
                articlesAttrForOne:action.payload,               
                } 

        default:
            return state;
    }
}
