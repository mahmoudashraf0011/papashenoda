// Play.jsx
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PlayRightSide from './play/PlayRightSide';
import PlayLeftSide from './play/PlayLeftSide';
import { UserContext } from '../Context/UserContext';
import './Play.css'

const rewindimg = '/assets/left1.png';
const rewindimg2 = '/assets/right1.png';
const rewindimg3 = '/assets/play-black.png';
const repeat = '/assets/repeat-single.png';
const repeat2 = '/assets/shape.png';

export default function Play() {
  const {
    audioURL,
    audioList,
    setAudioList,
    currentAudioIndex,
    setCurrentAudioIndex,
    SendAudio,
    setAudioURL,
    isUserInitiated,
    setIsUserInitiated
  } = useContext(UserContext);

  const playerRef = useRef();

  // UI visible (closed by default until a track is selected)
  const [checked, setChecked] = useState(false);

  // Loop (persist to session)
  const [isLoop, setIsLoop] = useState(() => {
    const saved = sessionStorage.getItem('player_isLoop');
    return saved ? JSON.parse(saved) : false;
  });

  // Mute state (managed here and passed to RightSide)
  const [isMuted, setIsMuted] = useState(false);

  // Playback rate (persist to session)
  const SPEEDS = useMemo(() => [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], []);
  const [playbackRate, setPlaybackRate] = useState(() => {
    const saved = sessionStorage.getItem('player_speed');
    return saved ? Number(saved) : 1;
  });
  const [speedOpen, setSpeedOpen] = useState(false);

  const customNextIcon = <FontAwesomeIcon icon={faForwardStep} />;
  const customForwardIcon2 = <img src={rewindimg2} alt="forward 10" />;
  const customForwardIcon3 = <img src={rewindimg} alt="back 10" />;
  const customForwardIcon4 = <img src={rewindimg3} alt="play" className="play-btn" />;
  const customRepeat = <img src={repeat} alt="loop on" className="play-btn" />;
  const customRepeat2 = <img src={repeat2} alt="loop off" className="play-btn" />;

  // في حال اختير تراك جديد افتح المشغل
  useEffect(() => {
    if (currentAudioIndex != null) setChecked(true);
  }, [currentAudioIndex]);

  // حمّل الحالة المخزنة (audioURL, index, list) أول مرة
  useEffect(() => {
    const savedAudio = sessionStorage.getItem('audioURL');
    const savedIndex = sessionStorage.getItem('currentAudioIndex');
    const savedList = sessionStorage.getItem('audioList');
    const savedIsUser = sessionStorage.getItem('isUserInitiated');

    if (savedAudio) {
      setAudioURL(JSON.parse(savedAudio));
      setCurrentAudioIndex(JSON.parse(savedIndex));
      setAudioList(JSON.parse(savedList));
      setIsUserInitiated(JSON.parse(savedIsUser) || false);
      setChecked(true);
    }
  }, [setAudioList, setAudioURL, setCurrentAudioIndex, setIsUserInitiated]);

  // احفظ أي تغيّر
  useEffect(() => {
    if (audioURL?.url) {
      sessionStorage.setItem('audioURL', JSON.stringify(audioURL));
      sessionStorage.setItem('currentAudioIndex', JSON.stringify(currentAudioIndex));
      sessionStorage.setItem('audioList', JSON.stringify(audioList));
      sessionStorage.setItem('isUserInitiated', JSON.stringify(isUserInitiated));
    }
  }, [audioURL, audioList, currentAudioIndex, isUserInitiated]);

  useEffect(() => {
    sessionStorage.setItem('player_isLoop', JSON.stringify(isLoop));
  }, [isLoop]);

  useEffect(() => {
    sessionStorage.setItem('player_speed', String(playbackRate));
    if (playerRef.current?.audio?.current) {
      playerRef.current.audio.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // لما يتغيّر التراك طبّق السرعة وكمان حالة الـ mute الحالية
  useEffect(() => {
    const el = playerRef.current?.audio?.current;
    if (el) {
      el.playbackRate = playbackRate;
      el.muted = isMuted;
    }
  }, [audioURL?.id, playbackRate, isMuted]);

  // حافظ على تزامن audio.muted مع state
  useEffect(() => {
    const el = playerRef.current?.audio?.current;
    if (el) el.muted = isMuted;
  }, [isMuted]);

  const handleLoopToggle = () => setIsLoop((v) => !v);

  const handleMuteToggle = () => {
    const el = playerRef.current?.audio?.current;
    if (!el) return;
    const next = !isMuted;
    el.muted = next;         // فعليًا على عنصر الصوت
    setIsMuted(next);        // وحدث الـ state للـ UI
  };

  const playNextAudio = () => {
    if (audioList && audioList.length > 0 && currentAudioIndex < audioList.length - 1) {
      const nextIndex = currentAudioIndex + 1;
      const nextAudio = audioList[nextIndex];
      setCurrentAudioIndex(nextIndex);
      SendAudio(
        nextAudio.url,
        nextAudio.id,
        nextAudio.image ? nextAudio.image : '/assets/default/sounds/Audio-DF.png',
        nextAudio.name,
        nextAudio.bookmarkshow,
        audioList,
        nextIndex
      );
    }
  };

  const playPrevAudio = () => {
    if (audioList && audioList.length > 0 && currentAudioIndex > 0) {
      const prevIndex = currentAudioIndex - 1;
      const prevAudio = audioList[prevIndex];
      setCurrentAudioIndex(prevIndex);
      SendAudio(
        prevAudio.url,
        prevAudio.id,
        prevAudio.image ? prevAudio.image : '/assets/default/sounds/Audio-DF.png',
        prevAudio.name,
        prevAudio.bookmarkshow,
        audioList,
        prevIndex
      );
    }
  };

  // مكوّن السرعة (زر + قائمة بسيطة)
  const SpeedControl = () => (
    <div className="player-speed-wrap" style={{ position: 'relative' }}>
      <button
        type="button"
        className="player-speed-btn"
        aria-haspopup="listbox"
        aria-expanded={speedOpen}
        onClick={(e) => {
          e.stopPropagation();
          setSpeedOpen((o) => !o);
        }}
        style={{
          minWidth: 44,
          height: 32,
          padding: '0 10px',
          borderRadius: 16,
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)'
        }}
        title="Playback Speed"
      >
        {`${playbackRate}x`}
      </button>

      {speedOpen && (
        <ul
          role="listbox"
          className="player-speed-menu"
          style={{
            position: 'absolute',
            bottom: '110%',
            right: 0,
            background: 'rgba(0,0,0,0.8)',
            borderRadius: 12,
            padding: 6,
            margin: 0,
            listStyle: 'none',
            minWidth: 90,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 50
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {SPEEDS.map((s) => (
            <li key={s} role="option" aria-selected={playbackRate === s}>
              <button
                type="button"
                onClick={() => {
                  setPlaybackRate(s);
                  setSpeedOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: playbackRate === s ? '#001857' : 'transparent',
                  color: playbackRate === s ? 'gray' : '#fff',
                  fontWeight: playbackRate === s ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {s}x
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const additionalControls = [
    <div onClick={handleLoopToggle} key="loop-toggle" className="play-loop" title="Loop">
      {isLoop ? customRepeat : customRepeat2}
    </div>,
    <div key="prev" onClick={playPrevAudio} className="play-prev" title="Previous">
      {customForwardIcon3}
    </div>,
    <div key="next" onClick={playNextAudio} className="play-next" title="Next">
      {customForwardIcon2}
    </div>,
    <div key="speed" className="play-speed" title="Playback Speed" style={{ marginLeft: 6 }}>
      <SpeedControl />
    </div>
  ];

  // اغلاق عند الضغط على الخلفية الداكنة
  const handleBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      setChecked(false);
    }
  };

  return (
    <>
      {audioURL?.url && checked && (
        <div className="play-complex-play" onClick={handleBackdropClick}>
          <div className="play-complex-play-cont">
            <div className="play-play-cont">
              <AudioPlayer
                key={audioURL.id}
                src={audioURL.url}
                ref={playerRef}
                autoPlay={isUserInitiated}
                customAdditionalControls={additionalControls}
                customVolumeControls={[]}
                showJumpControls={false}
                showDownloadProgress={false}
                showFilledProgress={true}
                customIcons={{
                  play: customForwardIcon4,
                  prev: '',
                  next: '',
                  rewind: '',
                  forward: ''
                }}
                onEnded={() => {
                  if (isLoop && playerRef.current?.audio?.current) {
                    const a = playerRef.current.audio.current;
                    a.currentTime = 0;
                    a.playbackRate = playbackRate;
                    a.muted = isMuted; // حافظ على حالة الميوت بعد الإعادة
                    a.play();
                  }
                }}
                onPlay={() => {
                  if (playerRef.current?.audio?.current) {
                    playerRef.current.audio.current.playbackRate = playbackRate;
                    playerRef.current.audio.current.muted = isMuted;
                  }
                }}
              />
            </div>

            {/* Left & Right sides (كما هي) */}
            <PlayLeftSide />

            <PlayRightSide
              audioURL={audioURL}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              handleMuteToggle={handleMuteToggle}
            />

            {/* Close button */}
            <img
              src="/assets/share/close.png"
              alt="close"
              className="sharedCancel"
              style={{
                position: 'absolute',
                top: window.innerWidth < 768 ? '50%' : '35%',
                right: '30px',
                width: '20px',
                cursor: 'pointer'
              }}
              onClick={() => setChecked(false)}
            />

            {/* Download */}
            <a
              href={audioURL?.url}
              download
              onClick={(e) => e.stopPropagation()}
              className='download-audio'
              style={{
                position: 'absolute',
                top: '18px',
                right: '62px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                fontSize: '18px',
                borderRadius: '50%',
                textDecoration: 'none',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer',
                transition: '0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'gold')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)')}
              title="Download"
            >
              ⬇
            </a>
          </div>
        </div>
      )}
    </>
  );
}
