import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

export default function ParticleField() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animId

        const isMobile = window.innerWidth < 768
        const COUNT = isMobile ? 25 : 60

        const resize = () => {
            canvas.width  = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const particles = Array.from({ length: COUNT }, () => ({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            size:    Math.random() * 2 + 0.5,
            speedX:  (Math.random() - 0.5) * 0.3,
            speedY:  (Math.random() - 0.5) * 0.3 - 0.1,
            opacity: Math.random() * 0.6 + 0.1,
            pulse:   Math.random() * Math.PI * 2,
        }))

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                p.pulse += 0.02
                const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
                gradient.addColorStop(0, `rgba(226, 215, 151, ${alpha})`)
                gradient.addColorStop(1, `rgba(226, 215, 151, 0)`)

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(226, 215, 151, ${alpha * 1.5})`
                ctx.fill()

                p.x += p.speedX
                p.y += p.speedY

                if (p.y < -10) p.y = canvas.height + 10
                if (p.y > canvas.height + 10) p.y = -10
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10
            })

            animId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className={styles.canvas} />
}