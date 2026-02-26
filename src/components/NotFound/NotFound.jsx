import React from 'react'
import './NotFound.scss'
import './NotFound-res.scss'

import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className='notfound'>
      <div className="notfound-wrapper">

        <p className='notfound-noresult'>لا يوجد نتائج بحث</p>
        <p className='notfound-return'> العوده للصفحة <Link to='/' className='notfound-main' style={{cursor:"pointer"}}> الرئيسية</Link></p>
        <img className='notfound-img' src="/assets/notfound.png" alt="" />
      </div>
    </div>
  )
}
