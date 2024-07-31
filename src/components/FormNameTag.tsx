
import { faTags, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppHook from "../hooks/AppHook";
import { useEffect, useState } from "react";
import PdfHook from "../hooks/PdfHook";
import { toast } from "react-toastify";

export default function FormNameTag() {

    const { showAddNameTag, setShowAddNameTag, formData, setShowDuplicate } = AppHook()!;
    const [tagFile, setTagFile] = useState("")
    const { uploadFile } = PdfHook()!;

    const hdlClose = () => {
        setShowAddNameTag(false);
        setShowDuplicate(true);
        setTagFile("")
    }

    useEffect(() => {
        document.documentElement.style.overflow = showAddNameTag ? 'hidden' : 'auto';
    }, [showAddNameTag]);

    const hdlAddTag = async () => {
        if(formData){
            formData?.append("duplicate", "false");
            formData?.append("tagfile", tagFile);
            formData?.append("copy", "false");
            if(tagFile === ""){
                toast.warning("กรุณากรอกข้อมูล", {
                    theme: 'colored'
                })
            }else{
                try {
                    const response = await uploadFile(formData);
                    console.log(response)
                    setShowAddNameTag(false);
                    setTagFile("")
                } catch (error) {
                    console.error("Error uploading file:", error);
    
                }
            }
        }
    }


  return (
    <div className={`fixed inset-0 flex z-[60] ${showAddNameTag ? "backdrop-blur-sm opacity-100 animate-fadeInDown" : "opacity-0 pointer-events-none"} justify-center items-center h-screen bg-slate-400/30 transition-all ease-in-out duration-200`}>
    <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] h-[30%] p-7 rounded-lg shadow-xl border flex justify-between flex-col gap-4 overflow-hidden">
        <div className="flex justify-between px-1 select-none">
            <p className="text-lg font-semibold flex items-center gap-2">เพิ่มแท็ก<FontAwesomeIcon icon={faTags} /></p>
            <p className="text-lg font-semibold rotate-0 scale-100 hover:scale-110 hover:rotate-90 hover:cursor-pointer transition-all ease-in-out duration-150"
                onClick={() => hdlClose()}
            ><FontAwesomeIcon icon={faXmark} /></p>
        </div>
        <div className="flex flex-col gap-1">
            <div  className="flex">
                <input className="w-1/6 rounded-l-md border-r-0 disabled:bg-slate-200 disabled:opacity-90 disabled:text-black/70" type="text" value={"-#"} disabled />
                <input className="w-5/6 rounded-r-md" value={tagFile} type="text" onChange={ (e) => setTagFile(e.target.value)} placeholder="ใส่ชื่อแท็กที่ต้องการ" />
            </div>
            {tagFile && (
                <p>ตัวอย่าง File-Name-#{tagFile}.typefile</p>
            )}
        </div>
        <div className="flex justify-end gap-1 mt-1">
            <button className="px-6 py-1.5 rounded-full hover:bg-slate-200 text-[#2659da]" onClick={ () => hdlClose()}>ยกเลิก</button>
            <button className="px-6 py-1.5 rounded-full hover:bg-[#3257b3] bg-[#2659da] text-white border-none" onClick={ () => hdlAddTag() }>ยืนยัน</button>
        </div>
    </div>
</div>
  )
}
