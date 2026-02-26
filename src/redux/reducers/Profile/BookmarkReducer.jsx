import { ADD_BOOKMARK_DATA, DELETE_BOOKMARK_DATA, GET_BOOKMARK_DATA, GET_ONE_BOOKMARK_DATA } from "../../type"




const initial ={
  bookmarkData:[],
  oneBookmarkData:[],
  addBookmark:[],
  deleteBookmark:[]
}

export const BookmarkReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_BOOKMARK_DATA:
            return{
                    ...state,
                    bookmarkData:action.payload,
                }
        case GET_ONE_BOOKMARK_DATA:
          return{
                  ...state,
                  oneBookmarkData:action.payload,
              }
        case ADD_BOOKMARK_DATA:
          return{
                  ...state,
                  addBookmark:action.payload,
              }
        case DELETE_BOOKMARK_DATA:
          return{
                  ...state,
                  deleteBookmark:action.payload,
              }

 

        default:
            return state;
    }
}
