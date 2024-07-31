
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../configs/axios"
import { useEffect, useState } from "react"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

interface DiskInfo {
    used: string;
    size: string;
    usedPer: string;
  }
  
  function DiskStorage() {
    const [infoDisk, setInfoDisk] = useState<DiskInfo | null>(null);
    const [showDisk, setShowDisk] = useState<boolean>(false)

    const fetchDisk = async () => {
        try {
            let token = localStorage.getItem('token')
            const rs = await axios.get('/api/disk-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(rs.status === 200){
                setInfoDisk(rs.data.storage)
            }
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchDisk();
    }, [])

  return (
    <div className={`select-none fixed bottom-10 z-50 right-3 md:right-10 shadow-lg backdrop-blur-xl bg-slate-400/30 ${showDisk ? "w-[300px] h-32 rounded-xl" : "w-[65px] h-16 rounded-full hover:bg-slate-400/60 hover:cursor-pointer scale-100 active:scale-95"} p-2 transition ease-in-out duration-200 ${infoDisk === null ? "opacity-0" : "opacity-100"}`}>
        <div className={`${showDisk ? "flex gap-2 relative" : "flex justify-center items-center"}`}>
            {showDisk && <div className=" absolute -top-5 -right-3 px-2 py-0.5 transition ease-in-out duration-200 rounded-full bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white font-bold border-2 border-white hover:rotate-180" onClick={ () => setShowDisk(false)}><FontAwesomeIcon icon={faXmark} /></div>}
            <div className={`flex items-center justify-center w-1/3 ${showDisk ? "py-3" : "pt-[5px]"}`} onClick={ () => setShowDisk(true)}>
                <img className={`${showDisk ? "max-w-20" : "max-w-10"}`} src="/hard-drive.png" alt="icon-disk" />
            </div>
            {showDisk && (
                <div className="flex flex-col gap-2 justify-center">
                    <div className="text-center font-semibold">
                        <p>พื้นที่เก็บข้อมูล</p>
                    </div>
                    <div className="text-sm">
                        <p>ใช้ไปแล้ว {infoDisk?.used} จาก {infoDisk?.size}</p>
                    </div>
                    <div>
                        <p className="text-xs text-center">{infoDisk?.usedPer}</p>
                        <div className="flex items-center whitespace-nowrap">
                        <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
                            <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{ width: `${infoDisk?.usedPer}`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    </div>
  )
}

export default DiskStorage