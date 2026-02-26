

import React,{useEffect, useState} from 'react'
import { Dropdown } from 'primereact/dropdown'; 
import { Calendar } from 'primereact/calendar';
import '../Media/Sounds/SoundsFilter.scss'
import './SearchMoreContainer.css'
import { useParams } from 'react-router-dom';
import SearchMoreHook from '../../Logic/Search/SearchMoreHook';
import { getSearchMoreFilterAction } from '../../redux/actions/Search/SearchActions';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect } from 'primereact/multiselect';
export default function SearchMoreFilter({cates}) {
    const [date, setDate] = useState(null);
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm("ss");
      };
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    let word="";
    if(localStorage.getItem("search")){
        word=localStorage.getItem("search");
    }
const {id}=useParams();
    const   [searchMoreData,pageCount,handleChangePage,getData,activePage,loading,currentPage]=SearchMoreHook(word,id);

       let data;
    if(localStorage.getItem("filterSearch")){
      data=JSON.parse(localStorage.getItem("filterSearch"))
      
    }
    const [selectedCate, setSelectedCate] = useState(data!=null?data:null);

const onChooseCate=async(e)=>{
   
    setSelectedCate(e.value) 
    localStorage.setItem("filterSearch",JSON.stringify(e.value))
    getData();
    

}
useEffect(()=>{
    if(selectedCate==null){
    localStorage.removeItem("filterSearch")     
    }

},selectedCate)
useEffect(()=>{
    if(!localStorage.getItem("filterSearch")){
        getData();
    }

},[localStorage.getItem("filterSearch")])
const handleSearchClick = () => {
    if (date) {
        setSearchClicked(true);
        setDropdownOpen(false);

    }
};
const handleImageClick = () => {
    if (isSearchClicked) {
        setSearchClicked(false);
    } else {
        toggleDropdown();
    }
};

function clearFilter(){
    //category
    setSelectedCate(null);
    getData();

   // Local Storage
   localStorage.removeItem("filterSearch");
 }
  return (
    <div className='mediaFiltertion'>
        <div className="videos-filter-info">
        {
            localStorage.getItem("filterSearch")?
             <button className='clearFilterBtn more_btn searchClear' onClick={()=>clearFilter()}>مسح الكل</button>
            :
             ""
                       
            }

            <div>
                <Dropdown
              className={`dp ${selectedCate ? 'selected' : ''}`} 
                    value={selectedCate}
                    onChange={onChooseCate}
                    options={cates}
                    optionLabel="name"
                    placeholder="الموضوع"
                    style={{
                        backgroundColor: selectedCate ? '#810400' : '#fff', // Change color when selected
                        color: selectedCate ? '#fff' : '#fff',
                    }}
                    dropdownIcon={
                        selectedCate ? (
                            <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {
                                
                                setSelectedCate(null);e.stopPropagation();
                                getData(); 
                            
                            }
                            
                            } />
                        ) : (
                            <img src="/assets/down.png" alt="Dropdown icon" />
                        )
                    }
                    itemTemplate={(option) => (
                        <div
                            style={{
                                color: option === selectedCate ? '#fff' : '#000',
                                padding: '8px',
                            }}
                        >
                            {option.name}
                        </div>
                    )}
                    filter
                    filterBy="name"  
                    filterValue={searchTerm}  
                    onFilter={handleSearchChange}  
                />

            </div>

    <p className='videos-filter-p'>تصفية حسب</p>
    </div>
    </div>

  )
}
