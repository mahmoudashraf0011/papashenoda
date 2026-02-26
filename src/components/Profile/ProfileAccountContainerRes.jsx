import React, { useEffect } from 'react'
import './ProfileAccountContainer.css'
import UserInfoHook from '../../Logic/Profile/UserInfoHook';
import UpdateUserInfo from '../../Logic/Profile/UpdateUserInfoHook';
import UpdateUserInfoHook from '../../Logic/Profile/UpdateUserInfoHook';
import { Link } from 'react-router-dom';
import Spinner from '../Utility/Spinner';
export default function ProfileAccountContainerRes() {
    const  [userInfo]=UserInfoHook();
    function isImage(file) {
        // Checking MIME type
        const validImageTypes = ['image/jpeg','image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
        
        return validImageTypes.includes(file.type);
      }
    const [userNameProfile,emailProfile,passProfile,confirmPassProfile,userNameProfileMessage,emailProfileMessage,passProfileMessage,confirmPassProfileMessage,generlaProfileMessage,imgProfileMessage,deleteImgMessage,imgGenerlaProfileMessage,userNameProfileRef,emailProfileRef,passProfileRef,confirmPassProfileRef,img,selectedFile,onChangeUserNameProfile,onChangeEmailProfile,onChangePassConfirmProfile,onChangePassProfile,handleIMGChange,handleIMGDelete,onSubmitProfile,handleIMGResChange,loading,press]
    =UpdateUserInfoHook()

  return (
    
   
        <div className='profileAccountContainer'>
        <form className='profileAccountForm'>
            <p className='profileAccountFormTitle'>بيانات المستخدم :</p>
            <div className='profileAccountFormUp'>
                <div className='profileAccountImg'>
                    <img 
                        src={img? img:'/assets/profile/avatar.svg'}  
                        alt="profileImg"
                        style={{
                            padding: img ? '0' : '7px', // Conditional padding
                        }}
                    />
                </div>
                <div className='profileAccountFormUpItems'>
                    <div className='profileAccountFormUpItem'>
                        <label htmlFor="changeImg" style={{display:"block"}}>
                            <img src={`/assets/profile/img.svg`}/>
                            <p className='profileAccountFormUpItemTitle'>تغيير الصورة</p>
                        </label>
                        <input type='file' id='changeImg' hidden onChange={handleIMGResChange} />

                    </div>
                    <div className='profileAccountFormUpItem' onClick={handleIMGDelete}>
                    <label htmlFor="c" style={{display:"block"}}>
                        <img src='/assets/profile/delete.svg'/>
                        <p className='profileAccountFormUpItemTitle'>مسح الصورة</p>
                    </label>
                    </div>
                </div>

            </div>
            <div className='profileAccountFormInputs'>
                <div className='profileAccountFormInput'>
                    <label htmlFor='userName'>اسم المستخدم</label>
                    <input type='text' id='userName' placeholder='إسم المستخدم'  value={userNameProfile} onChange={onChangeUserNameProfile} ref={userNameProfileRef}  />
                    <p className='messageInput'>{userNameProfileMessage}</p>
                </div>
                <div className='profileAccountFormInput'>
                    <label htmlFor='email'>البريد الإلكتروني</label>
                    <input type='email' id='email' placeholder="البريد الإلكتروني" value={emailProfile} onChange={onChangeEmailProfile} ref={emailProfileRef}/>
                    <p className='messageInput'>{emailProfileMessage}</p>
                </div>
                <div className='profileAccountFormInput'>
                    <label htmlFor='password'>كلمة المرور</label>
                    <input type='password' id='password' placeholder="كلمة المرور" value={passProfile} onChange={onChangePassProfile} ref={passProfileRef}/>
                    <p className='messageInput'>{passProfileMessage}</p>
                </div>
                <div className='profileAccountFormInput'>
                    <label htmlFor='confirmPass'>تأكيد كلمة المرور</label>
                    <input type='password' id='confirmPass' placeholder="تأكيد كلمة المرور" value={confirmPassProfile} onChange={onChangePassConfirmProfile} ref={confirmPassProfileRef} />
                    <p className='messageInput'>{confirmPassProfileMessage}</p>
                </div>
            </div>
            <div className='profileAccountFormBtns'>
                <button className='profileUpdateBtn profileBtn' onClick={onSubmitProfile}>تحديث</button>
                <Link to={"/"} className='profileCancelBtn profileBtn ' style={{textAlign:"center"}} >الغاء</Link>
            </div>
        </form>
        {
            press?
            loading?
            <Spinner />:
            "":
            <>
                <p className='messageInput'>{generlaProfileMessage}</p>
                <p className='messageInput'>{imgProfileMessage}</p>
                <p className='messageInput'>{deleteImgMessage}</p>
                <p className='messageInput'>{imgGenerlaProfileMessage}</p>
            </>

        }

         </div>

    

  )
}
