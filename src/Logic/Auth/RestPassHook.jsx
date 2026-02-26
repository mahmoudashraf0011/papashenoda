
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { restPassAction } from '../../redux/actions/AuthAction';

export default function RestPassHook(token,email) {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    console.log(token);
    console.log(email);
//States
const [pass,setPass]=useState('');
const [confirmPass,setConfirmPass]=useState('');
const [loading,setLoading]=useState(true);
const [press,setPress]=useState(false);
const [passMessage,setPassMessage]=useState("");
const [confirmPassMessage,setConfirmPassMessage]=useState("");
const [generalMessage,setGeneralMessage]=useState("");
const passRestRef=useRef();
const confirmPassRestRef=useRef();

// methods 
const onChangePass=(e)=>{
    setPass(e.target.value);
}
const onChangeCPass=(e)=>{
    setConfirmPass(e.target.value);
}


//authReducer
const onSubmitRest=async (e)=>{
    e.preventDefault();
    setPress(true)
    setLoading(true)
    await dispatch(restPassAction({
        token:token,
        email:email,
        password:pass,
        password_confirmation:confirmPass
    }))
    setLoading(false)

}
const res=useSelector(state=> state.AuthReducer.restPass);

useEffect(()=>{
    if(loading==false){

        if(res){
            console.log(res);

            if(res.status==200){
                setGeneralMessage(res.data.status)
                if(passRestRef.current){
                    passRestRef.current.classList.remove("profileActive")

                }
                if( confirmPassRestRef.current){
                    confirmPassRestRef.current.classList.remove("profileActive")

                }
                setConfirmPassMessage("")
                setPassMessage("")
                setTimeout(() => {
                    window.location.replace("https://ph.msol.dev/login");
                }, 1200);
            }    
            if(res.data.email){
                setGeneralMessage(res.data.email)

            }   
            if(res.data.password){
                setPassMessage(res.data.password[0])
                if( passRestRef.current){
                    passRestRef.current.classList.add("profileActive")

                }
            }
            if(res.data.password_confirmation){
                setConfirmPassMessage(res.data.password_confirmation[0])
                if( confirmPassRestRef.current){

                confirmPassRestRef.current.classList.add("profileActive")
                }
            }
            else{
                setPassMessage("")
                if( passRestRef.current){
                    passRestRef.current.classList.remove("profileActive")

                }
            }

           
    }
    }
    setLoading(true)
    setPress(false)
    },[loading])
        
  return [pass,confirmPass,passMessage,confirmPassMessage,generalMessage,passRestRef,confirmPassRestRef,onChangePass,onChangeCPass,onSubmitRest,press,loading]
}
