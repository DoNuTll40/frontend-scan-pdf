
import { createContext, useState, ReactNode } from "react";

interface RigthMenuContextProps {
    isOpen: boolean;
    menuPosition: { x: number; y: number };
    clickedContent: string;
    openContextMenu: (x: number, y: number, content: string) => void;
    closeContextMenu: () => void;
    setClickedContent: (clickedContent: string) => void
}

const RigthContext = createContext<RigthMenuContextProps | undefined>(undefined);

const RigthMenuProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [clickedContent, setClickedContent] = useState<string>("");

    const openContextMenu = (x: number, y: number, content: string) => {
        setMenuPosition({ x, y });
        setClickedContent(content);
        setIsOpen(true);
    };

    const closeContextMenu = () => {
        setIsOpen(false);
    };

    const value = { isOpen, menuPosition, clickedContent, setClickedContent, openContextMenu, closeContextMenu }

    return (
        <RigthContext.Provider value={value}>
            {children}
        </RigthContext.Provider>
    );
};

export { RigthMenuProvider };
export default RigthContext;
