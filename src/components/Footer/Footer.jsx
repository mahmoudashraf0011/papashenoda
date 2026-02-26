import React, { useState } from 'react'

import './Footer.scss'
import './Play-res.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faPinterest, faSoundcloud, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { Dropdown } from 'primereact/dropdown'
import Play from './Play'
import { Link } from 'react-router-dom'


export default function Footer() {
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [

    ];
    const placeholderTemplate = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <span>العربية</span>
            <img
                src="./assets/egypt 1.png"
                alt="Arabic flag"
                style={{ width: '20px', marginLeft: '5px' }}
            /> */}

        </div>
    );
  return (
    <>  
      {/* <Play/> */}
    <footer>
        <div className='footerContent'>
                <div className='footerLeft'>
                        <ul className='footerLeftSocial'>
                        <li><a href='https://www.youtube.com/user/popeshenoudagec?app=desktop'><FontAwesomeIcon icon={faYoutube} className='socialIcon'/></a></li>
                            <li><a href='https://www.instagram.com/popeshenoudagec/?utm_medium=copy_link'><FontAwesomeIcon icon={faInstagram} className='socialIcon'/></a></li>
                            <li><a href='https://www.tiktok.com/@popeshenouda3rd?lang=ar'><FontAwesomeIcon icon={faTiktok} className='socialIcon' /></a></li>
                            <li><a href='https://www.pinterest.com/popeshenoudagec5484/_saved/'><FontAwesomeIcon icon={faPinterest} className='socialIcon' /></a></li>
                            <li><a href='https://x.com/HHPopeshenouda3?t=pbtII3Houdmvo3QTCfFCEg&s=09'><FontAwesomeIcon icon={faTwitter} className='socialIcon'/></a></li>
                            <li><a href='https://m.facebook.com/GenerationsTeacherCenter/'><FontAwesomeIcon icon={faFacebookF} className='socialIcon'/></a></li>
                        </ul>
                        <div className="header-bottom-left">
                            {/* <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                placeholder={selectedCity ? null : placeholderTemplate()} /> */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <span className='header-bottom-left-p'>العربية</span>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/egypt 1.png`}
                            alt="Arabic flag"
                            style={{ width: '20px', marginLeft: '5px' }}
                        /> */}

                        </div>
                            <p className='header-bottom-left-p'><Link to='/contact'>تواصل معنا</Link></p>
                            <p className='header-bottom-left-p'><Link to='/about'>عن المركز</Link></p>
                        </div>
                </div>
                <div className='footerRight'>
                    <div style={{cursor:"pointer"}}><Link to="https://msol.dev/" target='_blank'> Designed and Developed by <span>Msol.Dev</span></Link></div>
                    <div>كنسية السيدة العذراء مريم بالزيتون</div>
                    <div>حقوق النشر 2024، جميع الحقوق محفوظة</div>
                </div>
        </div>
        <div className='footerContentRes' style={{display:"none"}}>
            <div className='footerImg'>
                <img src='/assets/logo.png' alt='footerImg'/>
            </div>
            <p className='footerHead'>كنيسة السيدة العذراء مريم بالزيتون</p>
            <div className='footerLine'></div>
            <div className='footerPages'>
                 <p ><Link to='/about'>عن المركز</Link></p>
                <p ><Link to='/contact'>تواصل معنا</Link></p>
            </div>
            <ul className='footerSocial'>
                            <li><a href='https://www.youtube.com/user/popeshenoudagec?app=desktop'><FontAwesomeIcon icon={faYoutube} className='socialIcon'/></a></li>
                            <li><a href='https://www.instagram.com/popeshenoudagec/?utm_medium=copy_link'><FontAwesomeIcon icon={faInstagram} className='socialIcon'/></a></li>
                            <li><a href='https://www.tiktok.com/@popeshenouda3rd?lang=ar'><FontAwesomeIcon icon={faTiktok} className='socialIcon' /></a></li>
                            <li><a href='https://www.pinterest.com/popeshenoudagec5484/_saved/'><FontAwesomeIcon icon={faPinterest} className='socialIcon' /></a></li>
                            <li><a href='https://x.com/HHPopeshenouda3?t=pbtII3Houdmvo3QTCfFCEg&s=09'><FontAwesomeIcon icon={faTwitter} className='socialIcon'/></a></li>
                            <li><a href='https://m.facebook.com/GenerationsTeacherCenter/'><FontAwesomeIcon icon={faFacebookF} className='socialIcon'/></a></li>
            </ul>
            <div className='footerCR footerBottom'>حقوق النشر 2024، جميع الحقوق محفوظة</div>
            <div className='footerCompany footerBottom' style={{cursor:"pointer"}}><Link to="https://msol.dev/" target='_blank'> Designed and Developed by <span>Msol.Dev</span></Link></div>
        </div>


    </footer>
    </>

  )
}
