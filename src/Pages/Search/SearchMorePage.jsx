import React, { useEffect } from 'react'
import './SearchMorePage.css'
import SearchMoreContainer from '../../components/Search/SearchMoreContainer'
import SearchMoreHook from '../../Logic/Search/SearchMoreHook'
import { useParams } from 'react-router-dom';
import SearchFilter from '../../components/Search/SearchFilter';
export default function SearchMorePage() {

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
    <div className='searchMorePage'>

       <SearchMoreContainer/>
    </div>
  )
}
