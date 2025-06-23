import React, { createContext, useState, useContext } from "react";

interface Session {
    id: number;
    duration: number;
    timestamp: string; // Local time ISO string with offset
}

interface SessionContextType {
    sessions: Session[];
    addSession: (duration: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
    children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
    children,
}) => {
    const [sessions, setSessions] = useState<Session[]>([]);

    const addSession = (duration: number) => {
        // Save timestamp as local time with offset (e.g., 2025-06-18T20:00:00-04:00)
        const now = new Date();
        const tzOffsetMin = now.getTimezoneOffset();
        const offsetSign = tzOffsetMin > 0 ? "-" : "+";
        const pad = (n: number) => n.toString().padStart(2, "0");
        const absOffset = Math.abs(tzOffsetMin);
        const offset = `${offsetSign}${pad(Math.floor(absOffset / 60))}:${pad(
            absOffset % 60
        )}`;
        const localIso =
            now.getFullYear() +
            "-" +
            pad(now.getMonth() + 1) +
            "-" +
            pad(now.getDate()) +
            "T" +
            pad(now.getHours()) +
            ":" +
            pad(now.getMinutes()) +
            ":" +
            pad(now.getSeconds()) +
            offset;
        setSessions((prevSessions) => [
            ...prevSessions,
            { id: prevSessions.length + 1, duration, timestamp: localIso },
        ]);
    };

    return (
        <SessionContext.Provider value={{ sessions, addSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
