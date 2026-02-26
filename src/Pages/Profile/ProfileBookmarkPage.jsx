import React, { useEffect } from 'react'
import './ProfileBookmarkPage.css'
import './Responsive/ProfileBookmarkRes.css'

import ProfileSider from '../../components/Profile/ProfileSider'
import ProfileBookMarkContainer from '../../components/Profile/ProfileBMContainer'
export default function ProfileBookmarkPage() {
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
            <div className='profilePageItems'>
                <ProfileSider type="bk"/>
                <ProfileBookMarkContainer />
            </div>

    </div>
  )
}
