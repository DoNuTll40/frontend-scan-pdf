
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AppHook from "../hooks/AppHook";
import { faAddressCard, faAngleDown, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchFile from "./SearchFile";
import BellNotification from "./BellNotification";

function Header() {

  document.title = "ระบบไฟล์พัสดุ"

  const { logout } = AppHook()!;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(prevState => !prevState);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 500);
  };

  const hdlLogout = () => {
    toast.success("ออกจากระบบเรียบร้อย", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      onClose: () => {
        navigate('/')
        logout()
      }
    })
  }

  return (
    <div className="w-full border-b sticky top-0 z-40 backdrop-blur-lg bg-white/85 select-none capitalize">
      <div className="max-w-[80rem] mx-auto flex justify-between py-1 px-2">

        <div className="flex gap-4 items-center hover:cursor-pointer w-[200px]" onClick={ () => navigate('/')}>
          <img className="h-10" src="/logo-02.png" alt="Logo" />
          <div>
            <p className="text-sm sm:text-md font-bold">ระบบจัดเก็บไฟล์</p>
            <p className="text-xs sm:text-sm font-semibold">โรงพยาบาลศูนย์สกลนคร</p>
          </div>
        </div>

        <div className="w-1/2 hidden md:block">
          <SearchFile />
        </div>

        <div className="flex gap-2 items-center justify-end w-[150px] sm:w-[200px]">

          <BellNotification />

          <div className="relative" onClick={handleMouseEnter}>
            <div className="flex items-center gap-3 bg-[#6498A3] px-2 py-1 rounded-full cursor-pointer">
              <img className="max-h-10 rounded-full border-white border-2" src="./user.png" alt="User Avatar" />
              <FontAwesomeIcon className={` transition ease-in-out duration-200 ${isHovered ? "pr-2 -rotate-0" : "pl-2 rotate-180"}`} icon={faAngleDown} />
            </div>
            <div onMouseLeave={handleMouseLeave} className={`absolute top-12 z-30 right-0 rounded-md w-[12rem] mt-2 p-2 bg-gray-100 border border-gray-300 shadow-lg transition-opacity duration-300 ease-in-out ${ isHovered ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
              style={{ maxHeight: '300px' }} >
              {/* <button className="w-full text-left hover:bg-gray-200 py-2 px-2 rounded-md hover:shadow-sm hover:text-gray-700 transition-all ease-in-out duration-150 hover:flex hover:justify-between hover:items-center" onClick={ () => toast.info("ระบบกำลังพัฒนา...", { theme: 'colored' })} ><FontAwesomeIcon icon={faAddressCard} /> โปรไฟล์</button> */}
              <button onClick={hdlLogout} className="w-full text-left hover:bg-gray-200 py-2 px-2 rounded-md hover:shadow-sm hover:text-gray-700 transition-all ease-in-out duration-150 hover:flex hover:justify-between hover:items-center"><FontAwesomeIcon icon={faRightToBracket} /> ออกจากระบบ</button>
            </div>
          </div>

        </div>
      </div>
        <div className="w-full block md:hidden px-5 my-2">
          <SearchFile />
        </div>
    </div>
  );
}

export default Header;
