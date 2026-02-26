import React from 'react'
import './CategoryHeader.css'
import { Link } from 'react-router-dom'
export default function CategoryHeader({cate,count,src}) {
  function convertArabicToWesternDigits(input) {
    return String(input).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  }
  let length = parseInt(convertArabicToWesternDigits(count));

  return (
    <div className='categoryHeader'>
        <div className='categoryRight'>
          <span className='categoryHeaderCounts'>({count})</span>
          <h2 className='categoryHeaderTitle'>{cate}</h2>
        </div>
        {
          length > 3 ? 
          <Link to={src} className='media_more_btn_res' style={{display:"none"}}  target='_blank'>عرض المزيد</Link>

          :""
        }

    </div>
  )
}
