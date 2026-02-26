// play/PlayRightSide.jsx
import React, { useContext, useState, useEffect } from 'react';
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookmarkHook from '../../../Logic/Bookmark/BookmarkHook';
import MultimediaShare from '../../Utility/MultimediaShare';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PlayRightSide({ handleMuteToggle, isMuted, audioURL, setIsMuted }) {
  const navigate = useNavigate();
  const { baseURL, fetchAudio, fetchbook, handleImageError, getClickedCategory } = useContext(UserContext);
  const token_popeShounda = localStorage.getItem('token_popeShounda');
  const [ , , , , , , handleChooseFav] = BookmarkHook();

  const [localBookmark, setLocalBookmark] = useState(audioURL?.bookmarkshow || false);

  useEffect(() => {
    setLocalBookmark(audioURL?.bookmarkshow || false);
    getClickedCategory(1);
    fetchAudio();
    fetchbook();
    handleChooseFav(5);
  }, [audioURL?.bookmarkshow]); // eslint-disable-line

  // لما التراك يتغير، خلّي الميوت false (نفس السلوك القديم)
  useEffect(() => {
    if (setIsMuted) setIsMuted(false);
  }, [audioURL, setIsMuted]);

  const AddToBook = (media_id, isBooked) => {
    setLocalBookmark(!isBooked);
    const req = isBooked
      ? axios.delete(`${baseURL}/bookmarks`, { data: { media_id }, headers: { Authorization: `Bearer ${token_popeShounda}` } })
      : axios.post(`${baseURL}/bookmarks`, { media_id }, { headers: { Authorization: `Bearer ${token_popeShounda}` } });

    req
      .then(() => {
        fetchAudio();
        fetchbook();
        handleChooseFav(5);
      })
      .catch(() => setLocalBookmark(isBooked));
  };

  const fallbackImage = `${process.env.PUBLIC_URL}/assets/header-papa.png`;

  const [isOverlayBlockMediaShare, setOverlayBlockMediaShare] = useState(false);
  const openMediaShareBlock = () => {
    document.body.classList.add('no-scroll');
    setOverlayBlockMediaShare(true);
  };
  const closeMediaShareBlock = () => {
    document.body.classList.remove('no-scroll');
    setOverlayBlockMediaShare(false);
    document.body.style.overflow = 'visible';
  };

  return (
    <div className="play-info-cont">
      <div className="play-info-flex3">
        <img
          src={`${process.env.PUBLIC_URL}/assets/info-share.png`}
          alt=""
          className="play-info-love"
          onClick={openMediaShareBlock}
        />
        {isOverlayBlockMediaShare && (
          <MultimediaShare
            closeOverlay={closeMediaShareBlock}
            text={`https://popeshenoudasitetest.msol.dev/media/5?id=${audioURL.id}`}
          />
        )}

        {token_popeShounda && (
          <img
            src={
              localBookmark
                ? `${process.env.PUBLIC_URL}/assets/bookmark-yellow.png`
                : `${process.env.PUBLIC_URL}/assets/archive.png`
            }
            alt=""
            className="footer-video-archive"
            onClick={() => AddToBook(audioURL.id, localBookmark)}
          />
        )}

        {isMuted ? (
          <FontAwesomeIcon icon={faVolumeMute} className="volume-img" onClick={handleMuteToggle} />
        ) : (
          <img
            src={`${process.env.PUBLIC_URL}/assets/volume-btn.png`}
            alt="volume"
            className="volume-img"
            onClick={handleMuteToggle}
          />
        )}
      </div>

      <ToastContainer />

      <div className="play-info-flex2">
        <div className="play-info-flex play-name">
          <p className="play-info-p-1 ">{audioURL.name}</p>
          <p className="play-info-p-2">قداسة البابا شنوده الثالث</p>
        </div>
        <img
          src={audioURL.image || fallbackImage}
          alt=""
          className="play-info-img"
          onError={() => handleImageError}
        />
      </div>
    </div>
  );
}
