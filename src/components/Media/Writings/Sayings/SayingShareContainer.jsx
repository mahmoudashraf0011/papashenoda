import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../Utility/MultimediaShare.css";

export default function SayingShareContainer({
  closeOverlay,
  currentPath,
  img,
  desc,
  name,
  cate,
  height,
}) {
  // Copy Link
  const linkRef = useRef();
  const copyLink = async () => {
    try {
      const message = linkRef.current.innerText || linkRef.current.textContent;
      await navigator.clipboard.writeText(message);
      toast.success("تم النسخ بنجاح");
    } catch (error) {
      toast.error("عذرا ..قم بالمحاولة لاحقا");
      console.error("Failed to copy:", error);
    }
  };

  // Shared data with X
  function shareOnX() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}`;
    window.open(twitterUrl, "_blank");
  }

  // Shared data with WhatsApp
  function shareOnWhatsApp() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  // Shared data with Instagram
  function shareOnInstagram() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `\n\n"${plainTextDesc}"\n\n- ${name} (${cate})`;

    // Copy the message to the clipboard
    navigator.clipboard
      .writeText(message)
      .then(() => {
        // Open Instagram website
        window.open("https://www.instagram.com/create/style/", "_blank");
      })
      .catch((err) => {
        alert("Failed to copy text to clipboard. Please try again.");
      });
  }

  // Shared data with FaceBook
  function shareOnFacebook() {
    try {
      const plainTextDesc = desc
        ? desc.replace(/<[^>]+>/g, "")
        : "Check this out!";
      const message = `"${plainTextDesc}"\n\n- ${name || "Anonymous"} (${
        cate || "Category"
      })`;
      const url = window.location.href;

      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(message)}`;

      window.open(facebookUrl, "_blank");
    } catch (error) {
      console.error("Error sharing on Facebook:", error);
    }
  }

  // Shared data with SnapChat
  function shareOnSnapchat() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `"${plainTextDesc}"\n\n- ${name} (${cate})`;
    const snapchatUrl = `https://www.snapchat.com/add/your_snapchat_username`;
    navigator.clipboard
      .writeText(message)
      .then(() => {
        window.open(snapchatUrl, "_blank");
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  }

  // Shared data with Tiktok
  function shareOnTikTok() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `"${plainTextDesc}"\n\n- ${name} (${cate})`;
    navigator.clipboard
      .writeText(message)
      .then(() => {
        window.open("https://www.tiktok.com/", "_blank");
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  }

  // Shared data with Massenger
  function shareOnMessenger() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "");
    const message = `"${plainTextDesc}"\n\n- ${name} (${cate})`;
    navigator.clipboard.writeText(message);
    const linkWithMessage = `${
      window.location.href
    }?sharedMessage=${encodeURIComponent(message)}`;
    const messengerUrl = `https://m.me?link=${encodeURIComponent(
      linkWithMessage
    )}`;

    window.open(messengerUrl, "_blank");
  }

  // Shared data with Telegram
  function shareOnTelegram() {
    const plainTextDesc = desc.replace(/<[^>]+>/g, "").trim();

    // Truncate description to 200 characters
    const truncatedDesc =
      plainTextDesc.length > 200
        ? plainTextDesc.substring(0, 200) + ".. للمزيد قم بزيارة الموقع.."
        : plainTextDesc;

    const message = `"${truncatedDesc}"\n\n- ${name} (${cate})`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(message)}`;

    console.log("Generated Telegram URL:", telegramUrl); // Debugging
    window.open(telegramUrl, "_blank");
  }

  return (
    <div className="saying overlay shared">
      <div className="overlay-wrapper">
        <div className="overlayCard shareCard" style={{ height: height }}>
          <div className="overlayCardHead" style={{ marginTop: "-5%" }}>
            <img
              src="/assets/share/close.png"
              alt=""
              className="sharedCancel sharedCancel1"
              onClick={closeOverlay}
            />
            <span className="overlayCardHeadTitle sharedTitle1">مشاركة</span>
          </div>
          <div className="shareItems">
            <div className="shareItem" onClick={shareOnX}>
              <div className="shareItemImg">
                <img src="/assets/share/x.png" />
              </div>
              <span>إكس</span>
            </div>
            <div className="shareItem" onClick={shareOnWhatsApp}>
              <div className="shareItemImg">
                <img src="/assets/share/whats.png" />
              </div>
              <span>واتساب</span>
            </div>
            {/* <div className='shareItem' onClick={shareOnInstagram}>
                    <div className='shareItemImg'>
                        <img src='/assets/share/insta.png'/>
                    </div>
                    <span>إنستجرام</span>
                </div> */}
            <div className="shareItem" onClick={shareOnFacebook}>
              <div className="shareItemImg face">
                <img src="/assets/share/face.png" />
              </div>
              <span>فيسبوك</span>
            </div>
            <div className="shareItem" onClick={shareOnTelegram}>
              <div className="shareItemImg">
                <img src="/assets/share/tel.png" />
              </div>
              <span>تيليجرام</span>
            </div>
          </div>
          {/* <div className='shareItem' onClick={shareOnSnapchat}>
                    <div className='shareItemImg'>
                            <img src='/assets/share/snapchat.png'/>
                    </div>
                        <span>سناب شات</span>
                </div> */}
          {/* <div className='shareItem' onClick={shareOnTikTok}>
                    <div className='shareItemImg'>
                        <img src='/assets/share/tiktok.png'/>
                    </div>
                    <span>تيك توك</span>
                </div> */}
          {/* <div className='shareItem' onClick={shareOnMessenger}>
                    <div className='shareItemImg'>
                        <img src='/assets/share/massenger.png'/>
                    </div>
                    <span>ماسنجر</span>
                </div> */}

          <div className="shareLink">
            <h3 className="shareLinkTitle">رابط الصفحة</h3>
            <div className="shareLinkContent">
              <p className="shareLinkContentDesc" style={{whiteSpace:"nowrap",direction:"ltr",width:"70%",textOverflow:"ellipsis",overflow:"hidden"}} ref={linkRef}>
                {currentPath}
              </p>
              <img
                src="/assets/copy.png"
                alt="copy"
                className="shareLinkContentImg"
                onClick={copyLink}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
