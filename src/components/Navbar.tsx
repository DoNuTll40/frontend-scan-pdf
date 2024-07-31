
function Navbar() {
  return (
    <div className="overflow-hidden whitespace-nowrap" style={{ width: '100%' }}>
      <div className="text-center animate-marquee w-full text-[0.65rem] md:text-base">
        ผู้ใช้งานไม่จำเป็นต้องสร้างโฟล์เดอร์เอง พอเวลาอัพโหลดไฟล์ระบบจะเป็นคนจัดการเองทั้งหมด
      </div>
      <style>
        {/* {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
            white-space: nowrap;
          }
        `} */}
      </style>
    </div>
  )
}

export default Navbar