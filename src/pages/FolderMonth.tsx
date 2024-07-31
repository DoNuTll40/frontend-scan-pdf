import { useEffect, useState } from "react";
import axios from "../configs/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFolderTree, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WSHook from "../hooks/WSHook";
import { saveAs } from "file-saver";
import RigthHook from "../hooks/RightHook";
import PdfHook from "../hooks/PdfHook";
import { useDropzone } from 'react-dropzone';
import AppHook from "../hooks/AppHook";

interface PdfFile {
    folder: string,
    folderYear: string,
    folderMonth: string,
    fileName: string,
    size: string,
    created: string,
    modified: string
}

function FolderMonth() {
    const [pdfFile, setPdfFile] = useState<PdfFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';
    const { notifications } = WSHook()!;
    const { openContextMenu } = RigthHook()!;
    const { formatDate } = PdfHook()!;
    const {
        setFileDuplicate,
        setShowDuplicate,
        setFormData,
      } = AppHook()!;

    const month = location.pathname.split('/')[4];
    const year = location.pathname.split('/')[2];
    // const ipAddress = window.location.hostname;

    document.title = decodeURIComponent(year) + " | " + decodeURIComponent(month);

    const cutYear = decodeURIComponent(year).split("สแกนปี")[1];

    const fetchPdfFile = async () => {
        try {
            setLoading(true);
            const rs = await axios.get(`/api/pdf?month=${month}&year=${cutYear}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (rs.status === 200) {
                setPdfFile(rs.data.files);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to fetch data', {
                theme: "colored",
                closeOnClick: true,
                autoClose: 1000,
            });
            setPdfFile([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPdfFile();
    }, [month, token, notifications]);

    const hdlFileClick = async (fileName: string) => {
        if (fileName.endsWith('doc') || fileName.endsWith('xlsx')) {
            let token = localStorage.getItem('token');
            const rs = await axios.get(`/api/pdf?search=${decodeURIComponent(fileName)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (rs.status === 200 && rs.data.files.length > 0) {
                const fileData = rs.data.files[0];

                const rs1 = await axios.get(`/api/pdf/${decodeURIComponent(fileData.folder)}/${decodeURIComponent(fileName)}`, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const blob = new Blob([rs1.data], { type: rs1.headers['content-type'] });
                saveAs(blob, fileName);
            }
        } else {
            navigate(`/view/file/${fileName}`);
        }
    };

    const hdlYearClick = () => {
        navigate(`/year/${year}`);
    };

    const dataLoad = {
        title: "กำลังโหลดข้อมูล"
    };

    const handleContextMenu = (event: React.MouseEvent, content: string) => {
        event.preventDefault();
        openContextMenu(event.clientX + window.scrollX, event.clientY + window.scrollY, content);
    };

    let date;
    const checkYear = decodeURIComponent(location.pathname.split('/')[2]).split("สแกนปี")[1]

    const checkDate = decodeURIComponent(location.pathname.split('/')[4])
    if((checkDate.split(checkYear))[0].endsWith('.')){ // กค.67
        date = checkDate
    }else {
        date = decodeURIComponent(location.pathname.split('/')[4]).split(checkYear)[0]
        date = date+"/"+checkYear
    }

    const onDrop =  async (files: File[]) => {
        const formData = new FormData();
        const fileDates: number[] = [];

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i], encodeURIComponent(files[i].name));
            fileDates.push(Number(files[i].lastModified));
        }
        formData.append("lastModified", JSON.stringify(fileDates));
        formData.append("date", date);

        try {
            const rs = await axios.post(`/api/pdf`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                toast.success("อัพโหลดไฟล์เสร็จสมบูรณ์", {
                    theme:'colored'
                })
            }
        } catch(err: any){
            if (err.response.data.status === "duplicate") {
                toast.error(err.response.data.message, {
                  theme: "colored",
                  autoClose: 3500,
                });
                console.error("Error uploading file:",err.response.data.duplicateFiles);
                setFileDuplicate(err.response.data.duplicateFiles);
                setShowDuplicate(true);
                setFormData(formData);
              }
              else{
                  toast.error(err.response.data.message, {
                      theme: 'colored'
                  })
              }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        noClick: true,
        accept: {
            'application/msword': ['.doc'], // Word documents
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], // Word documents (modern)
            'application/vnd.ms-excel': ['.xls'], // Excel spreadsheets
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // Excel spreadsheets (modern)
            'application/pdf': ['.pdf'] // PDF files
        },
    });

    return (
        <div className="max-w-[80rem] pt-5 mx-auto">
            <div className="flex gap-2 px-2 hover:cursor-default">
                <p className="hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={() => navigate('/')}><FontAwesomeIcon icon={faHome} /> Home </p>{">"}
                <p className="hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={hdlYearClick}><FontAwesomeIcon icon={faFolderOpen} /> {decodeURIComponent(location.pathname.split('/')[2])} </p>{">"}
                <p className="hover:cursor-pointer hover:underline hover:underline-offset-4 transition ease-out duration-200" onClick={() => location.reload()}><FontAwesomeIcon icon={faFolderTree} /> {decodeURIComponent(month)} </p>
            </div>
            <div>
                <div className="my-2 text-xl font-semibold relative">
                    <h1 className="relative z-10 bg-white inline-block px-2">ไฟล์ทั้งหมด</h1>
                    <hr className="absolute top-1/2 transform -translate-y-1/2 w-full border-t border-gray-300 z-0" />
                </div>
                {loading && (
                    <div className='w-full flex flex-col gap-2 justify-center items-center'>
                        <p className="text-md font-semibold">{dataLoad.title}</p>
                        <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
                    </div>
                )}

                {/* โครงสร้างในส่วนของตัวลากวาง */}
                <div
                    {...getRootProps()}
                    className={`fixed left-0 w-full h-[35rem] border-2 p-4 rounded-lg ${isDragActive ? 'border-blue-600 shadow-inner drop-shadow-md border-2 bg-blue-400/50 opacity-100' : 'border-gray-200 opacity-0'} transition-all ease-in-out duration-150`}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="flex items-center h-full w-full text-white justify-center text-4xl font-semibold">รองรับแค่ไฟล์ PDF, Word และ Excel</p>
                    ) : (
                        <p className="text-center"></p>
                    )}
                </div>
                

                {!loading && pdfFile?.length === 0 && (
                    <div className="max-w-[80rem] mx-auto select-none">
                        <div className="flex flex-col justify-center items-center">
                            <img className="max-w-[20rem] drop-shadow-lg pointer-events-none" src="/folder_empty.png" alt="empty_folder" />
                            <p className="text-xl font-semibold drop-shadow-lg">ไม่พบข้อมูลในโฟลเดอร์</p>
                            <div className="my-5">
                                <button className="text-md animate-pulse px-6 py-2 bg-slate-100 hover:bg-blue-100 rounded-lg border border-[#3257b3] hover:border-[#2659da] flex items-center gap-1 hover:gap-2 shadow-md transition-all ease-in-out duration-150" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faCaretLeft} />ย้อนกลับ</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5 max-w-[80rem] mx-auto">
                    {!loading && pdfFile?.map((el, index) => (
                        <div
                            key={index + 1}
                            title={`ชื่อไฟล์: ${el.fileName}\nขนาด: ${el.size}\nวันที่อัพโหลด: ${formatDate(el.created)}\nอัพเดทล่าสุด: ${formatDate(el.modified)}`}
                            className="flex flex-col gap-3 items-center p-2 py-4 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md scale-100 active:scale-95 active:bg-slate-200 rounded-xl select-none"
                            onClick={() => hdlFileClick(el.fileName)}
                            onContextMenu={(e) => handleContextMenu(e, el.fileName)}
                        >
                            {el.fileName.endsWith("xlsx") ? <img className="w-14 h-14 pointer-events-none" src="/xls.png" alt="folder" /> : el.fileName.endsWith("doc") ? <img className="w-14 h-14 pointer-events-none" src="/doc.png" alt="folder" /> : <img className="w-14 h-14 pointer-events-none" src="/pdf.png" alt="folder" />}
                            <p className="text-sm w-11/12 h-10 text-ellipsis overflow-hidden text-center">{el.fileName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FolderMonth;
