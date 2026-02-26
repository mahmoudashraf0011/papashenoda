import React, { useEffect } from 'react'
import './DocsPage.css'
import DocsContainer from '../../../../components/Media/Writings/Docs/DocsContainer'
import DocsFilter from '../../../../components/Media/Writings/Docs/DocsFilter'
import { Link } from 'react-router-dom';
export default function DocsPage() {
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
    <div className='docsPage'>
          <div className='breadCrumbContainer'  >
            <div className='Container'>
              <ul className="breadCrumb" >
                      <li><Link to={`/media/documents`}>وثائق بخط البابا</Link></li>
                      <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
                      <li><Link to={`/`}>الرئيسية</Link></li>
              </ul>
            </div>
          </div>
        <DocsContainer />
    </div>
  )
}
