import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';
import HappenHook from '../../Logic/Media/Writings/Happen/HappenHook';
export default function HappenSwiper({happenData}) {
  return (
    <div className="happen-swiper-relative" >
                    <Swiper

                        spaceBetween={50}
                        slidesPerView={1}
                        navigation={{
                            nextEl: ".happen-back",
                            prevEl: ".happen-front",
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                        }}
                        modules={[Navigation, Autoplay, Pagination]}
                        speed={2000}
                    >
                        {
                            happenData[0]?happenData[0].map((item)=>{
                                return(
                                    <SwiperSlide >
                                        <div className="happen-swiper">
                                            <img src={item.sharepoint_image?item.image:"/assets/default/happen/outSide.png"} alt="" />
                                            <div className="happen-happen-ps">
                                                <p className='happen-happen-p'>حدث في مثل هذا اليوم</p>
                                                <p className='happen-happen-p2' dangerouslySetInnerHTML={{__html:item.day_happened.event}}></p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            }):""
                        }


                        <div className="swiper-pagination"></div>


                        <div className="happen-back" >
                            <img src="./assets/happen-left.png" alt="" className='swiper-back' />

                        </div>
                        <div className="happen-front" >
                            <img src="./assets/happen-right.png" alt="" className='swiper-front' />

                        </div>

                    </Swiper>
                </div>
  )
}
