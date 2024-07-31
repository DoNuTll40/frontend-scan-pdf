
import { useEffect, useState } from "react";
import axios from "../configs/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WSHook from "../hooks/WSHook";

interface monthFolder {
    folder: string,
    created: string,
    modified: string
}

function FolderYear() {

    const [pdfMonth, setPdfMonth] = useState<monthFolder[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { notifications } = WSHook()!;

    let token = localStorage.getItem('token')

    const month = location.pathname.split('/')[2]

    document.title = decodeURIComponent(month)

    const fetchPdfMonth = async () => {
        setLoading(true)
        try {
            const rs = await axios.get(`/api/pdf/month/${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                setPdfMonth(rs.data.yearInFolder)
                setLoading(false)
            }
        }catch(err: any){
            if (!loading) {
                toast.error(err.response.data.message, {
                    theme: "colored",
                    autoClose: 1500,
                    onClose: () => navigate('/')
                })
            }
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect( () => {
        fetchPdfMonth();
    }, [month, token, notifications])

    const hdlMonthClick = (monthName: string) => {
        navigate(`month/${monthName}`)
    }

    // const dataLoad = {
    //   title: "กำลังโหลดข้อมูล"
    // }

  return (
    <div className="max-w-[80rem] pt-5 mx-auto ">
      <div className="flex gap-2 px-2 hover:cursor-default">
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={ () => navigate('/')}><FontAwesomeIcon icon={faHome}/> Home </p>{">"}
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={ () => location.reload()}><FontAwesomeIcon icon={faFolderOpen} /> {decodeURIComponent(month)} </p>
      </div>
      <>
        <div className="my-2 text-xl font-semibold relative">
            <h1 className="relative z-10 bg-white inline-block px-2">เดือน</h1>
            <hr className="absolute top-1/2 transform -translate-y-1/2 w-full border-t border-gray-300 z-0" />
        </div>

        {loading && (
                <div className='w-full flex flex-col gap-2 justify-center items-center'>
                    <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                    <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
                </div>
            )}

        <div className="px-3 sm:p-0 transition ease-in-out duration-200 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-5">
          {!loading && pdfMonth?.map((el: any, index: number) => (
            <div 
                key={index + 1}
                className="flex flex-col gap-2 items-center p-4 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md scale-100 active:scale-95 active:bg-slate-200 rounded-xl select-none"
                onClick={ () => hdlMonthClick(el.folder)}
            >
              <img className="max-w-15 sm:max-w-20 pointer-events-none" src="/folder.png" alt="folder" />
              <p className="text-[90%] sm:text-base">{el.folder}</p>
            </div>
          ))}
        </div>
      </>
    </div>
  )
}

export default FolderYear