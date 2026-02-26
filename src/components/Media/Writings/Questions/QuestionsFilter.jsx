
import React,{useEffect, useRef, useState} from 'react'
import { Dropdown } from 'primereact/dropdown'; 
import { Calendar } from 'primereact/calendar';
import '../../Sounds/SoundsFilter.scss'
import QuestionsHook from '../../../../Logic/Media/Writings/QuestionsHook';
import { json } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
export default function QuestionsFilter({cates,attrs}) {
    const [questionsData,filterGroup,attrGroup,handleChangePage,pageCount,getData,notFound,activePage]=QuestionsHook();
    const dispatch=useDispatch();
    // All Main States
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchClickedMulti, setSearchClickedMulti] = useState(false);
    const [isDropdownOpenMulti, setDropdownOpenMulti] = useState(false);
    const [isSearchClickedText, setSearchClickedText] = useState(false);
    const [isDropdownOpenText, setDropdownOpenText] = useState(false);
    const [isSearchClickedTA, setSearchClickedTA] = useState(false);
    const [isDropdownOpenTA, setDropdownOpenTA] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

   // All ToggleDropdown
   const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setDropdownOpenText(false)
    setDropdownOpenTA(false)
};
const toggleDropdownMulti = () => {
    setDropdownOpenMulti(!isDropdownOpenMulti);
    setDropdownOpen(false)
    setDropdownOpenTA(false)
    setDropdownOpenText(false)
};
const toggleDropdownText = () => {
    setDropdownOpenText(!isDropdownOpenText);
    setDropdownOpen(false)
    setDropdownOpenTA(false)
};
const toggleDropdownTA = () => {
    setDropdownOpenTA(!isDropdownOpenTA);
    setDropdownOpen(false)
    setDropdownOpenText(false)
};

    // All Variables
    let path;
    let wordChoosen="";
    let txtChoose="";
    let taChoose="";
    let defaultDate="";
    let defaultMultiSelect="";
    let defaultText="";
    let defaultTA="";
    let defaultCate="";

    // check Default Values oF Filters on Reload
    if(localStorage.getItem("qusAttrDefault")){
        let getdefaultAttrs=JSON.parse(localStorage.getItem("qusAttrDefault"))
        defaultCate=getdefaultAttrs?.find((item) => item.type === "cate")?.value;
        defaultMultiSelect=getdefaultAttrs?.find((item) => item.type === "multi")?.value;
        defaultDate=getdefaultAttrs?.find((item) => item.type === "date")?.value;
        defaultText=getdefaultAttrs?.find((item) => item.type === "text")?.value;
        defaultTA=getdefaultAttrs?.find((item) => item.type === "textArea")?.value;
    }

    // set Default Values for States oF Filters on Reload
    const [selectedCate, setSelectedCate] = useState(defaultCate!=null?defaultCate:null);
    const [wordSearch, setWordSearcg] = useState(defaultMultiSelect?defaultMultiSelect:null);
    const [wordSearchFormat, setWordSearchFormat] = useState(null);
    const [selectedDate, setSelectedDate] = useState(defaultDate?defaultDate:null);
    const [selectedDateFormat, setSelectedDateFormat] = useState(null);
    const [selectedTxt, setSelectedTxt] = useState(defaultText?defaultText:null);
    const [selectedTxtFormat, setSelectedTxtFormat] = useState(null);
    const [selectedTA, setSelectedTA] = useState(defaultTA?defaultTA:null);
    const [selectedTAFormat, setSelectedTAFormat] = useState(null);

    // get IDs for Filters
    const dateID = attrs?.find((item) => item.type === "date")?.id;
    const multiSelectID = attrs?.find((item) => item.type === "multi_select")?.id;
    const txtID = attrs?.find((item) => item.type === "text")?.id;
    const txtAreaID = attrs?.find((item) => item.type === "text_area")?.id;



// For Search on Filter Inputs
const handleSearchChange = (e) => {
        setSearchTerm("ss");
      };


let defaultAttrs=[];

// For Category Filter
const onChooseCate=(e)=>{
    setSelectedCate(e?e.value:null) 
    //  localStorage.setItem("sayingFilter",JSON.stringify(e?e.value:""))

    path=`${e ? "category_id=" + e.value.id +"&" : ""}${selectedDateFormat?selectedDateFormat+"&":""}${wordSearchFormat?wordSearchFormat+"&":""}${selectedTxtFormat?selectedTxtFormat+"&":""}${selectedTAFormat?selectedTAFormat+"&":""}`
    localStorage.setItem("qusAttr",JSON.stringify(path))
    defaultAttrs=[{type:"cate",value:e?e.value:null},{type:"date",value:selectedDate?new Date(selectedDate):null},{type:"multi",value:wordSearch},{type:"text",value:selectedTxt},{type:"textArea",value:selectedTA}]
    localStorage.setItem("qusAttrDefault",JSON.stringify(defaultAttrs))
     getData()
}

// For Date Filter
const onHandelYear = (updatedSelectedDate = selectedDate) => {
    const dateChoose = updatedSelectedDate
        ? `filter_ids[]=${dateID}&values[]=${new Date(updatedSelectedDate).toLocaleDateString('en-GB', { year: 'numeric' })}`
        : '';

    setSelectedDateFormat(dateChoose);

    const path = `${selectedCate ? "category_id=" + selectedCate.id + "&" : ""}${
        dateChoose ? dateChoose + "&" : ""
    }${wordSearchFormat ? wordSearchFormat + "&" : ""}${selectedTxtFormat ? selectedTxtFormat + "&" : ""}${
        selectedTAFormat ? selectedTAFormat + "&" : ""
    }`.slice(0, -1);

    localStorage.setItem("qusAttr", JSON.stringify(path));

    const defaultAttrs = [
        {type:"cate",value:selectedCate},
        { type: "date", value: updatedSelectedDate ? new Date(updatedSelectedDate) : null },
        { type: "multi", value: wordSearch },
        { type: "text", value: selectedTxt },
        { type: "textArea", value: selectedTA }
    ];
    localStorage.setItem("qusAttrDefault", JSON.stringify(defaultAttrs));
};
const onChooseDate = (date) => {
    if (!date) {
        setSelectedDate(null); // Explicitly set to null
        return;
    }
    setSelectedDate(date); // Otherwise, set the selected date
};
const isYearSelectable = (date, attributes) => {
    if (!attributes || !Array.isArray(attributes)) return false;
    const year = date.getFullYear();
    return attributes.includes(year.toString());
};
const handleSearchClick = () => {
    if(selectedDate){
        setSearchClicked(true);
        setDropdownOpen(false);
    }
        onHandelYear()
     


};
const handleImageClick = () => {
    if (isSearchClicked) {
        getData()
        setSearchClicked(false);
    } else {
        toggleDropdown();
    }

};

// For MultiSelect Filter
const [isDropdownVisible, setDropdownVisible] = useState(false);
const multiSelectRef = useRef(null);


const toggleDropdownMS = (e) => {
    setDropdownVisible((prev) => !prev); // Toggle dropdown visibility
};

const onChooseWordSearch=(e,attributes)=>{

    const selectedValues = e ? e.value : [];
    // Check if all options are selected
    const isSelectAll = attributes && selectedValues.length === attributes.length;
    setWordSearcg(selectedValues) 
     wordChoosen = isSelectAll
    ? " "
    : selectedValues.map((item) => `filter_ids[]=${multiSelectID}&values[]=${item}`).join('&');
    setWordSearchFormat(wordChoosen);
    path=`${selectedCate ? "category_id=" + selectedCate.id +"&": ""}${selectedDateFormat?selectedDateFormat+"&":""}${wordChoosen?"&"+wordChoosen:""}${selectedTxtFormat?selectedTxtFormat+"&":""}${selectedTAFormat?selectedTAFormat+"&":""}`
    localStorage.setItem("qusAttr",JSON.stringify(path))
    defaultAttrs=[{type:"cate",value:selectedCate},{type:"date",value:selectedDate?new Date(selectedDate):null},{type:"multi",value:e?e.value:""},{type:"text",value:selectedTxt},{type:"textArea",value:selectedTA}]
    localStorage.setItem("qusAttrDefault",JSON.stringify(defaultAttrs))
     getData()
}
const handleImageMultiSelectClick = () => {
    if (isSearchClickedMulti) {
        setSearchClickedMulti(false);
    } else {
        toggleDropdownMulti();
    }
};

// For Text Filter
const onHandleText=async(updatedSelectedTxt = selectedTxt)=>{
     txtChoose = updatedSelectedTxt ? `filter_ids[]=${txtID}&values[]=${updatedSelectedTxt}` : '';
    setSelectedTxtFormat(txtChoose);

    path=`${selectedCate ? "category_id=" + selectedCate.id +"&": ""}${selectedDateFormat?selectedDateFormat+"&":""}${wordSearchFormat?wordSearchFormat+"&":""}${txtChoose?txtChoose+"&":""}${selectedTAFormat?selectedTAFormat+"&":""}`
    localStorage.setItem("qusAttr",JSON.stringify(path))
    defaultAttrs=[{type:"cate",value:selectedCate},{type:"date",value:selectedDate?new Date(selectedDate):null},{type:"multi",value:wordSearch},{type:"text",value:updatedSelectedTxt},{type:"textArea",value:selectedTA}]
    localStorage.setItem("qusAttrDefault",JSON.stringify(defaultAttrs))


}
const onChangeTxt=(e)=>{
    setSelectedTxt(e.target.value);

}
const handleSearchTextClick = () => {
    if (selectedTxt) {
        setSearchClickedText(true);
        setDropdownOpenText(false);
    }
    onHandleText()

};
const handleImageTextClick = () => {
    if (isSearchClickedText) {
        getData()
        setSearchClickedText(false);
    } else {
        toggleDropdownText();

    }

};

// For TextArea Filter
const onHandleTextArea=async(updatedSelectedTA = selectedTA)=>{
    taChoose=updatedSelectedTA ?`filter_ids[]=${txtAreaID}&values[]=${updatedSelectedTA}`:'';
    setSelectedTAFormat(taChoose)
    path=`${selectedCate ? "category_id=" + selectedCate.id+"&" : ""}${selectedDateFormat?selectedDateFormat+"&":""}${wordSearchFormat?wordSearchFormat+"&":""}${selectedTxtFormat?selectedTxtFormat+"&":""}${taChoose?taChoose+"&":""}`
    localStorage.setItem("qusAttr",JSON.stringify(path))
    defaultAttrs=[{type:"cate",value:selectedCate},{type:"date",value:selectedDate?new Date(selectedDate):null},{type:"multi",value:wordSearch},{type:"text",value:selectedTxt},{type:"textArea",value:updatedSelectedTA}]
    localStorage.setItem("qusAttrDefault",JSON.stringify(defaultAttrs))

}
const handleSearchTAClick = () => {
    if (selectedTA) {
        setSearchClickedTA(true);
        setDropdownOpenTA(false);
    }
    onHandleTextArea()

};
const handleImageTAClick = () => {
    if (isSearchClickedTA) {
        setSearchClickedTA(false);
        getData()
    } else {
        toggleDropdownTA();
    }
};

// update filter depended on filters states
useEffect(() => {
    if (isSearchClickedTA) {
        onHandleTextArea();
    }
    if (isSearchClickedText) {
        onHandleText();
    }
    if (isSearchClicked) {
        onHandelYear(); // Will use the default state unless arguments are passed
    }
    if(wordSearch){
        if(wordSearch.length==0){
        setWordSearcg(null)

        }
        
    }
  
    if (JSON.parse(localStorage.getItem("qusAttr")) === "") {
        localStorage.removeItem("qusAttr");
        localStorage.removeItem("qusAttrDefault");
    }
}, [selectedTxt, selectedTA, selectedDate, wordSearch]);

// Remove locaStorage Date if null
  useEffect(() => {
    if (JSON.parse( localStorage.getItem("qusAttr")) == "") {
        localStorage.removeItem("qusAttr");
        localStorage.removeItem("qusAttrDefault");
    }

  }, [localStorage.getItem("qusAttr")]);

// update Filter on remove Selected values
  useEffect(()=>{
    if(defaultText){
        setSearchClickedText(true)
    }
    if(defaultTA){
        setSearchClickedTA(true)
    }
    if(defaultDate){
        setSearchClicked(true)
    }

  },[])

  function clearFilter(){
     //category
     setSelectedCate(null);
     onChooseCate();
 
     //Date
     setSelectedDate(null);
     setSelectedDateFormat(null);                            
     onHandelYear(null);                            
     handleImageClick();
 
     // word search
     setDropdownVisible(true);
     onChooseWordSearch(null);
 
     // text filter
     setSelectedTxt(null);
     setSelectedTxtFormat(null);
     onHandleText(null);                                       
     handleImageTextClick();
 
     // TextArea filter
     setSelectedTA(null);
     setSelectedTAFormat(null);
     onHandleTextArea(null);      
     handleImageTAClick();

    // Local Storage
    localStorage.removeItem("qusAttr");
    localStorage.removeItem("qusAttrDefault");
  }

  return (
    <div className='mediaFiltertion'>
                <p className='videos-filter-p'>تصفية حسب</p>
        <div className="videos-filter-info">


            {
                attrs?
                    attrs.map((item)=>{
                        return(
                            
                            item.type=="date"&& 
                            <div className="custom-menu">

                            <button  className="filterFiled" style={{
                                backgroundColor: isSearchClicked ? '#810400' : 'white',
                            }}>
                                                                   {
                            isSearchClicked ? (
                                <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDate(null);
                                    setSelectedDateFormat(null);                            
                                    onHandelYear(null);                            
                                    handleImageClick();

                                }
                                
                                } />
                        ) : (
                            isDropdownOpen?  <FontAwesomeIcon icon={faAngleUp} className='filterIcon' onClick={toggleDropdown}/>:  <FontAwesomeIcon icon={faAngleDown} className='filterIcon' onClick={toggleDropdown}/>
                        )
                        }
                                <div className="" style={{color:isSearchClicked?'white':'initial'}}>
                                    {isSearchClicked && selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { year: 'numeric' }) : item.value}
            
                                </div>
                            </button>
            
                            {isDropdownOpen && (
                                <div className="custom-dropdown-content" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                    <div className="videos-search" onClick={handleSearchClick} >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{color:"#FFF",fontWeight:'lighter',width:"14px",height:"14px",color:"#fff"}} />                                       </div>
                                    <DatePicker
                                       selected={selectedDate || null}
                                        onChange={onChooseDate}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        className="happen-year video-year"
                                        filterDate={(date) => isYearSelectable(date, item?.attributes || [])}
                                    />
                                </div>

                            )}
                        </div>
                            ||item.type=="multi_select"&&
                            
                            <div>
                                <MultiSelect
                                ref={multiSelectRef}
                                    className="dp"
                                    value={wordSearch}
                                    onChange={(e) => {
                                        onChooseWordSearch(e, item.attributes);
                                    
                                        // Close the dropdown
                                        if (multiSelectRef.current) {
                                        multiSelectRef.current.hide();
                                        setDropdownVisible(false)
                                        }
                                    }}
                                    options={item.attributes}
                                    optionLabel=""
                                    placeholder={item.value}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    style={{
                                        backgroundColor: wordSearch ? '#810400' : '#fff',
                                        color: wordSearch ? 'white' : '#000',
                                        width: '300px',
                                    }}
                                    dropdownIcon={
                                        wordSearch ? (
                                        <img
                                            src="/assets/close.png"
                                            alt="Close icon"
                                            width={13}
                                            height={13}
                                            onClick={(e) => {
                                            setDropdownVisible(true);
                                            onChooseWordSearch(null);
                                            e.stopPropagation();
                                        setDropdownVisible(false);

                                            }}
                                        />
                                        ) : (
                                        <FontAwesomeIcon
                                            icon={ isDropdownVisible ? faAngleUp : faAngleDown}
                                            className="filterIcon"
                                            onClick={toggleDropdownMS}
                                        />
                                        )
                                    }
                                    filter
                                    filterBy=""
                                    filterValue={searchTerm}
                                    onFilter={handleSearchChange}
                                    onShow={() => {
                                        setDropdownVisible(true);
                                        setDropdownOpen(false);
                                        setDropdownOpenTA(false);
                                        setDropdownOpenText(false);
                                    }}
                                    onHide={() => setDropdownVisible(false)}
                                />
                            </div>

                            
                            ||item.type=="text"&&
                                <div className="custom-menu">
                                <button className="filterFiled"
                                 style={{
                                    backgroundColor: isSearchClickedText ? '#810400' : 'white',
                                }}>
                                    {
                                        isSearchClickedText ? (
                                            <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTxt(null);
                                                setSelectedTxtFormat(null);
                                                onHandleText(null);                                       
                                                handleImageTextClick();

                                            }
                                            
                                            } />
                                    ) : (
                                        isDropdownOpenText?  <FontAwesomeIcon icon={faAngleUp} className='filterIcon' onClick={toggleDropdownText} />:  <FontAwesomeIcon icon={faAngleDown} className='filterIcon' onClick={toggleDropdownText} />
                                    )
                                    }

                                    <div className="" style={{ color: isSearchClickedText ? 'white' : 'initial' }}>
                                        {isSearchClickedText && selectedTxt ? selectedTxt :item.value}
                                    </div>
                                </button>

                                {isDropdownOpenText && (
                                    <div className="custom-dropdown-content" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                        <div className="videos-search" onClick={handleSearchTextClick}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color:"#FFF",fontWeight:'lighter',width:"14px",height:"14px",color:"#fff"}} />                                           </div>
                                    <input  type='text' className='textDP' value={selectedTxt} onChange={onChangeTxt}/>
                                    </div>
                                )}
                                </div>
                            ||item.type=="text_area"&&
                            <div className="custom-menu">
                            <button  className="filterFiled" style={{
                                backgroundColor: isSearchClickedTA ? '#810400' : 'white',
                            }}>
                               {
                                        isSearchClickedTA ? (
                                            <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTA(null);
                                                setSelectedTAFormat(null);
                                                onHandleTextArea(null);      
                                                handleImageTAClick();
                                             
                                            }
                                            
                                            } />
                                    ) : (
                                        isDropdownOpenTA?  <FontAwesomeIcon icon={faAngleUp} className='filterIcon' onClick={toggleDropdownTA}/>:  <FontAwesomeIcon icon={faAngleDown} className='filterIcon' onClick={toggleDropdownTA}/>
                                    )
                                    }
                                <div className="" style={{ color: isSearchClickedTA ? 'white' : 'initial' }}>
                                    {isSearchClickedTA && selectedTA ? selectedTA :item.value}
                                </div>
                            </button>

                            {isDropdownOpenTA && (
                                <div className="custom-dropdown-content" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                    <div className="videos-search" onClick={handleSearchTAClick}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color:"#FFF",fontWeight:'lighter',width:"14px",height:"14px",color:"#fff"}} />                                    </div>
                                    <input  type='text' className='textDP' value={selectedTA} onChange={(e)=>setSelectedTA(e.target.value)}/>

                                </div>
                            )}
                            </div>  
                        )
                    })
                :""
            }

            <div className='subjectFilter'>
                <Dropdown
                    className={`dp ${selectedCate ? 'selected' : ''} subject`} 
                    value={selectedCate}
                    onChange={onChooseCate}
                    options={cates}
                    optionLabel="name"
                    placeholder="الموضوع"
                    style={{
                        backgroundColor: selectedCate ? '#810400' : '#fff', // Change color when selected
                        color: selectedCate ? 'white' : '#000',
                    }}
                    dropdownIcon={
                        selectedCate ? (
                            <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {
                                
                                setSelectedCate(null);
                                e.stopPropagation();
                                onChooseCate();
                            }
                            
                            } />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} className='filterIcon'   />
                        )
                    }
                    filter
                    filterBy=""  
                    filterValue={searchTerm}  
                    onFilter={handleSearchChange} 
                    onShow={()=>{
                        setDropdownOpenText(false)
                        setDropdownOpenTA(false)
                        setDropdownOpen(false)
                    
                    }}
                />

            </div>

        </div>
        {
            localStorage.getItem("qusAttr") ||  localStorage.getItem("qusAttrDefault")?
             <button className='clearFilterBtn more_btn quesClear' onClick={()=>clearFilter()}>مسح الكل</button>
            :
             ""
                       
        }
    </div>

  )
}