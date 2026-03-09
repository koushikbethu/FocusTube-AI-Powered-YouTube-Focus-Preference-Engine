import { Clock, Eye, AlertTriangle } from 'lucide-react'
import { FeedItem } from '../../types'
import './VideoCard.css'

interface VideoCardProps {
    video: FeedItem
    onClick?: () => void
}

function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatViews(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
}

function getCategoryBadgeClass(category: string): string {
    return `badge badge-${category.toLowerCase()}`
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
    const isClickbaity = video.clickbait_score > 0.5

    return (
        <article className="video-card" onClick={onClick}>
            {/* Thumbnail */}
            <div className="video-thumbnail">
                {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt="" loading="lazy" />
                ) : (
                    <div className="thumbnail-placeholder" />
                )}

                <span className="video-duration">
                    {formatDuration(video.duration_seconds)}
                </span>

                {video.is_short && (
                    <span className="video-short-badge">SHORT</span>
                )}
            </div>

            {/* Info */}
            <div className="video-info">
                <h3 className="video-title">{video.title}</h3>

                <div className="video-meta">
                    {video.channel_title && (
                        <span className="video-channel">{video.channel_title}</span>
                    )}
                    <span className="video-stats">
                        <Eye size={12} />
                        {formatViews(video.view_count)}
                    </span>
                    {video.published_at && (
                        <span className="video-date">{formatDate(video.published_at)}</span>
                    )}
                </div>

                {/* AI Badges */}
                <div className="video-badges">
                    <span className={getCategoryBadgeClass(video.category)}>
                        {video.category}
                    </span>

                    {isClickbaity && (
                        <span className="badge badge-clickbait" title="High clickbait score">
                            <AlertTriangle size={10} />
                            Clickbait
                        </span>
                    )}

                    {video.entertainment_score > 0.7 && (
                        <span className="entertainment-indicator" title={`Entertainment: ${Math.round(video.entertainment_score * 100)}%`}>
                            🎭 {Math.round(video.entertainment_score * 100)}%
                        </span>
                    )}
                </div>
            </div>
        </article>
    )
}
