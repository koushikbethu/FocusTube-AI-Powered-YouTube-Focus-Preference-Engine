import { useEffect, useState } from 'react'
import { Focus, ArrowRight } from 'lucide-react'
import './SplashScreen.css'

interface SplashScreenProps {
    onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [phase, setPhase] = useState<'logo' | 'cta'>('logo')
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        const logoTimer = setTimeout(() => {
            setPhase('cta')
        }, 2500)

        return () => clearTimeout(logoTimer)
    }, [])

    const handleGetStarted = () => {
        setFadeOut(true)
        setTimeout(onComplete, 500)
    }

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            {phase === 'logo' ? (
                <div className="splash-content">
                    <div className="splash-logo">
                        <Focus className="splash-icon" />
                    </div>
                    <h1 className="splash-title">FocusTube</h1>
                    <div className="splash-tagline">Focus. Filter. Flow.</div>
                </div>
            ) : (
                <div className="splash-cta">
                    <h2 className="cta-title">Let's Get Started</h2>
                    <p className="cta-subtitle">Transform your YouTube experience with AI-powered focus</p>
                    <button className="btn btn-primary cta-button" onClick={handleGetStarted}>
                        <span>Get Started</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}
