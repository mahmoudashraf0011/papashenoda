import React, { useEffect } from 'react'
import './ForgetPassPage.css'
import './Responsive/RestPasswordRes.css'
import ForgetPassHook from '../../Logic/Auth/ForgetPassHook';
import Spinner from '../../components/Utility/Spinner';
import { Link } from 'react-router-dom';
export default function ForgetPassPage() {
  const  [email,emailMessage,emailForgetRef,onChangeEmail,onSubmitForget,loading,press]=ForgetPassHook();
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
  return (
    <div className='forgetPassPage'>
        <div className="forgetPassContent">
            <div className='forgetPassContentImg'>
              <img src='/assets/vector.png' alt='lock' />
            </div>
            <h2 className='forgetPassContentTitle'>نسيت كلمة المرور</h2>
            <p className='forgetPassContentDesc'>سيتم ارسال كود التحقق الى بريدك الالكترونى ، برجاء التحقق منه بعد إتمام تلك الخطوة</p>
            <form className='forgetForm' onSubmit={onSubmitForget} noValidate>
              <label for="emailInput">البريد الإلكترونى</label>
              <input id='emailInput' type='email' placeholder='البريد الإلكترونى' value={email} onChange={onChangeEmail} ref={emailForgetRef} />
              <button >إرسال</button>
              {press?loading?<Spinner />:"":<span className='messageInput'>{emailMessage}</span>} 
            </form>
            <Link className='backIcon' to={'/signUp'} style={{display:"none"}}><span>الرجوع</span> <img src='/assets/back.png' alt='back'/></Link>

        </div>
    </div>
  )
}
