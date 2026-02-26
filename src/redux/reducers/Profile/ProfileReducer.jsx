import { DELETE_USER_IMG, GET_USER_INFO, UPDATE_USER_IMG, UPDATE_USER_INFO } from "../../type";



const initial ={
    userInfo:[],
    updateInfoUser:[],
    deleteUserImg:[],
    updateUserImg:[]
}

export const ProfileReducer=(state=initial,action)=>{
    switch(action.type){
        case GET_USER_INFO:
            return{
                    ...state,
                    userInfo:action.payload,
                }
        case UPDATE_USER_INFO:
          return{
                  ...state,
                  updateInfoUser:action.payload,
              }
        case UPDATE_USER_IMG:
          return{
                  ...state,
                  updateUserImg:action.payload,
              }
        case DELETE_USER_IMG:
          return{
                  ...state,
                  deleteUserImg:action.payload,
              }
 

        default:
            return state;
    }
}
