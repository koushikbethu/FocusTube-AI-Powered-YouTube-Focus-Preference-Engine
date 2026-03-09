// API Types

export interface User {
    id: string
    email: string
    display_name: string | null
    avatar_url: string | null
    created_at: string
}

export interface FocusMode {
    id: string
    name: string
    description: string | null
    is_active: boolean
    is_locked: boolean
    lock_until: string | null
    allowed_categories: string[]
    blocked_categories: string[]
    min_duration_seconds: number
    allowed_languages: string[]
    max_clickbait_score: number
    max_entertainment_score: number
    block_shorts: boolean
    block_trending: boolean
    daily_time_limit_minutes: number | null
    blocked_keywords: string[]
    created_at: string
}

export interface VideoClassification {
    category: string
    confidence_score: number
    entertainment_score: number
    depth_score: number
    clickbait_score: number
}

export interface FeedItem {
    video_id: string
    title: string
    channel_title: string | null
    thumbnail_url: string | null
    duration_seconds: number
    is_short: boolean
    view_count: number
    published_at: string | null
    category: string
    clickbait_score: number
    entertainment_score: number
}

export interface FeedResponse {
    items: FeedItem[]
    next_page_token: string | null
    total_results: number | null
    filtered_count: number
}

export interface VideoDetails {
    video_id: string
    title: string
    description: string | null
    channel_id: string | null
    channel_title: string | null
    thumbnail_url: string | null
    duration_seconds: number
    is_short: boolean
    language: string | null
    view_count: number
    like_count: number
    published_at: string | null
    classification: VideoClassification
    is_allowed: boolean
    block_reason: string | null
}

export interface DailyStats {
    date: string
    watch_time_minutes: number
    videos_watched: number
    time_limit_minutes: number | null
    time_remaining_minutes: number | null
}

export interface AnalyticsSummary {
    total_watch_time_minutes: number
    videos_watched: number
    videos_skipped: number
    videos_completed: number
    average_watch_percentage: number
    top_categories: { category: string; count: number }[]
    daily_usage: { date: string; minutes: number }[]
    focus_mode_usage: { mode: string; minutes: number }[]
}
