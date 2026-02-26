

import { faEllipsisVertical, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState,useContext } from 'react'
import BookmarkHook from '../../../../Logic/Bookmark/BookmarkHook';
import { UserContext } from '../../../Context/UserContext';
import Play from '../../../Footer/Play'
export default function GenerlaSoundsCard({img,title,desc,id,onClick,handelFunction,bookmarkshow,url,index}) {
  const  [data,videosFavData,soundsFavData,pageCount,handleChangePage,handleDeleteFav,handleChooseFav,getHeaders,headFav,fav,ele,check]=BookmarkHook();
  const { SendAudio } = useContext(UserContext);
  const [showPlay, setShowPlay] = useState(false);

    const settingDD=useRef();
    const [heartImg,setHeartImg]=useState("archive2.png");
    const handleFav=()=>{
        if(heartImg == "archive1.png"){
            setHeartImg("archive2.png")
        }else{
            setHeartImg("archive1.png")
        }
    }


  return (
    <div className='SoundsCard'>
        <div className='soundFav'>
          <li className='recentlySoundsCardHeart' ><img src={`/assets/${heartImg}`} alt='heart' onClick={()=>{
            handelFunction(id)
          }
            } /></li>
        </div>
        <div 
            className='recentlySoundsCardImg' 
            onClick={onClick}>

            <img src={img} alt='sound'  />
          <div className='recentlySoundImgOverlay'>
                <div className='recentlySoundImgOverlayContent'>
                    <FontAwesomeIcon icon={faPlay} className='playSoundIcon' />
                </div>
            </div>
        </div>

        <h4 className='recentlySoundTitle' >{title}</h4>
        <p className='recentlySoundsCardDesc'>{desc}</p>
        {showPlay && <Play />}

    </div>
  )
}
