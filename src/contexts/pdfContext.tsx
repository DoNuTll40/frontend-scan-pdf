import axios from "../configs/axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import WSHook from "../hooks/WSHook";

interface pdfFile {
    folder: string;
    folderYear: string;
    folderMomth: string;
    fileName: string;
    size: string;
    created: string;
    modified: string;
}

interface yearFolder {
    forderYear: string;
    created: string;
    modified: string;
}

interface monthFolder {
    folderMain: string;
    folder: string;
    created: string;
    modified: string;
}

interface pdfContextValue {
    pdfYear: yearFolder[];
    pdfMonth: monthFolder[];
    pdfFile: pdfFile[];
    formatDate: (date: string) => string;
    uploadFile: (formData: FormData) => Promise<void>;
    deleteFile: (fileName: string) => Promise<void>;
}

const PdfContext = createContext<pdfContextValue | null>(null);

interface pdfContextProps {
    children: ReactNode;
}

function PdfContextProvider({ children }: pdfContextProps) {
    const [pdfYear, setPdfYear] = useState<yearFolder[]>([]);
    const [pdfMonth, setPdfMonth] = useState<monthFolder[]>([]);
    const [pdfFile, setPdfFile] = useState<pdfFile[]>([]);
    const { notifications } = WSHook()!;
    const token = localStorage.getItem('token');

    const fetchPdfYear = async () => {
        try {
            const rs = await axios.get('/api/pdf/year', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (rs.status === 200) {
                setPdfYear(rs.data.yearFolder);
            }
        } catch (err) {
            toast.error("การโหลดข้อมูลโฟล์เดอร์ปี ไม่สำเร็จ");
            console.log(err);
        }
    };

    const fetchPdfMonth = async () => {
        const date = new Date().toLocaleDateString('th-TH').split('/')[2]

        let resultDate;

        if (date.startsWith('25')) {
            // ปีในช่วง 2500-2599 ให้ส่งแค่ 2 ตัวสุดท้าย
            resultDate = date.slice(-2);
        } else if (date.startsWith('26')) {
            // ปีในช่วง 2600-2699 ให้ส่ง 3 ตัวสุดท้าย
            resultDate = date.slice(-3);
        } else {
            // จัดการกรณีอื่นๆ ถ้ามีความจำเป็น
            resultDate = date;
        }
        
        const month = `สแกนปี${resultDate}`;

        try {
            const rs = await axios.get(`/api/pdf/month/${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (rs.status === 200) {
                setPdfMonth(rs.data.yearInFolder);
            }
        } catch (err: any) {
            toast.error("การโหลดข้อมูลโฟล์เดอร์ปี ไม่สำเร็จ");
            console.log("Error Folder Api :", err.response.data.message);
        }
    };

    const fetchPdfFile = async () => {
        try {
            const rs = await axios.get(`/api/pdf/new`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (rs.status === 200) {
                setPdfFile(rs.data.files);
            }
        } catch (err) {
            toast.error("การโหลดข้อมูลโฟล์เดอร์ปี ไม่สำเร็จ");
            console.log(err);
        }
    };

    const deleteFile = async (fileName: string) => {
        try {
            if(confirm(`คุณต้องการลบไฟล์ ${fileName} หรือ ไม่ ระบบจะไม่สามารถนำไฟล์ที่ลบไปแล้วกลับมาได้`)){
                const searchFile = await axios.get(`/api/pdf?search=${fileName}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const filePath = searchFile.data?.files[0]?.folder + '/' + searchFile.data?.files[0]?.fileName;
    
                const rs = await axios.delete(`/api/pdf/${encodeURIComponent(filePath)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (rs.status === 200) {
                    toast.success(rs.data.message, {
                        theme: 'colored'
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const uploadFile = async (formData: FormData): Promise<void> => {
        try {
            const response = await axios.post('/api/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message, {
                    autoClose: 2500,
                    theme: 'colored'
                });
            }

        } catch (error: any) {
            if (error.response.data.status === "duplicate") {
                toast.error(error.response.data.message, {
                    theme: 'colored',
                    autoClose: 3500
                });
                console.error('Error uploading file:', error.response.data.duplicateFiles);
            }
            throw error;
        }
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
        return new Date(date).toLocaleDateString("th-TH", options);
    };

    useEffect(() => {
        fetchPdfYear();
        fetchPdfMonth();
        fetchPdfFile();
    }, [notifications]);

    const value = { pdfYear, pdfMonth, pdfFile, formatDate, deleteFile, uploadFile };

    return <PdfContext.Provider value={value}>{children}</PdfContext.Provider>;
}

export { PdfContextProvider };
export default PdfContext;