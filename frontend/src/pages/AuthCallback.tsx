import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setToken } = useAuth()
    const handled = useRef(false)

    useEffect(() => {
        if (handled.current) return
        handled.current = true

        const handleAuth = async () => {
            const token = searchParams.get('token')
            console.log('AuthCallback - Token from URL:', token?.substring(0, 20) + '...')

            if (token) {
                console.log('AuthCallback - Setting token via useAuth...')
                const success = await setToken(token)
                if (success) {
                    console.log('AuthCallback - Success, navigating to home')
                    navigate('/', { replace: true })
                } else {
                    console.error('AuthCallback - Failed to set token')
                    navigate('/login', { replace: true })
                }
            } else {
                console.error('AuthCallback - No token in URL')
                navigate('/login', { replace: true })
            }
        }

        handleAuth()
    }, [searchParams, navigate, setToken])

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{
                    width: 40,
                    height: 40,
                    border: '3px solid var(--color-accent-primary)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    margin: '0 auto var(--spacing-md)'
                }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>Completing sign in...</p>
            </div>
        </div>
    )
}
