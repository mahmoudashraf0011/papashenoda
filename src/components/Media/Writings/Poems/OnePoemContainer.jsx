import React, { useEffect, useRef } from 'react'
import './OnePoemContainer.css'
import '../../Responsive/PoemsRes.css'
import MediaHeader from '../../MediaHeader'
import OnePoemHook from '../../../../Logic/Media/Writings/Poems/OnePoemHook'
import { Link, useParams } from 'react-router-dom'
import Spinner from './../../../Utility/Spinner';
export default function OnePoemContainer() {
  const convertVideo=(video)=>{
    console.log(video);
    try {
      const videoID = video.match(/(?:youtu\.be\/|v=)([^&/]+)/)[0];
      const videoSrc = `https://www.youtube.com/embed/${videoID}`;
      return videoSrc
    } catch (error) {
      return video
    }
  }
  const { id } = useParams();
  const [onePoemData,loading] = OnePoemHook(id);
  let input, output;
  if (onePoemData[0] && onePoemData[0].poem) {
    input = onePoemData[0].poem;
    
    // Replace all variations of "n" markers with an actual newline.
    input = input.replace(/(?:\s*\/n\s*n\/\s*|\\n\s*n\\|\s*\/n|\s*n\/|\s*\\n|\s*n\\|\s*\bn\b\s*)/g, "\n");
  
    // Split on newlines.
    const lines = input.split(/\n+/);
    console.log("Lines:", lines);
    
    let rightLines = [];
    let leftLines = [];
    
    // Match all marker variations for right, left, and break markers.
    const markerRegex = /\/r|r\/|\\r|r\\|\/l|l\/|\\l|l\\|\/b|b\/|\\b|b\\/g;
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        leftLines.push(`<br><br>`);
        rightLines.push(`<br><br>`);
        return;
      }
    
      let lastIndex = 0;
      let match;
    
      while ((match = markerRegex.exec(trimmed)) !== null) {
        const marker = match[0];
        const index = match.index;
        const chunk = trimmed.slice(lastIndex, index).trim();
    
        // Handle text chunk before the marker
        if (chunk) {
          if (/r/.test(marker)) {
            rightLines.push(`<div class="poem-line">${chunk}</div>`);
          } else if (/l/.test(marker)) {
            leftLines.push(`<div class="poem-line">${chunk}</div>`);
          }
        }
    
        // Handle break marker
        if (/b/.test(marker)) {
          leftLines.push(`<br><br>`);
          rightLines.push(`<br><br>`);
        }
    
        lastIndex = index + marker.length;
      }
    
      // Handle remaining text after the last marker
      const remaining = trimmed.slice(lastIndex).trim();
      if (remaining) {
        // Decide where to push the remaining text.
        if (match && /r/.test(match[0])) {
          rightLines.push(`<div class="poem-line">${remaining}</div>`);
        } else if (match && /l/.test(match[0])) {
          leftLines.push(`<div class="poem-line">${remaining}</div>`);
        } else {
          rightLines.push(`<div class="poem-line">${remaining}</div>`);
        }
      }
    });
    
    output = `
      <div class="poem-flex-container">
        <div class="poem-left-column poem-column">
          ${leftLines.join('\n')}
        </div>
        <div class="poem-right-column poem-column">
          ${rightLines.join('\n')}
        </div>
      </div>
    `;
  }
  return (
    
     loading ? 
     <div style={{ marginTop:"300px" }}>
          <Spinner />
     </div>

     :

      <div className='onePoemContainer'>
               <div className='breadCrumbContainer'  >
            <div className='Container'>
              <ul className="breadCrumb" >
                      <li><Link >{onePoemData[0]&&onePoemData[0].name}</Link></li>
                      <li><Link to={`/media/poems`}>قصائد</Link></li>
                      <li><Link to={`/media/writings`}>مقالات وكتابات اخري</Link></li>
                      <li><Link to={`/`}>الرئيسية</Link></li>
              </ul>
            </div> 
          </div>
      <div className='Container'>
        
      <MediaHeader  title={`قصيدة ${onePoemData[0]&&onePoemData[0].name}`} />
          <div className='onPoemItems'>
              <div className='onPoemContent'>
                      {
                          onePoemData[0]&&<p style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: output }}></p>
                      }
              </div>
              <div className="onPoemContentImg" style={{ position:"relative" }}>
                  <img src={onePoemData[0]&&onePoemData[0].sharepoint_image?onePoemData[0].image:"/assets/default/poems/Poem -inside.png"}  />
                  {
                    onePoemData[0]&&onePoemData[0].sharepoint_image&&(
                      <a
                      href={onePoemData[0].image}
                      download
                      className="download-btn-poem"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      ⬇ تحميل
                    </a>
                    )
                  }
                 
              </div>
          </div>
      </div>
      {onePoemData[0] && onePoemData[0].url && (
        <div className='onPoemVideo' id='videoPlay' style={{ position:"relative" }}>
          <video controls>
            <source src={onePoemData[0] && onePoemData[0].url} type="video/mp4" />
          </video>
          <a
              href={onePoemData[0].url}
              download
              className="download-btn-poem"
              onClick={(e) => e.stopPropagation()} 
            >
              ⬇ تحميل
            </a>
        </div>
      )}
      </div>
    
        
   
  )
}