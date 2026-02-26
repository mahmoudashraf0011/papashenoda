

import React,{useEffect, useState} from 'react'
import { Dropdown } from 'primereact/dropdown'; 
import { Calendar } from 'primereact/calendar';
import '../Media/Sounds/SoundsFilter.scss'
import SearchHook from '../../Logic/Search/SearchHook';
export default function SearchFilter() {
    const [allData,check,ele,count,getData]=SearchHook();


    const [date, setDate] = useState(null);
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const cates = [
        { name: 'كتب', code: '1' },
        { name: 'معرض الحدث', code: '2' },
        { name: 'فيديو', code: '3' },
        { name: 'مقالة', code: '4' },
        { name: 'صوتي', code: '5' },
        { name: 'اقوال مكتوبة', code: '8' },
        { name: 'صور و أقوال', code: '10' },
        { name: 'قصائد', code: '12' },
        { name: 'أسئلة و أجوبة', code: '14' },
        { name: 'حدث فى مثل هذا اليوم', code: '15' },
        { name: 'وثائق', code: '16' },

    ];
    let data;
    if(localStorage.getItem("filterSearchCate")){
      data=JSON.parse(localStorage.getItem("filterSearchCate"))
      
    }
    const [selectedCate, setSelectedCate] = useState(data!=null?data:null);

    const onChooseCate=async(e)=>{
   
        setSelectedCate(e.value) 
        localStorage.setItem("filterSearchCate",JSON.stringify(e.value))
        getData();

    
    }
    useEffect(()=>{
        if(selectedCate==null){
        localStorage.removeItem("filterSearchCate")     
        }
    
    },selectedCate)
    useEffect(()=>{
        if(!localStorage.getItem("filterSearchCate")){
            getData();
        }
    
    },[localStorage.getItem("filterSearchCate")])
  return (
    <div className="videos-filter-info">

        <div>
            <Dropdown
             className='db'
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
                        <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) =>
                             {setSelectedCate(null);e.stopPropagation(); 
                                  getData();                    
                            }
                            }
                             
                             />
                    ) : (
                        <img src="/assets/down.png" alt="Dropdown icon" />
                    )
                }
            />

        </div>

        <p className='videos-filter-p'>تصفية حسب</p>
</div>
  )
}
