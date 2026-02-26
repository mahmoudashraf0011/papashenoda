import React, { useContext, useState } from 'react';
import './Contact.scss'
import './contact-res.scss'

import axios from 'axios'
import { UserContext } from '../Context/UserContext'

export default function Contact() {

    const { baseURL } = useContext(UserContext);
    const [error, setError] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });
    const [success, setSuccess] = useState('');

    const [contactInfo, setContactInfo] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    })
    const sendContact = () => {
        const hasErrors = Object.values(error).some((err) => err); // Check if there are any validation errors
        if (!contactInfo.name || !contactInfo.phone || !contactInfo.email || !contactInfo.message) {
            setError((prev) => ({
                ...prev,
                general: "يرجى ملء جميع الحقول", // "Please fill all fields"
            }));
            setTimeout(() => {
                setError((prev) => ({ ...prev, general: "" }));
            }, 3000);
            return;
        }

        if (hasErrors) {
            return; // Stop submission if there are validation errors
        }

        axios
            .post(`${baseURL}/contactus/send`, contactInfo)
            .then((response) => {
                setSuccess("تم إرسال الرسالة بنجاح"); // "Message Sent Successfully"
                setContactInfo({
                    name: "",
                    phone: "",
                    email: "",
                    message: "",
                });
                setTimeout(() => {
                    setSuccess("");
                }, 3000);
            })
            .catch((error) => {
                setError((prev) => ({
                    ...prev,
                    general: error.response?.data?.message || "حدث خطأ أثناء الإرسال", // "An error occurred while sending"
                }));
                setTimeout(() => {
                    setError((prev) => ({ ...prev, general: "" }));
                }, 3000);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setContactInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Validation logic
        if (name === "phone") {
            const phonePattern = /^01\d{9}$/; // Starts with 01 and has 11 digits
            setError((prev) => ({
                ...prev,
                phone: phonePattern.test(value) ? "" : "يجب أن يبدأ رقم الهاتف بـ 01 وأن يحتوي على 11 رقما", // "Phone number must start with 01 and be 11 digits."
            }));
        } else if (name === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            setError((prev) => ({
                ...prev,
                email: emailPattern.test(value) ? "" : "البريد الإلكتروني غير صالح", // "Invalid email address."
            }));
        } else if (name === "name") {
            setError((prev) => ({
                ...prev,
                name: value.trim() ? "" : "يرجى إدخال الاسم", // "Please enter a name."
            }));
        } else if (name === "message") {
            setError((prev) => ({
                ...prev,
                message: value.trim() ? "" : "يرجى إدخال رسالة", // "Please enter a message."
            }));
        }
    };

    return (
        <div className='contact'>
            <div className="contact-wrapper">
                <img className='contact-img' src="./assets/contact.png" alt="" />
                <div className="contact-left">
                    <div className="contact-left-cont">
                        <input
                            type="text"
                            name="name"
                            className="contact-left-input"
                            placeholder="الاسم"
                            value={contactInfo.name}
                            onChange={handleInputChange}
                            required
                        />
                        {error.name && <p className="contact-error-message">{error.name}</p>}

                        <input
                            type="text"
                            name="phone"
                            className="contact-left-input"
                            placeholder="رقم الموبيل"
                            value={contactInfo.phone}
                            onChange={handleInputChange}
                            required
                        />
                        {error.phone && <p className="contact-error-message">{error.phone}</p>}

                        <input
                            type="text"
                            name="email"
                            className="contact-left-input"
                            placeholder="البريد الألكتروني"
                            value={contactInfo.email}
                            onChange={handleInputChange}
                            required
                        />
                        {error.email && <p className="contact-error-message">{error.email}</p>}

                        <textarea
                            name="message"
                            className="contact-left-area"
                            placeholder="رسالة"
                            value={contactInfo.message}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                        {error.message && <p className="contact-error-message">{error.message}</p>}

                        {error.general && <p className="contact-error-message">{error.general}</p>}
                        {success && <p className="contact-error-message2">{success}</p>}

                        <button type="submit" className="contact-left-send" onClick={sendContact}>
                            ارسال
                        </button>
                    </div>
                </div>
                <div className="contact-right">
                    <p className='contact-contact'>تواصل معنا</p>
                    <p className='contact-how'>كيف يمكننا مساعدتك ؟</p>
                    <div className="contact-socials">
                        <img className='contact-social' src="./assets/contact5.png" alt="" />
                        <img className='contact-social' src="./assets/contact4.png" alt="" />
                        <img className='contact-social' src="./assets/contact2.png" alt="" />
                        <img className='contact-social' src="./assets/contact3.png" alt="" />
                        <img className='contact-social' src="./assets/contact1.png" alt="" />
                    </div>
                </div>
            </div>

        </div>
    )
}
