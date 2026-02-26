import React, { useEffect } from 'react'
import './WritingsPage.css'
import WritingsBG from '../../../components/Media/Writings/WritingsBG'
import WritingsContainer from '../../../components/Media/Writings/WritingsContainer'
import MediaHeader from '../../../components/Media/MediaHeader'
import { Link } from 'react-router-dom'
export default function WritingsPage() {
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
    <div className='writingsPage'>
      <div className='breadCrumbContainer' style={{ marginBottom: "0" }}>
        <div className='Container'>
          <ul className="breadCrumb" >
            <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
            <li><Link to={`/`}>الرئيسية</Link></li>


          </ul>
        </div>
      </div>
      <WritingsBG />
      <div className='Container'>
        <MediaHeader title="كتابات" />
      </div>
      <WritingsContainer />
    </div>
  )
}
