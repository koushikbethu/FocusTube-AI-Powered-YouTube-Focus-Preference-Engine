import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'
import { FeedItem, FeedResponse } from '../types'

interface UseFeedOptions {
    query?: string
    modeId?: string  // Track active mode to refetch when it changes
}

export function useFeed(options: UseFeedOptions = {}) {
    const [items, setItems] = useState<FeedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [filteredCount, setFilteredCount] = useState(0)
    const [nextPageToken, setNextPageToken] = useState<string | null>(null)

    // Track if we're currently fetching to prevent duplicate calls
    const isFetching = useRef(false)

    // Track previous mode/query to detect changes
    const prevModeId = useRef(options.modeId)
    const prevQuery = useRef(options.query)

    // Fetch feed data
    const fetchFeed = useCallback(async (pageToken: string | null, reset: boolean) => {
        // Prevent duplicate fetches
        if (isFetching.current && !reset) return

        isFetching.current = true

        try {
            setError(null)
            if (reset) {
                setLoading(true)
            }

            const endpoint = options.query ? '/feed/search' : '/feed'
            const params: any = {
                max_results: 20,
            }

            if (pageToken) {
                params.page_token = pageToken
            }

            if (options.query) {
                params.query = options.query
            }

            const response = await api.get<FeedResponse>(endpoint, { params })

            const newItems = response.data.items

            // Filter out duplicates based on video_id
            if (reset) {
                setItems(newItems)
            } else {
                setItems(prev => {
                    const existingIds = new Set(prev.map(item => item.video_id))
                    const uniqueNew = newItems.filter(item => !existingIds.has(item.video_id))
                    return [...prev, ...uniqueNew]
                })
            }

            setNextPageToken(response.data.next_page_token || null)
            setHasMore(!!response.data.next_page_token || newItems.length >= 15)
            setFilteredCount(prev => prev + (response.data.filtered_count || 0))
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load feed')
            setHasMore(false)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }, [options.query])

    // Reset and refetch when mode or query changes
    useEffect(() => {
        const modeChanged = prevModeId.current !== options.modeId
        const queryChanged = prevQuery.current !== options.query

        if (modeChanged || queryChanged) {
            // Update refs
            prevModeId.current = options.modeId
            prevQuery.current = options.query

            // Reset state and fetch
            setItems([])
            setNextPageToken(null)
            setHasMore(true)
            setLoading(true)
            setFilteredCount(0)

            // Small delay to ensure state is reset before fetching
            const timer = setTimeout(() => {
                fetchFeed(null, true)
            }, 50)

            return () => clearTimeout(timer)
        }
    }, [options.modeId, options.query, fetchFeed])

    // Initial fetch
    useEffect(() => {
        fetchFeed(null, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadMore = useCallback(() => {
        if (!loading && hasMore && !isFetching.current) {
            fetchFeed(nextPageToken, false)
        }
    }, [loading, hasMore, nextPageToken, fetchFeed])

    const refetch = useCallback(() => {
        setItems([])
        setNextPageToken(null)
        setHasMore(true)
        setFilteredCount(0)
        fetchFeed(null, true)
    }, [fetchFeed])

    return {
        items,
        loading,
        error,
        hasMore,
        filteredCount,
        loadMore,
        refetch
    }
}
