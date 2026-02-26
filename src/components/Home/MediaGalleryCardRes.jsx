
import React from 'react'
import { Link } from 'react-router-dom'

export default function MediaGalleryCardRes({img,cate,count,desc,cardIcon,src}) {
  return (
    <Link to={src}>
    <div className='mediaGalleryCard' style={{cursor:"pointer"}}>
        <div className='mediaGalleryCardImg'>
            <img src={img} alt='gallery'/>
        </div>
        <div className='mediaGalleryCardUpRes'>
            <span className='mediaGalleryCardCount'>({count})</span>
            <div className='mediaGalleryCardUpResCate'>
                <div className='IconContainerRes'>
                    <img className='mediaGalleryCardIcon' alt='cardIcon' src={cardIcon}/>
                </div>
                 <h4 className='mediaGalleryCardCategory'>{cate}</h4>
            </div>
           

        </div>


    </div>
    </Link>

//      <div className='mediaGalleryCardUp'>
//      <span className='mediaGalleryCardCount'>({count})</span>
//      <h4 className='mediaGalleryCardCategory'>{cate}</h4>
//      </div>
  )
}
