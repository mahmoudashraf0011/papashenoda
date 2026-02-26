import React from 'react'

export default function VisitsSwiperInfo2(src, title) {
    return (
        <div className="visits-swiper">
            <div className="visits-swiper-left">
                <img src={src} alt="" />
            </div>
            <div className="visits-swiper-line"></div>
            <div className="visits-swiper-right">
                <p className='visits-papa'>{title}</p>
                <p className='visits-visits'>زيارة قداسة البابا شنودة الثالث الى دير الانبا شنودة سوهاج.</p>
            </div>
        </div>
    )
}
