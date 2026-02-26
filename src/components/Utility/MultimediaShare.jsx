import React, { useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./MultimediaShare.css"

export default function MultimediaShare({closeOverlay,text}) {
    // Copy Link
    const linkMediaRef=useRef();
    const copyLink = async () => {
        try {
            const message = linkMediaRef.current.innerText || linkMediaRef.current.textContent;
            await navigator.clipboard.writeText(message);
            toast.success("تم النسخ بنجاح");
        } catch (error) {
            toast.error("عذرا ..قم بالمحاولة لاحقا");
            console.error("Failed to copy:", error);
        }
    };

    // Shared data with X
    function shareMediaOnX() {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, "_blank");
    }

    // Shared data with WhatsApp
    function shareMediaOnWhatsApp() {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    }

    // Shared data with Telegram
    function shareMediaOnTelegram() {

        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
        
        console.log("Generated Telegram URL:", telegramUrl); // Debugging
        window.open(telegramUrl, "_blank");
    }
    // Shared data with FaceBook
    function shareMediaOnFacebook() {
        try {
            const url = window.location.href;

            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;

            window.open(facebookUrl, "_blank");
        } catch (error) {
            console.error("Error sharing on Facebook:", error);
        }
    }
  return (
    <div className="saying overlay shared "  >
    <div className="overlay-wrapper">
    <div className="overlayCard shareCard multiMedia " style={{height:"60%",direction:"rtl",top:"50%"}}  >
       <div className='overlayCardHead'>
        <img src="/assets/share/close.png" alt="" className='sharedCancel' onClick={closeOverlay} />
        <span className='overlayCardHeadTitle'>مشاركة</span>
       </div>
       <div className='shareItems' >
           <div className='shareItem' onClick={shareMediaOnX}>
               <div className='shareItemImg'>
                   <img src='/assets/share/x.png'/>
               </div>
               <span>إكس</span>
           </div>
           <div className='shareItem' onClick={shareMediaOnWhatsApp}>
               <div className='shareItemImg'>
                   <img src='/assets/share/whats.png'/>
               </div>
               <span>واتساب</span>
           </div>
           <div className='shareItem' onClick={shareMediaOnFacebook}>
               <div className='shareItemImg face'>
                   <img src='/assets/share/face.png'/>
               </div>
               <span>فيسبوك</span>
           </div>
           <div className='shareItem' onClick={shareMediaOnTelegram}>
               <div className='shareItemImg'>
                   <img src='/assets/share/tel.png'/>
               </div>
               <span>تيليجرام</span>
           </div>
       </div>

       <div className='shareLink'>
           <h3 className='shareLinkTitle' style={{marginLeft:"75%"}}>رابط الصفحة</h3>
           <div className='shareLinkContent' style={{marginLeft:"15px",width:"100%",marginBottom:"15%"}}>
               <p className='shareLinkContentDesc' style={{whiteSpace:"nowrap",direction:"ltr",width:"70%",textOverflow:"ellipsis",overflow:"hidden"}} ref={linkMediaRef}>{text}</p>
               <img src='/assets/copy.png' alt='copy'  className='shareLinkContentImg' onClick={copyLink}/>
           </div>
       </div>

    </div>

   </div>

</div>
  )
}
