import { useEffect, useState } from 'react'
import api from '../../api/index'
import Reveal from '../../components/Reveal/Reveal'
import styles from './AboutPage.module.css'

export default function AboutPage() {
    const [page,    setPage]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/pages/about')
            .then(r => setPage(r.data.page))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>
    if (!page)   return null

    const texts  = page.blocks.filter(b => b.type === 'text')
    const stats  = page.blocks.filter(b => b.type === 'stat')
    const quotes = page.blocks.filter(b => b.type === 'quote')

    return (
        <div className={styles.page}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Reveal>
                        <p className={styles.eyebrow}>Наша история</p>
                        <h1 className={styles.title}>{page.title}</h1>
                        <p className={styles.subtitle}>{page.subtitle}</p>
                    </Reveal>
                </div>
                <div className={styles.heroDivider} />
            </section>

            {/* Тексты */}
            <section className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.textGrid}>
                        {texts.map((b, i) => (
                            <Reveal key={i} delay={i * 100} direction="up">
                                <p className={styles.textBlock}>{b.content}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Цитата */}
            {quotes[0] && (
                <section className={styles.quoteSection}>
                    <div className={styles.container}>
                        <Reveal direction="scale">
                            <blockquote className={styles.quote}>
                                <span className={styles.quoteIcon}>❝</span>
                                {quotes[0].content}
                            </blockquote>
                        </Reveal>
                    </div>
                </section>
            )}

            {/* Статистика */}
            {stats.length > 0 && (
                <section className={styles.statsSection}>
                    <div className={styles.container}>
                        <div className={styles.statsGrid}>
                            {stats.map((s, i) => (
                                <Reveal key={i} delay={i * 120} direction="up">
                                    <div className={styles.stat}>
                                        <span className={styles.statNum}>{s.content}</span>
                                        <span className={styles.statLabel}>{s.label}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}