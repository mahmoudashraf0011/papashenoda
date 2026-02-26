
import React, { useEffect, useRef, useState } from 'react'
import './ForgetPassPage.css'
import './Responsive/RestPasswordRes.css'
import RestPassHook from '../../Logic/Auth/RestPassHook'
import { Link, useParams } from 'react-router-dom'
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from '../../components/Utility/Spinner'
export default function RestPassPage() {


window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
  const url = new URL(window.location.href);

  // Extract the token and email from the URL
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  

    const [pass,confirmPass,passMessage,confirmPassMessage,generalMessage,passRestRef,confirmPassRestRef,onChangePass,onChangeCPass,onSubmitRest,press,loading]=RestPassHook(token,email);
    const [restPassIcon,setRestPassIcon]=useState(faEyeSlash)
    const [restConfirmPassIcon,setRestConfirmPassIcon]=useState(faEyeSlash)
    const restPassImg=useRef();
    const confirmPassImg=useRef();
    const restPassR=useRef();
    const confirmPassR=useRef();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const onhandleShowPass=()=>{
      setShowPassword(!showPassword)
    }
    const onhandleShowConfirmPass=()=>{
        setShowConfirmPassword(!showConfirmPassword)
    
    }
  return (
    <div className='forgetPassPage RestPage'>
        <div className="forgetPassContent">
            <div className='forgetPassContentImg'>
              <img src='/assets/vector.png' alt='lock' />
            </div>
            <h2 className='forgetPassContentTitle'>تعيين كلمة مرور جديدة</h2>
            <p className='forgetPassContentDesc'>يجب أن تتكون كلمة المرور من أحرف كبيرة وصغيرة وأرقام ورموز على ألا يقل عددها عن 8</p>
            <form className='forgetForm' onSubmit={onSubmitRest}>
              <div className='restField passRest'>
                <label htmlFor="pass">كلمة المرور الجديدة</label>
                <input
                    id="customPasswordInput"
                    type="text"
                    className={showPassword?`signup-input`:`custom-password-input signup-input`}
                    placeholder="كلمة المرور الجديدة "
                    value={pass} onChange={onChangePass} ref={restPassR} 
                  />
                <img src={showPassword?'/assets/pass-eye.png':'/assets/eye-hidden.png'} className='restImg passIcon' onClick={onhandleShowPass} ref={restPassImg} />
                <span className='messageInput'>{passMessage}</span>
              </div>
              <div className='restField confirmpassRest'>
                <label htmlFor="cpass">تأكيد كلمة المرور الجديدة</label>
                <input
                    id="customPasswordInput"
                    type="text"
                    className={showConfirmPassword?`signup-input`:`custom-password-input signup-input`}
                    placeholder="كلمة المرور الجديدة "
                    value={confirmPass} onChange={onChangeCPass} ref={confirmPassR} 
                  />
                <img src={showConfirmPassword?'/assets/pass-eye.png':'/assets/eye-hidden.png'}  className='restImg passIcon' onClick={onhandleShowConfirmPass} ref={confirmPassImg}  />
                <span className='messageInput'>{confirmPassMessage}</span>
              </div>
              <button >حفظ</button>
              {press?loading?<Spinner />:"":<span className='messageInput'>{generalMessage}</span>} 

            </form>
            <Link className='backIcon' to={'/signUp'} style={{display:"none"}}><span>الرجوع</span> <img src='/assets/back.png' alt='back'/></Link>
        </div>
    </div>
  )
}
