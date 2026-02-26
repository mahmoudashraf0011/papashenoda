import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUserAction, loginUserWithGoogleAction } from '../../redux/actions/AuthAction';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';


export default function LoginHook() {
    const Dispatch=useDispatch();
    const navigate=useNavigate();
    
//States
const [email,setEmail]=useState('');
const [pass,setPass]=useState('');
const [loading,setLoading]=useState(true);
const [press,setPress]=useState(false);
const [loadingGoogle,setLoadingGoogle]=useState(true);
const [emailMessage,setEmailMessage]=useState("");
const [passMessage,setPassMessage]=useState("");
const [generalMessage,setGeneralMessage]=useState("");
const [googleMessage,setGoogleMessage]=useState("");
const emailLoginRef=useRef()
const passLoginRef=useRef()
// Send the token to your backend to exchange it for an access token

const handleLoginFailure = (error) => {
console.log("Google Login Failed", error);
};

// methods 
const onChangeEmail=(e)=>{
    setEmail(e.target.value);
}

const onChangePass=(e)=>{
    setPass(e.target.value);
}



//authReducer
const onSubmitLogin=async (e)=>{
    e.preventDefault();
    setPress(true)
    setLoading(true)
    await Dispatch(loginUserAction({
        email:email,
        password:pass,

    }))
    setLoading(false)

}
  






const res=useSelector(state=> state.AuthReducer.loginUser);

useEffect(()=>{
if(loading==false){
    if(res){
        console.log("resssssssss",res);
        if(res.status==200){
            if(res.data){
                localStorage.setItem("token_popeShounda",res.data.data.access_token)
                localStorage.setItem("user_popeShounda",JSON.stringify(res.data.data.user))
                localStorage.setItem("pass_popeShounda",pass)

                setGeneralMessage(res.data.message)
            }
            setTimeout(() => {
                window.location.href = "/";

            }, 1000);
        }else{
            localStorage.removeItem("token_popeShounda")
            localStorage.removeItem("user_popeShounda")
            localStorage.removeItem("pass_popeShounda")

        }

        if(res.data.data){
            if(res.data.data.email){
                setEmailMessage(res.data.data.email)
                emailLoginRef.current.classList.add("profileActive")

            }
            else{
                setEmailMessage("")
                emailLoginRef.current.classList.remove("profileActive")

            }
            if(res.data.data.password){
                setPassMessage(res.data.data.password)
                passLoginRef.current.classList.add("profileActive")
            }
            else{
                setPassMessage("")
                passLoginRef.current.classList.remove("profileActive")
            }
        }
        if(res.status==401 || res.status==400 || res.status==422  || res.status==200){
            setGeneralMessage(res.data.message)
        }else{
            setGeneralMessage("")

        }
}
}
setLoading(true)
setPress(false)

},[loading])
 //authReducer
 const run=async(data)=>{
    await Dispatch(loginUserWithGoogleAction({
        token:data
       }))
 }
 const resGoogle=useSelector(state=> state.AuthReducer.loginWithGoogle);

const handle_google_login=useGoogleLogin({
    onSuccess: tokenResponse => {
        const data={
            token:tokenResponse.access_token
        }
        console.log(data);
        run(data.token)

        if(resGoogle){
            console.log(resGoogle);
            if(resGoogle.status==200){
                if(resGoogle.data){
                    localStorage.setItem("token_popeShounda",resGoogle.data.data.access_token)
                    localStorage.setItem("user_popeShounda",JSON.stringify(resGoogle.data.data.user))

                    setGeneralMessage(resGoogle.data.message)
                }
                setTimeout(() => {
                    window.location.href = "/";
    
                }, 1000);
            }else{
                localStorage.removeItem("token_popeShounda")
                localStorage.removeItem("user_popeShounda")
            }
    }
    
 
    },
    onError: error => console.error(error),
}); 

// useEffect(()=>{
//     if(loadingGoogle==false){
//         if(resGoogle){
//             console.log(resGoogle);
//             if(resGoogle.status==200){
//                 if(resGoogle.data){
//                     localStorage.setItem("token",resGoogle.data.data.access_token)
//                     localStorage.setItem("user",JSON.stringify(resGoogle.data.data.user))
//                     setGeneralMessage(resGoogle.data.message)
//                 }
//                 setTimeout(() => {
//                     window.location.href = "/";
    
//                 }, 1000);
//             }else{
//                 localStorage.removeItem("token")
//                 localStorage.removeItem("user")
//             }
//     }
//     setLoadingGoogle("true")
//     }
//     },[loadingGoogle])
  return [email,pass,emailMessage,passMessage,generalMessage,googleMessage,emailLoginRef,passLoginRef,onChangeEmail,onChangePass,onSubmitLogin,loading,press]
}
