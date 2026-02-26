
import React,{useState} from 'react'
import { Dropdown } from 'primereact/dropdown'; 
import { Calendar } from 'primereact/calendar';
import './CategoryFilter.css'
export default function CategoryFilter({title}) {
    const [date, setDate] = useState(null);
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const cates = [
        { name: 'موضوع اخر', code: '0' },
        { name: 'الكل', code: '1' },
        { name: 'الصوم', code: '2' },
        { name: 'الميلاد', code: '3' },
        { name: 'الاعتراف', code: '4' },
        { name: 'الانتقال', code: '5' },
    ];
    const sorts=[
        { name: 'الأقدم الى الأحدث', code: '0' },
        { name: 'الأحدث الى الأقدم', code: '1' },
        { name: 'الأكثر مشاهدة', code: '2' },
    ]
    const [selectedCate, setSelectedCate] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);
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
  return (
    <div className='categoryFilter'>
        <div className='categoryResult'>
            <h2>{title}</h2>
        </div>
    </div>

  )
}
