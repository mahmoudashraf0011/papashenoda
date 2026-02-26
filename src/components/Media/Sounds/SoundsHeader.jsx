import React from 'react'
import './SoundsHeader.css'
export default function SoundsHeader({title}) {
  return (
    <div className='soundsHeader'>
            <h3 className='soundsHeaderTitle'>{title}</h3>
    </div>
  )
}
