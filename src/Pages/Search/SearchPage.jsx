import React, { useEffect } from 'react'
import './SearchPage.css'
import '../../Pages/Search/Responsive/SearchResponsive.css'
import SearchContainer from '../../components/Search/SearchContainer'
import SearchHook from '../../Logic/Search/SearchHook';
import SearchFilter from '../../components/Search/SearchFilter';
import CategoryFilter from '../../components/Category/CategoryFilter';
export default function SearchPage() {
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
    <div className='searchPage'>
      <div className='Container'>
      </div>
        <SearchContainer />
    </div>
  )
}
