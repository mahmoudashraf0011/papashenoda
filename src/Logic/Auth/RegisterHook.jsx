
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUserAction } from '../../redux/actions/AuthAction';

export default function RegisterHook() {

const dispatch=useDispatch();
const navigate=useNavigate();

//States
const [name,setName]=useState('');
const [email,setEmail]=useState('');
const [pass,setPass]=useState('');
const [confirmPass,setConfirmPass]=useState('');
const [loading,setLoading]=useState(true);
const [press,setPress]=useState(false);
const [usernameMessage,setUsernameMessage]=useState("");
const [emailMessage,setEmailMessage]=useState("");
const [passMessage,setPassMessage]=useState("");
const [confirmPassMessage,setConfirmPassMessage]=useState("");
const [generalMessage,setGeneralMessage]=useState("");
const userNameRegisterRef=useRef()
const emailRegisterRef=useRef()
const passRegisterRef=useRef()
const confirmPassRegisterRef=useRef()
const userNameRegisterMessageRef=useRef()
const emailRegisterMessageRef=useRef()
const passRegisterMessageRef=useRef()
const confirmPassRegisterMessageRef=useRef()

// methods 
const onChangeName=(e)=>{
    setName(e.target.value);
}

const onChangeEmail=(e)=>{
    setEmail(e.target.value);
}

const onChangePass=(e)=>{
    setPass(e.target.value);
}

const onChangePassConfirm=(e)=>{
    setConfirmPass(e.target.value);
}




//authReducer
const onSubmitRegistertion=async (e)=>{
    e.preventDefault();
    setPress(true)
    setLoading(true)
    await dispatch(createUserAction({
        name: name,
        email:email,
        password:pass,
        checkpassword:confirmPass,
    }))
    setLoading(false)
}

const res=useSelector(state=> state.AuthReducer.createUser);

useEffect(()=>{
if(loading==false){
    if(res){
        console.log(res);
        if(res.data.data){
            if(res.data.data.name){
                setUsernameMessage(res.data.data.name)
                userNameRegisterRef.current.classList.add("profileActive")

            }else{
                setUsernameMessage("")
                userNameRegisterRef.current.classList.remove("profileActive")
            }
            if(res.data.data.email){
                setEmailMessage(res.data.data.email)
                emailRegisterRef.current.classList.add("profileActive")
            }
            else{
                setEmailMessage("")
                emailRegisterRef.current.classList.remove("profileActive")
            }
            if(res.data.data.password){
                setPassMessage(res.data.data.password)
                passRegisterRef.current.classList.add("profileActive")
            }
            else{
                setPassMessage("")
                passRegisterRef.current.classList.remove("profileActive")
            }
            if(res.data.data.checkpassword){
                setConfirmPassMessage(res.data.data.checkpassword);
                confirmPassRegisterMessageRef.current.style.display="block";
                confirmPassRegisterRef.current.classList.add("profileActive")
            }
            else{
                setConfirmPassMessage("")
                confirmPassRegisterMessageRef.current.style.display="none";
                confirmPassRegisterRef.current.classList.remove("profileActive")
            }
        }
        if(res.data==null){
            setGeneralMessage(res.data.message)
        }else{
            setGeneralMessage("")
        }
        if(res.status==200){
            setGeneralMessage(res.data.message)
            localStorage.setItem("token_popeShounda",res.data.data.access_token)
            localStorage.setItem("user_popeShounda",JSON.stringify(res.data.data.user))
            localStorage.setItem("pass_popeShounda",pass)
            setTimeout(() => {
                 window.location.href="/"
            }, 1000);
        }
}
}
setLoading(true)
setPress(false)

},[loading])

return [name,email,pass,confirmPass,usernameMessage,emailMessage,passMessage,confirmPassMessage,generalMessage,userNameRegisterRef,emailRegisterRef,passRegisterRef,confirmPassRegisterRef,onChangeName,onChangeEmail,onChangePass,onChangePassConfirm,onSubmitRegistertion,loading,press,userNameRegisterMessageRef,emailRegisterMessageRef,passRegisterMessageRef,confirmPassRegisterMessageRef]
}
//01015846758