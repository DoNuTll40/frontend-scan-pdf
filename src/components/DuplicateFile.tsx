import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppHook from "../hooks/AppHook";
import { faCircleExclamation, faFileSignature, faRightLeft, faTags, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useCallback } from "react";
import PdfHook from "../hooks/PdfHook";

export default function DuplicateFile() {
    const { showDuplicate, setShowDuplicate, fileDuplicate, formData, setShowAddNameTag } = AppHook()!;
    const { uploadFile } = PdfHook()!;

    useEffect(() => {
        document.documentElement.style.overflow = showDuplicate ? 'hidden' : 'auto';
    }, [showDuplicate]);

    const hdlCloseDuplicate = useCallback(() => {
        setShowDuplicate(false);
    }, [setShowDuplicate]);

    const hdlAddTagFile = useCallback(() => {
        setShowAddNameTag(true);
        setShowDuplicate(false);
    }, []);

    const hdlRewriteFile = useCallback(() => {
        if(formData) {
            formData?.append("duplicate", "true");
            formData?.append("tagfile", "null");
            formData?.append("copy", "false");
            uploadFile(formData).then(() => {
                console.log("File uploaded successfully");
                setShowDuplicate(false)
            }).catch(error => {
                console.error("Upload failed:", error);
            });
        }
    }, [formData, uploadFile]);

    const hdlAddNameCopy = useCallback(() => {
        if (formData) {
            formData.append("duplicate", "false");
            formData.append("tagfile", "null");
            formData.append("copy", "true");
            uploadFile(formData).then(() => {
                console.log("File-copy uploaded successfully");
                setShowDuplicate(false)
            }).catch(error => {
                console.error("Upload failed:", error);
            });
        }
    }, [formData, uploadFile]);

    return (
        <div className={`fixed inset-0 z-[60] flex justify-center items-center ${showDuplicate ? "animate-fadeInDown opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none animate-fadeOutDown"} transition-all ease-in-out duration-300`}>
            <div className="w-[35rem] relative bg-white min-h-52 p-3 pb-6 rounded-lg shadow-lg">
                <div className="flex justify-between my-2 pr-3">
                    <p className="drop-shadow-md text-lg font-medium flex items-center gap-2 select-none">
                        <FontAwesomeIcon className="text-[#FFC048] text-xl" icon={faCircleExclamation} />การแจ้งเตือน
                    </p>
                    <FontAwesomeIcon className="scale-100 rotate-0 hover:cursor-pointer hover:scale-110 hover:rotate-90 transition-all ease-in-out duration-150" onClick={hdlCloseDuplicate} icon={faXmark} />
                </div>
                <hr />
                <p className="text-center text-lg mt-2 mb-1 font-medium">ตรวจพบไฟล์ซ้ำในระบบ</p>
                <div>
                    <div className="max-h-64 overflow-y-auto">
                        {fileDuplicate?.map((el, index) => (
                            <div className="flex flex-col mb-4 px-4 pt-1 max-h-32" key={index + 1}>
                                <div className="flex gap-2">
                                    <p className="font-bold">{index + 1}</p>
                                    <p>ชื่อไฟล์ : {el.fileName}</p>
                                </div>
                                <div>
                                    <p className="text-sm pl-3">ตำแหน่งไฟล์ : {el.folder}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="flex justify-around mb-4 my-4">
                        <button className="bg-slate-200 text-black/80 px-7 py-1.5 rounded-md w-40 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 hover:text-black hover:font-semibold transition-all ease-in-out duration-150" title="เป็นการเพิ่มคำต่อท้ายชื่อไฟล์แบบกำหนดเอง" onClick={hdlAddTagFile}>
                            <FontAwesomeIcon icon={faTags} /> เพิ่มแท็ก
                        </button>
                        <button className="bg-slate-200 text-black/80 px-7 py-1.5 rounded-md w-40 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 hover:text-black hover:font-semibold transition-all ease-in-out duration-150" title="เป็นการเขียนทับไฟล์เดิม" onClick={hdlRewriteFile}>
                            <FontAwesomeIcon icon={faRightLeft} /> เขียนทับ
                        </button>
                        <button className="bg-slate-200 text-black/80 px-7 py-1.5 rounded-md w-40 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 hover:text-black hover:font-semibold transition-all ease-in-out duration-150" title="เป็นการเพิ่มคำว่า '-copy' ท้ายชื่อไฟล์" onClick={hdlAddNameCopy}>
                            <FontAwesomeIcon icon={faFileSignature} /> ไฟล์copy
                        </button>
                    </div>
                    <div className="flex justify-center items-center px-2">
                        <button className="bg-[#E5252A] hover:bg-[#a0181d] w-full px-8 py-1.5 rounded-md text-white/90 hover:text-white/100 transition-all ease-in-out duration-100" onClick={hdlCloseDuplicate}>
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
