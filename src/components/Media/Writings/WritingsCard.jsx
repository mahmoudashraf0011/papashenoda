import React from 'react'
import { Link } from 'react-router-dom'

export default function WritingsCard({img,title,desc,src}) {
  return (
    <div className='writingsCard'>
        <Link to={src}>
            <div className='writingsCardContent'>
                <h2 className='writingsCardTitle'>{title}</h2>
                <p className='writingsCardDesc'>{desc}</p>    
            </div>
        </Link>
        <div className='writingsCardImg'>
          
             <Link to={src} > <img src={img}/></Link>
        </div>
  
    </div>
  )
}
