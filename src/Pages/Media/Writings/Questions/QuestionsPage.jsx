import React, { useEffect } from 'react'
import './QuestionsPage.css'
import QuestionsBG from '../../../../components/Media/Writings/Questions/QuestionsBG'
import QuestionContainer from '../../../../components/Media/Writings/Questions/QuestionContainer'
import QuestionsFilter from '../../../../components/Media/Writings/Questions/QuestionsFilter'
import QuestionsHook from '../../../../Logic/Media/Writings/QuestionsHook'


export default function QuestionsPage() {
  const [questionsData,filterGroup,attrGroup,handleChangePage,pageCount,getData,notFound,activePage]=QuestionsHook();
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
});

window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
};
useEffect(() => {
  window.scrollTo(0, 0); // Ensure scroll starts at the top
}, []);
  return (
    <div className='questionsPage'>
      <QuestionsBG />
      <div className='Container'>
      <QuestionsFilter  cates={filterGroup} attrs={attrGroup}/>
      </div>
      <QuestionContainer data={questionsData} handleChangePage={handleChangePage}  pageCount={pageCount} notFound={notFound} activePage={activePage} />
    </div>
  )
}
