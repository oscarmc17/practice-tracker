import React, { createContext, useState, useContext } from 'react';

interface Session {
  id: number;
  duration: number;
  timestamp: string; // Added timestamp
}

interface SessionContextType {
  sessions: Session[];
  addSession: (duration: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = (duration: number) => {
    const timestamp = new Date().toISOString(); // Record the current date and time
    setSessions((prevSessions) => [
      ...prevSessions,
      { id: prevSessions.length + 1, duration, timestamp },
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
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};