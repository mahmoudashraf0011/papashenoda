import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './CategoryPage.css'
import './Responsive/CategoryRes.css'
import CatagoryFilter from '../../components/Category/CategoryFilter'
import CategoryContainer from '../../components/Category/CategoryContainer'
import BreadCrumb from '../../components/Utility/BreadCrumb'
import DataByCategoryHook from '../../Logic/Categories/DataByCategoryHook'
import CategoryFilter from '../../components/Category/CategoryFilter'
import { ToastContainer } from 'react-toastify'

export default function CategoryPage() {
  const [newID,setNewID]=useState();
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
let {id}=useParams();
  useEffect(()=>{
setNewID(id)
  },[id])
  useEffect(() => {
    console.log("Updated newID:", newID);
  }, [newID]);
  const [categoryBookData,categoryGalleryData,categoryVideoData,categoryArticleData,categorySoundData,categorySayingsData,categoryPhotoSayingsData,categoryPoemsData,categoryQuestionsData,categoryHappenData,categoryDocsData,categoryTitle,categoryPath,all,check,ele,loading]=DataByCategoryHook(newID);

  return (
    <div className='virtuesPage'>
        <BreadCrumb data={categoryPath} value={categoryTitle} />
        <div className='Container'>
         <CategoryFilter title={categoryTitle}  />
        </div>
        <CategoryContainer categoryBookData={categoryBookData} categoryArticleData={categoryArticleData} categoryGalleryData={categoryGalleryData} categoryVideoData={categoryVideoData} categorySoundData={categorySoundData} categorySayingsData={categorySayingsData} categoryPhotoSayingsData={categoryPhotoSayingsData} categoryPoemsData={categoryPoemsData} categoryQuestionsData={categoryQuestionsData} categoryHappenData={categoryHappenData} categoryDocsData={categoryDocsData}  all={all} check={check} ele={ele} loading={loading} cate={categoryTitle}/>

    </div>
  )
}
