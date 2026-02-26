
import { faEllipsisVertical, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react'

export default function SoundsFavCard({img,title,desc}) {
    const settingDD=useRef();
    const onHandleSetting=()=>{
        if(settingDD.current.style.display=="block"){
            settingDD.current.style.display="none"
        }else{
        settingDD.current.style.display="block"
        }
    }
  return (
    <div className='favSoundsCard'>
        <div className='favSoundsCardImg'>
            <img src={img} alt='favSoundImg'  />
          <div className='favSoundImgOverlay'>
                <div className='favSoundImgOverlayContent'>
                    <FontAwesomeIcon icon={faPlay} className='playSoundIcon' />
                </div>
            </div>
        </div>

        <h4 className='favSoundTitle'>{title}</h4>
        <p className='favSoundsCardDesc'>{desc}</p>
        <li className='favSoundsCardHeart' ><img src={`/assets/media/sounds/heart2.png`} alt='heart' /></li>
        <div className='soundSetting'>
            <li className=''>
                <FontAwesomeIcon icon={faEllipsisVertical} className='settingIcon' onClick={onHandleSetting} />
                <ul className='settingDropdown' ref={settingDD}>
                    <li>مشاركة</li>
                    <li>اضافة</li>
                </ul>
                </li>
        </div>
    </div>
  )
}
