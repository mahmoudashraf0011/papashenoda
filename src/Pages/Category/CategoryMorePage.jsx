import React, { useEffect, useState } from 'react'
import './CategoryMorePage.css'
import { useParams } from 'react-router-dom'
import DataByCategoryHook from '../../Logic/Categories/DataByCategoryHook';
import CategoryMoreContainer from '../../components/Category/CategoryMore/CategoryMoreContainer';
import DataByCategoryMoreHook from '../../Logic/Categories/DataByCategoryMoreHook';
import BreadCrumb from '../../components/Utility/BreadCrumb'
import CatagoryFilter from '../../components/Category/CategoryFilter'

export default function CategoryMorePage() {
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);
  const { mediaID } = useParams();
  const { id } = useParams();

  const [categoryMoreData, pageCount, handleChangePage, title, path,activePage] = DataByCategoryMoreHook(id, mediaID)


  return (
    <div className='categoryMorePage'>
      <BreadCrumb data={path} value={title} />
      <div className='Container'>
        <CatagoryFilter title={title} />
      </div>
      <CategoryMoreContainer title={title} data={categoryMoreData} pageCount={pageCount} handleChangePage={handleChangePage} cate={title} activePage={activePage} />
    </div>
  )
}
