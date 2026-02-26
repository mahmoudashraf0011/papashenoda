import React from 'react'

export default function VisitsImg({ info, src, handleImageClick }) {
  return (
    <div
      className="visits-img-re"
      onClick={handleImageClick}
      style={{
        position: 'relative',
        height: '350px',
        overflow: 'hidden',
        borderRadius: '20px',
      }}
    >
      {/* Blurred background image */}
      <img
        src={src}
        alt="blurred background"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Foreground image */}
      <div className="docsCardImg">
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

        {/* Download Button */}
        <a
          href={src}
          download
          className="download-btn"
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        >
          ⬇ تحميل
        </a>
      </div>

      <div className="visits-img-abs">
        <p
          className="visits-img-abs-p"
          dangerouslySetInnerHTML={{ __html: info }}
        ></p>
      </div>
    </div>
  )
}
