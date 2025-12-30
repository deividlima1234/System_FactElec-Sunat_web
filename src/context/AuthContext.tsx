import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User, LoginResponse } from '../types/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // 1. Optimistic load from storage to show UI immediately
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                    }

                    // 2. Verify with backend to get fresh data (e.g. role changes)
                    const response = await api.get('/api/v1/users/me');
                    const freshUser = {
                        username: response.data.username,
                        role: response.data.role
                    };

                    // Update state and storage with fresh data
                    setUser(freshUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (error) {
                    console.error("Session verification failed", error);
                    // If backend rejects token (e.g. expired/invalid), logout
                    logout();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    // Auto-logout functionality
    useEffect(() => {
        if (!isAuthenticated) return;

        const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
        let inactivityTimer: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                console.log("Sesión expirada por inactividad");
                logout();
            }, INACTIVITY_LIMIT);
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        // Setup listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated]);

    const login = async (credentials: any) => {
        try {
            const response = await api.post<LoginResponse>('/api/auth/login', credentials);
            const { token, username, role } = response.data;
            const user = { username, role };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
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
