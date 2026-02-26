import React, { useEffect, useState } from 'react'
import './SayingsWrite.css'
import '../../Responsive/SayingsWrittenRes.css'

import SayingWriteCard from './SayingWriteCard'
import MediaHeader from '../../MediaHeader'
import SayingsHook from '../../../../Logic/Media/Writings/Sayings/SayingsHook'
import Spinner from '../../../Utility/Spinner'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SkeletonSayingWriteCard from './SkeletonSayingWriteCard'
export default function SayingsWriteContainer() {

  const [sayingsWrittenDataLimited, sayingsPhotoDataLimited] = SayingsHook();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sayingsWrittenDataLimited && Array.isArray(sayingsWrittenDataLimited[0])) {
      setLoading(false); // عندما تكون البيانات جاهزة
    }
  }, [sayingsWrittenDataLimited]);

  return (
    <div className='sayingsWriteContainer' >
      <div className='Container'>
        <MediaHeader title="اقوال مكتوبة" src="/media/written-quotes-more" />
        <div className='sayingsWriteItems'>
          {/* {
            sayingsWrittenDataLimited && Array.isArray(sayingsWrittenDataLimited[0])?sayingsWrittenDataLimited[0].map((item)=>{
              return(
                <SayingWriteCard img={item.image}  desc={item.quote} name={item.ref} cate={item.name} key={item.id} checked={item.sharepoint_image}  />
              )
            }):""
          } */}
          {loading ? (
            // عرض Skeleton Loader أثناء تحميل البيانات
            <>
              <SkeletonSayingWriteCard />
              <SkeletonSayingWriteCard />
              <SkeletonSayingWriteCard />
              <SkeletonSayingWriteCard />
            </>
          ) : (
            sayingsWrittenDataLimited[0].map((item) => {
              return (
                <SayingWriteCard
                  img={item.image}
                  desc={item.quote}
                  name={item.ref}
                  cate={item.name}
                  key={item.id}
                  checked={item.sharepoint_image}
                />
              );
            })
          )}

        </div>
      </div>
      <ToastContainer />

    </div>
  )
}
