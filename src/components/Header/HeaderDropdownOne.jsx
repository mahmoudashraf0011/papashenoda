// HeaderDropdownOne
import React, { useEffect, useRef, useState } from 'react'
import HeaderAcc from './HeaderAcc';
import { Link } from 'react-router-dom';

export default function HeaderDropdownOne({ categories = [], openHeaderTwo, setOpenHeaderTwo ,closeDp}) {

    const [hoveredCategory, setHoveredCategory] = useState(false);
    const [checkChildren, setCheckChildern] = useState(null);
    const [hoveredImg, setHoveredImg] = useState(null);

    useEffect(() => {
        if (categories.length > 0) {
            setHoveredCategory(categories[0]);
        }
    }, [categories]);

    const closeWrapper = () => {
        setOpenHeaderTwo(false);
        document.querySelector(".overlayLight").style.display = "none";
    }

    const headsRef = useRef([]);

    useEffect(()=>{
        if (!hoveredCategory) return;
        headsRef.current.forEach((el) => {
            if (el?.id == hoveredCategory.id) {
                headsRef.current.forEach((el) => el.classList && el.classList.remove("activeHead"))
                el.classList.add("activeHead")
                const img = el.querySelector("img"); // get the <img> inside this element
                if (img) img.src = hoveredCategory.image_icon_hover;
            }
        });
        if(hoveredCategory.childern){
            setCheckChildern(true)
        }else{
            setCheckChildern(false)
        }
    },[openHeaderTwo, hoveredCategory, categories])

    return (
        <>
            {openHeaderTwo && (
                <div className="header-bottom-right-dropInfo scrolled" onMouseLeave={()=>closeDp()}>
                    <div className="header-bottom-right-dropInfo-left" >
                        {hoveredCategory && hoveredCategory.id&&(
                            <>
                            <p className='header-title-none'>{hoveredCategory.name}</p>
                            </>
                        )}

                        {hoveredCategory && <HeaderAcc categories={hoveredCategory} closeWrapper={closeWrapper} />}
                        {
                            hoveredCategory.children?.length > 0?<a href={`/category/${hoveredCategory.slug}`} className='header-bottom-right-dropInfo-topic-headunderline ' >عرض الكل</a> : ""
                        }
                    </div>

                    <div className="header-line-one"></div>

                    <div className="header-bottom-right-dropInfo-right">
                        {categories && categories.map((category,index) => (

                            <Link className="header-bottom-right-dropInfo-topic" key={category.id}
                            id={category.id}
                                to={`/category/${category.slug}`}
                                onMouseEnter={() => {
                                    setHoveredCategory(category);
                                    setHoveredImg(true);
                                }}
                                onClick={() => {
                                    closeWrapper();
                                    document.querySelector(".overlayLight").style.display = "none";
                                }}
                                ref={(el) => {
                                    if (el) {
                                      headsRef.current[index] = el;
                                    }
                                  }}
                                >
                                <p className=''>{category.name}</p>
                                <img   src={hoveredCategory?.id === category.id ? category.image_icon_hover : category.image_icon}
 alt="" className='header-bottom-right-img' />
                            </Link>

                        ))}

                    </div>
                </div>
            )}
        </>
    )
}
