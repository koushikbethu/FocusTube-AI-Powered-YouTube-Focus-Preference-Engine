import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { FocusModeProvider } from './hooks/useFocusModes'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'

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
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <FocusModeProvider>
                    <AppRoutes />
                </FocusModeProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

