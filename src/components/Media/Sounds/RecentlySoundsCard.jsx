import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';

export default function RecentlySoundsCard({ img, title, desc, onClick, id, bookmarkshow, fetchAudio }) {
  const token_popeShounda = localStorage.getItem("token_popeShounda");
  const { baseURL, handleImageError, fetchbook, getClickedCategory } = useContext(UserContext);

  const [localBookmark, setLocalBookmark] = useState(bookmarkshow);
  useEffect(() => {
    setLocalBookmark(bookmarkshow || false);
  }, [bookmarkshow]);

  const AddToBook = (media_id, isBooked) => {
    setLocalBookmark(!isBooked);

    const axiosRequest = isBooked
      ? axios.delete(`${baseURL}/bookmarks`, {
          data: { media_id },
          headers: { Authorization: `Bearer ${token_popeShounda}` },
        })
      : axios.post(`${baseURL}/bookmarks`, { media_id }, { headers: { Authorization: `Bearer ${token_popeShounda}` } });

    axiosRequest
      .then(() => {
        console.log("Bookmark updated successfully");
        if (typeof fetchAudio === "function") fetchAudio(); // refresh only after success
        if (typeof fetchbook === "function") fetchbook();
        if (typeof getClickedCategory === "function") getClickedCategory();
      })
      .catch((error) => {
        console.error("Error updating bookmark:", error);
        setLocalBookmark(isBooked); // revert on failure
      });
  };

  const fallbackImage = `${process.env.PUBLIC_URL}/assets/header-papa.png`;

  return (
    <div className='recentlySoundsCard'>
      <div className='recentlySoundsCardImg' onClick={onClick}>
        <img src={img || fallbackImage} alt='recentlySoundImg' onError={handleImageError} />
        <div className='recentlySoundImgOverlay'>
          <div className='recentlySoundImgOverlayContent'>
            <FontAwesomeIcon icon={faPlay} className='playSoundIcon' />
          </div>
        </div>
      </div>
      <h4 className='recentlySoundTitle'>{title}</h4>
      <p className='recentlySoundsCardDesc'>{desc}</p>

      {token_popeShounda && (
        <div className='soundSettingImg'>
          <img
            src={localBookmark ? `${process.env.PUBLIC_URL}/assets/bookmark-yellow.png` : `${process.env.PUBLIC_URL}/assets/archive.png`}
            alt="Bookmark Icon"
            className='videos-video-archive'
            onClick={() => AddToBook(id, localBookmark)}
          />
        </div>
      )}
    </div>
  );
}
