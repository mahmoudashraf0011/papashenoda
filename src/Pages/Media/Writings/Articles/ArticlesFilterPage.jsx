import React, { useEffect } from 'react'
import './ArticlesFilterPage.css'
import ArticlesFilterContainer from '../../../../components/Media/Writings/Articles/ArticleFilter/ArticlesFilterContainer'
import ArticlesFilter from '../../../../components/Media/Writings/Articles/ArticlesFilter'
import ArticlesNewsFilter from '../../../../components/Media/Writings/Articles/ArticleFilter/ArticlesNewsFilter'
import ArticlesForOneHook from '../../../../Logic/Media/Writings/Articles/ArticlesForOneHook'
import { useParams } from 'react-router-dom'
export default function ArticlesFilterPage() {
  const {newspaper}=useParams();
  const [articlesForOneData,pageCount,filterGroup,attrGroup,handleChangePage,getData]=ArticlesForOneHook(newspaper);
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
    <div className='articlesFilterPage'>
      {/* <div className='Container'>
      <ArticlesNewsFilter cates={filterGroup} attrs={attrGroup} />
      </div> */}
        <ArticlesFilterContainer />
    </div>
  )
}
