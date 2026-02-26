import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function PoemsCard({title,desc,src,url}) {
  const navigate=useNavigate();
  let input,output;

  if(desc){
    input =desc ;

    output = input
    .replace(/\/n|n\//g, '')   
    .replace(/\/b|b\//g, '') 
    .replace(/n\\/g, '')   
    .replace(/b\\/g, '')    
    .replace(/\\n/g, '')       
    .replace(/\\b/g, '')  
    .replace(/\/r|r\//g, '')   
    .replace(/\/l|l\//g, '')   
    .replace(/\\r/g, '')   
    .replace(/\\l/g, '') 
    .replace(/r\\/g, '')       
    .replace(/l\\/g, '')      
  }
  return (
    <div className='poemsCard'>
          <Link  to={src}>
            <h2 className='poemsCardTitle'>{title}</h2>
            <p  className="poemsCardDesc" style={{ whiteSpace: "pre-line" }}>{output}</p>
          </Link>
          <button className='articleCardBtn' onClick={()=>navigate(src)}>اقرأ المزيد<FontAwesomeIcon icon={faAnglesLeft} className='moreIcon'/>  </button>
          <div style={{clear:"both"}}></div>
          {
            url&&(
              <a
              href={url}
              download
              className="download-btn-poem"
              onClick={(e) => e.stopPropagation()} 
            >
              ⬇ تحميل
            </a>
            )
          }
        

    </div>
  )
}
