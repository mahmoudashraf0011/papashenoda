import React from 'react'

export default function soundsOptionsCard({ img, title, desc, onClick }) {
  return (
    <div className='soundsOptionsCard' onClick={onClick}>
      <div className='soundsOptionsCardImg'>
        <img src={img} alt='soundImg' />
      </div>
      <div className="soundsOptionsCardBet">
        <h4 className='soundsOptionsCardTitle'>{title}</h4>
        <p className='soundsOptionsCardTitleDesc'>{desc}</p>
      </div>
    </div>
  )
}
