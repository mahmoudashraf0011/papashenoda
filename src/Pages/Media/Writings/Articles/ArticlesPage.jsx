import React, { useEffect, useState } from 'react'
import './ArticlesPage.css'

import ArticlesFilter from '../../../../components/Media/Writings/Articles/ArticlesFilter'
import ArticlesContainer from '../../../../components/Media/Writings/Articles/ArticlesContainer'
import ArticlesHook from '../../../../Logic/Media/Writings/Articles/ArticlesHook'
import { Link } from 'react-router-dom'
import SkeletonArticlesCard from './SkeletonArticlesCard'
import SkeletonArticlesCard1 from './SkeletonArticlesCard1' // mobile version

export default function ArticlesPage() {
  const [articlesData, filterGroup, attrGroup, notFound, getData] = ArticlesHook();
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (articlesData && Array.isArray(articlesData[0])) {
      setLoading(false);
    }
  }, [articlesData]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='articlesPage'>
      <div className='breadCrumbContainer'>
        <div className='Container'>
          <ul className="breadCrumb">
            <li><Link to={`/media/article`}>مقالات</Link></li>
            <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
            <li><Link to={`/`}>الرئيسية</Link></li>
          </ul>
        </div>
      </div>

      <div className='Container'>
        <ArticlesFilter cates={filterGroup} attrs={attrGroup} />
      </div>

      <div className="Container">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, idx) =>
              isMobile ? <SkeletonArticlesCard1 key={idx} /> : <SkeletonArticlesCard key={idx} />
            )}
          </>
        ) : (
          articlesData[0].map((item) => (
            <ArticlesContainer header={item.title} data={item.articles} key={item.id} />
          ))
        )}
      </div>

      <p className='noResult' ref={notFound} style={{ display: "none" }}>لا يوجد نتائج</p>
    </div>
  )
}
