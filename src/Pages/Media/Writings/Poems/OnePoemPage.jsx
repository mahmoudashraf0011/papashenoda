import React, { useEffect } from 'react'
import './OnePoemPage.css'
import OnePoemContainer from '../../../../components/Media/Writings/Poems/OnePoemContainer'
import PoemsFilter from '../../../../components/Media/Writings/Poems/PoemsFilter'
import { Link, useParams } from 'react-router-dom';
export default function OnePoemPage() {
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
const { id } = useParams();

  return (
    <div className='onePoemPage'>

            <OnePoemContainer />
    </div>
  )
}
