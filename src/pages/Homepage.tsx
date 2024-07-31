
import { useNavigate } from "react-router-dom";
import PdfHook from "../hooks/PdfHook";
import axios from "../configs/axios";
// import { saveAs } from 'file-saver'; 
import RigthHook from "../hooks/RightHook";

function Homepage() {

  const { pdfYear, pdfMonth, pdfFile, formatDate } = PdfHook()!;
  const { openContextMenu } = RigthHook()!;
  const navigate = useNavigate();

  const ipAddress = window.location.hostname;

  const hdlFileClick = async (fileName: string) => {

    if(fileName.endsWith('doc') || fileName.endsWith('xlsx')){
      let token = localStorage.getItem('token')
      const rs = await axios.get(`/api/pdf?search=${decodeURIComponent(fileName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        if (rs.status === 200 && rs.data.files.length > 0) {
          const fileData = rs.data.files[0];

          const downloadUrl = `http://${ipAddress}:8080/api/pdf/${encodeURIComponent(fileData.folder)}/${encodeURIComponent(fileName)}`
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.title = fileName

          link.click();

          // try {
          //   const rs1 = await axios.get(`http://${ipAddress}:8080/api/pdf/${encodeURIComponent(fileData.folder)}/${encodeURIComponent(fileName)}`, {
          //     responseType: 'blob',
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //     },
          //   });
          //   console.log(rs1)
        
          //   const blob = new Blob([rs1.data], { type: rs1.headers['content-type'] });
          //   saveAs(blob, fileName);
          //   console.log(blob)
          // }catch(err){
          //   console.log(err)
          // }
        }
      } else {
        navigate(`/view/file/${fileName}`);
      }
  }

  const hdlYearClick = (YearLabel: string) => {
    navigate(`/year/${encodeURI(YearLabel)}`)
  }

  const year = pdfMonth[0]?.folderMain;

  const hdlMonthClick = (monthName: string) => {
    navigate(`/year/${year}/month/${monthName}`)
}

  const twentyFourHours = 24 * 60 * 60 * 1000;

  const handleContextMenu = (event: React.MouseEvent, content: string) => {
    event.preventDefault();
    openContextMenu(event.clientX + window.scrollX, event.clientY + window.scrollY, content);
  };

  return (
    <div className="max-w-[80rem] mx-auto p-4">
      <div>
      <div className="my-2 text-xl font-semibold relative select-none">
        <h1 className="relative z-10 bg-white inline-block px-2">ปี</h1>
        <hr className="absolute top-1/2 transform -translate-y-1/2 w-full border-t border-gray-300 z-0" />
      </div>

      {pdfYear.length === 0 && (
                <div className='w-full flex flex-col gap-2 justify-center items-center'>
                    <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                    <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
                </div>
            )}

        <div className="transition ease-in-out duration-200 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-5">
          {pdfYear?.map((el: any, index: number) => (
            <div 
              key={index + 1}
              className="flex flex-col gap-2 items-center p-4 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md scale-100 active:scale-95 active:bg-slate-200 rounded-xl select-none"
              onClick={ () => hdlYearClick(el.folderYear)}
              >
                <img className="max-w-15 sm:max-w-20 pointer-events-none" src="folder.png" alt="folder" />
              <p className="text-[90%] sm:text-base text-center">{el.folderYear}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="my-2 text-xl font-semibold relative select-none">
          <h1 className="relative z-10 bg-white inline-block px-2">เดือนในปีนี้</h1>
          <hr className="absolute top-1/2 transform -translate-y-1/2 w-full border-t border-gray-300 z-0" />
        </div>

        {pdfMonth.length === 0 && (
                <div className='w-full flex flex-col gap-2 justify-center items-center'>
                    <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                    <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
                </div>
            )}

        <div className=" transition ease-in-out duration-200 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-5">
          {pdfMonth?.map((el: any, index: number) => (
            <div 
              key={index + 1}
              className="flex flex-col gap-2 items-center p-4 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md scale-100 active:scale-95 active:bg-slate-200 rounded-xl select-none"
              onClick={ () => hdlMonthClick(el.folder)}
            >
              <img className="max-w-15 sm:max-w-20 pointer-events-none" src="folder.png" alt="folder" />
              <p className="text-[90%] sm:text-base">{el.folder}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="my-2 text-xl font-semibold relative select-none">
          <h1 className="relative z-10 bg-white inline-block px-2">ไฟล์ล่าสุดที่ถูกอัพโหลด</h1>
          <hr className="absolute top-1/2 transform -translate-y-1/2 w-full border-t border-gray-300 z-0" />
        </div>

        {pdfFile.length === 0 && (
                <div className='w-full flex flex-col gap-2 justify-center items-center'>
                    <p className="text-md font-semibold">กำลังโหลดข้อมูล</p>
                    <span className='border-gray-300 h-10 w-10 animate-spin rounded-full border-[6px] border-t-blue-800'></span>
                </div>
            )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-5 max-w-[80rem] mx-auto">
          {pdfFile?.map((el: any, index: number) => (
            <div 
              key={index + 1}
              title={`ชื่อไฟล์: ${el.fileName}\nขนาด: ${el.size}\nวันที่อัพโหลด: ${formatDate(el.created)}\nอัพเดทล่าสุด: ${formatDate(el.modified)}`}
              className=" relative flex flex-col gap-3 items-center p-2 py-4 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md scale-100 active:scale-95 active:bg-slate-200 rounded-xl select-none"
              onClick={ () => hdlFileClick(el.fileName)}
              onContextMenu={ (e) => handleContextMenu(e, el.fileName)}
            >
              <p className={`absolute -top-1 -right-2 text-white bg-red-700 rounded-lg px-1.5 py-0.5 text-xs ${el.created >= new Date().getTime() - twentyFourHours ? "block" : "hidden"}`}>{el.created >= new Date().getTime() - twentyFourHours ? "new" : "old"}</p>
              {el.fileName.endsWith("xlsx") ? <img className="w-14 h-14 pointer-events-none" src="/xls.png" alt="folder" /> : el.fileName.endsWith("doc") ? <img className="w-14 h-14 pointer-events-none" src="/doc.png" alt="folder" /> : <img className="w-14 h-14 pointer-events-none" src="/pdf.png" alt="folder" />}
              <p className="text-sm w-11/12 h-10 text-ellipsis overflow-hidden text-center">{el.fileName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
