
import React, { useEffect } from 'react'
import './SayingFilterPage.css'
import SayingsBG from '../../../../components/Media/Writings/Sayings/SayingsBG'
import SayingsWriteContainer from '../../../../components/Media/Writings/Sayings/SayingsWriteContainer'
import SayingsPhotoContainer from '../../../../components/Media/Writings/Sayings/SayingsPhotoContainer'
import SayingFilterContainer from '../../../../components/Media/Writings/Sayings/SayingFilter/SayingFilterContainer'
import SayingFilterion from '../../../../components/Media/Writings/Sayings/SayingFilter/SayingFilterion'
import SayingsDetailsHook from '../../../../Logic/Media/Writings/Sayings/SayingsDetailsHook'
import { useParams } from 'react-router-dom'
import SayingsPhotoFilterion from '../../../../components/Media/Writings/Sayings/SayingFilter/SayingsPhotoFilterion'

export default function SayingWrittenPage() {
  const [sayingsWrittenData,sayingsPhotoData,sayingsWrittenFilter,sayingsPhotoFilter,pageCountSP,pageCountSW,sayingsPhotoAttrs,sayingsWrittenAttrs,handleChangePageSW,handleChangePageSP,getData,notFound,notFoundWrite]=SayingsDetailsHook();
  const {id}=useParams();
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
  console.log("sayingID",id);
}, []);
console.log(id)

  return (
    <div className='sayingFilterPage'>
        <div className='Container'>
            {
          <SayingFilterion cates={sayingsWrittenFilter} attrs={sayingsWrittenAttrs} />

            }
        </div>

            <SayingFilterContainer />
    </div>
  )
}
