import { faBell, faEye, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWSHook from "../hooks/WSHook";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../configs/axios";

interface Notification {
    message: string;
    timestamp: number;
}

function BellNotification() {
    const { notifications } = useWSHook()!;
    const [latestNotifications, setLatestNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (notifications.length > 0) {
            const latestTimestamp = Math.max(...notifications.map(notification => notification.timestamp));

            if (lastSeenTimestamp !== latestTimestamp) {

                const isNewNotification = latestTimestamp > (latestNotifications[0]?.timestamp);
                console.log(isNewNotification)
                setHasNewNotification(true);
            }
        }
    }, [notifications, latestNotifications, lastSeenTimestamp]);
    
    
useEffect(() => {
    if (isOpen && notifications.length > 0) {
        const sortedNotifications = notifications.sort((a: any, b: any) => b.timestamp - a.timestamp);
        const latest = sortedNotifications.slice(0, 2);
        
        setLastSeenTimestamp(sortedNotifications[0]?.timestamp || null);
        // console.log(sortedNotifications[0]?.timestamp)
        setHasNewNotification(false);
        
        setLatestNotifications(latest);
    }
}, [isOpen, notifications]);


    const handleClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen && notifications.length > 0) {
            const latestTimestamp = Math.max(...notifications.map(notification => notification.timestamp));
            const isNewNotification = latestTimestamp > (latestNotifications[0]?.timestamp || 0);
            setHasNewNotification(isNewNotification);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setHasNewNotification(false);
    };

    const hdlClickViewFile = (fileName: string) => {
        navigate(`/view/file/${encodeURIComponent(fileName)}`);
        handleClose();
    }

    const hdlClickViewFolder = async (fileName: string) => {
        let token = localStorage.getItem('token');
        try {
            const rs = await axios.get(`/api/pdf?search=${decodeURIComponent(fileName)}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (rs.status === 200) {
                const folder = rs.data.files[0].folder;
                const year = folder.split('/')[0];
                const month = folder.split('/')[1];
                handleClose();
                navigate(`/year/${year}/month/${month}`)
            }
        } catch (err) {
            console.log(err);
            toast.error("ไม่สามารถเปิดโฟลเดอร์ได้");
        }
    }

    return (
        <div className="relative">
            <div className="relative hover:bg-slate-300 hover:cursor-pointer px-4 py-3 rounded-full overflow-hidden" onClick={handleClick}>
                {hasNewNotification && (
                    <div className="absolute w-2 h-2 border-2 border-white rounded-full bg-red-600 top-2.5 right-4"></div>
                )}
                <FontAwesomeIcon className="text-xl" icon={faBell} />
            </div>

            {isOpen && (
                <div className={`fixed top-16 right-2.5 sm:right-3 xl:right-10 z-50 flex w-[95%] sm:w-2/3 md:w-1/2 xl:w-4/12 justify-center items-center backdrop-blur-sm bg-gray-200/95 overflow-hidden rounded-xl shadow-md transition-all ease-in-out duration-300 ${isOpen ? " animate-fadeInDown translate-x-0" : "-translate-x-10"}`} onPointerLeave={handleClose}>
                    <div className={`relative bg-gray-200/95 w-full max-h-[550px] px-4 pt-2 rounded-lg shadow-lg`}>
                        <h2 className="text-xl font-bold mb-2 pb-1 border-b border-black/20 ">การแจ้งเตือน</h2>
                        <div className="">
                            {latestNotifications.length > 0 ? (
                                latestNotifications.map((notification, index) => (
                                    <div key={index} className="mb-2 px-2 py-1 flex flex-col hover:bg-slate-500/30 rounded-md  transition-all ease-in-out duration-100" title={notification.message.replace(/\*/g, '')}>
                                        <p className="w-full h-6 text-ellipsis text-nowrap overflow-hidden">{notification.message.replace(/\*/g, '')}</p>
                                        <div className="flex justify-between">
                                            <p className="text-gray-500 text-xs w-full h-6 text-ellipsis text-nowrap overflow-hidden flex items-center">ข้อมูลวันที่ {new Date(notification.timestamp).toLocaleString('th-TH')} น.</p>
                                            <div className="flex gap-1 items-center">
                                                <button className="text-gray-500 text-xs w-full h-6 text-nowrap hover:bg-white/70 px-1 rounded-md hover:shadow-sm transition-all ease-in-out duration-150 hover:font-semibold" onClick={() => hdlClickViewFile(notification.message.split('*')[1])}><FontAwesomeIcon icon={faEye} /> ดูไฟล์</button>
                                                <button className="text-gray-500 text-xs w-full h-6 text-nowrap hover:bg-white/70 px-1 rounded-md hover:shadow-sm transition-all ease-in-out duration-150 hover:font-semibold" onClick={() => hdlClickViewFolder(notification.message.split('*')[1])}><FontAwesomeIcon icon={faFolder} /> เปิดโฟลเดอร์</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="mb-2 px-2 py-1 flex flex-col">
                                    <p className="w-full h-6 text-ellipsis text-nowrap overflow-hidden">ไม่มีการแจ้งเตือน</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BellNotification;
