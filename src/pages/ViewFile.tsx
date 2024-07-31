
import { useEffect, useState } from "react";
import axios from "../configs/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolderTree, faHome } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from "react-router-dom";
import PdfHook from "../hooks/PdfHook";
import { toast } from "react-toastify";

interface searchPdf {
  created: string;
  fileName: string;
  folder: string;
  folderMomth: string;
  folderYear: string;
  modified: string;
  size: string;
}

function ViewFile() {

  const [search, setSearch] = useState<searchPdf | null>(null);
  const [loadIframe, setLoadIframe] = useState<boolean>(true)
  const { formatDate } = PdfHook()!;
  const navigate = useNavigate();

  const ipAddress = window.location.hostname;

  const fileName = location.pathname.split('/')[3];

  document.title = decodeURIComponent(fileName)

  useEffect(() => {
    setLoadIframe(true)
    const fetchSearch = async () => {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          console.log("Token not found in localStorage");
          return;
        }

        const rs = await axios.get(
          `/api/pdf?search=${decodeURIComponent(fileName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (rs.data.files.length !== 0) {
          setSearch(rs.data.files[0]);
        } else {
          console.log("No files found");
        }
      } catch (err: any) {
        toast.error(err.response.data.message, {
          theme: 'colored',
          autoClose: 2500,
          onClose: () => navigate(-1)
        })
        console.log(err);
      }
    };

    if (fileName) {
      fetchSearch();
    }
  }, [fileName]);

  const hdlLoadIframe = () => {
    setLoadIframe(false)
  }

  const hdlMonthClick = () => {
    const folder = search?.folder.split('/')[1]
    navigate(`/year/${search?.folderYear}/month/${folder}`)
  }

  const hdlYearClick = () => {
    const year = search?.folderYear;
    navigate(`/year/${year}`)
  }

  const dataLoad = {
    title: "กำลังโหลดข้อมูล"
  }

  return (
    <div className="max-w-[80rem] pt-5 mx-auto ">
      <div className="flex gap-2 px-2 hover:cursor-default select-none text-[0.65rem] md:text-base">
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={ () => navigate('/')}><FontAwesomeIcon icon={faHome}/> Home </p>{">"}
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={hdlYearClick}><FontAwesomeIcon icon={faFolderOpen} /> {!search ? dataLoad.title : search?.folderYear} </p>{">"}
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={hdlMonthClick}><FontAwesomeIcon icon={faFolderTree} /> {!search ? dataLoad.title : search?.folder.split('/')[1]} </p>{">"}
        <p className=" hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={ () => location.reload()}><FontAwesomeIcon icon={faFilePdf} /> {!search ? dataLoad.title : search?.fileName}</p>
      </div>
      {!search && (
        <>
          <div className="mt-4 p-2">
            <p className="font-semibold text-lg">รายละเอียดไฟล์</p>
            <p>ชื่อไฟล์ {dataLoad.title}</p>
            <p>ขนาดไฟล์ {dataLoad.title}</p>
            <p>วันที่อัพโหลด {dataLoad.title}</p>
            <p>แก้ไขล่าสุด {dataLoad.title}</p>
          </div>
          <hr className="py-2" />
          <div className="px-2">
          {loadIframe ? (
              <div className='flex flex-col gap-2 my-4 justify-center items-center'>
                <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
              </div>
            ) : (
              null
            )}
          </div>
        </>
      )}
      {search && (
        <>
          <div className="mt-4 p-2">
            <p className="font-semibold text-lg">รายละเอียดไฟล์</p>
            <p>ชื่อไฟล์ {search.fileName}</p>
            <p>ขนาดไฟล์ {search.size}</p>
            <p>วันที่อัพโหลด {formatDate(search.created)}</p>
            <p>แก้ไขล่าสุด {formatDate(search.modified)}</p>
          </div>
          <hr className="py-2" />
          <div className="px-2">
            {loadIframe && (
              <div className="flex flex-col gap-2 my-4 justify-center items-center">
                <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
              </div>
            )}
            <iframe
              className={`sticky top-20 z-40 bg-white/75 ${loadIframe ? 'hidden' : ''}`}
              src={`http://${ipAddress}:8080/api/pdf/${decodeURIComponent(search.folder)}/${decodeURIComponent(fileName)}`}
              style={{ width: "100%", height: "100vh" }}
              title="PDF Viewer"
              onLoad={hdlLoadIframe}
            ></iframe>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewFile;
