import React, { useState } from 'react'
import './Login.scss'
import './Login-res.scss'

import LoginHook from '../../Logic/Auth/LoginHook'
import { Link } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { usePostData } from '../../hooks/usePostData';
import axios from 'axios';
import baseURL from '../../API/baseURL';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserWithGoogleAction } from '../../redux/actions/AuthAction';
import { useEffect } from 'react';
import Spinner from '../Utility/Spinner';

export default function Login() {
    const [email, pass, emailMessage, passMessage, generalMessage, googleMessage, emailLoginRef, passLoginRef, onChangeEmail, onChangePass, onSubmitLogin, loading, press] = LoginHook();

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
 
    const handle_google_login = useGoogleLogin({
        onSuccess: tokenResponse => {
            const data = {
                token: tokenResponse.access_token
            }
            Dispatch(loginUserWithGoogleAction({
                token: data.token
            }))

        },
        onError: error => console.error(error),
        redirectUri: "https://ph.msol.dev/"
    });
    const resGoogle = useSelector(state => state.AuthReducer.loginWithGoogle);
    useEffect(() => {
        if (resGoogle) {
            if (resGoogle.status == 200) {
                if (resGoogle.data) {
                    localStorage.setItem("token_popeShounda", resGoogle.data.data.access_token)
                    localStorage.setItem("user_popeShounda", JSON.stringify(resGoogle.data.data.user))
                    setGoogelMessage(resGoogle.data.message)
                }
                setTimeout(() => {
                    window.location.href = "/";

                }, 500);
            } else {
                localStorage.removeItem("token_popeShounda")
                localStorage.removeItem("user_popeShounda")
            }
        }
    }, [resGoogle])


    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    useEffect(() => {
        if (passLoginRef.current) {
            passLoginRef.current.focus();
        }
    }, [showPassword]);
    return (
        <div className='signup'>
            <div className="signup-wrapper">
                <img src="./assets/signup-abs.png" alt="" className='signup-abs' />
                <div className="signup-relative">
                    <img className='signup-img' src="./assets/login-img.png" alt="" />
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

                <div className="signup-right-cont">
                    <p className='signup-welcome'>👋 أهلاً بك  </p>
                    <p className='signup-info'>مركز معلم الأجيال - الموقع الرسمي للبابا شنوده الثالث - يمنحك الوصول إلى كل مكتبات البابا بشكل مجاني</p>

                    <div className='headAuthRes signup-info' style={{display:"none",direction:"rtl"}} >
                    <p>مركز معلم الأجيال - الموقع الرسمي للبابا </p>
                    <p>شنودة الثالث - يمنحك الوصول إلى كل مكتبات</p>
                    <p >البابا بشكل مجاني.</p>
                    </div>

                    <label htmlFor="" className='signup-label'> البريد الإلكتروني</label>
                    <input type="text" name="" id="" className='signup-input' placeholder='البريد الإلكتروني' value={email} onChange={onChangeEmail} ref={emailLoginRef} />
                    <span className='messageInput'>{emailMessage}</span>


                    <label htmlFor="" className='signup-label'>   كلمة المرور</label>
                    <div className="signup-pass-rel" >
        
                        <input
                            id="customPasswordInput"
                            type="text"
                            className={showPassword?`signup-input`:`custom-password-input signup-input`}
                            placeholder="كلمة المرور "
                            value={pass} onChange={onChangePass} ref={passLoginRef} 
                        />

                        <img
                            src={showPassword?'./assets/pass-eye.png':'./assets/eye-hidden.png'}
                            alt="Toggle password visibility"
                            onClick={togglePasswordVisibility}
                            className='signup-eye-img'
                           
                        />

                    </div>
                    <span className='messageInput'>{passMessage}</span>


                    <div className="signup-p-check">
                        <Link to='/forgetPassword' className='signup-rem'>هل نسيت كلمة المرور؟</Link>

                    </div>
                    <button className='signup-create-btn' onClick={onSubmitLogin}> تسجيل الدخول</button>
                    <div className='messageContainer'>
                        {press ? loading ? <Spinner /> : "" : <span className='messageInputGeneral'>{generalMessage}</span>}
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
                    <div className='messageContainer'>
                        <span className='messageInputGeneral'>{googleMessages}</span>
                    </div>
                    <span className='messageInputGeneral'>{googleMessage}</span>
                    <div className="signup-already">
                        <Link to={'/signup'} > لا تملك حساب؟<span> إنشاء حساب جديد</span></Link>
                    </div>

                </div>
            </div>
        </div >
    )
}
