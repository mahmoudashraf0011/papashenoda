import React, { useEffect } from 'react'
import './ProfileAccountPage.css'
import './Responsive/ProfileAccountRes.css'
import ProfileSider from '../../components/Profile/ProfileSider'
import ProfileAccountContainer from '../../components/Profile/ProfileAccountContainer'
import UserInfoHook from '../../Logic/Profile/UserInfoHook';
export default function ProfileAccountPage() {
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
    <div className='profilePage'>
            {/* <div className='profilePageItemsRes' style={{display:"none"}}>
                <ProfileSider type="account"/>
                <div className='Container'>
                  <ProfileAccountContainer />
                </div>
            </div> */}
            <div className='profilePageItems'>
                <ProfileSider type="account"/>
          
                <ProfileAccountContainer />
            </div>


    </div>
  )
}
