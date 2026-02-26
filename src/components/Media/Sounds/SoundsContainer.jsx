import React, { useContext } from 'react'
import SoundsOptionsContainer from './SoundsOptionsContainer'
import RecentlySoundsContainer from './RecentlySoundsContainer'
import './SoundsContainer.css'
import SoundsFilter from './SoundsFilter'
import { UserContext } from '../../Context/UserContext'

export default function SoundsContainer() {

  const { clicked } = useContext(UserContext);
  return (
    <div className='soundsLeft'>
      {clicked && (<SoundsFilter />)}
      <div className='soundsContainer'>
        <SoundsOptionsContainer />
        <RecentlySoundsContainer />
      </div>

    </div>
  )
}
