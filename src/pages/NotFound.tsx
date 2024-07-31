import { faCaretLeft } from "@fortawesome/free-solid-svg-icons/faCaretLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"

export default function NotFound() {

    const navigate = useNavigate();
    document.title = "404 Not Found | ไม่พบเส้นทาง"

  return (
    <div className="flex h-screen justify-center select-none">
        <div className="flex flex-col justify-between items-center pt-24 pb-3">
            <div className="flex flex-col items-center animate-fadeInDown">
                <img className="w-[300px] pointer-events-none" src="/error404.png" alt="error-404" />
                <p className="text-lg font-medium my-2">เว็บไซต์ไม่พบเส้นทางที่คุณต้องการ</p>
                <p>{decodeURIComponent(location.href)}</p>
                <button className="text-md text-black hover:text-black/70 hover:font-semibold animate-fadeInDown px-8 py-2 mt-10 bg-slate-100 hover:bg-blue-100 rounded-md border border-[#3257b3] hover:border-[#2659da] flex items-center gap-1 hover:gap-2 shadow-md transition-all ease-in-out duration-150" onClick={ () => navigate('/')}><FontAwesomeIcon icon={faCaretLeft} />หน้าหลัก</button>
            </div>
            <div className="flex gap-2 items-center justify-center animate-fadeInDown">
                <img className="w-[7%]" src="/logo-02.png" alt="logo-sknh" />
                <p className="text-md font-normal">โรงพยาบาลศูนย์สกลนคร</p>
            </div>
        </div>
    </div>
  )
}
