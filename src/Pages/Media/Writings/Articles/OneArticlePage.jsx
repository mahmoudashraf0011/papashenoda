import React, { useEffect } from 'react'
import './OneArticlePage.css'
import OneArticleContainer from '../../../../components/Media/Writings/Articles/OneArticleContainer'
import ArticlesFilter from '../../../../components/Media/Writings/Articles/ArticlesFilter'
export default function OneArticlePage() {
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
    <div className='oneArticlePage'>
      <OneArticleContainer />
    </div>
  )
}
