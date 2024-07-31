import { useState, useRef, useEffect } from "react";
import axios from "../configs/axios";
import AppHook from "../hooks/AppHook";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

function UploadFile() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const {
    showModal,
    setShowModal,
    setFileDuplicate,
    setShowDuplicate,
    setFormData,
  } = AppHook()!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHover, setIsHover] = useState<boolean>(false);

  const hdlShowModal = () => {
    setShowModal(true);
    document.documentElement.style.overflow = "hidden";
  };

  const hdlCloseModal = () => {
    setShowModal(false);
    document.documentElement.style.overflow = "auto";
    setFiles(null);
    setUploadProgress(0);
    setDate("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hdlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(fileList);
    }
  };

  const handleUpload = async () => {
    setUploadProgress(0);
    if (!files) {
      return toast.error("โปรดเลือกไฟล์ที่ต้องการอัพโหลด", {
        theme: "colored",
        autoClose: 2500,
      });
    }

    if (!date) {
      return toast.error("โปรดเลือกวันที่ต้องการบันทึก", {
        theme: "colored",
        autoClose: 2500,
      });
    }

    const formData = new FormData();
    const fileDates = [];
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], encodeURIComponent(files[i].name));
      fileDates.push(Number(files[i].lastModified));
    }
    formData.append("lastModified", JSON.stringify(fileDates));
    formData.append("date", date);

    try {
      let token = localStorage.getItem("token");
      const response = await axios.post("/api/pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (
            progressEvent.total !== null &&
            progressEvent.total !== undefined
          ) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        hdlCloseModal();
        toast.success(response.data.message, {
          autoClose: 2500,
          theme: "colored",
        });
        setUploadProgress(0);
        setFiles(null);
      }
    } catch (error: any) {
      setUploadProgress(404);
      if (error.response.data.status === "duplicate") {
        toast.error(error.response.data.message, {
          theme: "colored",
          autoClose: 3500,
        });
        console.error("Error uploading file:",error.response.data.duplicateFiles);
        setFileDuplicate(error.response.data.duplicateFiles);
        setShowDuplicate(true);
        hdlCloseModal();
        setFormData(formData);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hdlCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showModal]);

  const hdlPointerEnter = () => {
    setIsHover(true);
  };

  const hdlPointerLeave = () => {
    setTimeout(() => {
      setIsHover(false);
    }, 500);
  };

  if (showModal) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }

  return (
    <>
      <div
        className={`select-none fixed scale-100 right-5 md:right-12 active:scale-95 flex items-center bottom-28 z-40 hover:cursor-pointer shadow-lg backdrop-blur-xl bg-slate-400/30 overflow-hidden ${
          isHover
            ? "w-fit h-12 rounded-full px-4 py-2 bg-slate-400/60 cursor-pointer"
            : "pl-3.5 w-12 h-12 rounded-full"
        } transition-all duration-300 ease-in-out`}
        title="upload pdf"
        onPointerEnter={hdlPointerEnter}
        onPointerLeave={hdlPointerLeave}
        onClick={hdlShowModal}
      >
        <div
          className={`flex ${
            isHover ? "gap-2" : "gap-4"
          } items-center justify-center`}
        >
          <FontAwesomeIcon className="text-xl" icon={faUpload} />
          <p className="font-bold overflow-hidden">อัพโหลดไฟล์ PDF</p>
        </div>
      </div>

      <div
        id="modal-upload"
        className={`fixed inset-0 z-50 flex justify-center items-center ${
          showModal
            ? " backdrop-blur-sm opacity-100"
            : "opacity-0 pointer-events-none"
        } transition-all ease-in-out duration-300`}
      >
        <div
          className={`relative bg-gray-200/95 w-full md:w-3/5 xl:w-2/5 max-h-[550px] p-4 rounded-lg overflow-y-auto shadow-lg transform ${
            showModal ? "scale-100" : "scale-95"
          } transition-transform ease-in-out duration-500`}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 rotate-0 hover:rotate-180 transition-all ease-in-out duration-300"
            onClick={hdlCloseModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4">อัพโหลดไฟล์ PDF</h2>
          <div className="mb-4">
            <p>เลือกไฟล์ที่ต้องการ</p>
            <input
              className="file:border-none file:rounded-md file:p-1.5 file:hover:bg-slate-200 file:hover:cursor-pointer hover:cursor-pointer border-none rounded-lg bg-white w-full p-1"
              type="file"
              accept=".doc, .xlsx, application/pdf"
              multiple
              onChange={hdlFileChange}
              ref={fileInputRef}
              placeholder="เลือกไฟล์"
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="dateInput">วันที่ต้องการจัดเก็บ</label>
            <input
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              type="month"
              id="dateInput"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {files && (
            <div className="pb-4 px-2 border-b border-black/10">
              <p className="font-semibold">
                จำนวน {files.length} ไฟล์ ที่ถูกเลือก
              </p>
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex gap-1 my-2 items-center cursor-default"
                >
                  <p className="w-5 text-center text-ellipsis select-none">
                    {index + 1}
                  </p>
                  <img
                    className="max-w-7 select-none pointer-events-none"
                    src="/pdf.png"
                    alt="photo"
                  />
                  <p className="w-2/5 text-ellipsis overflow-x-hidden text-nowrap cursor-text">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="my-4 w-full">
            <button
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>

          {uploadProgress > 0 && (
            <div className="mb-2">
              <p>
                {uploadProgress !== 404
                  ? `Uploading... ${uploadProgress}%`
                  : "มีข้อผิดพลาด ไม่สามารถอัพโหลดไฟล์ได้"}
              </p>
              <div
                className={`bg-gray-200 ${
                  uploadProgress !== 0 ? "h-2" : ""
                } rounded-full`}
              >
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width: `${uploadProgress !== 404 ? uploadProgress : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UploadFile;
