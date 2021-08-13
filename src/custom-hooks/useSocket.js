import { useState, useEffect } from 'react';
import socket from "../config/socket.io";

export const useSocket = method => {
    const [socketToggle, setSocketToggle] = useState(true)

    useEffect(() => {
        socket.on(method, () => setSocketToggle(!socketToggle));

        return () => socket.off();
    }, [method, socketToggle]);

    const socketEmit = method => {
        socket.emit(method);
    };

    return {
        socketToggle,
        socketEmit
    };
};