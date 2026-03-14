import { useEffect, useState } from 'react'
import api from '../../api/index'
import Reveal from '../../components/Reveal/Reveal'
import styles from './PerfumeryPage.module.css'

const PYRAMID = [
    { level: 'Верхние ноты',    time: '15–30 мин', desc: 'Первое впечатление. Лёгкие, свежие, быстро улетают.', icon: '◎' },
    { level: 'Сердечные ноты',  time: '2–4 часа',  desc: 'Основа аромата. Раскрываются после верхних нот.',    icon: '❋' },
    { level: 'Базовые ноты',    time: 'до 8 часов', desc: 'Финальный аккорд. Самые глубокие и стойкие.',        icon: '✦' },
]

const CONCENTRATIONS = [
    { name: 'Eau de Cologne',   pct: '2–5%',   desc: 'Лёгкий, свежий, до 2 часов' },
    { name: 'Eau de Toilette',  pct: '5–15%',  desc: 'Популярный формат, 3–5 часов' },
    { name: 'Eau de Parfum',    pct: '15–20%', desc: 'Насыщенный, 5–8 часов' },
    { name: 'Parfum / Extrait', pct: '20–40%', desc: 'Максимальная стойкость, весь день' },
]

export default function PerfumeryPage() {
    const [page,    setPage]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/pages/perfumery')
            .then(r => setPage(r.data.page))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>

    return (
        <div className={styles.page}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Reveal>
                        <p className={styles.eyebrow}>Энциклопедия аромата</p>
                        <h1 className={styles.title}>{page?.title || 'О парфюмерии'}</h1>
                        <p className={styles.subtitle}>{page?.subtitle || 'Всё что нужно знать о мире ароматов'}</p>
                    </Reveal>
                </div>
                <div className={styles.heroDivider} />
            </section>

            {/* Пирамида нот */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <Reveal>
                        <h2 className={styles.sectionTitle}>Пирамида <em>аромата</em></h2>
                    </Reveal>
                    <div className={styles.pyramidGrid}>
                        {PYRAMID.map((p, i) => (
                            <Reveal key={p.level} delay={i * 150} direction="up">
                                <div className={styles.pyramidCard}>
                                    <span className={styles.pyramidIcon}>{p.icon}</span>
                                    <h3 className={styles.pyramidLevel}>{p.level}</h3>
                                    <p className={styles.pyramidTime}>{p.time}</p>
                                    <p className={styles.pyramidDesc}>{p.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Концентрации */}
            <section className={styles.sectionAlt}>
                <div className={styles.container}>
                    <Reveal>
                        <h2 className={styles.sectionTitle}>Концентрация <em>и стойкость</em></h2>
                    </Reveal>
                    <div className={styles.concGrid}>
                        {CONCENTRATIONS.map((c, i) => (
                            <Reveal key={c.name} delay={i * 100} direction="left">
                                <div className={styles.concCard}>
                                    <div className={styles.concPct}>{c.pct}</div>
                                    <div>
                                        <p className={styles.concName}>{c.name}</p>
                                        <p className={styles.concDesc}>{c.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Тексты из БД */}
            {page?.blocks?.filter(b => b.type === 'quote').map((b, i) => (
                <section key={i} className={styles.quoteSection}>
                    <div className={styles.container}>
                        <Reveal direction="scale">
                            <blockquote className={styles.quote}>
                                <span className={styles.quoteIcon}>❝</span>
                                {b.content}
                            </blockquote>
                        </Reveal>
                    </div>
                </section>
            ))}

        </div>
    )
}