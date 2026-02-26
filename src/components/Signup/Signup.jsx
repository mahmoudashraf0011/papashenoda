import React, { useEffect, useState } from 'react'
import './Signup.scss'
import './Signup-res.scss'

import RegisterHook from '../../Logic/Auth/RegisterHook'
import { Link } from 'react-router-dom';
import Spinner from '../Utility/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUserWithGoogleAction } from '../../redux/actions/AuthAction';
export default function Signup() {
    const[name,email,pass,confirmPass,usernameMessage,emailMessage,passMessage,confirmPassMessage,generalMessage,userNameRegisterRef,emailRegisterRef,passRegisterRef,confirmPassRegisterRef,onChangeName,onChangeEmail,onChangePass,onChangePassConfirm,onSubmitRegistertion,loading,press,userNameRegisterMessageRef,emailRegisterMessageRef,passRegisterMessageRef,confirmPassRegisterMessageRef]=RegisterHook();
    window.addEventListener('hashchange', function (e) {
        e.preventDefault();
    });
    
    window.onload = function () {
        window.history.replaceState(null, null, ' '); // Clear hash if any
    };
    useEffect(() => {
      window.scrollTo(0, 0); // Ensure scroll starts at the top
    }, []); 
    const Dispatch=useDispatch();
    const [googleMessages,setGoogelMessage]=useState();
    const handle_google_login=useGoogleLogin({
        onSuccess: tokenResponse => {
            const data={
                token:tokenResponse.access_token
            }
            Dispatch(loginUserWithGoogleAction({
            token:data.token
           }))
     
        },
        onError: error => console.error(error),
        redirectUri: "https://popeshenoudasitetest.msol.dev/"
    }); 
    const resGoogle=useSelector(state=> state.AuthReducer.loginWithGoogle);
    useEffect(()=>{
        if(resGoogle){
            if(resGoogle.status==200){
                if(resGoogle.data){
                    localStorage.setItem("token",resGoogle.data.data.access_token)
                    localStorage.setItem("user",JSON.stringify(resGoogle.data.data.user))
                    setGoogelMessage(resGoogle.data.message)
                }
                setTimeout(() => {
                    window.location.href = "/";
    
                }, 500);
            }else{
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }
    },[resGoogle])

    return (
        <div className='signup'>
            <div className="login-wrapper">
                <img src="./assets/signup-abs.png" alt="" className='signup-abs' />
                <div className="login-relative">
                    <img className='signup-img' src="./assets/signup-1.png" alt="" />
                    <div className="singup-logos-abs">
                        <div className="signup-social">
                            <img src="./assets/youtube-abs.png" alt="" />
                        </div>
                    </div>
                    <div className="singup-logos-abs">
                        <div className="signup-social">
                            <img src="./assets/youtube-abs.png" alt="" />
                        </div>
                        <div className="signup-social">
                            <img src="./assets/insta-abs.png" alt="" />
                        </div>
                        <div className="signup-social">
                            <img src="./assets/sound-abs.png" alt="" />
                        </div>
                        <div className="signup-social">
                            <img src="./assets/x-abs.png" alt="" />
                        </div>
                        <div className="signup-social">
                            <img src="./assets/face-abs.png" alt="" />
                        </div>
                    </div>
                    
                </div>

                <div className="login-right-cont">
                <p className='signup-welcome'>👋 أهلاً بك  </p>
                    <div className='headAuth'>
                        <p className='signup-info'>مركز معلم الأجيال - الموقع الرسمي للبابا شنوده الثالث - يمنحك الوصول إلى كل مكتبات البابا بشكل مجاني</p>
                    </div>
                    <div className='headAuthRes signup-info' style={{display:"none",direction:"rtl"}} >
                    <p>مركز معلم الأجيال - الموقع الرسمي للبابا </p>
                    <p>شنودة الثالث - يمنحك الوصول إلى كل مكتبات</p>
                    <p >البابا بشكل مجاني.</p>
                    </div>


                    <label htmlFor="" className='signup-label'>إسم المستخدم</label>
                    <input type="text" name="" id="" className='signup-input' placeholder='إسم المستخدم' value={name} onChange={onChangeName} ref={userNameRegisterRef} />
                    <span className='messageInput' ref={userNameRegisterMessageRef}>{usernameMessage}</span>

                    <label htmlFor="" className='signup-label'> البريد الإلكتروني</label>
                    <input type="text" name="" id="" className='signup-input' placeholder='البريد الإلكتروني' value={email} onChange={onChangeEmail} ref={emailRegisterRef} />
                    <span className='messageInput' ref={emailRegisterMessageRef}>{emailMessage}</span>

                    <div className="signup-labels-inputs">
                        <div className="signup-collection">
                            <label htmlFor="confirmPass" className='signup-label'>   تأكيد كلمة المرور </label>
                            <input
                            id="confirmPass"
                            type="text"
                            className={`custom-password-input signup-input`}
                            placeholder="كلمة المرور "
                            value={confirmPass} onChange={onChangePassConfirm} ref={confirmPassRegisterRef} 
                        />  
                            <span className='messageInput' ref={confirmPassRegisterMessageRef}>{confirmPassMessage}</span>
                        </div>
                        <div className="signup-collection">
                            <label htmlFor="" className='signup-label'>   كلمة المرور</label>
                            <input
                            id="password"
                            type="text"
                            className={`custom-password-input signup-input`}
                            placeholder="كلمة المرور "
                            value={pass} onChange={onChangePass} ref={passRegisterRef} 
                        />                    
                            <span className='messageInput' ref={passRegisterMessageRef}>{passMessage}</span>
                        </div>
                    </div>

                    <button className='signup-create-btn'onClick={onSubmitRegistertion} >أنشئ حساب</button>
                    <div className='messageContainer'>
                        <span className='messageInputGeneral'>{press?loading?<Spinner />:"":<span className='messageInputGeneral'>{generalMessage}</span>}</span>
                    </div>
                    <div className="signup-lines-or">
                        <div className="signup-line"></div>
                        <p className='signup-or'>أو</p>
                        <div className="signup-line"></div>
                    </div>

                    <div className="signup-google-btn" onClick={handle_google_login} >
                          <p className='signup-register'>تسجيل الدخول عبر حساب جوجل</p> 
                        <img className='signup-google-img' src="/assets/Google.png" alt="" /> 
                    </div> 
                    <div className="signup-already">
                        <Link to="/login"> هل لديك حساب بالفعل؟ <span>تسجيل الدخول</span></Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
