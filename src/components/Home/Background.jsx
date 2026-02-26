import React from 'react'
import './Background.css'

export default function Background() {
  return (
    <div className="bg">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto" 
        poster="/fallback.jpg" // fallback image for iOS low power mode
      >
        <source src="https://popeshenoudatest.msol.dev/bg.mp4" type="video/mp4" />
        {/* Extra fallback for browsers without video support */}
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
