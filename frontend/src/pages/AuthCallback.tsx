import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
    const [searchParams] = useSearchParams()
    const { setToken } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token')

            if (token) {
                const success = await setToken(token)
                if (success) {
                    navigate('/', { replace: true })
                } else {
                    navigate('/login', { replace: true })
                }
            } else {
                navigate('/login', { replace: true })
            }
        }

        handleAuth()
    }, [searchParams, setToken, navigate])

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
