// Header.js
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Header.scss'
import './Header-res.scss'

import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  
import 'primeflex/primeflex.css';

import HeaderTop from './HeaderTop';
import HeaderDropdownOne from './HeaderDropdownOne';
import HeaderDropdownTwo from './HeaderDropdownTwo';
import HeaderContent from './HeaderContent';
import HeaderRes from './HeaderRes';
import { UserContext } from '../Context/UserContext';

export default function Header() {
  const { baseURL } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [showInfo, setShowInfo] = useState(null); // data from /show_header

  // Fetch categories and show_header once in parent
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [catRes, showRes] = await Promise.all([
          axios.get(`${baseURL}/categories`),
          axios.get(`${baseURL}/show_header`)
        ]);
        if (!cancelled) {
          setCategories(catRes?.data?.data || []);
          setShowInfo(showRes?.data?.data || {});
        }
      } catch (err) {
        console.error('Header fetch error', err);
        if (!cancelled) {
          setCategories([]);
          setShowInfo({});
        }
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [baseURL]);

  // existing sticky header logic (unchanged)
  useEffect(() => {
    const header = document.querySelector('.header-bottom');
    if (!header) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const width = window.innerWidth;

      if (width < 662) {
        header.classList.remove('fixed');
      } else if (width >= 669 && width < 1100) {
        if (scrollY > 120) header.classList.add('fixed');
        else header.classList.remove('fixed');
      } else {
        if (scrollY > 180) header.classList.add('fixed');
        else header.classList.remove('fixed');
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const [openHeaderOne, setOpenHeaderOne] = useState(false);
  const [openHeaderTwo, setOpenHeaderTwo] = useState(false);
  function openHeader1() {
      setOpenHeaderOne(!openHeaderOne);
      setOpenHeaderTwo(false);
  }
  function openHeader2() {
      setOpenHeaderTwo(!openHeaderTwo);
      setOpenHeaderOne(false);
  }
  const closeWrapper = () =>{
      setOpenHeaderOne(false);
      setOpenHeaderTwo(false);
      if(document.querySelector(".overlayLight")){
          document.querySelector(".overlayLight").style.display = "none";
      }
  }

  return (
      <header className='header'>
          <HeaderTop closeDp={closeWrapper}/>
          <div className="header-bottom">
              <div className="header-bottom-wrapper">
                  <HeaderDropdownOne
                    categories={categories}
                    openHeaderTwo={openHeaderTwo}
                    setOpenHeaderTwo={setOpenHeaderTwo}
                    closeDp={closeWrapper}
                  />
                  <HeaderDropdownTwo
                    showInfo={showInfo}             
                    openHeaderOne={openHeaderOne}
                    setOpenHeaderOne={setOpenHeaderOne}
                    closeDp={closeWrapper}
                  />
                  <HeaderContent
                    openHeader1={openHeader1}
                    openHeader2={openHeader2}
                    setOpenHeaderTwo={setOpenHeaderTwo}
                    setOpenHeaderOne={setOpenHeaderOne}
                    openHeaderOne={openHeaderOne}
                    openHeaderTwo={openHeaderTwo}
                    closeDp={closeWrapper}
                  />
                  <HeaderRes
                    categories={categories}
                    showInfo={showInfo}              
                  />
              </div>
          </div>
      </header>
  )
}
