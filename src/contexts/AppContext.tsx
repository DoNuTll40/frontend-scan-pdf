import axios from "../configs/axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  fullname: string;
  prefix: string;
  fname: string;
  lname: string;
  officeCode: string;
  officeName: string;
  position: string;
}

interface FileDuplicate {
  fileName: string;
  folder: string;
  size: string;
}

interface AppContextValue {
  user: User | null;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setFileDuplicate: React.Dispatch<React.SetStateAction<FileDuplicate[]>>;
  fileDuplicate: FileDuplicate[]
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  setShowRename: React.Dispatch<React.SetStateAction<boolean>>;
  showRename: boolean;
  showDuplicate: boolean;
  setShowDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  showAddNameTag: boolean;
  setShowAddNameTag: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppContextProps {
  children: ReactNode;
}

function AppContextProvider({ children }: AppContextProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRename, setShowRename] = useState<boolean>(false);
  const [showDuplicate, setShowDuplicate] = useState<boolean>(false)
  const [fileDuplicate, setFileDuplicate] = useState<FileDuplicate[]>([])
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showAddNameTag, setShowAddNameTag] = useState<boolean>(false)

  const fetchData = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const rs = await axios.get("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (rs.status === 200) {
        setUser(rs.data[0]);
      }
    } catch (err: any) {
      console.log(err);

      if (err.response?.data?.message === "TokenExpiredError") {
        alert("ผู้ใช้งานของคุณหมดอายุ โปรดเข้าสู่ระบบใหม่");
        localStorage.removeItem("token");
      } else {
        alert("Fetch unsuccess!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.reload();
  };

  const value = { 
    user, logout, setUser, loading, setLoading, showModal, setShowModal, showRename, 
    setShowRename, showDuplicate, setShowDuplicate, fileDuplicate, setFileDuplicate, 
    formData, setFormData, showAddNameTag, setShowAddNameTag
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContextProvider };
export default AppContext;
