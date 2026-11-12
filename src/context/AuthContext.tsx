import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, city: string, defaultAnonymous: boolean) => Promise<{ success: boolean; error?: string }>;
  recoverPassword: (email: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  switchRole: (role: 'admin' | 'user' | 'guest') => void;
  allUsers: User[];
  toggleUserStatus: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'vozes_crateus_current_user_v1';
const USERS_LIST_KEY = 'vozes_crateus_users_db_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_LIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to the regular logged-in citizen user for friendly first impression
    return INITIAL_USERS[1];
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(allUsers));
    } catch {
      // ignore
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'E-mail não encontrado na base de usuários cadastrados.' };
    }

    if (user.status === 'suspended') {
      return { success: false, error: 'Esta conta foi suspensa pela moderação devido a violação dos termos comunitários.' };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    _pass: string,
    city: string,
    defaultAnonymous: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'Já existe uma conta cadastrada com este endereço de e-mail.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'user',
      city: city || 'Crateús (CE)',
      defaultAnonymous: !!defaultAnonymous,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const recoverPassword = async (email: string, _newPass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'E-mail não localizado em nosso registro seguro.' };
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const switchRole = (role: 'admin' | 'user' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
    } else if (role === 'admin') {
      const adminUser = allUsers.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
    } else {
      const regularUser = allUsers.find(u => u.role === 'user') || INITIAL_USERS[1];
      setCurrentUser(regularUser);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          if (currentUser?.id === userId) {
            setCurrentUser({ ...u, status: nextStatus });
          }
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        recoverPassword,
        logout,
        updateProfile,
        switchRole,
        allUsers,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
};
