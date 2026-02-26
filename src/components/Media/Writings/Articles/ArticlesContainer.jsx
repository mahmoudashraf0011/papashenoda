import React from 'react'
import './ArticleContainer.css'
import './../../Responsive/ArticlesRes.css'
import ArticlesCard from './ArticlesCard'
import MediaHeader from '../../MediaHeader'
import ArticlesForOneHook from '../../../../Logic/Media/Writings/Articles/ArticlesForOneHook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
import "../../../Utility/BreadCrumb.css"

export default function ArticlesContainer({ header, data }) {
  function isImageType(url) {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
  }
  return (

    <div className='articleContainer'>
      <div className='Container'>

        <MediaHeader title={header} src={`/articals/${header}`} />
        <div className='articleItems'>
          {
            data ? data.map((item) => {
              return (
                <ArticlesCard img={item.sharepoint_image ? item.image : "/assets/default/articles/Articles - inside.png"} title={item.name} desc={item.artical} src={`/articles/${item.media_slug}`} key={item.id} check={item.sharepoint_image}/>
              )
            }) : ""
          }
        </div>
      </div>

    </div>
  )
}
