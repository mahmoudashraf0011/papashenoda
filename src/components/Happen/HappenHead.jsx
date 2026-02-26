import React, { useState } from 'react'
import { Calendar } from 'primereact/calendar';
import HappenHook from '../../Logic/Media/Writings/Happen/HappenHook';
import { logDOM } from '@testing-library/dom';
import { Value } from 'sass';
// happend head
export default function HappenHead() {
    const today = new Date();
    const isoString = today.toISOString();
    const year = parseInt(isoString.substring(0, 4));
    const monthISO = parseInt(isoString.substring(5, 7));
    const dayOfMonth = parseInt(isoString.substring(8, 10));
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const [happenData, pageCount, handleChangePage, getData, loading] = HappenHook();
    let dayDefault;

    if (localStorage.getItem("happenDay")) {
        dayDefault = JSON.parse(localStorage.getItem("happenDay"))
    }
    let monthDefault;
    if (localStorage.getItem("happenMonth")) {
        monthDefault = JSON.parse(localStorage.getItem("happenMonth"))
    }
    let yearDefault;
    if (localStorage.getItem("happenYear")) {
        yearDefault = JSON.parse(localStorage.getItem("happenYear"))
    }
    const currentYear = new Date().getFullYear();

    const [date, setDate] = useState(() => new Date(
        new Date(isoString).getFullYear(),
        new Date(isoString).getMonth(),
        dayDefault?.value ?? new Date(isoString).getDate()
      ));
        const [date2, setDate2] = useState(
        monthDefault
          ? new Date(currentYear, monthDefault.value - 1, 1)
          : new Date(isoString)
      );    const [date3, setDate3] = useState(
        yearDefault ? new Date(yearDefault.value, 0, 1) : new Date(isoString)
      );
          const onChooseDay = async (e) => {
        setDate(e.value)
        const day = { "format": e.value, "value": e.value && e.value.getDate() };
        localStorage.setItem("happenDay", JSON.stringify(day))
    }
    const onChooseMonth = async (e) => {
        setDate2(e.value)
        const month = { "format": e.value, "value": e.value && e.value.getMonth() + 1 };
        localStorage.setItem("happenMonth", JSON.stringify(month))
    }
    const onChooseYear = async (e) => {
        setDate3(e.value)
        const year = { "format": e.value, "value": e.value && e.value.getFullYear() };
        localStorage.setItem("happenYear", JSON.stringify(year))
    }
        const onHandleFilter = () => {
            const now = new Date();
        
            if (
                now.getDate() === date.getDate() &&
                now.getMonth() === date2.getMonth() &&
                now.getFullYear() === date3.getFullYear()
            ) {
                const day = { format: date, value: date.getDate() };
                localStorage.setItem("happenDay", JSON.stringify(day));
        
                const month = { format: date2, value: date2.getMonth() + 1 };
                localStorage.setItem("happenMonth", JSON.stringify(month));
        
                const year = { format: date3, value: date3.getFullYear() };
                localStorage.setItem("happenYear", JSON.stringify(year));
            }else{
                if(!localStorage.getItem("happenDay")){
                    const day = { "format": date.getDate(), "value":date.getDate() };
                    localStorage.setItem("happenDay", JSON.stringify(day))
                }

                if(!localStorage.getItem("happenMonth")){
                    const month = { "format": date2.getMonth(), "value":date2.getMonth()+1 };
                    localStorage.setItem("happenMonth", JSON.stringify(month))
                }

                if(!localStorage.getItem("happenYear")){
                    const year = { "format": date3.getFullYear(), "value":date3.getFullYear() };
                    localStorage.setItem("happenYear", JSON.stringify(year))
                } 
            }
        
            getData();
        };

        const onRest=()=>{
            localStorage.removeItem("happenDay")
            localStorage.removeItem("happenMonth")
            localStorage.removeItem("happenYear")
            setDate(new Date(isoString));
            setDate2(new Date(isoString));
            setDate3(new Date(isoString));
            getData();
        }
        
    return (
        <>
            <div className="happen-top-head">
                <div className="happen-date" style={{ cursor: "pointer" }}>
                    <div className='delete_all' onClick={()=>onRest()}>مسح الكل</div>
                    <div className="happen-search" onClick={onHandleFilter}>
                        <img className='' src="./assets/search2.png" alt="" />
                    </div>
                    {/* <div className="happen-year-cont">

                        <Calendar value={date3} onChange={onChooseYear} view="year" dateFormat="yy" className={`happen-year ${isFocused ? 'focused' : ''}`} onFocus={handleFocus}
                            onBlur={handleBlur} readOnlyInput/>
                        <p className='happen-year-p'   >سنة</p>
                    </div> */}
                    <div className="happen-year-cont">
                        <Calendar value={date2} onChange={onChooseMonth} view="month" dateFormat="mm" className='happen-month' readOnlyInput />
                        <p className='happen-year-p' >شهر</p>
                    </div>
                    <div className="happen-year-cont">
                        <Calendar value={date} onChange={onChooseDay} view="date" dateFormat="dd" className='happen-month' readOnlyInput />
                        <p className='happen-year-p' >يوم</p>
                    </div>
                </div>
                <img className='happen-top-img' src="./assets/happen.png" alt="" />
                <p className='happen-happen-head'>حدث في مثل هذا اليوم</p>
            </div>
            <div className="happen-top-head-res" style={{display:"none"}} >
                <p className='happen-top-head-res-label'>ادخل التاريخ</p>
                <div className="happen-date" style={{ cursor: "pointer" }}>
                    <div className='delete_all' onClick={()=>onRest()}>مسح الكل</div>
                    <div className="happen-search" onClick={onHandleFilter}>
                        <img className='' src="./assets/search2.png" alt="" />
                    </div>
                    {/* <div className="happen-year-cont">

                        <Calendar value={date3} onChange={onChooseYear} view="year" dateFormat="yy" className={`happen-year ${isFocused ? 'focused' : ''}`} onFocus={handleFocus}
                            onBlur={handleBlur} readOnlyInput/>
                        <p className='happen-year-p'   >سنة</p>
                    </div> */}
                    <div className="happen-year-cont">
                        <Calendar value={date2} onChange={onChooseMonth} view="month" dateFormat="mm" className='happen-month' readOnlyInput />
                        <p className='happen-year-p' >شهر</p>
                    </div>
                    <div className="happen-year-cont">
                        <Calendar value={date} onChange={onChooseDay} view="date" dateFormat="dd" className='happen-month' readOnlyInput />
                        <p className='happen-year-p' >يوم</p>
                    </div>
                </div>
            </div>

        </>

    )
}
