
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "../configs/axios"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface pdfFile {
    folder: string,
    folderYear: string,
    folderMomth: string,
    fileName: string,
    size: string,
    created: string,
    modified: string
}

function SearchFile() {

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [inputSearch, setInputSearch] = useState<string | null>(null)
    const [resultSearch, setResultSearch] = useState<pdfFile[]>([])
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);

    const hdlClickSearchInput = () => {
        setShowSearch(true)
    }

    const hdlCloseSearchInput = () => {
        setShowSearch(false)
    }

    const fetchSearch = async () => {
        let fileName = inputSearch
        let token = localStorage.getItem('token')

        try {
            if(fileName && fileName.trim() !== ''){
                const rs = await axios.get(`/api/pdf?search=${fileName}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setResultSearch(rs.data.files);
            } else {
                setResultSearch([]);
            }

        }catch(err: any){
            toast.error(err.response.data.message, {
                theme: 'colored',
                autoClose: 2000,
                closeOnClick: true,
                onClose: () => {
                    setResultSearch([])
                    setInputSearch('')
                }
            })
        }
    }

    useEffect( () => {
        if(setInputSearch === null){
            setResultSearch([])
        }
        fetchSearch();
    }, [inputSearch])

    const hdlChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (typingTimeout) {
            clearTimeout(typingTimeout); // ถ้ามี timeout เก่าอยู่ให้ clear ออกก่อน
        }

        // สร้าง timeout ใหม่
        const timeout = setTimeout(() => {
            setInputSearch(value);
        }, 500); // ตั้งเป็น 1000 มิลลิวินาที (1 วินาที)

        setTypingTimeout(timeout); // เก็บ timeout เพื่อเอาไว้ clear ในการเปลี่ยนแปลงครั้งถัดไป
    };

    const hdlFileClick = (fileName: string) => {
        setInputSearch('')
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        hdlCloseSearchInput()
        navigate(`/view/file/${fileName}`)
    }

  return (
    <div className="relative" onMouseLeave={hdlCloseSearchInput} onTouchCancel={hdlCloseSearchInput}>
        <div className="relative flex items-center z-20 p-1" onClick={hdlClickSearchInput}>
            <FontAwesomeIcon className="absolute top-[2.2vh] left-3.5 text-[rgba(0,0,0,0.3)]" icon={faSearch} />
            <input className="w-full rounded-full shadow-[inset_0_5px_4px_rgba(0,0,0,0.3)] border-none pl-8" type="search" name="search" placeholder="ค้นหา..." ref={inputRef} onChange={hdlChangeSearch} />
        </div>

        {showSearch && (
            <div className={`absolute top-0 z-10 w-full max-h-64 bg-slate-200 rounded-t-3xl rounded-b-xl transition-transform shadow-md overflow-y-auto ${showSearch ? "animate-fadeInDown" : "opacity-0 translate-y-[-20px]"}`}>
                <div className="pt-14 pb-2">
                    {resultSearch.length === 0 ? (
                        <p className="text-end font-semibold px-2">ไม่พบข้อมูล</p>
                    ) : (
                        <div>
                            <p className="text-end font-semibold px-2">พบ {resultSearch.length} รายการ</p>
                            <div className="flex flex-col gap-2 my-2 px-2">
                                <hr className="w-full" />
                                {resultSearch && resultSearch?.map((el, index: number) => (
                                    <div 
                                        key={index}
                                        className="flex flex-col hover:cursor-pointer hover:bg-white px-2 py-1 rounded-xl transition ease-in-out duration-100 hover:shadow-sm scale-95 hover:scale-100"
                                        onClick={() => hdlFileClick(el.fileName)}
                                    >
                                        <div className="flex justify-between">
                                            <div className="flex gap-1 items-center">
                                            {el.fileName.endsWith("xlsx") ? <img className="max-w-6 pointer-events-none" src="/xls.png" alt="folder" /> : el.fileName.endsWith("doc") ? <img className="max-w-6 pointer-events-none" src="/doc.png" alt="folder" /> : <img className="max-w-6 pointer-events-none" src="/pdf.png" alt="folder" />}
                                                <p className=" text-sm">{el.fileName}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-sm">ขนาดไฟล์ {el.size}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs">
                                            <p className="px-2">{el.folder}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> 
                    )}
                </div>
            </div>
        )}
    </div>
  )
}

export default SearchFile