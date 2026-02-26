import React from 'react'
import './VisitBG.css'
import './Responsive/HomeRes.css'
import { useNavigate } from 'react-router-dom'

export default function VisitBG() {
  return (
    <div className='visitBG'>
      <div className='visitBGItems'>
        <div className='visitBGleftImg'>
          <img src='/assets/visit/photos.png' />
        </div>
        <div className='visitBGDesc'>
          <p className='visitBGDescContent'>يمكنك زيارة الموقع الرسمي  لأكاديمية البابا شنوده الثالث للعلوم اللاهوتية والكنسية</p>
          <button
              onClick={() => window.open("https://popeshenoudaacademy.com/", "_blank")}
              className="visitBGSubtractContentBtnRes"
              >
              زيارة الموقع
            </button>
        </div>
        <div className='visitBGRightImg'>
          <img src='/assets/visit/logo2.png' />
        </div>

      </div>
      <div className='visitBGItemsRes' style={{display:"none"}}>
      <div className='visitBGleftImgRes'>
          <img src='/assets/visit/photos.png' />
        </div>
      <div className='visitBGDesc'>
          <p className='visitBGDescContent'>يمكنك زيارة الموقع الرسمي  لأكاديمية البابا شنوده الثالث للعلوم اللاهوتية والكنسية</p>
          <button
              onClick={() => window.open("https://popeshenoudaacademy.com/", "_blank")}
              className="visitBGSubtractContentBtnRes"
              >
              زيارة الموقع
            </button>
        </div>
        


        {/* <div className='visitBGRightImgRes'>
          <img src='/assets/visit/logo2.png' />
        </div> */}

      </div>
    </div>
  )
}
{/* <button
onClick={() => window.location.href = "https://popeshenoudaacademy.com/"}
className="visitBGSubtractContentBtn"
> */}