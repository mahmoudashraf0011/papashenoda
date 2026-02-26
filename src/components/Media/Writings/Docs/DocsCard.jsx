import React from 'react'

export default function DocsCard({ src, handleImageClick }) {

  return (
    <div className='docsCard' onClick={() => handleImageClick(src)}>
      <div style={{
        position: 'relative', height: '350px', overflow: 'hidden', borderRadius: "20px"
      }}>

        {/* Blurred background image */}
        <img
          src={src}
          alt="blurred background"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />

        {/* Foreground image */}
        <div className='docsCardImg'>
          <img
            src={src}
            alt="docs"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          <a
            href={src}
            download
            className="download-btn"
            onClick={(e) => e.stopPropagation()} // Prevent parent click
          >
            ⬇ تحميل
          </a>
        </div>
      </div>
    </div>
  )
}
