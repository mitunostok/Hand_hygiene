import { AuditSession, User } from '../types';

const STORAGE_KEY = 'handHygieneAuditSessions';
const USERS_STORAGE_KEY = 'handHygieneUsers';

export const getAuditSessions = (): AuditSession[] => {
  try {
    const sessionsJSON = localStorage.getItem(STORAGE_KEY);
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
  } catch (error) {
    console.error('Error retrieving audit sessions from localStorage', error);
    return [];
  }
};

export const saveAuditSessions = (sessions: AuditSession[]): void => {
  try {
    const sessionsJSON = JSON.stringify(sessions);
    localStorage.setItem(STORAGE_KEY, sessionsJSON);
  } catch (error) {
    console.error('Error saving audit sessions to localStorage', error);
  }
};

export const getUsers = (): User[] => {
  try {
    const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
  } catch (error) {
    console.error('Error retrieving users from localStorage', error);
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    const usersJSON = JSON.stringify(users);
    localStorage.setItem(USERS_STORAGE_KEY, usersJSON);
  } catch (error) {
    console.error('Error saving users to localStorage', error);
  }
};
