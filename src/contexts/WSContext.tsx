
import { createContext, ReactNode, useState, Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface Notification {
    message: string;
    timestamp: number;
}

interface WSContextValue {
    setNotifications: Dispatch<SetStateAction<Notification[]>>;
    notifications: Notification[];
}

const WSContext = createContext<WSContextValue | null>(null);

interface WSContextProps {
    children: ReactNode;
}

function WSContextProvider({ children }: WSContextProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect( () => {

        ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);

        ws.current.onopen = () => {
            console.log('Connected to Server');
        };

        ws.current.onmessage = (event) => {
            const { message, timestamp } = JSON.parse(event.data);

            setNotifications(prevNotifications => [
                ...prevNotifications,
                { message, timestamp }
            ]);

        };
        
        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [])


    const value = {notifications, setNotifications};

    return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
}

export { WSContextProvider };
export default WSContext;