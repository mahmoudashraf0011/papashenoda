import React from 'react'
import './WritingsBG.css'
import './../Responsive/WritingsContainerRes.css'
export default function WritingsBG() {
  return (
    <div className='writingsBG'>
        <div className='handBG'>
            <img src='/assets/media/writings/bgHand.png' alt='hand' className='handBG'/>
        </div>
        <div className='bookBG'>
            <img src='/assets/media/writings/bgBook.png' alt='book' className='bookBG'/>
        </div>
        <h1 className='writingsBGTitle'> مقالات و كتابات أخري </h1>
    </div>
  )
}
