import { faAnglesLeft,faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({date,title,desc,img,id,check}) {
  return (
    <div className='eventsItem' style={{ position:"relative" }}>
        <div className='eventContent'>
          <Link to={`happen/${id}`} ><li className='eventContentDate'><img src='/assets/clcok.png' alt='clcok' className='clock'/> {date}</li></Link>
          <Link to={`happen/${id}`} ><h4 className='eventContentTitle'>{title}</h4></Link>
          <Link to={`happen/${id}`} ><p className='eventContentDesc' dangerouslySetInnerHTML={{__html:desc}}></p></Link>
          <Link to={`happen/${id}`} className='eventReadMore'> أكمل القراءة<FontAwesomeIcon icon={faAnglesLeft} className='evenIcon'/></Link>
        </div>
        <Link to={`happen/${id}`} >
          <div className='eventsItemImg'>
              <img src={img}/>
          </div>
        </Link> 

        {
        check?
          <a
          href={img}
          download
          className="download-btn"
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        >
          ⬇ تحميل
        </a>
        :
        ""

      }
   
  </div>
  )
}
