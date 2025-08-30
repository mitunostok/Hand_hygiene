import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuditSession } from '../types';
import { getAuditSessions, saveAuditSessions } from '../services/storageService';

interface AuditFormContextType {
  sessions: AuditSession[];
  addSession: (session: AuditSession) => void;
  clearSessionsForUser: (email: string) => void;
}

const AuditFormContext = createContext<AuditFormContextType | undefined>(undefined);

export const AuditFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<AuditSession[]>(getAuditSessions());

  const addSession = (session: AuditSession) => {
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    saveAuditSessions(updatedSessions);
  };
  
  const clearSessionsForUser = (email: string) => {
    const remainingSessions = sessions.filter(s => s.observerEmail !== email);
    setSessions(remainingSessions);
    saveAuditSessions(remainingSessions);
  };

  return (
    <AuditFormContext.Provider value={{ sessions, addSession, clearSessionsForUser }}>
      {children}
    </AuditFormContext.Provider>
  );
};

export const useAuditForm = (): AuditFormContextType => {
  const context = useContext(AuditFormContext);
  if (!context) {
    throw new Error('useAuditForm must be used within an AuditFormProvider');
  }
  return context;
};
