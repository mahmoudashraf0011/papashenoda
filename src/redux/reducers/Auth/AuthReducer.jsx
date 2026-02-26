import { CREATE_USER, DELETE_USER, FORGET_PASSWORD, GET_USER_DATA, LOGIN_USER, LOGIN_WITH_GOOGLE, LOGOUT_USER, REST_PASSWORD } from "../../type";

const initial ={
    createUser:[],
    loginUser:[],
    logoutUser:[],
    forgetPass:[],
    restPass:[],
    getUserData:[],
    loginWithGoogle:[],
    deleteUser:[]
}

export const AuthReducer=(state=initial,action)=>{
    switch(action.type){
        case CREATE_USER:
            return{
                    ...state,
                    createUser:action.payload,
                    loading:false
                }
        case LOGIN_USER:
            return{
                    ...state,
                    loginUser:action.payload,
                    loading:false
                }
    case LOGIN_WITH_GOOGLE:
        return{
                ...state,
                loginWithGoogle:action.payload,
                loading:false
            }
        case LOGOUT_USER:
            return{
                ...state,
                logoutUser:action.payload,
                loading:false
            }
        case FORGET_PASSWORD:
                return{
                    ...state,
                    forgetPass:action.payload,
                    loading:false
                }
        case REST_PASSWORD:
            return{
                ...state,
                restPass:action.payload,
                loading:false
            }
        case GET_USER_DATA:
            return{
                ...state,
                getUserData:action.payload,
                loading:false
            }
        case DELETE_USER:
            return{
                ...state,
                deleteUser:action.payload,
                loading:false
            }
        
        
        default:
            return state;
    }
}
