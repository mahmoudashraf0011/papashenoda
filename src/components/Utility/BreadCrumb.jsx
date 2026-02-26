import React, { useEffect } from 'react'
import './BreadCrumb.css'
import { Link, useNavigate } from 'react-router-dom'

export default function BreadCrumb({ data, value }) {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!data || data.length === 0) {
                navigate("*");
            } else {
                const arr = data.map(item => item.id);
                localStorage.setItem("headerRoute", JSON.stringify(arr.reverse()));
            }
        }, 10000); 

        return () => clearTimeout(timer);
    }, [data, navigate]);

    return (
        <div className='breadCrumbContainer'>
            <div className='Container'>
                <ul className="breadCrumb">
                    {data?.map((item) => (
                        <li key={item.id}>
                            <Link to={`/category/${item.slug}`}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
