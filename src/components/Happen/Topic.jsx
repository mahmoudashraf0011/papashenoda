import React, { useEffect, useState } from 'react'
import './Topic.scss'
import TopicLeft from './TopicLeft'
import TopicRight from './TopicRight'
import { Link, useParams } from 'react-router-dom'
import HappenDetailsHook from '../../Logic/Media/Writings/Happen/HappenDetailsHook'
export default function Topic() {
    const { id } = useParams();
    const [oneHappenData, oneHappenRelatedData, getData] = HappenDetailsHook(id)
    const [artID, setArtID] = useState(id)

    useEffect(() => {
        if (artID !== id) {
            setArtID(id);
            getData();
        }
    }, [id, artID]);
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
        <div className='topic_parent'>
            <div className='breadCrumbContainer'  >
                <div className='Container'>
                    <ul className="breadCrumb" >
                        <li><Link >{oneHappenData[0] && oneHappenData[0].name}</Link></li>
                        <li><Link to={`/happen`}>حدث في مثل هذا اليوم</Link></li>
                        <li><Link to={`/`}>الرئيسية</Link></li>


                    </ul>
                </div>
            </div>
            <div className='topic'>
                <div className="topic-wrapper">
                    <p className='topic-date'>{oneHappenData[0] ? oneHappenData[0].date : ""}</p>
                    <p className='topic-sub'>{oneHappenData[0] ? oneHappenData[0].name : ""}</p>

                    <div className="topic-left-right-sides">

                        <TopicLeft data={oneHappenRelatedData} />

                        <TopicRight data={oneHappenData} />
                    </div>
                </div>
            </div>
        </div>

    )
}
