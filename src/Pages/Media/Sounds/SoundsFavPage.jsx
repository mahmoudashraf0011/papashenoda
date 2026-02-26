import React, { useEffect } from 'react'
import './SoundsFavPage.css'
import SoundsSidebarContainer from '../../../components/Media/Sounds/SoundsSidebarContainer'
import SoundsFavContainer from '../../../components/Media/Sounds/SoundsFavContainer'

export default function SoundsFavPage() {
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
    const onShowWords=(item)=>{
        item.current.style.display="block"
    }
  return (
    <div className='soundsFavPage soundsPage'>
            <div className='soundsItems'>
                <SoundsFavContainer/>
                <SoundsSidebarContainer />
            </div>
            <div style={{clear:"both"}}></div>
    </div>
  )
}
