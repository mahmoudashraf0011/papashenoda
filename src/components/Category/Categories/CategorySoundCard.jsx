import React, { forwardRef, useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import '../CategoryContainer.css'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const rewindimg = "/assets/rewind.png";
const rewindimg2 = "/assets/rewind2.png";
const rewindimg3 = "/assets/play.png";

const SkeletonCategorySoundCard = () => (
  <div className="categorySoundCard">
    <div className="categorySoundCardImg"><Skeleton height={100} width={50} circle /></div>
    <div className="categorySoundCardHead"><Skeleton height={40} width="80%" /></div>
    <li className="categorySoundCardPlayIcon"><Skeleton height={80} width="80%" /></li>
    <Skeleton height={60} width="40%" />
  </div>
);

const CategorySoundCard = forwardRef(
  ({ index, audio, title, isPlaying, hasPrev, hasNext, onPlay, onPrev, onNext, onAudioPlay, onAudioStop, activeAudio }, ref) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 662);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 662);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const customPrevIcon = hasPrev && (
      <button onClick={() => onPrev(index)} className="audio-control-button">
        <img src={rewindimg2} alt="prev" />
      </button>
    );
    const customNextIcon = hasNext && (
      <button onClick={() => onNext(index)} className="audio-control-button2">
        <img src={rewindimg} alt="next" />
      </button>
    );
    const customPlayIcon = <img src={rewindimg3} alt="play" className="play-btn" />;

    useEffect(() => {
      const audioElement = ref?.current?.audio?.current;
      const handleEnded = () => { if (audioElement) onAudioStop(audioElement); };
      if (audioElement) {
        audioElement.addEventListener('ended', handleEnded);
        // if another category item is active, pause myself (onPause will call onAudioStop with ref)
        if (activeAudio?.type === 'category' && activeAudio?.id !== index && !audioElement.paused) {
          audioElement.pause();
        }
      }
      return () => { if (audioElement) audioElement.removeEventListener('ended', handleEnded); };
    }, [activeAudio, index, onAudioStop, ref]);

    const handlePlay = () => {
      onPlay(index);
      const audioEl = ref?.current?.audio?.current;
      // Tell parent first (pause others + mark active). Audio element will then play via user gesture inside the player.
      onAudioPlay('category', index, audioEl);
    };

    return (
      <div className="categorySoundCard">
        <div className="categorySoundCardImg"><img src="/assets/wav.png" alt="audio" /></div>
        <div className="categorySoundCardHead"><p>{title}</p></div>
        <li className="categorySoundCardPlayIcon">
          <AudioPlayer
            ref={ref}
            src={audio}
            customAdditionalControls={[customPrevIcon, customNextIcon]}
            customVolumeControls={[]}
            showJumpControls={false}
            customIcons={{ play: customPlayIcon }}
            onPlay={handlePlay}
            onPause={() => onAudioStop(ref?.current?.audio?.current)}
          />
        </li>
        {audio && (
          <a
            href={audio}
            download
            className="video-download-btn-cate"
            onClick={(e) => e.stopPropagation()}
          >
            ⬇ تحميل
          </a>
        )}
      </div>
    );
  }
);

export default CategorySoundCard;
export { SkeletonCategorySoundCard };
