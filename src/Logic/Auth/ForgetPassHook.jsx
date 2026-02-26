
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgetPassAction } from '../../redux/actions/AuthAction';

export default function ForgetPassHook() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    
//States
const [email,setEmail]=useState('');
const [loading,setLoading]=useState(true);
const [press,setPress]=useState(false);
const [emailMessage,setEmailMessage]=useState("");
const emailForgetRef=useRef();

// methods 
const onChangeEmail=(e)=>{
    setEmail(e.target.value);
}



//authReducer
const onSubmitForget=async (e)=>{
    e.preventDefault();
    setPress(true)
    setLoading(true)
    await dispatch(forgetPassAction({
        email:email,
    }))
    setLoading(false)

}
const res=useSelector(state=> state.AuthReducer.forgetPass);

useEffect(()=>{
if(loading==false){
    if(res){
        if(res.status==200){
            setEmailMessage(res.data.message)
            emailForgetRef.current.classList.remove("profileActive")

        }else{
            console.log(res);
            if(res.status==400){

                setEmailMessage(res.data.email)
                emailForgetRef.current.classList.add("profileActive")

            }

            if(res.status=422){
                if(res.data.errors){
                    setEmailMessage(res.data.errors.email[0])
                    emailForgetRef.current.classList.add("profileActive")

                }
                if(res.data.message){
                    setEmailMessage(res.data.message)
                    emailForgetRef.current.classList.add("profileActive")

                }

            }


        }   
       
}
}
setLoading(true)
setPress(false)
},[loading])
        
  return [email,emailMessage,emailForgetRef,onChangeEmail,onSubmitForget,loading,press]
}
