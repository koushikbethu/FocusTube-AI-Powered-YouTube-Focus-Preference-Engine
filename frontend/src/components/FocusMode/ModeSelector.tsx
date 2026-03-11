import { useState } from 'react'
import { ChevronDown, Lock } from 'lucide-react'
import { useFocusModes } from '../../hooks/useFocusModes'
import './ModeSelector.css'

export default function ModeSelector() {
    const { modes, activeMode, loading, activateMode, lockMode } = useFocusModes()
    const [isOpen, setIsOpen] = useState(false)
    const [lockDuration, setLockDuration] = useState(30)
    const [showLockModal, setShowLockModal] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleActivate = async (modeId: string) => {
        try {
            setError(null)
            await activateMode(modeId)
            setIsOpen(false)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleLock = async () => {
        if (!activeMode) return
        try {
            setError(null)
            await lockMode(activeMode.id, lockDuration)
            setShowLockModal(false)
        } catch (err: any) {
            setError(err.message)
        }
    }

    if (loading) {
        return (
            <div className="mode-selector-skeleton">
                <div className="skeleton-line" />
            </div>
        )
    }

    return (
        <div className="mode-selector">
            {/* Current Mode Button */}
            <button
                className={`mode-current ${activeMode?.is_locked ? 'locked' : ''}`}
                onClick={() => !activeMode?.is_locked && setIsOpen(!isOpen)}
                disabled={activeMode?.is_locked}
            >
                <div className="mode-info">
                    <span className="mode-label">Focus Mode</span>
                    <span className="mode-name">{activeMode?.name || 'Select Mode'}</span>
                </div>
                {activeMode?.is_locked ? (
                    <Lock size={18} className="mode-icon locked" />
                ) : (
                    <ChevronDown size={18} className={`mode-icon ${isOpen ? 'open' : ''}`} />
                )}
            </button>

            {/* Lock Button */}
            {activeMode && !activeMode.is_locked && (
                <button
                    className="btn btn-ghost btn-sm lock-btn"
                    onClick={() => setShowLockModal(true)}
                    title="Lock this focus session"
                >
                    <Lock size={14} />
                </button>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="mode-dropdown">
                    {modes.map(mode => (
                        <button
                            key={mode.id}
                            className={`mode-option ${mode.is_active ? 'active' : ''}`}
                            onClick={() => handleActivate(mode.id)}
                        >
                            <div className="mode-option-info">
                                <span className="mode-option-name">{mode.name}</span>
                                {mode.description && (
                                    <span className="mode-option-desc">{mode.description}</span>
                                )}
                            </div>
                            {mode.is_active && <span className="active-badge">Active</span>}
                        </button>
                    ))}
                </div>
            )}

            {/* Lock Modal */}
            {showLockModal && (
                <div className="modal-overlay" onClick={() => setShowLockModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Lock Focus Session</h3>
                        <p>You won't be able to change modes for the selected duration.</p>

                        <div className="lock-options">
                            {[15, 30, 60, 120].map(mins => (
                                <button
                                    key={mins}
                                    className={`lock-option ${lockDuration === mins ? 'selected' : ''}`}
                                    onClick={() => setLockDuration(mins)}
                                >
                                    {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                </button>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setShowLockModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleLock}>
                                <Lock size={16} />
                                Lock for {lockDuration}m
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mode-error">{error}</div>
            )}
        </div>
    )
}
