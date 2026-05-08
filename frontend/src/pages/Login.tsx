import { useState, useEffect, useRef } from 'react'
import { Focus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const BACKEND = API_URL.replace('/api', '')

async function pingBackend(): Promise<boolean> {
    try {
        console.log('Pinging backend:', `${BACKEND}/health`)
        const res = await fetch(`${BACKEND}/health`, { 
            method: 'GET',
            mode: 'cors',
            signal: AbortSignal.timeout(60000)  // 60 seconds for cold start
        })
        console.log('Health check response:', res.status, res.ok)
        return res.ok
    } catch (err) {
        console.error('Health check failed:', err)
        return false
    }
}

export default function Login() {
    const { login } = useAuth()
    const [status, setStatus] = useState<'waking' | 'ready' | 'error'>('waking')
    const awake = useRef(false)

    useEffect(() => {
        let cancelled = false

        const wake = async () => {
            // Try up to 3 times with 60s timeout each (3 min total)
            for (let i = 0; i < 3; i++) {
                if (cancelled) return
                console.log(`Health check attempt ${i + 1}/3`)
                const ok = await pingBackend()
                if (ok) {
                    awake.current = true
                    if (!cancelled) setStatus('ready')
                    return
                }
                // Wait 5s before retry
                if (i < 2) await new Promise(r => setTimeout(r, 5000))
            }
            if (!cancelled) setStatus('error')
        }

        wake()
        return () => { cancelled = true }
    }, [])

    const handleLogin = async () => {
        if (!awake.current) {
            setStatus('waking')
            console.log('Waiting for backend to wake...')
            // Keep pinging until awake (max 3 attempts)
            for (let i = 0; i < 3; i++) {
                const ok = await pingBackend()
                if (ok) { 
                    awake.current = true
                    setStatus('ready')
                    break 
                }
                if (i < 2) await new Promise(r => setTimeout(r, 5000))
            }
        }
        console.log('Redirecting to login...')
        login()
    }

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="bg-gradient-1" />
                <div className="bg-gradient-2" />
                <div className="bg-grid" />
            </div>

            <div className="login-content">
                <div className="login-card glass-card">
                    <div className="login-logo">
                        <Focus size={48} />
                        <h1>FocusTube</h1>
                    </div>

                    <p className="login-tagline">AI-Powered YouTube Focus Engine</p>

                    <p className="login-description">
                        Take control of your YouTube consumption.
                        Block distractions, eliminate clickbait, and stay focused on what matters.
                    </p>

                    <ul className="login-features">
                        <li><span className="feature-icon">🎯</span><span>Focus modes for Study, Deep Work, Music & more</span></li>
                        <li><span className="feature-icon">🤖</span><span>AI-powered content classification</span></li>
                        <li><span className="feature-icon">🚫</span><span>Block Shorts, clickbait, and distractions</span></li>
                        <li><span className="feature-icon">📊</span><span>Analytics to track your progress</span></li>
                    </ul>

                    {/* Server status */}
                    <div className={`wake-status wake-${status}`}>
                        <span className="wake-dot" />
                        {status === 'waking' && `Starting server (${BACKEND})...`}
                        {status === 'ready' && 'Server ready ✓'}
                        {status === 'error' && 'Server timeout — click to try anyway'}
                    </div>

                    <button
                        className="btn btn-primary btn-lg login-btn"
                        onClick={handleLogin}
                        disabled={status === 'waking'}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" className="google-icon">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {status === 'waking' ? 'Starting server...' : 'Get Started'}
                    </button>

                    <div className="login-search-padding"></div>

                    <p className="login-disclaimer">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                        We only access your YouTube data for filtering purposes.
                    </p>
                </div>
            </div>
        </div>
    )
}
