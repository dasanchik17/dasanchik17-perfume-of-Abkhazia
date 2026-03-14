import { useEffect, useState } from 'react'
import styles from './Preloader.module.css'

export default function Preloader() {
    const [hiding, setHiding] = useState(false)
    const [gone,   setGone]   = useState(false)

    useEffect(() => {
        const t1 = setTimeout(() => setHiding(true), 1800)
        const t2 = setTimeout(() => setGone(true),   2400)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [])

    if (gone) return null

    return (
        <div className={`${styles.preloader} ${hiding ? styles.hiding : ''}`}>
            <div className={styles.inner}>
                <div className={styles.arabicText}>عطر</div>
                <div className={styles.line} />
                <div className={styles.logoText}>
                    AROMA <em>Абхазия</em>
                </div>
            </div>
        </div>
    )
}