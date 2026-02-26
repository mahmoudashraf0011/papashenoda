import React from 'react'
import './QuestionsBG.css'
import './../../Responsive/QuestionsRes.css'
export default function QuestionsBG() {
  return (
    <>
    <div className='questionsBG'>
        <div className='q1'>
            <img src='/assets/media/writings/questions/1.png' alt='questionIMG' className='q1'/>
        </div>
         <div className='q2'>
            <img src='/assets/media/writings/questions/2.png' alt='questionIMG' className='q2'/>
        </div>

        <div className='q3'>
            <img src='/assets/media/writings/questions/3.png' alt='questionIMG' className='q3'/>
        </div>

        <div className='q4'>
            <img src='/assets/media/writings/questions/4.png' alt='questionIMG' className='q4'/>
        </div>
        <div className='q5'>
            <img src='/assets/media/writings/questions/5.png' alt='questionIMG' className='q5'/>
        </div> 
        <h1 className='questionsBGTitle'>سؤال و جواب</h1>
    </div>
    <div className='questionsBGRes' style={{display:"none"}}>
        <div className="bgRes">
            <img src='/assets/quesBg.png' alt='questionIMG' className='questionIMGBg'/>
        </div>
    </div>
    </>

  )
}
