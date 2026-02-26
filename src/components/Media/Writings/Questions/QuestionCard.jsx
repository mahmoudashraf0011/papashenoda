// QuestionCard.jsx (one-click: pause category + play question reliably)
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';

export default function QuestionCard({
  ques,
  answer,
  audio,
  id,
  checkAudio,
  onAudioPlay,     // (type, id, ref)
  onAudioStop,     // (ref)
  onRequestPlay,   // (type, id, ref) -> pauses OTHER players synchronously (NOT this ref)
  activeAudio,     // { type, id, ref }
  setActiveAudio,
}) {
  const sound = useRef(null);
  const imgs = useRef(null);
  const quesDP = useRef(null);
  const iconDisplay = useRef(null);
  const question = useRef(null);
  const paragraphRef = useRef(null);

  // Guard to avoid self-pause during the same click (race with pausing others)
  const startingRef = useRef(false);
  const [iconShow, setIconShow] = useState(faPlus);
  const [isPlaying, setIsPlaying] = useState(false);

  // ---------- UI helpers ----------
  const expandDropdownUI = () => {
    if (!quesDP.current || !iconDisplay.current) return;
    quesDP.current.style.height = '140px';
    quesDP.current.style.overflowY = 'scroll';
    iconDisplay.current.style.backgroundColor = '#000';
    iconDisplay.current.style.color = '#fff';
    setIconShow(faMinus);
    if (window.innerWidth <= 662 && question.current) {
      question.current.classList.add('expanded');
    }
  };

  const collapseDropdownUI = () => {
    if (!quesDP.current || !iconDisplay.current) return;
    quesDP.current.style.height = '0';
    quesDP.current.style.overflow = 'hidden';
    iconDisplay.current.style.backgroundColor = '#fff';
    iconDisplay.current.style.color = '#000';
    setIconShow(faPlus);
    if (window.innerWidth <= 662 && question.current) {
      question.current.classList.remove('expanded');
    }
  };

  const onToggleQuestion = () => {
    const isExpanded = quesDP.current?.style.height === '140px';
    if (isExpanded) {
      collapseDropdownUI();
      if (!sound.current) return;
      if (!sound.current.paused) {
        try { sound.current.pause(); } catch {}
        onAudioStop?.(sound.current);
      }
    } else {
      expandDropdownUI();
    }
  };

  // ---------- One-click play ----------
  const onHandlePlay = () => {
    const el = sound.current;
    if (!el) return;

    if (el.paused) {
      // 1) Pause others synchronously (must NOT pause `el`)
      onRequestPlay?.('question', id, el);
      onAudioPlay?.('question', id, el);

      // 2) Open dropdown
      expandDropdownUI();

      // 3) Start this audio immediately (same user gesture)
      startingRef.current = true;        // protect from self-pause
      const p = el.play?.();
      if (p && typeof p.then === 'function') {
        p.catch((err) => {
          // If interrupted by a pause from elsewhere in the same tick, retry quickly once
          if (err?.name === 'AbortError') {
            try { el.play?.(); } catch {}
          } else {
            // Other errors can be logged; they usually mean missing user gesture or bad src
            console.error(err);
          }
        });
      }
      // DO NOT set isPlaying yet; wait for onPlay/onPlaying to confirm
      setActiveAudio?.({ type: 'question', id, ref: el });
    } else {
      // user pauses this one
      try { el.pause(); } catch {}
      onAudioStop?.(el);
    }
  };

  // ---------- keep in sync with global active ----------
  useEffect(() => {
    const el = sound.current;
    if (!el) return;

    // If this question is the active one, ensure UI is open & icons correct
    if (activeAudio && activeAudio.type === 'question' && activeAudio.id === id && activeAudio.ref === el) {
      const playing = !el.paused;
      setIsPlaying(playing);
      if (imgs.current) imgs.current.src = playing ? '/assets/pauser.png' : '/assets/playing.png';
      if (playing) expandDropdownUI();
      return;
    }

    // Another audio became active
    // Only pause this if it is actually playing AND we're not in the boot phase
    if (!startingRef.current && el && !el.paused) {
      try { el.pause(); } catch {}
      setIsPlaying(false);
      if (imgs.current) imgs.current.src = '/assets/playing.png';
    }
  }, [activeAudio, id]);

  // ---------- answer scroll behavior ----------
  useEffect(() => {
    const p = paragraphRef.current;
    if (!p) return;
    const computedStyle = window.getComputedStyle(p);
    const lineHeight = parseFloat(computedStyle.lineHeight || '20');
    const lines = p.scrollHeight / (lineHeight || 20);
    if (lines <= 4) {
      p.style.overflowY = 'hidden';
      p.classList.remove('scrolled');
    } else {
      p.style.overflowY = 'auto';
      p.classList.add('scrolled');
    }
  }, [answer]);

  // ---------- end / playing / pause ----------
  useEffect(() => {
    const el = sound.current;
    if (!el) return;

    const handlePlay = () => {
      setIsPlaying(true);
      if (imgs.current) imgs.current.src = '/assets/pauser.png';
    };

    const handlePlaying = () => {
      // playback stabilized — clear guard
      startingRef.current = false;
      setIsPlaying(true);
      if (imgs.current) imgs.current.src = '/assets/pauser.png';
    };

    const handlePause = () => {
      // Ignore pauses during the boot phase caused by pausing others
      if (startingRef.current) return;
      setIsPlaying(false);
      if (imgs.current) imgs.current.src = '/assets/playing.png';
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (imgs.current) imgs.current.src = '/assets/playing.png';
      onAudioStop?.(el);
    };

    el.addEventListener('play', handlePlay);
    el.addEventListener('playing', handlePlaying);
    el.addEventListener('pause', handlePause);
    el.addEventListener('ended', handleEnded);
    return () => {
      el.removeEventListener('play', handlePlay);
      el.removeEventListener('playing', handlePlaying);
      el.removeEventListener('pause', handlePause);
      el.removeEventListener('ended', handleEnded);
    };
  }, [onAudioStop]);

  return (
    <div className="questionCard" data-audio-id={id}>
      <div className="questionCardContent">
        <div className="questionCardContentRight" onClick={onToggleQuestion}>
          {checkAudio && (
            <img
              src={isPlaying ? '/assets/pauser.png' : '/assets/playing.png'}
              alt="iconRun"
              className="playIcon"
              ref={imgs}
              onClick={(e) => {
                e.stopPropagation(); // keep the gesture for play()
                onHandlePlay();
              }}
            />
          )}
          <p className="questionCardQues" ref={question}>{ques}</p>
        </div>

        <FontAwesomeIcon
          icon={iconShow}
          className="PlusIcon"
          ref={iconDisplay}
          onClick={onToggleQuestion}
        />

        {checkAudio && (
          <a
            href={audio}
            download
            className="download-btn-poem"
            onClick={(e) => e.stopPropagation()}
          >
            ⬇ تحميل
          </a>
        )}
      </div>

      <div className="questionCardDropdown" ref={quesDP}>
        <p className="scrolled" ref={paragraphRef}>{answer}</p>
        <audio
          controls
          ref={sound}
          className="audioQ"
          preload="auto"
        >
          <source src={audio} type="audio/ogg" />
          <source src={audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
