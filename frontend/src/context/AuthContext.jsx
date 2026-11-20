import { useEffect, useMemo, useState } from 'react';
import API from '../services/api';
import { AuthContext } from './authStore';

function saveTokens(data) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore the logged-in user from the saved JWT on page load
    useEffect(() => {
        let active = true;

        async function restoreSession() {
            if (!localStorage.getItem('access_token')) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('auth/me/');
                if (active) setUser(response.data);
            } catch {
                if (active) clearTokens();
            } finally {
                if (active) setLoading(false);
            }
        }

        restoreSession();

        return () => {
            active = false;
        };
    }, []);

    async function login(credentials) {
        const response = await API.post('auth/login/', credentials);

        saveTokens(response.data);

        const currentUser = await API.get('auth/me/');
        setUser(currentUser.data);

        return currentUser.data;
    }

    function logout() {
        clearTokens();
        setUser(null);
    }

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            isAdmin: Boolean(user?.is_staff),
            login,
            logout
        }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
