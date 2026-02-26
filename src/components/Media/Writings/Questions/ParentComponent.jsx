import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkeletonQuestionCard from './SkeletonQuestionCard'; // Assuming this is defined somewhere
import { SwiperSlide } from 'swiper/react';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import CategoryHeader from '../../../Category/CategoryHeader';
import QuestionCard from './QuestionCard';
import CategorySoundCard from '../../../Category/Categories/CategorySoundCard';

const ParentComponent = ({ categoryQuestionsData, categorySoundData, id }) => {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const playersRef = useRef([]);

  // دالة لإيقاف الصوت في جميع العناصر
  const stopOtherAudios = (currentAudio) => {
    const allAudios = document.querySelectorAll("audio");
    allAudios.forEach(aud => {
      if (aud !== currentAudio) {
        aud.pause();
        aud.currentTime = 0;
      }
    });
  };

  // دالة لتشغيل الصوت
  const handlePlay = (index, isQuestionCard = false) => {
    setCurrentPlayingIndex(index);

    if (isQuestionCard) {
      // إذا بدأ الصوت في مكون الأسئلة، توقف أي صوت في مكون الصوت
      stopOtherAudios(null); 
    } else {
      // إذا بدأ الصوت في مكون الصوت، توقف أي صوت في مكون الأسئلة
      stopOtherAudios(null); 
    }
  };

  return (
    <div>
      {/* مكون الأسئلة */}
      {categoryQuestionsData[0] && (
        <>
          <CategoryHeader cate={categoryQuestionsData[0].key} count={categoryQuestionsData[0].count} src={`/category/${id}/more/${categoryQuestionsData[0].media_type_slug}`} />
          <div className="categoryRow">
            <div className="questionsItems categoryQuestionsData">
              {
                isLoading ? (
                  <>
                    <SkeletonQuestionCard />
                    <SkeletonQuestionCard />
                    <SkeletonQuestionCard />
                  </>
                ) : (
                  categoryQuestionsData[0].value && categoryQuestionsData[0].value.slice(0, 3).map((item, i) => (
                    <QuestionCard
                      key={item.id}
                      ques={item.question}
                      answer={item.answer}
                      audio={item.audio}
                      checkAudio={item.sharepoint_uodated}
                      onPlay={(index) => handlePlay(index, true)} // على تشغيل الصوت في الأسئلة
                    />
                  ))
                )
              }
            </div>
          </div>
        </>
      )}

      {/* مكون الصوت */}
      {categorySoundData[0] && (
        <>
          <CategoryHeader cate={categorySoundData[0].key} count={categorySoundData[0].count} src={`/category/${id}/more/${categorySoundData[0].media_type_slug}`} />
          <div className="categoryRow">
            <div className="categorySoundData">
              {categorySoundData[0].value.slice(0, 6).map((item, index) => (
                <CategorySoundCard
                  key={item.id}
                  index={index}
                  audio={item.url}
                  title={item.name}
                  isPlaying={currentPlayingIndex === index}
                  onPlay={(index) => handlePlay(index)} // عند تشغيل الصوت في مكون الصوت
                  stopOtherAudios={stopOtherAudios} // تمرير دالة إيقاف الصوت
                  ref={(el) => (playersRef.current[index] = el)} // حفظ الريف الخاص بالصوت
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentComponent;
