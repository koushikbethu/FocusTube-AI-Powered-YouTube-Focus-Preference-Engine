import { LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import './Profile.css'

export default function Profile() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    if (!user) return null

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>

            <div className="profile-card">
                {user.avatar_url && (
                    <img src={user.avatar_url} alt="" className="profile-avatar" />
                )}
                <h2>{user.display_name || user.email}</h2>
                <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-actions">
                <button className="btn btn-secondary" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button className="btn btn-danger" onClick={logout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
