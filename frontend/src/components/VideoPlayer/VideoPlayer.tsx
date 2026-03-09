import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ThumbsUp, ThumbsDown, AlertTriangle, ExternalLink } from 'lucide-react'
import api from '../../services/api'
import { VideoDetails } from '../../types'
import './VideoPlayer.css'

interface VideoPlayerProps {
    videoId: string
    onClose: () => void
    modeId?: string
}

export default function VideoPlayer({ videoId, onClose, modeId }: VideoPlayerProps) {
    const [video, setVideo] = useState<VideoDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const startTimeRef = useRef<number>(Date.now())
    const hasTrackedRef = useRef<boolean>(false)
    const videoRef = useRef<VideoDetails | null>(null)

    // Keep videoRef in sync
    useEffect(() => {
        videoRef.current = video
    }, [video])

    useEffect(() => {
        fetchVideoDetails()
        startTimeRef.current = Date.now()
        hasTrackedRef.current = false
    }, [videoId])

    const fetchVideoDetails = async () => {
        try {
            const response = await api.get(`/feed/video/${videoId}`)
            setVideo(response.data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load video')
        } finally {
            setLoading(false)
        }
    }

    const trackWatchTime = useCallback(async (completed: boolean = false) => {
        const currentVideo = videoRef.current
        if (hasTrackedRef.current) {
            console.log('Already tracked, skipping')
            return
        }
        if (!currentVideo) {
            console.log('No video data, skipping tracking')
            return
        }

        hasTrackedRef.current = true

        const watchDurationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
        const videoDurationSeconds = currentVideo.duration_seconds || 0

        console.log('Tracking watch time:', {
            videoId,
            watchDurationSeconds,
            videoDurationSeconds,
            modeId
        })

        // Only track if watched for at least 3 seconds (reduced from 5)
        if (watchDurationSeconds < 3) {
            console.log('Watch time too short, skipping')
            return
        }

        try {
            const payload = {
                video_id: videoId,
                watch_duration_seconds: Math.min(watchDurationSeconds, videoDurationSeconds || watchDurationSeconds),
                video_duration_seconds: videoDurationSeconds,
                was_skipped: watchDurationSeconds < 30 && videoDurationSeconds > 60,
                skip_position_percent: videoDurationSeconds > 0
                    ? Math.min(100, (watchDurationSeconds / videoDurationSeconds) * 100)
                    : null,
                completed: completed || (videoDurationSeconds > 0 && watchDurationSeconds >= videoDurationSeconds * 0.9),
                mode_id: modeId || null
            }
            console.log('Sending watch event:', payload)
            const response = await api.post('/analytics/watch', payload)
            console.log('Watch event tracked successfully:', response.data)
        } catch (err: any) {
            console.error('Failed to track watch time:', err.response?.data || err.message)
        }
    }, [videoId, modeId])

    const handleFeedback = async (type: 'like' | 'dislike' | 'not_interested') => {
        try {
            await api.post('/analytics/feedback', {
                video_id: videoId,
                feedback_type: type
            })
        } catch (err) {
            console.error('Failed to submit feedback:', err)
        }
    }

    const handleClose = useCallback(async (e?: React.MouseEvent) => {
        // Allow closing from overlay click or button click
        if (e && e.currentTarget !== e.target && (e.target as HTMLElement).closest('.video-player-modal')) {
            return // Clicked inside modal content, don't close
        }

        console.log('Closing video player, tracking watch time...')
        // Track watch time before closing
        await trackWatchTime()
        onClose()
    }, [trackWatchTime, onClose])

    // Track watch time when component unmounts
    useEffect(() => {
        return () => {
            console.log('VideoPlayer unmounting, will track watch time')
            // Use setTimeout to ensure state is still available
            if (!hasTrackedRef.current && videoRef.current) {
                const watchDurationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
                if (watchDurationSeconds >= 3) {
                    api.post('/analytics/watch', {
                        video_id: videoId,
                        watch_duration_seconds: watchDurationSeconds,
                        video_duration_seconds: videoRef.current.duration_seconds || 0,
                        was_skipped: false,
                        completed: false,
                        mode_id: modeId || null
                    }).catch(err => console.error('Failed to track on unmount:', err))
                }
            }
        }
    }, [videoId, modeId])

    return (
        <div className="video-player-overlay" onClick={handleClose}>
            <div className="video-player-modal">
                {/* Header */}
                <div className="player-header">
                    <button className="btn btn-ghost" onClick={() => handleClose()}>
                        <X size={20} />
                    </button>
                </div>

                {loading && (
                    <div className="player-loading">
                        <div className="spinner" />
                        <span>Loading...</span>
                    </div>
                )}

                {error && (
                    <div className="player-error">
                        <AlertTriangle size={24} />
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={fetchVideoDetails}>
                            Try Again
                        </button>
                    </div>
                )}

                {video && !video.is_allowed && (
                    <div className="player-blocked">
                        <AlertTriangle size={48} />
                        <h3>Video Blocked</h3>
                        <p>{video.block_reason}</p>
                        <p className="blocked-hint">This video doesn't match your current focus mode settings.</p>
                    </div>
                )}

                {video && video.is_allowed && (
                    <>
                        {/* YouTube Embed */}
                        <div className="player-embed">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {/* Video Info */}
                        <div className="player-info">
                            <h2 className="player-title">{video.title}</h2>
                            <p className="player-channel">{video.channel_title}</p>

                            {/* AI Classification */}
                            <div className="player-classification">
                                <span className={`badge badge-${video.classification.category.toLowerCase()}`}>
                                    {video.classification.category}
                                </span>
                                <span className="score">
                                    Confidence: {Math.round(video.classification.confidence_score * 100)}%
                                </span>
                                <span className="score">
                                    Entertainment: {Math.round(video.classification.entertainment_score * 100)}%
                                </span>
                                <span className="score">
                                    Depth: {Math.round(video.classification.depth_score * 100)}%
                                </span>
                                {video.classification.clickbait_score > 0.3 && (
                                    <span className="score clickbait">
                                        ⚠️ Clickbait: {Math.round(video.classification.clickbait_score * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="player-actions">
                                <button className="btn btn-ghost" onClick={() => handleFeedback('like')}>
                                    <ThumbsUp size={18} />
                                    Helpful
                                </button>
                                <button className="btn btn-ghost" onClick={() => handleFeedback('dislike')}>
                                    <ThumbsDown size={18} />
                                    Not Useful
                                </button>
                                <button className="btn btn-ghost" onClick={() => handleFeedback('not_interested')}>
                                    <X size={18} />
                                    Not Interested
                                </button>
                                <a
                                    href={`https://youtube.com/watch?v=${videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                >
                                    <ExternalLink size={18} />
                                    Open on YouTube
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

