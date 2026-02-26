import React, { useEffect, useContext, useState } from 'react'
import './SoundsPage.css'
import '../../../components/Media/Sounds/Sounds-res.scss'

import SoundsContainer from '../../../components/Media/Sounds/SoundsContainer'
import SoundsSidebarContainer from '../../../components/Media/Sounds/SoundsSidebarContainer'
import Play from '../../../components/Footer/Play'
import { useParams, useLocation } from 'react-router-dom';
import { UserContext } from '../../../components/Context/UserContext';
import axios from 'axios'

export default function SoundsPage() {
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
  const {
    audioList,
    setAudioURL,
    setAudioList,
    setCurrentAudioIndex,
    SendAudio,
    clicked,
    recent, baseURL
  } = useContext(UserContext);

  const location = useLocation();
  const [mediaId,setMediaId]=useState('');
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    if (id) {

      axios.get(`${baseURL}/get-audio?media_id=${id}`)
        .then((response) => {
          const audioData = response.data.data;
          setMediaId(audioData);

         const audioIndex = audioData.audios.findIndex((audio) => audio.id === parseInt(id, 10));

        if (audioIndex !== -1) {
          SendAudio(
            audioData.audio.url,
            audioData.audio.id,
            audioData.audio.image,
            audioData.audio.name,
            audioData.audio.bookmarkshow,
            audioData.audios,
            audioIndex
          );
        } else {
          console.log('Audio ID not found in the list');
        }
        })
        .catch((error) => {
          console.log(error);
        })

    }
  }, [location]);


  return (
    <div className='soundsPage'>
      <div className='soundsItemsflex'>
        <SoundsContainer />
        <SoundsSidebarContainer />
      </div>
      <div style={{ clear: "both" }} ></div>

      <Play />
    </div>
  )
}
