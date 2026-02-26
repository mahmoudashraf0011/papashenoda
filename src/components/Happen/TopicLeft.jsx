import React from 'react'
import { Link } from 'react-router-dom'
import SkeletonTopicLeftSection from './SkeletonTopicLeftSection';

export default function TopicLeft({ data }) {
    return (
        <div className="topic-left-side">
            <p className='topic-left-p'>ايضاً في مثل هذا اليوم</p>
            {/* {
                data[0] ? data[0].map((item) => {
                    return (
                        <Link to={`/happen/${item.slug}`}>
                            <div className="topic-left-headline-cont">
                                <div className="topic-left-headline">
                                    <p className='topic-left-top-p'>{item.name}</p>
                                    <p className='topic-left-bot-p'>{item.date}</p>
                                </div>
                                <div className="topic-right-headlineimg">
                                    <img src={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"} alt="" />
                                </div>
                            </div>
                            <div className="topic-left-headline-cont-res" style={{ display: "none" }}>
                                <div div className="topic-left-headline">
                                    <p className='topic-left-top-p'>{item.name}</p>
                                    <p className='topic-left-bot-p'>{item.date}</p>
                                </div>
                                <div className="topic-right-headlineimg">
                                    <img src={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"} alt="" />
                                </div>

                            </div>
                        </Link>
                    )
                }) : ""
            } */}
            {/* إذا كانت البيانات قيد التحميل، عرض Skeleton */}
            {data[0] ? (
                data[0].map((item) => {
                    return (
                        <Link to={`/happen/${item.slug}`} key={item.id} style={{marginBottom:"5%"}}>
                            <div className="topic-left-headline-cont">
                                <div className="topic-left-headline">
                                    <p className='topic-left-top-p'>{item.name}</p>
                                    {
                                        item.sharepoint_image&&(
                                            <p className='topic-left-bot-p' style={{ position: "relative" }}>{item.date}
                                            <a
                                                href={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"}
                                                download
                                                className="download-btn"
                                                onClick={(e) => e.stopPropagation()} // Prevent parent click
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // خلفية شفافة قليلًا
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    fontSize: '14px',
                                                    color: '#000',
                                                    textDecoration: 'none',
                                                    marginRight: '50%',
                                                }}
                                            >
                                                ⬇ تحميل
                                            </a>
                                            </p>
                                        )
                                    }
                                
                                </div>
                                <div className="topic-right-headlineimg">
                                    <img src={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"} alt="" />
                                </div>
                            </div>
                            <div className="topic-left-headline-cont-res" style={{ display: "none" }}>
                                <div div className="topic-left-headline">
                                    <p className='topic-left-top-p'>{item.name}</p>
                                    <p className='topic-left-bot-p'>{item.date}</p>
                                </div>
                                <div className="topic-right-headlineimg">
                                    <img src={item.sharepoint_image ? item.image : "/assets/default/happen/outSide.png"} alt="" />
                                </div>

                            </div>
                        </Link>
                    );
                })
            ) : (
                // عرض Skeleton أثناء التحميل
                <SkeletonTopicLeftSection />
            )}
        </div>
    )
}
