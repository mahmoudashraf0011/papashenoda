import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import '../../components/Home/Responsive/HomeRes.css'
import Background from '../../components/Home/Background'
import MediaGallery from '../../components/Home/MediaGallery'
import Meditations from '../../components/Home/Meditations'
import VisitBG from '../../components/Home/VisitBG'
import Sayings from '../../components/Home/Sayings'
import DownloadApp from '../../components/Home/DownloadApp'
import Events from '../../components/Home/Events'
import { Link } from 'react-router-dom'
import { ProgressBar } from 'primereact/progressbar';
import "swiper/css/pagination";
import { SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Swiper from 'swiper'
import { getRandomQuoteAction } from '../../redux/actions/RandomQuoteActions'
import { useDispatch, useSelector } from 'react-redux'
import { gapi } from 'gapi-script';
import YouTubePrivateVideo from './file'
// const videoId = 'gbGIp7pBeAA';
// const privateKey = 'AIzaSyD3YnYJp_REly-mSUt5USZEy_rqQVv6S44';


// const YouTubePrivateVideo = ({ videoId, clientId }) => {
//   useEffect(() => {
//     const loadScript = (src) => {
//       return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = src;
//         script.async = true;
//         script.onload = resolve;
//         document.body.appendChild(script);
//       });
//     };

//     const initializePlayer = async () => {
//       await loadScript('https://apis.google.com/js/api.js');
//       await loadScript('https://www.youtube.com/iframe_api');

//       gapi.load('client:auth2', () => {
//         gapi.client
//           .init({
//             clientId: clientId, // Replace with your OAuth Client ID
//             scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
//           })
//           .then(() => {
//             const authInstance = gapi.auth2.getAuthInstance();
//             if (!authInstance.isSignedIn.get()) {
//               authInstance.signIn(); // Prompt the user to sign in
//             }

//             window.onYouTubeIframeAPIReady = () => {
//               new YT.Player('youtube-player', {
//                 videoId: videoId,
//                 events: {
//                   onReady: (event) => {
//                     event.target.playVideo();
//                   },
//                 },
//               });
//             };
//           });
//       });
//     };

//     initializePlayer();
//   }, [videoId, clientId]);

//   return <div id="youtube-player" style={{ width: '560px', height: '315px' }}></div>;
// };
const convertVideo = (video) => {
  if (video) {
    const videoId = new URL(video).searchParams.get('v');
    const videoSrc = `https://www.youtube.com/embed/${videoId}`;
    return videoSrc
  }
}
function isImageType(url) {
  console.log("sss", url);
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
}
export default function Home() {
  window.addEventListener('hashchange', function (e) {
    e.preventDefault();
  });

  window.onload = function () {
    window.history.replaceState(null, null, ' '); // Clear hash if any
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at the top
  }, []);
  const [img, setImg] = useState("/assets/noteIcon.png")
  const randowQuote = useRef();
  const dispatch = useDispatch();
  const getData = async () => {
    await dispatch(getRandomQuoteAction())

  }
  useEffect(() => {
    if (img == "/assets/noteIcon.png") {
      getData();

    }
  }, [img])
  const res = useSelector(state => state.RandomQuoteReducer.randomQuoteData);

  let Data = {};
  try {
    if (res) {
      if (res.data) {
        Data = { ...res.data }
      }
    }
  } catch (e) {
    console.log(e);
  }

  const onOpenRandomQuote = () => {
    if (img == "/assets/noteIcon.png") {
      setImg("/assets/close.png")
      randowQuote.current.style.display = "block"
    } else {
      setImg("/assets/noteIcon.png")
      randowQuote.current.style.display = "none"
    }
  }
  // get image from on Drive
  function convertOneDriveLink(onedriveUrl) {
    try {
      const url = new URL(onedriveUrl);
      const fileId = url.searchParams.get('id');
      if (!fileId) {
        console.error("Invalid OneDrive URL or 'id' parameter missing.");
        return null;
      }
      const directLink = `https://popeshenoudaacademy-my.sharepoint.com/personal/msoul4_zvf-eg_org/Documents/Audios 01-%D9%84%D9%85%D8%A7%D8%B0%D8%A7%20%D8%AA%D9%82%D8%B1%D8%A3%D9%88%D9%86%D9%8A%20%D9%82%D8%B1%D9%88%D8%A1%D8%9F%2013-07-1978.mp3`;
      return directLink;
    } catch (error) {
      console.error("Error processing OneDrive URL:", error.message);
      return null;
    }
  }
  let imageUrl = Data.image_url != null && isImageType(Data.image_url) ? Data.image_url : `/assets/media/writings/Sayings/img1.png`;

  useEffect(() => {
    if (isImageType(imageUrl)) {
    } else {
      imageUrl = "/assets/media/writings/Sayings/img1.png"
    }
  }, [img])
  // const YouTubePrivateVideos = ({ videoId }) => {
  //   useEffect(() => {
  //     const loadAuth = () => {
  //       gapi.load('client:auth2', () => {
  //         gapi.client.init({
  //           clientId: '19192798554-9cd6dhmhs8rkq8028phh2uuagvmp4rfu.apps.googleusercontent.com',
  //           scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
  //         }).then(() => {
  //           gapi.auth2.getAuthInstance().signIn();
  //         });
  //       });
  //     };
  //     loadAuth();
  //   }, []);
  // }

  return (
    <section className='Home'>
      <Background />
      <MediaGallery />
      <Meditations />
      <VisitBG />
      <Sayings />
      <DownloadApp />
      <Events />
      <div className='randomQoute'>

        <div className='randomQouteDropDown'>
          <div className="randomQouteDropDownContent">
            <div className='randomQouteImg'>
              <img src={img} alt='noteImg' onClick={onOpenRandomQuote} />
            </div>
            <div className='randomCard' ref={randowQuote}>
              {
                Data ?
                  <>
                    <div className='randomWriteCardImg' key={Data.id}>
                      <img src={imageUrl} alt='img' />
                    </div>
                    <div className='randomWriteCardContent'>
                      <img className='signQuote saywImg' src='/assets/media/writings/Sayings/q1.png' alt='img' />
                      <p className='randomWriteCardDesc scrolled' dangerouslySetInnerHTML={{ __html: Data.quote }}></p>
                      <div className='randomWriteCardSign'>
                        <h3 className='randomWriteCardSignName'> {Data.ref}</h3>
                        <span className='randomWriteCardCategory'>{Data.name}</span>
                      </div>
                    </div>
                  </>

                  : ""
              }


            </div>
          </div>

        </div>
      </div>

      <div>

      </div>
    </section>
  )
}
