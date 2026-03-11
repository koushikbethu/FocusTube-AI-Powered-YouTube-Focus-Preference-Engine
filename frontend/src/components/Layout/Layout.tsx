import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Settings, BarChart3, LogOut, Focus, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useFocusModes } from '../../hooks/useFocusModes'
import { useTheme } from '../../contexts/ThemeContext'
import ModeSelector from '../FocusMode/ModeSelector'
import './Layout.css'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth()
    const { activeMode } = useFocusModes()
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()

    const navItems = [
        { path: '/', icon: Home, label: 'Feed' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ]

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <Focus className="logo-icon" />
                        <span className="logo-text">FocusTube</span>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="sidebar-section">
                    <ModeSelector />
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="sidebar-footer">
                    {user && (
                        <div className="user-info">
                            {user.avatar_url && (
                                <img src={user.avatar_url} alt="" className="user-avatar" />
                            )}
                            <div className="user-details">
                                <span className="user-name">{user.display_name || user.email}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </div>
                    )}

                    <button className="btn btn-ghost nav-item" onClick={toggleTheme} title="Toggle Theme">
                        <div className="flex items-center gap-sm">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                    </button>

                    <button className="btn btn-ghost logout-btn" onClick={logout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Active Mode Banner */}
                {activeMode?.is_locked && (
                    <div className="locked-banner">
                        <Focus size={16} />
                        <span>
                            <strong>{activeMode.name}</strong> is locked
                            {activeMode.lock_until && (
                                <> until {new Date(activeMode.lock_until).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</>
                            )}
                        </span>
                    </div>
                )}

                <div className="content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    )
}

