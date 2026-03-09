import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import { useFocusModes } from '../hooks/useFocusModes'
import { FocusMode } from '../types'
import api from '../services/api'
import './Settings.css'

// All YouTube video categories
const CATEGORIES = [
    'EDUCATION',
    'SCIENCE_TECH',
    'HOWTO_STYLE',
    'MUSIC',
    'GAMING',
    'ENTERTAINMENT',
    'COMEDY',
    'NEWS_POLITICS',
    'SPORTS',
    'PEOPLE_BLOGS',
    'FILM_ANIMATION',
    'TRAVEL_EVENTS',
    'AUTOS_VEHICLES',
    'PETS_ANIMALS',
    'NONPROFITS'
]

export default function Settings() {
    const { modes, refetch, resetModes } = useFocusModes()
    const [selectedMode, setSelectedMode] = useState<FocusMode | null>(null)
    const [editData, setEditData] = useState<Partial<FocusMode>>({})
    const [saving, setSaving] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (modes.length > 0 && !selectedMode) {
            setSelectedMode(modes[0])
            setEditData(modes[0])
        }
    }, [modes])

    const handleModeSelect = (mode: FocusMode) => {
        setSelectedMode(mode)
        setEditData(mode)
        setMessage(null)
    }

    const handleSave = async () => {
        if (!selectedMode) return

        setSaving(true)
        setMessage(null)

        try {
            await api.put(`/modes/${selectedMode.id}`, {
                name: editData.name,
                description: editData.description,
                allowed_categories: editData.allowed_categories,
                blocked_categories: editData.blocked_categories,
                min_duration_seconds: editData.min_duration_seconds,
                max_clickbait_score: editData.max_clickbait_score,
                max_entertainment_score: editData.max_entertainment_score,
                block_shorts: editData.block_shorts,
                block_trending: editData.block_trending,
                daily_time_limit_minutes: editData.daily_time_limit_minutes,
                blocked_keywords: editData.blocked_keywords,
            })

            setMessage({ type: 'success', text: 'Mode saved successfully!' })
            await refetch()
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save' })
        } finally {
            setSaving(false)
        }
    }

    const toggleCategory = (category: string, type: 'allowed' | 'blocked') => {
        const key = type === 'allowed' ? 'allowed_categories' : 'blocked_categories'
        const current = editData[key] || []

        if (current.includes(category)) {
            setEditData({ ...editData, [key]: current.filter(c => c !== category) })
        } else {
            setEditData({ ...editData, [key]: [...current, category] })
        }
    }

    const addKeyword = () => {
        const keyword = prompt('Enter keyword to block:')
        if (keyword && keyword.trim()) {
            const current = editData.blocked_keywords || []
            setEditData({ ...editData, blocked_keywords: [...current, keyword.trim()] })
        }
    }

    const removeKeyword = (keyword: string) => {
        const current = editData.blocked_keywords || []
        setEditData({ ...editData, blocked_keywords: current.filter(k => k !== keyword) })
    }

    const handleReset = async () => {
        if (!confirm('Reset all modes to defaults? This will delete all your customizations and add new YouTube category modes.')) {
            return
        }

        setResetting(true)
        setMessage(null)

        try {
            await resetModes()
            setMessage({ type: 'success', text: 'Modes reset successfully! New modes available.' })
            setSelectedMode(null)
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to reset modes' })
        } finally {
            setResetting(false)
        }
    }

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>Settings</h1>
                <p className="header-subtitle">Configure your focus modes and preferences</p>
            </header>

            <div className="settings-layout">
                {/* Mode List */}
                <aside className="mode-list glass-card">
                    <div className="mode-list-header">
                        <h3>Focus Modes</h3>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleReset}
                            disabled={resetting}
                            title="Reset to default modes with all YouTube categories"
                        >
                            <RefreshCw size={14} className={resetting ? 'spin' : ''} />
                            {resetting ? 'Resetting...' : 'Reset'}
                        </button>
                    </div>
                    {modes.map(mode => (
                        <button
                            key={mode.id}
                            className={`mode-item ${selectedMode?.id === mode.id ? 'selected' : ''}`}
                            onClick={() => handleModeSelect(mode)}
                        >
                            <span className="mode-item-name">{mode.name}</span>
                            {mode.is_active && <span className="active-dot" />}
                        </button>
                    ))}
                </aside>

                {/* Mode Editor */}
                {selectedMode && (
                    <div className="mode-editor glass-card">
                        {/* Name & Description */}
                        <section className="editor-section">
                            <h3>Basic Info</h3>
                            <div className="form-group">
                                <label className="label">Mode Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editData.name || ''}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Description</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editData.description || ''}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                />
                            </div>
                        </section>

                        {/* Categories */}
                        <section className="editor-section">
                            <h3>Allowed Categories</h3>
                            <p className="section-hint">Only videos in these categories will be shown</p>
                            <div className="category-grid">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        className={`category-btn ${editData.allowed_categories?.includes(cat) ? 'selected' : ''}`}
                                        onClick={() => toggleCategory(cat, 'allowed')}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="editor-section">
                            <h3>Blocked Categories</h3>
                            <p className="section-hint">Videos in these categories will be hidden</p>
                            <div className="category-grid">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        className={`category-btn blocked ${editData.blocked_categories?.includes(cat) ? 'selected' : ''}`}
                                        onClick={() => toggleCategory(cat, 'blocked')}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Filters */}
                        <section className="editor-section">
                            <h3>Content Filters</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Min Duration (minutes)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="0"
                                        value={(editData.min_duration_seconds || 0) / 60}
                                        onChange={e => setEditData({ ...editData, min_duration_seconds: Number(e.target.value) * 60 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label">Daily Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min="0"
                                        value={editData.daily_time_limit_minutes || ''}
                                        onChange={e => setEditData({ ...editData, daily_time_limit_minutes: e.target.value ? Number(e.target.value) : null })}
                                        placeholder="No limit"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Max Clickbait Score (%)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(editData.max_clickbait_score || 1) * 100}
                                        onChange={e => setEditData({ ...editData, max_clickbait_score: Number(e.target.value) / 100 })}
                                    />
                                    <span className="range-value">{Math.round((editData.max_clickbait_score || 1) * 100)}%</span>
                                </div>
                                <div className="form-group">
                                    <label className="label">Max Entertainment Score (%)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(editData.max_entertainment_score || 1) * 100}
                                        onChange={e => setEditData({ ...editData, max_entertainment_score: Number(e.target.value) / 100 })}
                                    />
                                    <span className="range-value">{Math.round((editData.max_entertainment_score || 1) * 100)}%</span>
                                </div>
                            </div>

                            <div className="form-row toggles">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={editData.block_shorts || false}
                                        onChange={e => setEditData({ ...editData, block_shorts: e.target.checked })}
                                    />
                                    <span>Block Shorts</span>
                                </label>
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={editData.block_trending || false}
                                        onChange={e => setEditData({ ...editData, block_trending: e.target.checked })}
                                    />
                                    <span>Block Trending</span>
                                </label>
                            </div>
                        </section>

                        {/* Keywords */}
                        <section className="editor-section">
                            <h3>Blocked Keywords</h3>
                            <div className="keywords-list">
                                {(editData.blocked_keywords || []).map(kw => (
                                    <span key={kw} className="keyword-tag">
                                        {kw}
                                        <button onClick={() => removeKeyword(kw)}>
                                            <Trash2 size={12} />
                                        </button>
                                    </span>
                                ))}
                                <button className="btn btn-ghost btn-sm" onClick={addKeyword}>
                                    <Plus size={14} />
                                    Add Keyword
                                </button>
                            </div>
                        </section>

                        {/* Save */}
                        <div className="editor-actions">
                            {message && (
                                <div className={`message ${message.type}`}>{message.text}</div>
                            )}
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                <Save size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
