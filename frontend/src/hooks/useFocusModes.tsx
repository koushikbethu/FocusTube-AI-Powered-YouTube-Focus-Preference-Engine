import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import api from '../services/api'
import { FocusMode } from '../types'

interface FocusModeContextType {
    modes: FocusMode[]
    activeMode: FocusMode | null
    loading: boolean
    error: string | null
    activateMode: (modeId: string) => Promise<void>
    lockMode: (modeId: string, durationMinutes: number) => Promise<void>
    resetModes: () => Promise<void>
    refetch: () => Promise<void>
}

const FocusModeContext = createContext<FocusModeContextType | null>(null)

export function FocusModeProvider({ children }: { children: ReactNode }) {
    const [modes, setModes] = useState<FocusMode[]>([])
    const [activeMode, setActiveMode] = useState<FocusMode | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchModes = useCallback(async () => {
        // Only fetch if user is authenticated (has token)
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const response = await api.get('/modes')
            setModes(response.data)
            const active = response.data.find((m: FocusMode) => m.is_active)
            setActiveMode(active || null)
            setError(null)
        } catch (err: any) {
            // Only set error if not a 401 (user just needs to log in)
            if (err.response?.status !== 401) {
                setError('Failed to fetch focus modes')
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // Check for token before fetching
        const token = localStorage.getItem('token')
        if (token) {
            fetchModes()
        }
    }, [fetchModes])

    const activateMode = async (modeId: string) => {
        try {
            const response = await api.post(`/modes/${modeId}/activate`)
            setActiveMode(response.data)
            setModes(prev => prev.map(m => ({
                ...m,
                is_active: m.id === modeId
            })))
        } catch (err: any) {
            throw new Error(err.response?.data?.detail || 'Failed to activate mode')
        }
    }

    const lockMode = async (modeId: string, durationMinutes: number) => {
        try {
            const response = await api.post(`/modes/${modeId}/lock`, {
                duration_minutes: durationMinutes
            })
            setActiveMode(response.data)
            await fetchModes()
        } catch (err: any) {
            throw new Error(err.response?.data?.detail || 'Failed to lock mode')
        }
    }

    const resetModes = async () => {
        try {
            setLoading(true)
            const response = await api.post('/modes/reset')
            setModes(response.data)
            const active = response.data.find((m: FocusMode) => m.is_active)
            setActiveMode(active || null)
        } catch (err: any) {
            throw new Error(err.response?.data?.detail || 'Failed to reset modes')
        } finally {
            setLoading(false)
        }
    }

    const contextValue: FocusModeContextType = {
        modes,
        activeMode,
        loading,
        error,
        activateMode,
        lockMode,
        resetModes,
        refetch: fetchModes
    }

    return (
        <FocusModeContext.Provider value={contextValue}>
            {children}
        </FocusModeContext.Provider>
    )
}

export function useFocusModes() {
    const context = useContext(FocusModeContext)
    if (!context) {
        throw new Error('useFocusModes must be used within a FocusModeProvider')
    }
    return context
}
