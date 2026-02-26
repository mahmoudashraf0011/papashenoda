import React from 'react'
import { Link } from 'react-router-dom'

export default function GalleryImg({src,info,children,slug,hero_image}) {
    
    return (
        
            children.length > 0?
            <Link 
            to="/displaygallery"
            state={{ extraContent: children, name:info,slug:slug,hero_image:hero_image}} 
            className="gallery-img-cont"
        >
                <img src={src} alt="gallery img" className='gallery-img' />
                <p className='gallery-img-p'>{info}</p>
            </Link>
            :
            <Link 
            to={`/gallerymedia/${slug}`}
            state={{ extraContent: children, name:info,slug:slug,hero_image:hero_image}} 
            className="gallery-img-cont"
        >
                <img src={src} alt="gallery img" className='gallery-img' />
                <p className='gallery-img-p'>{info}</p>
            </Link>
        
 
    )
}
