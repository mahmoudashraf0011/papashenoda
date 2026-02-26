import React, { useEffect, useState } from 'react'


import './PoemsPage.css'
import PoemsContainer from '../../../../components/Media/Writings/Poems/PoemsContainer'
import PoemsFilter from '../../../../components/Media/Writings/Poems/PoemsFilter'
import PoemsHook from '../../../../Logic/Media/Writings/Poems/PoemsHook';
import { Link } from 'react-router-dom';

export default function PoemsPage() {
  const [poemsData,pageCount,filterGroup,attrGroup,handleChangePage,getData,notFound]=PoemsHook();
console.log(filterGroup);
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
    <div className='poemsPage'>
           <div className='breadCrumbContainer'  >
            <div className='Container'>
              <ul className="breadCrumb" >
                      <li><Link to={`/media/poems`}>قصائد</Link></li>
                      <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
                      <li><Link to={`/`}>الرئيسية</Link></li>


              </ul>
            </div>
          </div>
      <div className='Container'>
      <PoemsFilter cates={filterGroup} attrs={attrGroup} />
      </div>
        <PoemsContainer />

    </div>
  )
}
