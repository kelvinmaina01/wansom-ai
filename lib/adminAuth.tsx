import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AdminAuthContextType {
    admin: Admin | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'lawlify_admin_token';
const ADMIN_DATA_KEY = 'lawlify_admin_data';

export function AdminAuthProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
        const storedAdmin = localStorage.getItem(ADMIN_DATA_KEY);

        if (storedToken && storedAdmin) {
            setToken(storedToken);
            setAdmin(JSON.parse(storedAdmin));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setAdmin(data.admin);
                localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
                localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data.admin));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Admin login error:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_DATA_KEY);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, token, loading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
