import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HappenTopic({ img, date, desc, id, check, slug }) {

  return (
    <div className="happen-topic">

      <div className='happen-rel'>
        {
          check && <p className='happen-happen-p-abs'>حدث في مثل هذا اليوم</p>
        }
      </div>
      <Link to={`/happen/${slug}`}><img src={img} alt="" /></Link>
      <div className="happen-bottom-topic">
        <Link to={`/happen/${slug}`}><p className='happen-bottom-topic-date'>{date}</p></Link>
        <Link to={`/happen/${slug}`}><p className='happen-bottom-topic-info' dangerouslySetInnerHTML={{ __html: desc }}></p></Link>
        <div className="happen-read-arrow">
          <img src="./assets/redarrow.png" alt="" />
          <Link to={`/happen/${slug}`} className='happen-bottom-read'>اقرأ المزيد</Link>
        </div>
      </div>
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
