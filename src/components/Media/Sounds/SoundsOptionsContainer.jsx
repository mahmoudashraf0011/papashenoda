import React, { useEffect, useState, useContext } from 'react'
import SoundsHeader from './SoundsHeader'
import ChooseCard from './soundsOptionsCard'
import './SoundsOptionsContainer.css'
import axios from 'axios'
import { UserContext } from '../../Context/UserContext'
import SkeletonLoading from './SkeletonLoadingSound'

export default function ChooseContainer() {
  const [showMore, setShowMore] = useState(false);
  const { baseURL, setCategoryId } = useContext(UserContext);
  const [media, setMedia] = useState('');
  const [loading, setLoading] = useState(true);  // حالة التحميل

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    axios.get(`${baseURL}/getmedia/5`)
      .then((response) => {
        setMedia(response.data.data);
        setLoading(false); // بعد التحميل نقوم بتغيير حالة التحميل إلى false
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // في حالة حدوث خطأ نقوم بإيقاف التحميل
      });
  }, [baseURL]);

  const SendCategoryId = (id, name) => {
    setCategoryId({ id, name });
  };

  return (
    <>
      <div className='soundsOptionsContainer'>
        <SoundsHeader title="أبرز الاختيارات" />

        <div className="soundsOptionsRed">
          <div className='soundsOptionsItems'>
            {/* إذا كانت البيانات قيد التحميل، نعرض Skeleton Loading */}
            {loading ? (
              <SkeletonLoading />
            ) : (
              media && media.slice(0, 5).map((med, index) => (
                <ChooseCard
                  img={med.sharepoint_image ? med.image : "/assets/default/sounds/Audio-Highlights - DF.png"}
                  title={med.name}
                  key={index}
                  desc="قداسة البابا شنوده الثالث"
                  onClick={() => {
                    SendCategoryId(med.id, med.name);
                    setShowMore(false);
                    window.scrollTo({
                      top: 500,
                      behavior: "smooth"
                    });
                  }}
                />
              ))
            )}

            {showMore && !loading && (
              <>
                {media && media.slice(5).map((med, index) => (
                  <ChooseCard
                    img={med.sharepoint_image ? med.image : "/assets/default/sounds/Audio-Highlights - DF.png"}
                    title={med.name}
                    key={index}
                    desc="قداسة البابا شنوده الثالث"
                    onClick={() => {
                      SendCategoryId(med.id, med.name);
                      setShowMore(false);
                      window.scrollTo({
                        top: 500,
                        behavior: "smooth"
                      });
                    }}
                  />
                ))}
              </>
            )}
          </div>
          <p className="soundsOptionsMore" onClick={handleShowMore}>{showMore ? "عرض اقل" : "المزيد"}</p>
        </div>
      </div>

      {/* لعرض نفس الـ Skeleton في القسم الآخر أيضا */}
      <div className="soundsOptionsRedRes" style={{ display: "none" }}>
        <div className='soundsOptionsItems'>
          {loading ? (
            <SkeletonLoading />
          ) : (
            media && media.slice(0, 4).map((med, index) => (
              <ChooseCard
                img={med.sharepoint_image ? med.image : "/assets/default/sounds/Audio-Highlights - DF.png"}
                title={med.name}
                key={index}
                desc="قداسة البابا شنوده الثالث"
                onClick={() => {
                  SendCategoryId(med.id, med.name);
                  setShowMore(false);
                  window.scrollTo({
                    top: 500,
                    behavior: "smooth"
                  });
                }}
              />
            ))
          )}

          {showMore && !loading && (
            <>
              {media && media.slice(5).map((med, index) => (
                <ChooseCard
                  img={med.sharepoint_image ? med.image : "/assets/default/sounds/Audio-Highlights - DF.png"}
                  title={med.name}
                  key={index}
                  desc="قداسة البابا شنوده الثالث"
                  onClick={() => {
                    SendCategoryId(med.id, med.name);
                    setShowMore(false);
                    window.scrollTo({
                      top: 500,
                      behavior: "smooth"
                    });
                  }}
                />
              ))}
            </>
          )}
        </div>
        <p className="soundsOptionsMore" onClick={handleShowMore}>{showMore ? "عرض اقل" : "المزيد"}</p>
      </div>
    </>
  );
}
