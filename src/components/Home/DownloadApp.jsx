import React from 'react'
import './DownloadApp.css'
import './Responsive/HomeRes.css'

export default function DownloadApp() {
  return (
    <div className='downloadApp'>
        <div className='Container'>
          <div className='downloadAppBg one'></div>
          <div className='downloadAppBg two'></div>
          <div className='downloadAppItems'>
              <div className='downloadAppImg'>
              <   img alt='downloadAppImg' src='./assets/Download/frame.png'/>
              </div>
              <div className='downloadAppContent'>
                  <h2 className='downloadAppTitle'>تحميل التطبيق</h2>
                  <p className='downloadAppDesc'>اكتشف تطبيق البابا شنوده الآن! استمتع بتجربة فريدة تجمع بين الإلهام الروحي والموارد الغنية التي تعزز علاقتك الروحية. مع محتوى متنوع يشمل الكتب، العظات، والترانيم، كل ذلك بين يديك بسهولة وسرعة. قم بتحميل التطبيق الآن واستمتع بإمكانية الوصول إلى تعاليم البابا شنوده في أي وقت ومن أي مكان.</p>
                  <div style={{clear:"both"}}></div>
                  <div className='downloadAppLinks'>
                      <a><img alt="barCode" src='./assets/Download/barCode.png'/></a>
                      <div className='downloadAppLinksLeft'>
                      <a ><img alt="appstore" src='./assets/Download/appStore.png'/></a>
                      <a><img alt="Googleplay" src='./assets/Download/googlePlay.png'/></a>
                      </div>
                  </div>
              </div>
          </div>
        </div>

 
    </div>
  )
}
