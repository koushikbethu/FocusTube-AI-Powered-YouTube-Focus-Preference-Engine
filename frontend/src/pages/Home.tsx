import { useState, useEffect, useRef } from 'react'
import { Search, Filter, RefreshCw } from 'lucide-react'
import { useFeed } from '../hooks/useFeed'
import { useFocusModes } from '../hooks/useFocusModes'
import { useDebounce } from '../hooks/useDebounce'
import VideoCard from '../components/Feed/VideoCard'
import VideoPlayer from '../components/VideoPlayer/VideoPlayer'
import api from '../services/api'
import '../components/Feed/VideoCard.css'
import './Home.css'

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeSearch, setActiveSearch] = useState('')
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

    const searchInputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounce(searchQuery, 300)

    const { activeMode } = useFocusModes()
    const { items, loading, error, hasMore, filteredCount, loadMore, refetch } = useFeed({
        query: activeSearch || undefined,
        modeId: activeMode?.id
    })

    // Fetch suggestions when debounced query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 1) {
                setSuggestions([])
                return
            }

            try {
                const response = await api.get('/suggestions', {
                    params: { query: debouncedQuery }
                })
                setSuggestions(response.data)
            } catch (err) {
                setSuggestions([])
            }
        }

        fetchSuggestions()
    }, [debouncedQuery])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
                searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Infinite scroll
    useEffect(() => {
        if (!loadMoreRef.current || loading || !hasMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [loading, hasMore, loadMore])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setActiveSearch(searchQuery)
        setShowSuggestions(false)
    }

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion)
        setActiveSearch(suggestion)
        setShowSuggestions(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedSuggestionIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedSuggestionIndex])
                } else {
                    handleSearch(e as any)
                }
                break
            case 'Escape':
                setShowSuggestions(false)
                break
        }
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setActiveSearch('')
        setSuggestions([])
    }

    if (!activeMode) {
        return (
            <div className="no-mode-message">
                <h2>No Focus Mode Active</h2>
                <p>Please select a focus mode from the sidebar to start browsing.</p>
            </div>
        )
    }

    return (
        <div className="home-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-info">
                    <h1>Feed</h1>
                    <p className="header-subtitle">
                        Filtered by <strong>{activeMode.name}</strong>
                        {filteredCount > 0 && (
                            <span className="filtered-badge">
                                {filteredCount} videos filtered
                            </span>
                        )}
                    </p>
                </div>

                {/* Search with Autocomplete */}
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="input search-input"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setShowSuggestions(true)
                                setSelectedSuggestionIndex(-1)
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div ref={suggestionsRef} className="suggestions-dropdown">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <Search size={14} className="suggestion-icon" />
                                        <span>{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                    {activeSearch && (
                        <button type="button" className="btn btn-ghost" onClick={handleClearSearch}>
                            Clear
                        </button>
                    )}
                    <button type="button" className="btn btn-ghost" onClick={refetch} title="Refresh feed">
                        <RefreshCw size={18} />
                    </button>
                </form>
            </header>

            {/* Active Filters Summary */}
            <div className="active-filters">
                {activeMode.block_shorts && <span className="filter-tag">No Shorts</span>}
                {activeMode.block_trending && <span className="filter-tag">No Trending</span>}
                {activeMode.min_duration_seconds > 0 && (
                    <span className="filter-tag">Min {activeMode.min_duration_seconds / 60}min</span>
                )}
                {activeMode.max_clickbait_score < 1 && (
                    <span className="filter-tag">Max Clickbait: {Math.round(activeMode.max_clickbait_score * 100)}%</span>
                )}
                {activeMode.allowed_categories.length > 0 && (
                    <span className="filter-tag">Categories: {activeMode.allowed_categories.join(', ')}</span>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={refetch}>Try Again</button>
                </div>
            )}

            {/* Video Grid */}
            <div className="video-grid">
                {items.map((video) => (
                    <VideoCard
                        key={video.video_id}
                        video={video}
                        onClick={() => setSelectedVideoId(video.video_id)}
                    />
                ))}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="loading-indicator">
                    <div className="spinner" />
                    <span>Loading...</span>
                </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="infinite-scroll-trigger" />

            {/* Empty State */}
            {!loading && items.length === 0 && !error && (
                <div className="empty-state">
                    <Filter size={48} className="empty-icon" />
                    <h3>No videos found</h3>
                    <p>
                        {activeSearch
                            ? 'Try a different search term or adjust your focus mode filters.'
                            : 'No videos match your current focus mode filters.'}
                    </p>
                </div>
            )}

            {/* Video Player Modal */}
            {selectedVideoId && (
                <VideoPlayer
                    videoId={selectedVideoId}
                    onClose={() => setSelectedVideoId(null)}
                    modeId={activeMode?.id}
                />
            )}
        </div>
    )
}
