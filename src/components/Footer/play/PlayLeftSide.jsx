import React, { useContext, useState } from 'react'

import { UserContext } from '../../Context/UserContext';


export default function PlayLeftSide() {
  const [menuVisible, setMenuVisible] = useState(false);

  const { sideMenu, setSideMenu } = useContext(UserContext);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handelMenuClick = (item) => {
    setSideMenu(item);
    console.log(item, 'item');
    toggleMenu();
  }
  return (
    <div className="play-btns-cont">

      {/* <div className="play-btns-container" onClick={toggleMenu}>

        <img className='play-btns-down-img' src={`${process.env.PUBLIC_URL}/assets/down2.png`} alt="" />
        {sideMenu==='bookmark'?(
        <p className='play-btns-p'>قائمة المقاطع المفضلة</p>
      ):(
        <p className='play-btns-p'>قائمة المقاطع المستمع إليها حديثاً</p>
      )}
        <img src={`${process.env.PUBLIC_URL}/assets/sound-list.png`} alt="" />
      </div> */}

      {/* {menuVisible && (
        <div className="custom-menu">

          <div className={sideMenu==='bookmark'?`custom-menu-div-5`:'custom-menu-div'} >
          <img src={`${process.env.PUBLIC_URL}/assets/sound-list.png`} alt="" />
            <p onClick={() => handelMenuClick('bookmark')}>قائمة المقاطع المفضلة</p>
          </div>
          <div className={sideMenu==='lately'?`custom-menu-div-5`:'custom-menu-div2'} >
          <img src={`${process.env.PUBLIC_URL}/assets/sound-list.png`} alt="" />
            <p onClick={() => handelMenuClick('lately')}>قائمة المقاطع المستمع إليها حديثاً</p>
          </div>
        </div>
      )} */}


    </div>
  )
}
