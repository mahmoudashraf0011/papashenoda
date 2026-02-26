import React, { useEffect, useState, useContext, useRef } from 'react'
import './RecentlySoundsContainer.css'
import RecentlySoundsCard from './RecentlySoundsCard'
import SoundsHeader2 from './SoundsHeader2'
import axios from 'axios'
import { UserContext } from '../../Context/UserContext'
import Paginate from '../../Utility/Paginate'


export default function RecentlySoundsContainer() {
  const notFound = useRef()
  const [activePage, setActivePage] = useState();
  const { baseURL, categoryId, setCategoryId, setAudioURL, setAudioId, fetchAudio, setClicked, recent, clicked, SendAudio, pag, setPag, setPage, pag2, setPag2, setPage2, clickedFliter, getAudioFilter, getClickedCategory } = useContext(UserContext);


  useEffect(() => {
    setCategoryId('');
    setClicked('');
    fetchAudio();
  }, [])


  const handlePageChange = (selectedPage) => {
    if (clicked) {
      if (localStorage.getItem("filterIds") && localStorage.getItem("filterValues")) {
        let fi = JSON.parse(localStorage.getItem("filterIds"))
        let fb = JSON.parse(localStorage.getItem("filterValues"))
        getAudioFilter(fi, fb, selectedPage)
      } else {
        setActivePage(selectedPage);
        setPage(selectedPage);
        getClickedCategory(selectedPage);


      }
      console.log("sele", selectedPage);

    }
    console.log("page1:", selectedPage);

  };
  const handlePageChange2 = (selectedPage) => {
    console.log("page2:", selectedPage);
    setActivePage(selectedPage);
    setPage2(selectedPage);
    getClickedCategory(selectedPage);



  };


  useEffect(() => {
    if (categoryId.id) {
      setActivePage(1); // Reset active page
      handlePageChange2(1);
      handlePageChange(1);
    }
  }, [categoryId.id]);

  return (
    <div className='recentlySoundsContainer scrolled'>
      {categoryId.name ? (<SoundsHeader2 title={categoryId.name} />) : (<SoundsHeader2 title="المضاف حديثاً" />)}

      <div className='recentlySoundsItems'>
        {categoryId.id ? (
          clicked && clicked.media.map((rec, index) => (
            <RecentlySoundsCard fetchAudio={fetchAudio} id={rec.id} bookmarkshow={rec.bookmarkshow} img={rec.sharepoint_image ? rec.image : "/assets/default/sounds/Audio-DF.png"} title={rec.name} key={index} desc="قداسة البابا شنوده الثالث" onClick={() => SendAudio(rec.url, rec.id, rec.sharepoint_image ? rec.image : "/assets/default/sounds/Audio-DF.png", rec.name, rec.bookmarkshow, clicked.media, index)} />

          ))
        )
          : (
            recent && recent.map((rec, index) => (
              <RecentlySoundsCard fetchAudio={fetchAudio} id={rec.id} bookmarkshow={rec.bookmarkshow} img={rec.sharepoint_image ? rec.image : "/assets/default/sounds/Audio-DF.png"} title={rec.name} key={index} desc="قداسة البابا شنوده الثالث" onClick={() => SendAudio(rec.url, rec.id, rec.sharepoint_image ? rec.image : "/assets/default/sounds/Audio-DF.png", rec.name, rec.bookmarkshow, recent, index)} />

            ))
          )
        }



      </div>
      {pag ? (
        <>
          {clicked.media && clicked.media.length === 0 ? (
            ""
          ) : (
            <Paginate
              pageCount={pag.totalPages}
              onPress={handlePageChange}
              activePage={activePage}
            />
          )}
        </>
      ) : pag2 ? (
        <>
          <Paginate
            pageCount={pag2.totalPages}
            onPress={handlePageChange2}
            activePage={activePage}
          />
        </>
      ) : null}
      {
        (clicked.media && clicked.media.length == 0) && <p className='noResult' ref={notFound} >لا يوجد نتائج</p>
      }

    </div>

  )
}
