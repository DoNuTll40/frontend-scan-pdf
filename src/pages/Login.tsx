import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AppHook from "../hooks/AppHook";
import { Bounce, toast } from "react-toastify";
import axios from "../configs/axios";
// import { useNavigate } from "react-router-dom";

function Login() {
  const { setUser } = AppHook()!;
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  // const navigate = useNavigate();

  const hdlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.username || !input.password) {
      toast.error("กรุณากรอกข้อมูลให้ครบ", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const rs = await axios.post("/api/login", input);
      localStorage.setItem("token", rs.data.token);

      const rs1 = await axios.get("/api/me", {
        headers: {
          Authorization: `Bearer ${rs.data.token}`,
        },
      });

      if (rs1.status === 200) {
        setUser(rs1.data[0])
        toast.success("เข้าสู่ระบบสำเร็จ", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          onClose: () => {
          }
        });

      }
    } catch (err: any) {
      toast.error(err.response?.data.message);
      // toast.error(err.message)
      // console.log(err);
    }
  };

  return (
    <div className="bg-cover bg-[url('background.png')]">
      <div className="h-screen w-full bg-black bg-opacity-20 flex flex-col justify-center items-center text-center p-4">
        <div className="bg-[#E6F3FF] border-4 border-white h-[30rem] w-[24rem] rounded-3xl shadow-lg scale-95 sm:scale-100">
          <div className="flex justify-center pt-3 pointer-events-none select-none">
            <img className=" w-[85px]" src="logo-02.png" alt="Logo" />
          </div>
          <div className="flex flex-col items-center my-3 text-lg font-semibold drop-shadow-md">
            <p>เข้าสู่ระบบ</p>
            <p>หน่วยงานพัสดุ</p>
          </div>
          <form onSubmit={hdlSubmit} className="flex flex-col gap-10">
            <div className="px-4 my-2 flex gap-4 flex-col">
              <div className="relative">
                <FontAwesomeIcon
                  className=" absolute top-[1.8vh] left-4"
                  icon={faUser}
                />
                <input
                  className="w-full pl-9 pr-2 rounded-full py-2 text-[17px] shadow-sm border-2 focus:border-transparent"
                  type="text"
                  name="username"
                  placeholder="username"
                  onChange={hdlChange}
                />
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  className=" absolute top-[1.8vh] left-4"
                  icon={faLock}
                />
                <input
                  className="w-full pl-9 pr-2 rounded-full py-2 text-[17px] shadow-sm border-2 focus:border-transparent"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  onChange={hdlChange}
                />
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center select-none cursor-pointer w-fit">
                  <input
                    className="ml-1 text-[#001697] w-5 h-5 mr-2 focus:ring-[#001697] focus:ring-opacity-25 border border-gray-300 rounded-full"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                  <span>แสดงรหัสผ่าน</span>
                </label>
              </div>
            </div>
            <div className="w-full flex items-center justify-center px-4">
              <input
                className="bg-[#32D609] py-2 w-2/4 rounded-full text-white shadow-sm text-[17px] font-semibold hover:bg-[#367e23] transition ease-in-out duration-200 hover:cursor-pointer"
                type="submit"
                value="Login"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
