
import React,{useState} from 'react'
import { Dropdown } from 'primereact/dropdown'; 
import { Calendar } from 'primereact/calendar';
import '../Sounds/SoundsFilter.scss'
export default function WritingFilter() {
    const [date, setDate] = useState(null);
    const [isSearchClicked, setSearchClicked] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const cates = [
        { name: 'الكل', code: '0' },
        { name: 'اقوال', code: '1' },
        { name: 'قصائد', code: '2' },
    ];
    const [selectedCate, setSelectedCate] = useState(null);
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
    <div className="videos-filter-info">
        <div className="custom-menu">


            <button onClick={toggleDropdown} className="p-button" style={{
                backgroundColor: isSearchClicked ? '#810400' : 'white',
                
            }}>
                <img src={`/assets/${isSearchClicked ? 'close' : 'down'}.png`} alt="" onClick={(e) => {
                    e.stopPropagation(); // Prevents button click when image is clicked
                    handleImageClick();
                }} />
                <div className="" style={{color:isSearchClicked?'white':'initial'}}>
                    {isSearchClicked && date ? date.toLocaleDateString('en-GB', { year: 'numeric' }) : 'السنة'}

                </div>
            </button>

            {isDropdownOpen && (
                <div className="custom-dropdown-content" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                    <div className="videos-search" onClick={handleSearchClick}>
                        <img src="/assets/search2.png" alt="Search" className='' />
                    </div>

                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        view="year"
                        dateFormat="yy"
                        className="happen-year video-year"
                    />
                </div>
            )}
        </div>
        <div>
            <Dropdown
                value={selectedCate}
                onChange={(e) => setSelectedCate(e.value)}
                options={cates}
                optionLabel="name"
                placeholder="الموضوع"
                style={{
                    backgroundColor: selectedCate ? '#810400' : '#fff', // Change color when selected
                    color: selectedCate ? 'white' : '#000',
                }}
                dropdownIcon={
                    selectedCate ? (
                        <img src="/assets/close.png" alt="Close icon" width={13} height={13} onClick={(e) => {setSelectedCate(null);e.stopPropagation(); }} />
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
