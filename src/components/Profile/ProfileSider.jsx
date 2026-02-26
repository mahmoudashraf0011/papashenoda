import React, { useEffect, useRef } from 'react'
import './ProfileSider.css'
import { Link, useParams } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import LogoutHook from '../../Logic/Auth/LogoutHook';
export default function ProfileSider({type}) {
    const account=useRef();
    const bk=useRef();
    const accountRes=useRef();
    const bkRes=useRef();
    const path = window.location.pathname; 
    const lastPart = path.substring(path.lastIndexOf("/") + 1);
    useEffect(()=>{
        if(lastPart=="profileAccount"){
            console.log("yes",account);
            account.current.classList.add("active")
            accountRes.current.classList.add("active")
            bk.current.classList.remove("active")
            bkRes.current.classList.remove("active")
    
        }else{
            bk.current.classList.add("active")
            bkRes.current.classList.add("active")
            account.current.classList.remove("active")
            accountRes.current.classList.remove("active")

        }
    },[])
    const [onSubmitLogout]=LogoutHook();

  return (
    <div className='profileSider'>
        <div className='userProfileLinks'>
            <div className='profileSliderUp'>
            <Link to='/profileAccount' className='userProfileLinksItem account' ref={account}>
                <div  className='profileImg' />
                <p>حسابى</p>
            </Link>
            <Link to='/profileBookMark' className='userProfileLinksItem subscribe' ref={bk}>
                <div className='profileImg' />
                <p>الإشتراكات</p>
            </Link>
            </div>  
            <div className='userProfileLinksItem logoutDP' onClick={onSubmitLogout}>
                <div  className='profileImg'/>
                <p>تسجيل الخروج</p>
            </div>
        </div>
        <div className='userProfileLinksRes' style={{display:"none"}}>
            <Link to='/profileAccount' className='userProfileLinksItem account' ref={accountRes}>
                <div  className='profileImg' />
                <p>حسابى</p>
            </Link>
            <Link to='/profileBookMark' className='userProfileLinksItem subscribe' ref={bkRes}>
                <div className='profileImg' />
                <p>الإشتراكات</p>
            </Link>
            <div className='userProfileLinksItem logoutDP' onClick={onSubmitLogout}>
                <div  className='profileImg'/>
                <p>تسجيل الخروج</p>
            </div>
        </div>
    </div>
  )
}
