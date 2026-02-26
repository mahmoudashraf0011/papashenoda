import React, { useEffect } from 'react'
import './Aboutpap.scss'
import './Aboutpapa-res.scss'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid, EffectFlip, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
export default function Aboutpapa() {
    window.addEventListener('hashchange', function (e) {
        e.preventDefault();
    });
    
    window.onload = function () {
        window.history.replaceState(null, null, ' '); // Clear hash if any
    };
    useEffect(() => {
      window.scrollTo(0, 0); // Ensure scroll starts at the top
    }, []);
    return (
        <div className='aboutpapa'>
            <div className="aboutpapa-wrapper">
            <p className='aboutpapa-about-res'>سلسلة كتب قصة حياة البابا شنوده </p>
                <div className="aboutpapa-left-right">
                    <div className="aboutpapa-swiper-relative" >
                        <Swiper

                            spaceBetween={0}
                            slidesPerView={1}
                            navigation={{
                                nextEl: ".aboutpapa-back",
                                prevEl: ".aboutpapa-front",
                            }}
                            pagination={{
                                clickable: true,
                                el: '.swiper-pagination',
                                renderBullet: (index, className) => {
                                    return `<span class="${className}">${index + 1}</span>`;
                                },
                            }}
                            modules={[Navigation, Autoplay, Pagination, EffectFade]}
                            speed={2000}
                            effect="fade"
                        >

                            <SwiperSlide >
                                <div className="aboutpapa-swipers-mains">
                                
                                    <div className="aboutpapa-swipers-mainn">
                                        
                                        <div className="aboutpapa-swiper-main2">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-small'>
                                                <img src="./assets/4.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/3.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/2.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-big'>

                                                <img src="./assets/1.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="aboutpapa-rightsection">
                                        <div className="aboutpapa-date">(١٩٥٢ - ١٩٧١)</div>
                                        <p className='aboutpapa-about'>سلسلة كتب قصة حياة البابا شنوده </p>
                                        <div className="aboutpapa-about-ps2">
                                            <p>.<span>الجزء الأول:</span> وُلد نظير جيد روفائيل جاد في 3 
                                            غسطس 1923 بقرية سلام بأسيوط. تربى على
                                            المبادئ المسيحية الأرثوذكسية، وبدأ خدمته في 
                                            مدارس التربية الكنسية وهو في سن مبكرة، وكتب 
                                            .ولى أعماله الأدبية في سن 17 عامًا</p>
                                        </div>
                                        <button className='aboutpapa-more'>عرض المزيد</button>
                                    </div>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide >
                                <div className="aboutpapa-swipers-mains">
                                    <div className="aboutpapa-swipers-mainn">
                                        <div className="aboutpapa-swiper-main2">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-small'>
                                                <img src="./assets/5-2.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/4-2.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/3-2.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-big'>

                                                <img src="./assets/2-2.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="aboutpapa-rightsection">
                                        <div className="aboutpapa-date">(١٩٥٢ - ١٩٧١)</div>
                                        <p className='aboutpapa-about'>سلسلة كتب قصة حياة البابا شنوده </p>
                                        <div className="aboutpapa-about-ps2">
                                            <p>.<span>الجزء الثاني:</span> وُلد نظير جيد روفائيل جاد في 3 
                                            غسطس 1923 بقرية سلام بأسيوط. تربى على
                                            المبادئ المسيحية الأرثوذكسية، وبدأ خدمته في 
                                            مدارس التربية الكنسية وهو في سن مبكرة، وكتب 
                                            .ولى أعماله الأدبية في سن 17 عامًا</p>
                                        </div>
                                        <button className='aboutpapa-more'>عرض المزيد</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide >
                                <div className="aboutpapa-swipers-mains">
                                    <div className="aboutpapa-swipers-mainn">
                                        <div className="aboutpapa-swiper-main2">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-small'>
                                                <img src="./assets/1-3.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/5-3.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/4-3.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-big'>

                                                <img src="./assets/3-3.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="aboutpapa-rightsection">
                                        <div className="aboutpapa-date">(١٩٥٢ - ١٩٧١)</div>
                                        <p className='aboutpapa-about'>سلسلة كتب قصة حياة البابا شنوده </p>
                                        <div className="aboutpapa-about-ps2">
                                            <p>.<span>الجزء الثالت:</span> وُلد نظير جيد روفائيل جاد في 3 
                                            غسطس 1923 بقرية سلام بأسيوط. تربى على
                                            المبادئ المسيحية الأرثوذكسية، وبدأ خدمته في 
                                            مدارس التربية الكنسية وهو في سن مبكرة، وكتب 
                                            .ولى أعماله الأدبية في سن 17 عامًا</p>
                                        </div>
                                        <button className='aboutpapa-more'>عرض المزيد</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide >
                                <div className="aboutpapa-swipers-mains">
                                    <div className="aboutpapa-swipers-mainn">
                                        <div className="aboutpapa-swiper-main2">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-small'>
                                                <img src="./assets/2-4.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/1-4.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/5-4.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-big'>

                                                <img src="./assets/4-4.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="aboutpapa-rightsection">
                                        <div className="aboutpapa-date">(١٩٥٢ - ١٩٧١)</div>
                                        <p className='aboutpapa-about'>سلسلة كتب قصة حياة البابا شنوده </p>
                                        <div className="aboutpapa-about-ps2">
                                            <p>.<span>الجزء الرابع:</span> وُلد نظير جيد روفائيل جاد في 3 
                                            غسطس 1923 بقرية سلام بأسيوط. تربى على
                                            المبادئ المسيحية الأرثوذكسية، وبدأ خدمته في 
                                            مدارس التربية الكنسية وهو في سن مبكرة، وكتب 
                                            .ولى أعماله الأدبية في سن 17 عامًا</p>
                                        </div>
                                        <button className='aboutpapa-more'>عرض المزيد</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide >
                                <div className="aboutpapa-swipers-mains">
                                    <div className="aboutpapa-swipers-mainn">


                                        <div className="aboutpapa-swiper-main2">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-small'>
                                                <img src="./assets/3-5.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/2-5.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="aboutpapa-swiper-main">
                                            <div className="aboutpapa-swiper">

                                                <img src="./assets/1-5.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="aboutpapa-swiper" id='aboutpapa-swiper-big'>

                                                <img src="./assets/5-5.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="aboutpapa-rightsection">
                                        <div className="aboutpapa-date">(١٩٥٢ - ١٩٧١)</div>
                                        <p className='aboutpapa-about'>سلسلة كتب قصة حياة البابا شنوده </p>
                                        <div className="aboutpapa-about-ps2">
                                            <p>.<span>الجزء الخامس:</span> وُلد نظير جيد روفائيل جاد في 3 
                                            غسطس 1923 بقرية سلام بأسيوط. تربى على
                                            المبادئ المسيحية الأرثوذكسية، وبدأ خدمته في 
                                            مدارس التربية الكنسية وهو في سن مبكرة، وكتب 
                                            .ولى أعماله الأدبية في سن 17 عامًا</p>
                                        </div>
                                        <button className='aboutpapa-more'>عرض المزيد</button>
                                    </div>


                                </div>

                            </SwiperSlide>




                        </Swiper>
                    </div>

                    <div className="aboutpapa-right">
                    <div className="aboutpapa-date-res">(١٩٥٢ - ١٩٧١)</div>
                   
                    <div className="swiper-pagination"></div>

                        
                    </div>
                </div>
                <div className="aboutpapa-btns">

                    <div className="aboutpapa-front" >
                        <img src="./assets/arrow-prev.png" alt="" className='swiper-front' />

                    </div>
                    <div className="aboutpapa-back" >
                        <img src="./assets/arrow-next.png" alt="" className='swiper-back' />

                    </div>
                </div>
            </div>
        </div>
    )
}
