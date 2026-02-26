import React, { useContext, useEffect, useState } from 'react'
import OneBook2 from './OneBook2'
import axios from 'axios'
import { UserContext } from '../Context/UserContext'
import Paginate from '../Utility/Paginate';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/autoplay';
import SkeletonBookCard from './SkeletonBookCard';
export default function BooksSections({ searchInfo, searchPag, sendSearch, searchVar }) {
    const [books, setBooks] = useState(null);
    const [pag, setPag] = useState(null);

    const { baseURL } = useContext(UserContext);

    const [page, setPage] = useState(1);

    useEffect(() => {

        axios.get(`${baseURL}/getmedia/1?page=${page}&lang=ar`)
            .then((response) => {
                console.log(response.data.data);
                setBooks(response.data.data);
                setPag(response.data.pagination);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [page])

    useEffect(() => {
        if (searchInfo) {
            setBooks(searchInfo);
        }
        if (searchPag) {
            setPag(searchPag);
        }

    }, [searchInfo, searchPag]);

    const handlePageChange = (selectedPage) => {
        if (searchVar) {
            console.log(searchVar);
            console.log("zzzzzzzzz", searchVar, selectedPage,);

            axios.get(`${baseURL}/getmedia/1?page=${selectedPage}&search=${searchVar}&lang=ar`)
                .then((response) => {
                    console.log(response);
                    setBooks(response.data.data);
                    setPag(response.data.pagination);

                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            setPage(selectedPage);

        }
        window.history.replaceState(null, null, ' ')
        window.scrollTo(0, 0);
    };
    console.log("books", books);
    

    return (
        <div className="books-section-one">



            {/* {books && books.map((book, index) => (
                <>
                    <p className='books-about'>{book.value}</p>
                    <div key={`book-${index}`} className="books-section-one-books-1">

                        {book.media &&
                            Array.from({ length: Math.ceil(book.media.length / 3) }, (_, i) => (
                                <div key={`book-group-${i}`} className="books-section-one-books">

                                    {book.media.slice(i * 3, i * 3 + 3).map((subbook, subIndex) => (
                                        <OneBook2 key={subIndex} src={subbook.sharepoint_image ? subbook.image : "/assets/default/books/Book - inside.png"} info={subbook.name} book={subbook.url} book_id={subbook.id} slug={subbook.slug} />
                                    ))}

                                    <img className='books-head-stand2' src="/assets/books-5.png" alt="stand" />
                                </div>
                            ))
                        }




                    </div>

                    <div key={`book-${index}`} className="books-section-one-books-1-res">

                        {book.media &&
                            Array.from({ length: Math.ceil(book.media.length / 3) }, (_, i) => (
                                <div key={`book-group-${i}`} className="books-section-one-books" dir="ltr">

                                    <Swiper

                                        spaceBetween={0}
                                        slidesPerView={1}
                                        initialSlide={2}
                                        navigation={{
                                            nextEl: ".happen-front",
                                            prevEl: ".happen-back",
                                        }}
                                        pagination={{
                                            clickable: true,
                                            el: '.swiper-pagination',
                                        }}
                                        modules={[Navigation, Autoplay, Pagination]}
                                        speed={2000}
                                        breakpoints={{
                                            // When width is greater than 662px and less than 1050px
                                            662: {
                                                slidesPerView: 2, // Show 2 slides
                                            }
                                        }}
                                    >

                                        {book.media.slice(i * 3, i * 3 + 3).map((subbook, subIndex) => (
                                            <SwiperSlide >
                                                <OneBook2 key={subIndex} src={subbook.sharepoint_image ? subbook.image : "/assets/default/books/Book - inside.png"} info={subbook.name} book={subbook.url} book_id={subbook.id} slug={subbook.slug} />
                                            </SwiperSlide>
                                        ))}
                                        {
                                            book.media.length > 1 ?
                                                <>
                                                    <div className="happen-back" >
                                                        <img src="/assets/book-left-res.png" alt="" className='swiper-back' />

                                                    </div>
                                                    <div className="happen-front" >
                                                        <img src="/assets/book-right-res.png" alt="" className='swiper-front' />

                                                    </div>
                                                </>

                                                : ""
                                        }

                                    </Swiper >
                                    <img className='books-head-stand2' src="/assets/books-5.png" alt="stand" />
                                </div>
                            ))
                        }




                    </div >



                </>
            ))
            } */}

            {books ? (
                books.map((book, index) => (
                    <>
                        <p className="books-about">{book.value}</p>
                        <div key={`book-${index}`} className="books-section-one-books-1">
                            {book.media &&
                                Array.from({ length: Math.ceil(book.media.length / 3) }, (_, i) => (
                                    <div key={`book-group-${i}`} className="books-section-one-books">
                                        {book.media.slice(i * 3, i * 3 + 3).map((subbook, subIndex) => (
                                            <OneBook2
                                                key={subIndex}
                                                src={subbook.sharepoint_image ? subbook.image : '/assets/default/books/Book - inside.png'}
                                                info={subbook.name}
                                                book={subbook.url}
                                                book_id={subbook.id}
                                                slug={subbook.slug}
                                            />
                                        ))}
                                        <img className="books-head-stand2" src="/assets/books-5.png" alt="stand" />
                                    </div>
                                ))}
                        </div>
                        <div key={`book-${index}`} className="books-section-one-books-1-res">
                            {book.media &&
                                Array.from({ length: Math.ceil(book.media.length / 3) }, (_, i) => (
                                    <div key={`book-group-${i}`} className="books-section-one-books" dir="ltr">
                                        <Swiper
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            initialSlide={2}
                                            navigation={{
                                                nextEl: '.happen-front',
                                                prevEl: '.happen-back',
                                            }}
                                            pagination={{
                                                clickable: true,
                                                el: '.swiper-pagination',
                                            }}
                                            modules={[Navigation, Autoplay, Pagination]}
                                            speed={2000}
                                            breakpoints={{
                                                662: {
                                                    slidesPerView: 2,
                                                },
                                            }}
                                        >
                                            {book.media.slice(i * 3, i * 3 + 3).map((subbook, subIndex) => (
                                                <SwiperSlide key={subIndex}>
                                                    <OneBook2
                                                        key={subIndex}
                                                        src={subbook.sharepoint_image ? subbook.image : '/assets/default/books/Book - inside.png'}
                                                        info={subbook.name}
                                                        book={subbook.url}
                                                        book_id={subbook.id}
                                                        slug={subbook.slug}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                            {book.media.length > 1 ? (
                                                <>
                                                    <div className="happen-back">
                                                        <img src="/assets/book-left-res.png" alt="" className="swiper-back" />
                                                    </div>
                                                    <div className="happen-front">
                                                        <img src="/assets/book-right-res.png" alt="" className="swiper-front" />
                                                    </div>
                                                </>
                                            ) : (
                                                ''
                                            )}
                                        </Swiper>
                                        <img className="books-head-stand2" src="/assets/books-5.png" alt="stand" />
                                    </div>
                                ))}
                        </div>
                    </>
                ))
            ) : (
                <>
                    <SkeletonBookCard />
                    <SkeletonBookCard />
                    <SkeletonBookCard />
                    <SkeletonBookCard />
                </>
            )}

            {
                pag && pag.total_pages > 0 && (
                    <Paginate pageCount={pag.total_pages} onPress={handlePageChange} />
                )
            }

        </div >
    )
}
