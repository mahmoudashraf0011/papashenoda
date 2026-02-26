import React from 'react'
import './MediaHeader.css'
import { Link } from 'react-router-dom'
export default function MediaHeader({title,src}) {
  return (
    <div className='mediaHeader'>
            <div className='headerContent'>
                <Link to={src} className='media_more_btn'>المزيد</Link>               
                 <Link to={src} className='media_more_btn_res' style={{display:"none"}}>عرض المزيد</Link>

                <h2 className='mediaHeaderTitle'>{title}</h2>
            </div>
    </div>
  )
}
