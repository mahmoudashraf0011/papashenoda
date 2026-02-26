import React, { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Link } from 'react-router-dom';

export default function HeaderAcc({ categories, closeWrapper }) {
    const midIndex = Math.ceil(categories.children.length / 2);
    const leftCategories = categories.children.slice(0, midIndex);
    const rightCategories = categories.children.slice(midIndex);
    const [activeIndex, setActiveIndex] = useState([]);

    return (
        <div className="header-bottom-right-dropInfo-dropdowns">

            <div className="header-bottom-right-dropInfo-flex">
                {rightCategories && rightCategories.map((child,index) => {
                    return child.children?.length > 0 ? (
                        <Accordion multiple  className={`accordion-right ${activeIndex.includes(index) ? 'activeHead' : ''}`}
                        activeIndex={activeIndex}
                         >
                            <AccordionTab 
                                header={
                                    <>
                                        <i className="pi pi-chevron-down custom-static-icon" />
                                        {/* <Link to={`/category/${child.slug}`}>{child.name}</Link> */}
                                        <p >{child.name}</p>

                                    </>
                                }
                            >

                                {child.children.map((subchild) => {

                                    return subchild.children?.length > 0 ? (
                                        <Accordion multiple className="accordion-subchild" key={subchild.id}>
                                            <AccordionTab 
                                                header={
                                                    <>
                                                        <i className="pi pi-chevron-down custom-static-icon" />
                                                        {/* <Link to={`/category/${subchild.slug}`}>{subchild.name}</Link> */}
                                                        <p >{subchild.name}</p>


                                                    </>
                                                }
                                            >
                                                {subchild.children.map((grandchild) => (
                                                    <Link 
                                                        to={`/category/${grandchild.slug}`} 
                                                        className="m-0 header-non-acc-p3" 
                                                        key={grandchild.id} 
                                                        onClick={() => closeWrapper()}
                                                    >
                                                        {grandchild.name}
                                                    </Link>
                                                    
                                                ))}
                                                <Link to={`/category/${subchild.slug}`}className='header-bottom-right-dropInfo-topic-headunderline ' style={{ color:"#000" }} onClick={closeWrapper}>عرض الكل</Link>

                                            </AccordionTab>
                                     
                                        </Accordion>
                                        
                                    ) : (
                                        <Link 
                                            to={`/category/${subchild.slug}`} 
                                            className="m-0 header-non-acc-p2" 
                                            key={subchild.id} 
                                            onClick={() => closeWrapper()}
                                        >
                                            {subchild.name}
                                        </Link>
                                    );
                                })}
                                 <Link to={`/category/${child.slug}`}  onClick={closeWrapper}className='header-bottom-right-dropInfo-topic-headunderline ' style={{ color:"#000" }}>عرض الكل</Link>

                            </AccordionTab>
                        </Accordion>
                    ) : (
                        <Link 
                            to={`/category/${child.slug}`} 
                            className="m-0 header-non-acc-p" 
                            key={child.id} 
                            onClick={() => closeWrapper()}
                        >
                            {child.name}
                        </Link>
                    );
                })}
            </div>

            <div className="header-bottom-right-dropInfo-flex">
                {leftCategories && leftCategories.map((child,index) => {
                    return child.children?.length > 0 ? (
                        <Accordion multiple className={`accordion-right ${activeIndex.includes(index) ? 'activeHead' : ''}`}
                        activeIndex={activeIndex} key={child.id} >
                            <AccordionTab 
                                header={
                                    <>
                                        <i className="pi pi-chevron-down custom-static-icon" />
                                        <Link to={`/category/${child.slug}`}>{child.name}</Link>
                                    </>
                                }
                            >
                                {child.children.map((subchild) => {

                                    return subchild.children?.length > 0 ? (
                                        <Accordion multiple className="accordion-subchild" key={subchild.id}>
                                            <AccordionTab 
                                                header={
                                                    <>
                                                        <i className="pi pi-chevron-down custom-static-icon" />
                                                        <Link to={`/category/${subchild.slug}`}>{subchild.name}</Link>
                                                    </>
                                                }
                                            >
                                                {subchild.children.map((grandchild) => (
                                                    <Link 
                                                        to={`/category/${grandchild.slug}`} 
                                                        className="m-0 header-non-acc-p3" 
                                                        key={grandchild.id} 
                                                        onClick={() => closeWrapper()}
                                                    >
                                                        {grandchild.name}
                                                    </Link>
                                                ))}
                                            </AccordionTab>
                                        </Accordion>
                                    ) : (
                                        <Link 
                                            to={`/category/${subchild.slug}`} 
                                            className="m-0 header-non-acc-p2" 
                                            key={subchild.id} 
                                            onClick={() => closeWrapper()}
                                        >
                                            {subchild.name}
                                        </Link>
                                    );
                                })}
                            </AccordionTab>
                        </Accordion>
                    ) : (
                        <Link 
                            to={`/category/${child.slug}`} 
                            className="m-0 header-non-acc-p" 
                            key={child.id} 
                            onClick={() => closeWrapper()}
                        >
                            {child.name}
                        </Link>
                    );
                })}
            </div>
        </div >
    )
}
