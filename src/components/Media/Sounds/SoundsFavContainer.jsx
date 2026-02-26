import React, { useRef } from 'react'
import './SoundsFavContainer.css'
import RecentlySoundsCard from './RecentlySoundsCard'
import SoundsHeader from './SoundsHeader'
import SoundsFavCard from './SoundsFavCard'
import { useParams } from 'react-router-dom'
import SoundsFilter from './SoundsFilter'

export default function SoundsFavContainer() {
    const {title}=useParams();
  return (
    <div className='soundsFavContainer'>
            <SoundsFilter />
            {
                title =="fav"?(
                    <>
                    <SoundsHeader title="المقاطع المفضلة" />
                    <div className='favSoundsItems'>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                    </div>
                    </>

                ):title=="list"?(
                    <>
                    <SoundsHeader title="قائمة التشغيل" />
                    <div className='favSoundsItems'>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                       <SoundsFavCard img='/assets/media/sounds/rec.jpg' title="تأمل اعن المحبة"  desc="قداسة البابا شنوده الثالث"/>
                    </div>
                    </>    
                ):""
            }

    </div>
  )
}
