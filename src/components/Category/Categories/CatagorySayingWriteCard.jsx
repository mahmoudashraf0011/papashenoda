import React from 'react'

export default function CatagorySayingWriteCard({name,cate,desc}) {
  return (
    <div className='catagorySayingWriteCard'>
        <div className='SayingWriteCardContent'>
            <img className='signQuote saywImg' src='/assets/media/writings/sayings/q1.png' alt='img'/>
            <p className='sayingWriteCardDesc' dangerouslySetInnerHTML={{__html:desc}}></p>
            <div className='sayingWriteCardSign'>
                
                <span className='sayingWriteCardCategory'>{cate}</span>
                <h3 className='sayingWriteCardSignName'> {name} </h3>
            </div>
        </div>
    </div>
  )
}
