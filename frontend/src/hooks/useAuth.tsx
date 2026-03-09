import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'
import { User } from '../types'

interface AuthContextType {
    user: User | null
    loading: boolean
    login: () => void
    logout: () => void
    setToken: (token: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async (): Promise<boolean> => {
        try {
            const response = await api.get('/auth/me')
            setUser(response.data)
            return true
        } catch (error) {
            localStorage.removeItem('token')
            setUser(null)
            return false
        } finally {
            setLoading(false)
        }
    }

    const login = () => {
        // Redirect to backend API for Google OAuth
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
        window.location.href = `${apiUrl}/auth/google`
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        window.location.href = `${import.meta.env.BASE_URL}login`
    }

    const setToken = async (token: string): Promise<boolean> => {
        localStorage.setItem('token', token)
        return await fetchUser()
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
