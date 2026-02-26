import React from 'react'
import SectionHeader from '../Utility/SectionHeader'
import EventCard from './EventCard'
import './Events.css'
import './Responsive/HomeRes.css'

import HomeHook from '../../Logic/Home/HomeHook';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';

export default function Events() {
  const navigate=useNavigate()
  const [mediaData,meditationsData,sayingsData,eventsData]=HomeHook();
  const today = new Date();
  const isoString = today.toISOString();
  const year = parseInt(isoString.substring(0, 4)); 
  const monthISO = parseInt(isoString.substring(5, 7)); 
  const dayOfMonth = parseInt(isoString.substring(8, 10));
  const handleMoreHappen=()=>{
    // const day = {"format":new Date(isoString),"value":new Date(isoString).getDate()};
    // localStorage.setItem("happenDay",JSON.stringify(day))
    // const month ={"format":new Date(isoString),"value":new Date(isoString).getMonth() + 1};
    // localStorage.setItem("happenMonth",JSON.stringify(month))
    // const year = {"format":new Date(isoString),"value":new Date(isoString).getFullYear()}; 
    // localStorage.setItem("happenYear",JSON.stringify(year))
    localStorage.removeItem("happenDay");
    localStorage.removeItem("happenMonth");
    localStorage.removeItem("happenYear");
    navigate('/happen')
  }
  return (
    <div className='events'>
      {
         eventsData[0]&&eventsData[0].length > 0&&(
          <>
              <SectionHeader title="حدث" subtitle="في مثل هذا اليوم"/>
              <div className='Container'>
                <div className='eventsItems'>
                  
                    {
                      eventsData[0]?eventsData[0].map((item)=>{
                        return(
                          <EventCard date={item.day_happened.date} title={item.name} desc={item.day_happened.event} img={item.sharepoint_image?item.image:"/assets/default/happen/outSide.png"}   key={item.id} id={item.id} check={item.sharepoint_image}/>
                        )
                      }):""
                    }
                      
        
                </div>
              </div>
        
              <div className='eventsItemsRes' style={{display:"none"}} dir="rtl">
                <Swiper
        
                    spaceBetween={20}
                    slidesPerView={1.3}
        
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                    }}
                    modules={[ Autoplay, Pagination]}
                    speed={2000}
                    >
                    {
                        eventsData[0]?eventsData[0].map((item)=>{
                            return(
                                <SwiperSlide >
                                    <EventCard date={item.day_happened.date} title={item.name} desc={item.day_happened.event} img={item.sharepoint_image?item.image:"/assets/default/happen/outSide.png"}   key={item.id} id={item.id}/>
        
                                </SwiperSlide>
                            )
                        }):""
                    }
        
        
                <div className="swiper-pagination"></div>
        
                  </Swiper>
                  <button className='more_btn_res_event more' onClick={handleMoreHappen}>المزيد</button>
        
              </div>
              <div style={{clear:"both"}}></div>
              <button className='more_btn' onClick={handleMoreHappen}>المزيد</button>
          </>
      
         )
      }

    </div>
  )
}
