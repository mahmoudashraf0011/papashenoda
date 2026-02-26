import React, { useEffect, useState } from 'react'
import WritingsCard from './WritingsCard'
import './WritingsContainer.css'
import '../Responsive/WritingsContainerRes.css'
import WritingsHook from '../../../Logic/Media/Writings/WritingsHook'
import SkeletonWritingsCard from './SkeletonWritingsCard'
export default function WritingsContainer() {
  const [writingsData] = WritingsHook()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (writingsData && Array.isArray(writingsData[0])) {
      setLoading(false); // يتم إيقاف التحميل عندما تكون البيانات جاهزة
    }
  }, [writingsData]);

  return (
    <div className='writingsContainer'>
      <div className='Container'>
        <div className='writingsItems'>
          {/* {
            writingsData && Array.isArray(writingsData[0]) ? writingsData[0].map((item) => {
              return (
                <WritingsCard img={item.image} title={item.name} desc={item.description} src={`/media/${item.slug}`} key={item.id} />
              )
            }) : ""
          } */}
          {loading ? (
            // عرض Skeleton Loader عند انتظار تحميل البيانات
            <>
              <SkeletonWritingsCard />
              <SkeletonWritingsCard />
              <SkeletonWritingsCard />
              <SkeletonWritingsCard />
              <SkeletonWritingsCard />
            </>
          ) : (
            writingsData[0].map((item) => {
              return (
                <WritingsCard
                  img={item.image}
                  title={item.name}
                  desc={item.description}
                  src={`/media/${item.slug}`}
                  key={item.id}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}
