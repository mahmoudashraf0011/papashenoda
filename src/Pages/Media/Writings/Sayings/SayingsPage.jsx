import React, { useEffect } from 'react'
import './SayingsPage.css'
import SayingsBG from '../../../../components/Media/Writings/Sayings/SayingsBG'
import SayingsWriteContainer from '../../../../components/Media/Writings/Sayings/SayingsWriteContainer'
import SayingsPhotoContainer from '../../../../components/Media/Writings/Sayings/SayingsPhotoContainer'
import SaysFilter from '../../../../components/Media/Writings/Sayings/SaysFilter'

export default function SayingsPage() {
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
    <div className='sayingsPage'>
            <SayingsBG />
            <SayingsWriteContainer />
            <SayingsPhotoContainer />
    </div>
  )
}
