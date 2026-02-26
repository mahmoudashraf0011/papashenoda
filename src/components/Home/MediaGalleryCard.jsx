import React from 'react'
import { Link } from 'react-router-dom'

export default function MediaGalleryCard({img,cate,count,desc,cardIcon,src}) {
  return (
    <div className='mediaGalleryCard'>
        <Link to={src} style={{ cursor:"pointer" }}>
          <div className='mediaGalleryCardImg'>
              <img src={img} alt='gallery'/>
          </div>
        </Link>
        <div className='mediaGalleryCardContent'>
            <div className='mediaGalleryCardUp'>
                <span className='mediaGalleryCardCount'>({count})</span>
                <Link  to={src} style={{ cursor:"pointer" }}
                
                ><h4 className='mediaGalleryCardCategory'>{cate}</h4>
                </Link> 
            </div>
            <Link to={src} style={{ cursor:"pointer" }}><p className='mediaGalleryCardDesc'>{desc}</p></Link>
            <Link className='mediaGalleryCardBtn' to={src}>المزيد</Link>
            <div className='clear' style={{clear:"both"}}></div>
        </div>
        <div className='IconContainer'>
           <img className='mediaGalleryCardIcon' alt='cardIcon' src={cardIcon}/>
        </div>

    </div>
  )
}
