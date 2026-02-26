import React, { useEffect } from 'react'
import './DocsFilterPage.css'
import DocsFilterContainer from '../../../../components/Media/Writings/Docs/DocsFilter/DocsFilterContainer'
import DocsFilter from '../../../../components/Media/Writings/Docs/DocsFilter'
export default function DocsFilterPage() {
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
    <div className='docsFilterPage'>
            <DocsFilterContainer />
    </div>
  )
}
