import React, { useState, useContext, useEffect } from 'react'
import './DisplayGallery.scss'
import { Link, useLocation, useParams } from 'react-router-dom'
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import GalleryHook from '../../Logic/Gallery/GalleryHook';

export default function DisplayGallery() {
    const { baseURL } = useContext(UserContext);
    const [displayGallery, setDisplayGallery] = useState('');
    const location = useLocation();
    const extraContent = location.state?.extraContent;
    const name = location.state?.name;
    const slug = location.state?.slug;

    window.addEventListener('hashchange', function (e) {
        e.preventDefault();
    });
    
    // window.onload = function () {
    //     window.history.replaceState(null, null, ' ');
    // };
    useEffect(() => {
      window.scrollTo(0, 0); 
      if(extraContent.length==0){
        console.log("extraContent",extraContent);

      }
      console.log("extraContent",slug);

    }, []);

    const [galleryData]=GalleryHook(slug)
    return (
        <div className='display-gallery'>
            <div className="display-gallery-wrapper">
                <p className='display-gallery-about'>{name}</p>


                <div className="display-gallery-imgs-cont">


                    <div className="display-gallery-left-imgs">
                    {
                        extraContent.length > 0 ? (
                            extraContent.map((image, index) => {
                            if (image.children?.length === 0) {
                                return (
                                <Link to={`/gallerymedia/${image.slug}`} className="display-gallery-img-cont4" key={index}>
                                    <img
                                            src={image.image}
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
                                            <div className='docsCardImg'>
                                            <img
                                                src={image.image}
                                                alt="docs"
                                                style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                }}
                                            />
                                            </div>

                                    <p className="display-gallery-visits">{image.name}</p>
                                </Link>
                                );
                            } else {
                                return (
                                <Link
                                    to={`/displaygallery`}
                               state={{ extraContent: image.children, name:image.info,slug:slug,hero_image:image.hero_image}} 
                                    className="display-gallery-img-cont4"
                                    key={index}
                                >
                                    <img src={image.image} alt="" className="display-gallery-img4" />
                                    <p className="display-gallery-visits">{image.name}</p>
                                </Link>
                                );
                            }
                            })
                        ) : galleryData ? (
                            galleryData.map((image, index) => (
                            <div className="display-gallery-img-cont4" key={index}>
                                <img src={image.image} alt="" className="display-gallery-img4" />
                                <p className="display-gallery-visits">{image.name}</p>
                            </div>
                            ))
                        ) : null
                        }
                        

                    </div>

                </div>

            </div>
        </div>
    )
}
