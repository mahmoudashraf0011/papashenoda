import React from 'react'
import './SectionHeader.css'
export default function SectionHeader({title,subtitle}) {
  return (
    <h2 className='sectionHeaderTitle'>{title} <span>{subtitle}</span></h2>
      )
}
