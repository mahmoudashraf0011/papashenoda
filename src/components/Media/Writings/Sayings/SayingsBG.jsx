import React, { useEffect, useState } from 'react'
import './SayingsBG.css'

export default function SayingsBG() {
  return (
    <>
    <div className='SayingsBG'>
        <h2 className='SayingsBGTitle'>أقوال قداسة البابا شنوده الثالث  </h2>
    </div>
    <div className='SayingsBGRes' style={{display:"none"}}>
       <div className="bgRes" > 
            <img src='/assets/sayingBg.png' alt='sayingsImg' className='sayingsIMGBg'/>
        </div>
    </div>
    </>

  )
}

