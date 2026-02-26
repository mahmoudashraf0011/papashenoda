import React ,{useContext}from 'react'
import { UserContext } from '../../Context/UserContext';

export default function SoundsSidebarCard({img,title,desc,onClick}) {
  const { baseURL,handleImageError } = useContext(UserContext);

  return (
    <div className='soundsSidebarCard'onClick={onClick}>
        <div className='soundsSidebarCardImg'>
          <img src={img} alt='imgListen' onError={handleImageError}/>
        </div>
        <div className='soundsSidebarCardContent'>
            <h4 className='soundsSidebarCardTitle'>{title}</h4>
            <p className='soundsSidebarCardDesc'>{desc}</p>
        </div>
    </div>
  )
}
