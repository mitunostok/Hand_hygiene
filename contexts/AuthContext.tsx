import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { getUsers, saveUsers } from '../services/storageService';

// A mock hashing function for demonstration. 
// In a real app, use a library like bcrypt.
const simpleHash = (s: string) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return String(hash);
};


interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  signup: (userData: Omit<User, 'passwordHash'> & {password: string}) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('handHygieneCurrentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    saveUsers(users);
  }, [users]);
  
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('handHygieneCurrentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('handHygieneCurrentUser');
      }
    } catch (error) {
        console.error("Could not save current user to localStorage", error);
    }
  }, [currentUser]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.passwordHash === simpleHash(password)) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, 'passwordHash'> & {password: string}): boolean => {
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      alert('An account with this email already exists.');
      return false;
    }
    const newUser: User = {
      email: userData.email,
      passwordHash: simpleHash(userData.password),
      name: userData.name,
      facility: userData.facility,
      country: userData.country,
      city: userData.city,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
