import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppHook from "../hooks/AppHook";
import RigthHook from "../hooks/RightHook";
import { useEffect, useRef, useState } from "react";
import axios from "../configs/axios";
import { toast } from "react-toastify";

export default function FormRename() {

    const { showRename, setShowRename } = AppHook()!;
    const { clickedContent, setClickedContent } = RigthHook()!;
    const [newFileName, setNewFileName] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null);
    
    const token = localStorage.getItem('token')

    const hdlClose = () => {
        setClickedContent("")
        setShowRename(false)
    }

    useEffect(() => {
      setNewFileName(clickedContent)
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            hdlClose();
          }
        };
    
        if (showRename) {
          document.addEventListener('keydown', handleKeyDown);
          if (inputRef.current) {
            setTimeout(() => {
              inputRef.current?.focus();
              inputRef.current?.setSelectionRange(0, inputRef.current.value.lastIndexOf('.'));
          }, 0);
        }
        } else {
          document.removeEventListener('keydown', handleKeyDown);
        }
    
      }, [showRename]);

    if(showRename){
        document.documentElement.style.overflow = 'hidden';
    }else{
        document.documentElement.style.overflow = 'auto';
    }

    const hdlRename = async (oldFileName: string) => {
      try {
        const searchFile = await axios.get(`/api/pdf?search=${oldFileName}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })

      const filePath = searchFile.data?.files[0]?.folder

      const dataApi = { folderPath: filePath, oldFileName, newFileName, request: "rename" }

      const renameFile = await axios.patch('/api/pdf/rename', dataApi, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(renameFile.status === 200){
        toast.success(renameFile.data.message)
        hdlClose();
      }
      }catch(err: any){
        console.log(err)
        toast.error(err.response.data.message, {
          theme: 'colored'
        })
      }
    }

  return (
    <div className={`fixed inset-0 flex z-[60] ${showRename ? "backdrop-blur-sm opacity-100 animate-fadeInDown" : "opacity-0 pointer-events-none"} justify-center items-center h-screen bg-slate-400/30 transition-all ease-in-out duration-200`}>
        <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] h-[30%] p-7 rounded-lg shadow-xl border flex justify-between flex-col gap-4 overflow-hidden">
            <div className="flex justify-between px-1 select-none">
                <p className="text-lg font-semibold">เปลี่ยนชื่อ</p>
                <p className="text-lg font-semibold rotate-0 scale-100 hover:scale-110 hover:rotate-90 hover:cursor-pointer transition-all ease-in-out duration-150"
                    onClick={() => hdlClose()}
                ><FontAwesomeIcon icon={faXmark} /></p>
            </div>
            <input className="w-full rounded-md" ref={inputRef} value={newFileName} type="text" onChange={ (e) => setNewFileName(e.target.value)} />
            <div className="flex justify-end gap-1 mt-3">
                <button className="px-6 py-1.5 rounded-full hover:bg-slate-200 text-[#2659da]" onClick={ () => hdlClose()}>ยกเลิก</button>
                <button className="px-6 py-1.5 rounded-full hover:bg-[#3257b3] bg-[#2659da] text-white border-none" onClick={ () => hdlRename(clickedContent) }>ยืนยัน</button>
            </div>
        </div>
    </div>
  )
}
