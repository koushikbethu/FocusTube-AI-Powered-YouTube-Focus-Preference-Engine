import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { FocusModeProvider } from './hooks/useFocusModes'
import Layout from './components/Layout/Layout'
import SplashScreen from './components/SplashScreen/SplashScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh' }}>
                <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--color-accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

function AppRoutes() {
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
        if (hasSeenSplash) {
            setShowSplash(false)
        }
    }, [])

    const handleSplashComplete = () => {
        sessionStorage.setItem('hasSeenSplash', 'true')
        setShowSplash(false)
    }

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout>
                        <Home />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <Layout>
                        <Settings />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <Layout>
                        <Analytics />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Layout>
                        <Profile />
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AuthProvider>
                <FocusModeProvider>
                    <AppRoutes />
                </FocusModeProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

