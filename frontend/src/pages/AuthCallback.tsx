import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function AuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token')
            console.log('AuthCallback - Token from URL:', token)
            console.log('AuthCallback - Full URL:', window.location.href)

            if (token) {
                console.log('AuthCallback - Setting token...')
                localStorage.setItem('token', token)
                console.log('AuthCallback - Token saved to localStorage')
                
                try {
                    const response = await api.get('/auth/me')
                    console.log('AuthCallback - User fetched:', response.data)
                    navigate('/', { replace: true })
                } catch (error) {
                    console.error('AuthCallback - Failed to fetch user:', error)
                    localStorage.removeItem('token')
                    navigate('/login', { replace: true })
                }
            } else {
                console.error('AuthCallback - No token in URL')
                navigate('/login', { replace: true })
            }
        }

        handleAuth()
    }, [])

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
