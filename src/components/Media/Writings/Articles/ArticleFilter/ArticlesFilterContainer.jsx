

import React, { useEffect } from 'react'
import MediaHeader from '../../../MediaHeader'
import './ArticlesFilterContainer.css'
import { Link, useParams } from 'react-router-dom'
import ArticlesCard from '../ArticlesCard'
import ArticlesForOneHook from '../../../../../Logic/Media/Writings/Articles/ArticlesForOneHook'
import Paginate from '../../../../Utility/Paginate'
import Spinner from '../../../../Utility/Spinner'
import '../../../../Utility/BreadCrumb.css'
import SkeletonArticleCard from './SkeletonArticleCard '
export default function ArticlesFilterContainer() {
  const { newspaper } = useParams();
  const [articlesForOneData, pageCount, filterGroup, attrGroup, handleChangePage, getData, notFound, activePage] = ArticlesForOneHook(newspaper);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className='articlesFilterContainer'>
      <>
        <div className='breadCrumbContainer'  >
          <div className='Container'>
            <ul className="breadCrumb" >
              <li><Link >{newspaper}</Link></li>
              <li><Link to={`/media/article`}>مقالات</Link></li>
              <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
              <li><Link to={`/`}>الرئيسية</Link></li>
            </ul>
          </div>
        </div>
        <div className='Container'>

          <MediaHeader title={newspaper} />

          <div className='articleItems'>

            {
              articlesForOneData && Array.isArray(articlesForOneData[0]) ? (
                articlesForOneData[0].map(item => (
                  <ArticlesCard
                    img={item.sharepoint_image ? item.image : "/assets/default/articles/Articles - inside.png"} title={item.name}
                    desc={item.description}
                    src={`/articles/${item.slug}`}
                    key={item.id}
                    check={item.sharepoint_image}

                  />
                ))
              ) : articlesForOneData[0] ? (
                <ArticlesCard
                  img={articlesForOneData[0].sharepoint_image ? articlesForOneData[0].image : "/assets/default/articles/Articles - inside.png"}
                  title={articlesForOneData[0].name}
                  desc={articlesForOneData[0].description}
                  src={`/articles/${articlesForOneData[0].media_slug}`}
                  key={articlesForOneData[0].id}
                  check={articlesForOneData[0].sharepoint_image}
                />
              ) : (
                /* <Spinner /> */
                <>
                  <SkeletonArticleCard />
                  <SkeletonArticleCard />
                  <SkeletonArticleCard />
                  <SkeletonArticleCard />
                </>
              )
            }

          </div>
        </div>


      </>

      {
        pageCount > 0 && <Paginate pageCount={pageCount} onPress={handleChangePage} activePage={activePage} />
      }
      <p className='noResult' ref={notFound} style={{ display: "none" }}>لا يوجد نتائج</p>

    </div>

  )
}
