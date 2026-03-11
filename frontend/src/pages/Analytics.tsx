import { useState, useEffect, useCallback } from 'react'
import { Clock, Video, SkipForward, CheckCircle, TrendingUp, BarChart2, AlertCircle } from 'lucide-react'
import api from '../services/api'
import { AnalyticsSummary, DailyStats } from '../types'
import './Analytics.css'

export default function Analytics() {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
    const [daily, setDaily] = useState<DailyStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(7)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [summaryRes, dailyRes] = await Promise.all([
                api.get(`/analytics/summary?days=${days}`),
                api.get('/analytics/daily')
            ])
            setSummary(summaryRes.data)
            setDaily(dailyRes.data)
        } catch (err) {
            console.error('Failed to fetch analytics:', err)
        } finally {
            setLoading(false)
        }
    }, [days])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading) {
        return (
            <div className="analytics-page">
                <header className="page-header">
                    <h1>Analytics</h1>
                </header>
                <div className="loading-state">
                    <div className="spinner" />
                    <span>Loading analytics...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="analytics-page">
            <header className="page-header">
                <h1>Analytics</h1>
                <div className="period-selector">
                    {[7, 14, 30].map(d => (
                        <button
                            key={d}
                            className={`btn ${days === d ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                            onClick={() => setDays(d)}
                        >
                            {d} days
                        </button>
                    ))}
                </div>
            </header>

            {/* Today's Summary */}
            {daily && (
                <section className="today-section glass-card">
                    <h2>Today</h2>
                    <div className="today-stats">
                        <div className="today-stat">
                            <Clock size={24} />
                            <div>
                                <span className="stat-value">{daily.watch_time_minutes}</span>
                                <span className="stat-label">minutes watched</span>
                            </div>
                        </div>
                        <div className="today-stat">
                            <Video size={24} />
                            <div>
                                <span className="stat-value">{daily.videos_watched}</span>
                                <span className="stat-label">videos</span>
                            </div>
                        </div>
                        {daily.time_limit_minutes && (
                            <div className="today-stat limit">
                                <TrendingUp size={24} />
                                <div>
                                    <span className="stat-value">{daily.time_remaining_minutes}</span>
                                    <span className="stat-label">minutes remaining</span>
                                </div>
                                <div className="limit-bar">
                                    <div
                                        className="limit-fill"
                                        style={{
                                            width: `${Math.min(100, (daily.watch_time_minutes / daily.time_limit_minutes) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Stats Cards */}
            {summary && (
                <div className="stats-grid">
                    <div className="stat-card glass-card">
                        <div className="stat-icon blue">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{summary.total_watch_time_minutes}</span>
                            <span className="stat-label">Total Minutes</span>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon purple">
                            <Video size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{summary.videos_watched}</span>
                            <span className="stat-label">Videos Watched</span>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon orange">
                            <SkipForward size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{summary.videos_skipped}</span>
                            <span className="stat-label">Videos Skipped</span>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon green">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{summary.videos_completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Watch Percentage */}
            {summary && (
                <section className="percentage-section glass-card">
                    <h3>Average Watch Completion</h3>
                    <div className="percentage-bar-container">
                        <div className="percentage-bar">
                            <div
                                className="percentage-fill"
                                style={{ width: `${summary.average_watch_percentage}%` }}
                            />
                        </div>
                        <span className="percentage-value">{Math.round(summary.average_watch_percentage)}%</span>
                    </div>
                    <p className="percentage-hint">
                        Higher completion rates indicate better content matching for your focus modes.
                    </p>
                </section>
            )}

            {/* Daily Usage Chart */}
            {summary && summary.daily_usage.length > 0 && (
                <section className="chart-section glass-card">
                    <div className="chart-header">
                        <BarChart2 size={20} />
                        <h3>Daily Watch Time</h3>
                    </div>
                    <div className="daily-chart">
                        {summary.daily_usage.map((day, index) => {
                            const maxMinutes = Math.max(...summary.daily_usage.map(d => d.minutes), 1);
                            const heightPercent = (day.minutes / maxMinutes) * 100;
                            return (
                                <div key={index} className="chart-bar-container">
                                    <div className="chart-bar-wrapper">
                                        <div
                                            className="chart-bar"
                                            style={{ height: `${heightPercent}%` }}
                                            title={`${day.minutes} minutes`}
                                        />
                                    </div>
                                    <span className="chart-label">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="chart-value">{day.minutes}m</span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {summary && summary.videos_watched === 0 && (
                <section className="empty-state glass-card">
                    <AlertCircle size={48} />
                    <h3>No Watch History Yet</h3>
                    <p>Start watching videos to see your analytics here. Your viewing habits will be tracked to help you stay focused.</p>
                </section>
            )}

            {/* Tips */}
            <section className="tips-section glass-card">
                <h3>Focus Tips</h3>
                <ul className="tips-list">
                    <li>🎯 Set specific goals before each session</li>
                    <li>⏰ Use time limits to avoid endless scrolling</li>
                    <li>🔒 Lock your focus mode during deep work</li>
                    <li>📊 Review your analytics weekly to identify patterns</li>
                </ul>
            </section>
        </div>
    )
}
