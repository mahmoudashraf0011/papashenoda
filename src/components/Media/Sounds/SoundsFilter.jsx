import React, { useState, useContext, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import './SoundsFilter.scss'
import { UserContext } from '../../Context/UserContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Module-scoped guards persist across React StrictMode remounts in development,
 * preventing duplicate automatic API calls on initial load.
 */
let __audioFilterCalledOnce = false;
let __clickedCategoryCalledOnce = false;

export default function SoundsFilter() {
    const { clicked, clickedFliter, getAudioFilter, getClickedCategory } = useContext(UserContext);
    const [isSearchClicked, setIsSearchClicked] = useState({});
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});
    // const toggleDropdown = () => {
    //     setDropdownOpen(!isDropdownOpen);
    // };

    const toggleDropdown = (attId) => {
        setOpenDropdowns((prev) => {
            const newDropdownsState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            
            return {
                ...newDropdownsState,
                [attId]: !prev[attId], 
            };
        });
    };

    const [selectedValues, setSelectedValues] = useState({});

    useEffect(() => {

        if (clickedFliter) {
            if(localStorage.getItem("filterIds")){
                // Guard so this automatic call happens only once globally (survives StrictMode remount)
                if (!__audioFilterCalledOnce) {
                    __audioFilterCalledOnce = true;
                    let fi = JSON.parse(localStorage.getItem("filterIds"))
                    let fb = JSON.parse(localStorage.getItem("filterValues"))
                    getAudioFilter(fi, fb, 1)
                }
                setSelectedValues(null);

            }
            else{
                localStorage.removeItem("filterIds")
                localStorage.removeItem("filterValues")
                const newValues = {};
                clickedFliter.addetionals.filterable_attrebutes.forEach((att) => {
                    newValues[att.id] = null;
                });
                setSelectedValues(newValues);
            }
        }

    }, [clickedFliter])

    useEffect(()=>{
        localStorage.removeItem("filterIds")
        localStorage.removeItem("filterValues")
    },[])



    const filterIds = [];
    const filterValues = [];
    const handleSearchClick = (attId) => {
 
        if(filterIds==[] && filterValues==[]){
            localStorage.removeItem("filterIds")
            localStorage.removeItem("filterValues")
        }
        // Extract IDs and values from selectedDates
        for (const id in selectedDates) {
            if (selectedDates[id] !== null) {
                filterIds.push(id);
                filterValues.push(selectedDates[id]); // Add date value directly
            }
        }

        // Extract IDs and values from selectedValues2
        for (const id in selectedValues2) {
            if (selectedValues2[id] && selectedValues2[id].length > 0) {
                filterIds.push(id);
                filterValues.push(...selectedValues2[id]); // Flatten array into filterValues
            }
        }

        // Pass to API or state
        if (filterIds.length > 0) {
            // user-initiated search: call normally
            getAudioFilter(filterIds, filterValues,1); // Pass flattened filterValues
            localStorage.setItem("filterIds",JSON.stringify(filterIds))
            localStorage.setItem("filterValues",JSON.stringify(filterValues))
        }else{
            localStorage.removeItem("filterIds")
            localStorage.removeItem("filterValues")
        }

        // Update UI state
        setIsSearchClicked((prev) => ({
            ...prev,
            [attId]: true,
        }));
        setOpenDropdowns((prev) => ({
            ...prev,
            [attId]: false,
        }));
    };


    const handleImageClick = (attId) => {
        // Check if the clicked attId has values
        const hasSelectedValues = selectedDates[attId] || (selectedValues2[attId]?.length > 0);

        if (isSearchClicked[attId]) {
            console.log(attId, 'idddddd');

            // Collect remaining data before deletion
            const remainingDates = { ...selectedDates };
            const remainingValues2 = { ...selectedValues2 };

            // Remove the clicked attId
            delete remainingDates[attId];
            delete remainingValues2[attId];

            // Calculate remaining filter values for getAudioFilter
            const remainingFilterIds = Object.keys(remainingDates).concat(Object.keys(remainingValues2));
            const remainingValues = Object.values(remainingValues2).flat();

            // Reset the clicked attribute's values
            if (selectedDates[attId]) {
                setSelectedDates((prev) => {
                    const updatedDates = { ...prev };
                    delete updatedDates[attId]; // Remove the attId key entirely
                    return updatedDates;
                });
            }

            if (selectedValues2[attId]?.length > 0) {
                setSelectedValues2((prev) => {
                    const updatedValues = { ...prev };
                    delete updatedValues[attId]; // Remove the attId key entirely
                    return updatedValues;
                });
            }

            // Mark the search as not clicked
            setIsSearchClicked((prev) => ({
                ...prev,
                [attId]: false,
            }));

            if (remainingFilterIds.length === 0) {
                localStorage.removeItem("filterIds")
                localStorage.removeItem("filterValues")
                // Only call once for the automatic "no remaining filters" transition,
                // but allow this guard to be reset by user actions (clearFilter).
                if (!__clickedCategoryCalledOnce) {
                    __clickedCategoryCalledOnce = true;
                    // getClickedCategory(1); // Call category if no values remain
                }
            } else {
                console.log('Remaining filter IDs and values:', remainingFilterIds, remainingValues);
                // Call getAudioFilter with the remaining IDs and values
                getAudioFilter(remainingFilterIds, remainingValues);
            }
        } else {
            // If search is not clicked, toggle the dropdown as usual
            toggleDropdown(attId);
        }
    };





    const isYearSelectable = (date, attributes) => {
        const year = date.getFullYear();
        return attributes.includes(year.toString());
    };
    const [selectedDates, setSelectedDates] = useState({});

    const handleDateChange = (dropdownId, newDate) => {
        const selectedYear = newDate.getFullYear();

        setSelectedDates((prev) => {
            return {
                ...prev,
                [dropdownId]: selectedYear,
            };
        });
    };


    const [selectedValues2, setSelectedValues2] = useState({});

    const handleItemSelect = (attId, item) => {
        setSelectedValues2((prev) => {
            const currentSelections = prev[attId] || [];
            // Add or remove the item from the selection
            const updatedSelections = currentSelections.includes(item)
                ? currentSelections.filter((i) => i !== item) // Remove if already selected
                : [...currentSelections, item]; // Add if not selected
            return { ...prev, [attId]: updatedSelections };
        });
    };



    const handleInputChange = (attId, event) => {
        const { value } = event.target;
        setSelectedValues2((prev) => ({
            ...prev,
            [attId]: value ? value.split(',').map((item) => item.trim()) : [], // Split by commas and remove extra spaces
        }));
    };
    function clearFilter(){
       // Local Storage
       localStorage.removeItem("filterIds");
       localStorage.removeItem("filterValues");

       // allow getClickedCategory to be called again on next automatic transition
       __clickedCategoryCalledOnce = false;

    //    getClickedCategory(1); 
       setSelectedValues2({});
       setSelectedDates({});
       setIsSearchClicked({})

     }
    return (
        <div className='mediaFiltertion soundFiltertion'>
            {clickedFliter &&
                    Array.isArray(clickedFliter.addetionals.filterable_attrebutes) &&
                    clickedFliter.addetionals.filterable_attrebutes.length > 0 && (
                        <p className='videos-filter-p' style={{marginTop:"20px"}}>تصفية حسب</p>
                    )}
            <div className="videos-filter-info">
         
                {clickedFliter &&
                    clickedFliter.addetionals.filterable_attrebutes.map((att, index) => (
                        <div className="custom-menu" key={index}>
                            <button onClick={() => toggleDropdown(att.id)} className="p-button" style={{
                                backgroundColor: isSearchClicked[att.id] ? '#810400' : 'white',
                            }}>
                                <img src={`/assets/${isSearchClicked[att.id] ? 'close' :openDropdowns[att.id] &&!isSearchClicked[att.id]? "up":'down'}.png`} alt="" onClick={(e) => {
                                    e.stopPropagation(); // Prevents button click when image is clicked
                                    handleImageClick(att.id);
                                }} />
                                <div className="" style={{ color: isSearchClicked[att.id] ? 'white' : 'initial' }}>
                                    {isSearchClicked[att.id] && selectedDates[att.id]
                                        ? selectedDates[att.id] // Show selected date if present
                                        : isSearchClicked[att.id] && selectedValues2[att.id]?.length > 0
                                            ? selectedValues2[att.id].join(', ') // Show selected multi-select values
                                            : att.value // Fallback to default value
                                    }
                                </div>
                            </button>
                            
                                {openDropdowns[att.id] && (

                                att.type === 'date' ? (

                                    <div className="custom-dropdown-content" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                        <div className="videos-search" onClick={() => handleSearchClick(att.id)}>
                                            <img src="/assets/search2.png" alt="Search" />
                                        </div>

                                        <DatePicker
                                            selected={selectedDates[att.id] ? new Date(selectedDates[att.id], 0, 1) : null}
                                            onChange={(newDate) => handleDateChange(att.id, newDate)}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            filterDate={(date) => isYearSelectable(date, att.attributes)}
                                        />

                                    </div>

                                ) : att.type === 'multi_select' ? (


                                    <div className="custom-dropdown-content2" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                        <div className="custom-dropdown-head">
                                            <div className="videos-search" onClick={() => handleSearchClick(att.id)}>
                                                <img src="/assets/search2.png" alt="Search" />
                                            </div>

                                            <input className='custom-filter-input' value={selectedValues2[att.id]?.join(', ') || ''} readOnly placeholder={''} />
                                        </div>
                                        {att.attributes.map((item, index) => (
                                            <div key={index} className="custom-dropdown-att-item">
                                                <label style={{ display: "flex",flexDirection:"row-reverse", alignItems: "center", width: "100%" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedValues2[att.id]?.includes(item) || false}
                                                        onChange={() => handleItemSelect(att.id, item)}
                                                        style={{marginLeft:'20px'}}
                                                    />
                                                    <span style={{ wordBreak: "break-word" ,direction:"rtl"}}>{item}</span>
                                                </label>
                                            </div>
                                        ))}


                                    </div>
                                ) : (

                                    <div className="custom-dropdown-content2" style={{ padding: '1rem', borderRadius: '0 0 10px 10px', backgroundColor: '#fff' }}>
                                        <div className="custom-dropdown-head">
                                            <div className="videos-search" onClick={() => handleSearchClick(att.id)}>
                                                <img src="/assets/search2.png" alt="Search" />
                                            </div>

                                            <input id={att.id}
                                                className="custom-filter-input"
                                                value={selectedValues2[att.id]?.join(', ') || ''}
                                                onChange={(event) => handleInputChange(att.id, event)} // Handle the input change
                                                placeholder="" />
                                        </div>



                                    </div>

                                )


                            )}
                        </div>
                    ))
                }



                {
                    localStorage.getItem("filterIds") ||  localStorage.getItem("filterValues")?
                    <button className='clearFilterBtn more_btn soundClear' onClick={()=>clearFilter()}>مسح الكل</button>
                    :
                    ""
                        
                }
            </div>
        </div>

    )
}
