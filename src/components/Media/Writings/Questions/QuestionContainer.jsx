
import React, { useEffect, useRef, useState } from 'react'
import './QuestionContainer.css'
import '../../Responsive/QuestionsRes.css'
import MediaHeader from '../../MediaHeader'
import QuestionCard from './QuestionCard'
import Paginate from '../../../Utility/Paginate';
import Spinner from '../../../Utility/Spinner';
import SkeletonQuestionCard from './SkeletonQuestionCard'
export default function QuestionContainer({ data, handleChangePage, pageCount, notFound, activePage }) {
  const qs = useRef();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (data && Array.isArray(data[0])) {
      setLoading(false);
    }
  }, [data]);
  //   if (qs.current) {
  //     const allCards = Array.from(qs.current.children);
  //     allCards.map((a)=>{
  //       console.log(a);
  //     })
  //     console.log(allCards);
  //   }
  const [activeAudio, setActiveAudio] = useState({
    type: null,    // 'question' أو 'category'
    id: null,      // معرف الصوت النشط
    ref: null      // مرجع عنصر الصوت
  });
  const handleAudioPlay = (audioType, audioId, audioRef) => {
    // إذا كان هناك صوت نشط بالفعل، أوقفه وأعد تعيين أيقوناته
    if (activeAudio.ref && activeAudio.ref !== audioRef) {
      activeAudio.ref.pause();

      // إعادة تعيين أيقونات QuestionCard إذا كان الصوت النشط السابق من نوع question
      if (activeAudio.type === 'question') {
        const prevPlayIcons = document.querySelectorAll(`.questionCard .playIcon`);
        prevPlayIcons.forEach(icon => {
          if (icon.closest('.questionCard').dataset.audioId === activeAudio.id) {
            icon.src = "/assets/playing.png";
          }
        });
      } else if (activeAudio.type === 'category') {
        // إعادة تعيين أيقونات CategorySoundCard إن وجدت
        const categoryPlayers = document.querySelectorAll('.rhap_play-pause-button');
        categoryPlayers.forEach(player => {
          //player.querySelector('svg').style.display = 'block';
        });
      }
    }
    // تعيين الصوت الجديد كصوت نشط
    setActiveAudio({
      type: audioType,
      id: audioId,
      ref: audioRef
    });

    setTimeout(() => {
      if (audioRef && typeof audioRef.play === 'function') {
        audioRef.play().catch(error => {
          console.error("Failed to play audio:", error);
        });
      }
    }, 50);
  };
  const handleAudioStop = () => {
    if (activeAudio.ref) {
      activeAudio.ref.pause();

      // إعادة تعيين أيقونات QuestionCard إذا كان الصوت النشط من نوع question
      if (activeAudio.type === 'question') {
        const playIcons = document.querySelectorAll(`.questionCard .playIcon`);
        playIcons.forEach(icon => {
          if (icon.closest('.questionCard').dataset.audioId === activeAudio.id) {
            icon.src = "/assets/playing.png";
          }
        });
      }

      setActiveAudio({
        type: null,
        id: null,
        ref: null
      });
    }
  };

  return (
    <div>
      <div className='questionContainer questionLoveContainer' ref={qs}>

        {/* {
          data && Array.isArray(data[0]) ? data[0].map((item) => {
            return (
              <>
                <div className='Container'>
                  <MediaHeader title={item.value} />
                  <div className='questionsItems ' >

                    {
                      item.media ? item.media.map((qus) => {
                        return (
                          <QuestionCard ques={qus.question} answer={qus.answer} audio={qus.audio} key={Math.random() * 10} id={qus.id} checkAudio={qus.sharepoint_uodated} />
                        )
                      }) : ""
                    }

                    
                  </div>

                </div>
              </>


            )
          }) : <Spinner />
        } */}
        {
          loading ? (
            // أثناء تحميل البيانات، نعرض Skeleton بدلاً من Spinner
            <>
              <SkeletonQuestionCard />
              <SkeletonQuestionCard />
              <SkeletonQuestionCard />
              <SkeletonQuestionCard />
            </>
          ) : (
            // عندما تكون البيانات جاهزة، نعرض الكروت الفعلية
            data && Array.isArray(data[0]) ? data[0].map((item) => {
              return (
                <div className='Container' key={item.id}>
                  <MediaHeader title={item.value} />
                  <div className='questionsItems'>
                    {
                      item.media ? item.media.map((qus) => {
                        return (
                          // عرض QuestionCard عند اكتمال تحميل البيانات
                          <QuestionCard
                            ques={qus.question}
                            answer={qus.answer}
                            audio={qus.audio}
                            key={qus.id}
                            id={qus.id}
                            checkAudio={qus.sharepoint_uodated}
                            onAudioPlay={handleAudioPlay}
                            onAudioStop={handleAudioStop}
                            activeAudio={activeAudio}
                          />
                        )
                      }) : ""
                    }
                  </div>
                </div>
              );
            }) : ""
          )
        }

      </div>
      {

        pageCount > 0 && <Paginate pageCount={pageCount} onPress={handleChangePage} activePage={activePage} />

      }

      <p className='noResult' ref={notFound} style={{ display: "none" }}>لا يوجد نتائج</p>
    </div>

  )
}
