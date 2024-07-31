import { useEffect } from "react";
import RigthHook from "../hooks/RightHook";
import PdfHook from "../hooks/PdfHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFilePen } from "@fortawesome/free-solid-svg-icons/faFilePen";
import { faEye, faFile } from "@fortawesome/free-solid-svg-icons";
import AppHook from "../hooks/AppHook";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import axios from "../configs/axios";
import { saveAs } from "file-saver"
import { useNavigate } from "react-router-dom";

export default function ContextMenu() {
  const { isOpen, menuPosition, clickedContent, closeContextMenu } = RigthHook()!;
  const { deleteFile } = PdfHook()!;
  const { setShowRename } = AppHook()!;
  const ipAddress = window.location.hostname;
  const navigate = useNavigate();

  const handleClick = () => {
    closeContextMenu();
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Action: ${action}\nContent: ${clickedContent}`);
    closeContextMenu();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleDownload = async (fileName: string) => {
    try {
      let token = localStorage.getItem('token')
      const rs = await axios.get(`/api/pdf?search=${decodeURIComponent(fileName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        if (rs.status === 200 && rs.data.files.length > 0) {
          const fileData = rs.data.files[0];
          if(fileName.endsWith('.pdf')){
            try {
            const rs1 = await axios.get(`http://${ipAddress}:8080/api/pdf/${encodeURIComponent(fileData.folder)}/${encodeURIComponent(fileName)}`, {
              responseType: 'blob',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        
            const blob = new Blob([rs1.data], { type: rs1.headers['content-type'] });
            saveAs(blob, fileName);
            }catch(err){
              console.log(err)
            }
          } else {
            const downloadUrl = `http://${ipAddress}:8080/api/pdf/${encodeURIComponent(fileData.folder)}/${encodeURIComponent(fileName)}`
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.title = fileName

            link.click();
          }
        }

    }catch(err){
      console.log(err)
    }
  }

  const hdlViewFile = (fileName: string) => {
    navigate(`/view/file/${fileName}`);
  }

  return (
    <div
      className={`absolute max-w-[15rem] animate-fadeInDown bg-white border z-50 px-2 py-2 flex flex-col gap-1 backdrop-blur-xl bg-white/70 rounded-md shadow-md select-none ${isOpen ? "flex" : "hidden"}`}
      style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
    >
      <p className="w-[12rem] text-ellipsis text-nowrap overflow-hidden" title={clickedContent}><FontAwesomeIcon className="px-1" icon={faFile} /> {clickedContent}</p>
      {clickedContent.endsWith('.pdf') && (
        <>
          <hr />
          <p
            className="hover:bg-slate-200 hover:cursor-pointer hover:font-medium transition-all ease-in-out duration-100 px-2 py-1 rounded-md"
            onClick={() => hdlViewFile(clickedContent)}><FontAwesomeIcon className="text-sm px-2" icon={faEye} /> ดูไฟล์</p>
        </>
      )}
      <hr />
      <p
        className="hover:bg-slate-200 hover:cursor-pointer hover:font-medium transition-all ease-in-out duration-100 px-2 py-1 rounded-md"
        onClick={() => handleDownload(clickedContent)}><FontAwesomeIcon className="text-sm px-2" icon={faDownload} /> ดาวน์โหลด</p>
      <p
        className="hover:bg-slate-200 hover:cursor-pointer hover:font-medium transition-all ease-in-out duration-100 px-2 py-1 rounded-md"
        onClick={() => { handleMenuItemClick("แก้ไขชื่อ"); setShowRename(true) }}><FontAwesomeIcon className="text-sm px-2" icon={faFilePen} /> แก้ไขชื่อ</p>
        <hr />
      <p
        className="hover:bg-slate-200 hover:cursor-pointer hover:font-medium transition-all ease-in-out duration-100 px-2 py-1 rounded-md"
        onClick={() => deleteFile(clickedContent)}><FontAwesomeIcon className="text-sm px-2" icon={faTrashCan} /> ลบไฟล์</p>
    </div>
  );
}
