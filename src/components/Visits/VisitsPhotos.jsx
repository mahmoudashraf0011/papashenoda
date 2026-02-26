import React, { useContext, useState } from 'react'
import VisitsImg from './VisitsImg'
import { UserContext } from '../Context/UserContext';


export default function VisitsPhotos({handleImageClick,visitsImgs}) {

  

    return (
        <div className="visits-imgs-cont">

            {visitsImgs && visitsImgs.images.map((img, index) => (


                <VisitsImg info={img.description} src={img.image} key={index} handleImageClick={()=>handleImageClick(index)}/>
            ))}

            
        </div>
    )
}
