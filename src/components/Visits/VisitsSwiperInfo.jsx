import React from 'react'

export default function VisitsSwiperInfo({src,title,info}) {
  return (
    <div className="visits-swiper">
    <div className="visits-swiper-left2">
        <img src={src} alt="" />
    </div>
    <div className="visits-swiper-line"></div>
    <div className="visits-swiper-right">
        <p className='visits-papa'>{title}</p>
        <p className='visits-visits'>ظل يمارس حياة الرهبنة القبطية بالرغم من مشاغلة كبابا للكنيسة القبطية فلم يفقد حياة الوحدة بالرغم من وجوده فى العالم فمنذ ترهبنة فى دير السريان فى 18 يوليو 1954 م كان ملتزما بقوانين الرهبنة وسيرتها العطرة , وعندما رسم أسقف للتعليم فى 30 سبتمبر 1962 م وحتى بعد أن أصبح بابا.
            ظل يمارس حياة الرهبنة القبطية بالرغم من مشاغلة كبابا للكنيسة القبطية فلم يفقد حياة الوحدة بالرغم من وجوده فى العالم فمنذ ترهبنة فى دير السريان فى 18 يوليو 1954 م كان ملتزما بقوانين الرهبنة وسيرتها العطرة , وعندما رسم أسقف للتعليم فى 30 سبتمبر 1962 م وحتى بعد أن أصبح بابا.</p>
    </div>
</div>
  )
}
