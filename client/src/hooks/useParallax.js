import { useEffect, useState } from 'react'

export function useParallax(speed = 0.3) {
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        if (window.innerWidth < 768) return

        const handle = () => setOffset(window.scrollY * speed)
        window.addEventListener('scroll', handle, { passive: true })
        return () => window.removeEventListener('scroll', handle)
    }, [speed])

    return offset
}