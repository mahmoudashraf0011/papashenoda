import React, { useEffect } from 'react'
import './About.scss'
import './About-res.scss'

export default function About() {
    window.addEventListener('hashchange', function (e) {
        e.preventDefault();
    });
    
    window.onload = function () {
        window.history.replaceState(null, null, ' '); // Clear hash if any
    };
    useEffect(() => {
      window.scrollTo(0, 0); // Ensure scroll starts at the top
    }, []);
    return (
        <div className='about'>
            <div className="about-wrapper">
                <img className='about-img' src="./assets/Frame-1023.png" alt="" />
                <div className="about-infos">
                    <p className='about-about'>عن الموقع</p>
                    <div className='about-about-ps'>
                        <p>نحن مجموعة من أبناء البابا شنودة الثالث كهنة، وأساتذة كلية أكليريكية، وأكليريكين</p>
                        <p> و مكرسين ومكرسات، وخدام وخادمات عشنا تربينا وتتلمذنا على يد البابا شنودة الثالث العظيم</p>
                        <p>فى البطاركة،أستمعنا الى عظاته فأضاء لنا الطريق، فكان نوراً منيراً أنار للاهوتى الباحث،</p>
                        <p>و الكاهن الراعي، والخادم المحب، للقوى وللضعيف منا، فأمنا بفكره “فكر المسيح” فى الروحيات</p>
                        <p> وفى العلاقة مع المسيح وفى الرعاية وفى الخدمة وفى الرهبنة.</p>
                        <p> و قد أجتمعنا معاً لخدمة الكنيسة من خلال حفظ ونشر تراثه، بمباركة وتحت رعاية أبينا صاحب</p>
                        <p>الغبطة والقداسة البابا الأنبا تواضروس الثانى  بابا الاسكندرية وبطريرك الكرازة</p>
                        <p>المرقسية المائة والثامن عشر</p>
                    </div>
                    <p className='about-about2'> اهداف الموقع</p>
                    <div className="about-about-ps2">
                        <p> <span>جمع</span>: تراث قداسة البابا شنوده الثالث من كتب مقالات عظات فيديو عظات صوتية محاضرات</p>
                        <p>الكلية الإكليريكية والمعاهد الدينية اللقاءات التلفزيونية مؤتمر الخدمة سيمنارات الآباء الكهنة</p>
                        <p>.في الداخل والخارج زيارات الأديرة و الإبروشيات والكنائس</p>

                    </div>
                    <div className="about-about-ps2">
                        <p>.<span>حفظ:</span> هذا التراث بطريقة جيدة بعد توثيقه بدقة وفهرسته وتقديمه للخادم القبطي في العالم كله</p>
                    </div>
                    <div className="about-about-ps2">
                        <p>.<span>معالجة:</span> ما تم جمعه بأحدث الطرق الإلكترونية</p>
                    </div>
                    <div className="about-about-ps2">
                        <p>.<span>نشر:</span> هذا التراث لنفع الكثيرين وأن يمتد هذا التعليم النقي السليم من جيل الى جيل </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
