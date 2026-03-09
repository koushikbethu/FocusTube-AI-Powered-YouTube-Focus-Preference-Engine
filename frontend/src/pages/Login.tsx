import { Focus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export default function Login() {
    const { login } = useAuth()

    return (
        <div className="login-page">
            {/* Background */}
            <div className="login-bg">
                <div className="bg-gradient-1" />
                <div className="bg-gradient-2" />
                <div className="bg-grid" />
            </div>

            {/* Content */}
            <div className="login-content">
                <div className="login-card glass-card">
                    {/* Logo */}
                    <div className="login-logo">
                        <Focus size={48} />
                        <h1>FocusTube</h1>
                    </div>

                    <p className="login-tagline">
                        AI-Powered YouTube Focus Engine
                    </p>

                    <p className="login-description">
                        Take control of your YouTube consumption.
                        Block distractions, eliminate clickbait, and stay focused on what matters.
                    </p>

                    {/* Features */}
                    <ul className="login-features">
                        <li>
                            <span className="feature-icon">🎯</span>
                            <span>Focus modes for Study, Deep Work, Music & more</span>
                        </li>
                        <li>
                            <span className="feature-icon">🤖</span>
                            <span>AI-powered content classification</span>
                        </li>
                        <li>
                            <span className="feature-icon">🚫</span>
                            <span>Block Shorts, clickbait, and distractions</span>
                        </li>
                        <li>
                            <span className="feature-icon">📊</span>
                            <span>Analytics to track your progress</span>
                        </li>
                    </ul>

                    {/* Login Button */}
                    <button className="btn btn-primary btn-lg login-btn" onClick={login}>
                        <svg viewBox="0 0 24 24" width="20" height="20" className="google-icon">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>



                    <p className="login-disclaimer">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                        We only access your YouTube data for filtering purposes.
                    </p>
                </div>
            </div>
        </div>
    )
}
