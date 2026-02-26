import React, { useEffect, useRef, useState } from 'react'
import './SearchComponent.css'
import './SearchComponentRes.css'
import {
    PlayCircle,
    Mic,
    Image,
    BookOpen,
    FileText,
    LayoutGrid
  } from "lucide-react";
  import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or your preferred theme
import 'primereact/resources/primereact.min.css';
import FullSearchHook from '../../Logic/Search/FullSearchHook';
import { json } from 'react-router-dom';

const SearchComponent = ({closeSearch,checkVisibility}) => {
    const [searchWord,cates,checkedCategories,prefered,searchValue,setSearchWord,getSearchWord,handleRecentClick,getCatesIDs,filterOptions,toggleMedia,generateMediaTypeQuery,setSearchValue,handleSearchChange,clearSearch,onSubmitSearch,allData,check,count,ele,defaultCates,selectedMedia,setSelectedMedia,restSearch,removeRecentItem]=FullSearchHook(closeSearch);


      const [search, setSearch] = useState("");
    
      const toggleOption = (option) => {
        if (selectedMedia.includes(option)) {
          setSelectedMedia(selectedMedia.filter((item) => item !== option));
        } else {
            setSelectedMedia([...selectedMedia, option]);
        }
      };
    
      const removeTag = (option) => {
        setSelectedMedia(selectedMedia.filter((item) => item !== option));
      };   
      
      
      const categories = [
        { label: "الكل", icon: <LayoutGrid size={18} />, key: "0" },
        { label: "فيديو", icon: <PlayCircle size={18} />, key: "3" },
        { label: "مقاطع صوت", icon: <Mic size={18} />, key: "5" },
        { label: "صور", icon: <Image size={18} />, key: "2" },
        { label: "كتب", icon: <BookOpen size={18} />, key: "1" },
        { label: "قصائد", icon: <BookOpen size={18} />, key: "12" },
        { label: "اقوال مكتوبة", icon: <FileText size={18} />, key: "8" },
        { label: "صور واقوال", icon: <FileText size={18} />, key: "10" },
        { label: "سؤال و جواب", icon: <FileText size={18} />, key: "14" },
        { label: "مقالات", icon: <FileText size={18} />, key: "4" },
        { label: "وثائق", icon: <FileText size={18} />, key: "16" },
        { label: "حدث في مثل هذا اليوم", icon: <FileText size={18} />, key: "15" },
      ];

      let recentlyWords=[];
        if(localStorage.getItem("recentlyWords")){
            recentlyWords=JSON.parse(localStorage.getItem("recentlyWords"))

        }
        const componentRef = useRef(null);

        useEffect(() => {
          function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
              closeSearch();         
              checkVisibility(false);
            }
          }
      
          document.addEventListener('mousedown', handleClickOutside);
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
        }, [closeSearch, checkVisibility]);


        const handleClear = () => {
          setSearchWord('');
        };

        const [topOffset, setTopOffset] = useState(205); // default to 205

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setTopOffset(97);
      } else {
        setTopOffset(205);
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const searchRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='searchPopup'   >
        <div className='overlaySearch' ref={overlayRef}>
            <div className='searchParent'       style={{ top: `${topOffset}px` }} ref={searchRef}>
                <div className="dropdown-arrow"></div>
                <div className='searchBar search-wrapper'>
                     <img alt='history' src='/assets/search/search.png'/>
                    <input type='search' alt='search' placeholder='استكشف المحتوى الوحى والتعليمى للبابا شنودة الثالث ...' value={searchWord} onChange={(e)=>getSearchWord(e)} defaultValue={searchWord}  id="searchInput"/>
                    {searchWord && (
                            <span className="clear-btn" onClick={handleClear}>×</span>
                        )}
                </div>
                <div className='searchParent_content' >
                    <div className='searchFilter scrolled'>
                        <div className='searchFilter_items' dir='rtl'>
                            <div className='searchFilter_right'>
                                <div className='searchFilter_right_result'>
                                    {/* <h2 className='closeSearch' onClick={() => checkVisibility(false)}>X</h2> */}
                                    <br></br>
                                    <h3 className='searchFilter_right_result_title'>نتائج البحث مؤخراً:</h3>
                                    <ul className='searchFilter_right_result_items'>
                                        {recentlyWords?recentlyWords.map((word, i) => (
                                            <li key={i} onClick={() => handleRecentClick(word)}>
                                            <img alt='history' src='/assets/search/History.png' />
                                            <p>{word}</p>
                                            <img
                                                alt='remove'
                                                src='/assets/search/close.png'
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering li onClick
                                                    removeRecentItem(word); // ✅ Remove word from state and localStorage
                                                }}
                                            />
                                            </li>
                                        )): <p>لا يوجد كلمات بحث حديثة !</p>
                                        
                                        }
    </ul>
                                </div>
                                <div className="multi-select-container" dir="rtl">
                                    <div className="input-wrapper">
                                        <img src='/assets/search/search.png'/>
                                        <input
                                        type="text"
                                        placeholder="الأقسام..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="search-input"
                                        />
                                {selectedMedia.map((category, index) => (
                                        <div key={index} className="tag" style={{ cursor: "pointer" }}>
                                            <img alt="check" src="/assets/search/Check.png" />
                                            <span style={{ padding: "0 10px" }}>{category?.name || "غير معروف"}</span>
                                            <img
                                            alt="close"
                                            src="/assets/search/close2.png"
                                            onClick={() => {
                                                const newSelected = selectedMedia.filter(item => item.id !== category.id);
                                                setSelectedMedia(newSelected);
                                                getCatesIDs(newSelected.map(item => item.id));
                                                localStorage.setItem("selectedCates", JSON.stringify(newSelected));
                                            }}
                                            />
                                        </div>
                                        ))}
                                    
                                    </div>

                                    <div className="dropdown-list scrolled">
                                        {cates && cates
                                            .filter((opt) => opt.name?.toLowerCase().includes(search?.toLowerCase() || ""))
                                            .map((opt, index) => {
                                            const isSelected = selectedMedia.some(item => item.id === opt.id);

                                            return (
                                                <div
                                                key={index}
                                                className={`dropdown-item ${isSelected ? "selected" : ""}`}
                                                onClick={() => {
                                                    const newSelected = isSelected
                                                    ? selectedMedia.filter(item => item.id !== opt.id)
                                                    : [...selectedMedia, opt];

                                                    // Update your state with full objects
                                                    setSelectedMedia(newSelected);

                                                    // Update selected IDs
                                                    getCatesIDs(newSelected.map(item => item.id));

                                                    // Store full details
                                                    localStorage.setItem("selectedCates", JSON.stringify(newSelected));
                                                }}
                                                >
                                                {opt.name}
                                                </div>
                                            );
                                            })}
                                        </div>
                                </div>
                            </div>
                            <div className='searchFilter_left'>
                                <div className='searchFilter_left_list' dir='rtl'>
                                  <div style={{ display:"flex",justifyContent:"space-between" , alignItems:"center"}}>
                                    <span className='searchFilter_left_title'>التصنيف:</span>
                                    <img src='/assets/search/filter.png'/>
                                  </div>
                                    <ul className='searchFilter_left_categories scrolled_search'  dir='ltr'>
                                        
                                        {categories.map((category, index) => (
                                        <li key={index} className="searchFilter_left_category_item">
                                            <InputSwitch
                                            checked={checkedCategories&&checkedCategories.includes(category.key)}
                                            onChange={() => toggleMedia(category.key)}
                                            />
                                            <span>{category.label}</span>
                                        </li>
                                        ))}

                                    
                                        

                                    </ul>

                                </div>
                                <div className='searchFilter_left_words'>
                                    <span className='searchFilter_left_title'>كلمات بحث مساعدة:</span>

                                    <div className="select-box-search">
                                        <div style={{ position: "relative" }}>
                                            <input
                                            type="text"
                                            className="search-input-search"
                                            placeholder="ابحث هنا ..."
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            />
                                            {searchValue ? (
                                            <img
                                                src="/assets/search/close2.png"
                                                alt="clear"
                                                onClick={clearSearch}
                                                style={{
                                                position: "absolute",
                                                left: "50px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer"
                                                }}
                                            />
                                            ) : (
                                            <img
                                                src="/assets/search/search.png"
                                                alt="search"
                                                style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)"
                                                }}
                                            />
                                            )}
                                        </div>

                                        {prefered && prefered.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="select-option-search"
                                                    onClick={() => {
                                                    setSearchValue(item);        
                                                    // filterOptions(item);         
                                                    }}
                                                >
                                                    {item}
                                                </div>
    ))}
                                    </div>
                                </div>
                                <div className='searchFilter_btns'>
                                    <button className='searchFilter_btn searchFilter_btn_submit' onClick={
                                        ()=>{
                                            onSubmitSearch()
                                       
                                        
                                        }
                                        
                                        }>بحث</button>
                                    <button className='searchFilter_btn searchFilter_btn_delete'
                                    onClick={()=>{
                                        restSearch();
                                        setTimeout(() => {
                                            closeSearch()
                                        }, 1000);
                                    }}
                                    >مسح</button>
                                </div>
                        
                            </div>
                        </div>
             
                    
                    </div>
                    <div className='searchFilter_down' >
                                <div   div className='result_count'>نتائج البحث: <span>({localStorage.getItem("searchCount")?localStorage.getItem("searchCount"):0})</span></div>
                            <div className='searchFilter_close' onClick={()=>closeSearch()} style={{ cursor:"pointer" }}>إغلاق البحث </div>
                    </div>
                </div>
          
           

            </div>
        
        </div>
 
    </div>
  )
}

export default SearchComponent
