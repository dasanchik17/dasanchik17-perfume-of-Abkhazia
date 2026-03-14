import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import Reveal from '../../components/Reveal/Reveal'

const CATEGORIES = [
    { key: 'female', name: 'Женские', icon: '🌸' },
    { key: 'male',   name: 'Мужские', icon: '🌿' },
    { key: 'unisex', name: 'Унисекс', icon: '✦'  },
    { key: 'new',    name: 'Новинки', icon: '◎'  },
]

const STATS = [
    { value: '200+', label: 'Ароматов' },
    { value: '50+',  label: 'Брендов'  },
    { value: '3 г',  label: 'На рынке' },
]

export default function HomePage() {
    return (
        <div className={styles.page}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroNoise} />

                <Reveal>
                    <div className={styles.heroContent}>
                        <p className={styles.heroEyebrow}>Коллекция 2026</p>
                        <h1 className={styles.heroTitle}>
                            Аромат,<br />
                            <em>рождённый</em> <br/>
                            в Абхазии
                        </h1>
                        <p className={styles.heroSub}>
                            Редкие парфюмерные композиции,<br />
                            вдохновлённые природой Кавказа
                        </p>
                        <div className={styles.heroActions}>
                            <Link to="/catalog" className={styles.btnPrimary}>Перейти в каталог</Link>
                            <Link to="/perfumery" className={styles.btnGhost}>О парфюмерии →</Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal direction="scale" delay={300}>
                    <div className={styles.heroDecor}>
                        <div className={styles.heroOrb} />
                        <div className={styles.heroOrb2} />
                        <div className={styles.heroAr}>عطر</div>
                    </div>
                </Reveal>

                <div className={styles.heroLine}>
                    <span>scroll</span>
                </div>
            </section>

            {/* Категории */}
            <section className={styles.categories}>
                <div className={styles.container}>
                    <Reveal>
                        <h2 className={styles.sectionTitle}>
                            Ароматы по <em>настроению</em>
                        </h2>
                    </Reveal>
                    <div className={styles.categoryGrid}>
                        {CATEGORIES.map((c, i) => (
                            <Reveal key={c.key} delay={i * 100} direction="up">
                                <Link to={`/catalog?category=${c.key}`} className={styles.categoryCard}>
                                    <span className={styles.categoryIcon}>{c.icon}</span>
                                    <span className={styles.categoryName}>{c.name}</span>
                                    <span className={styles.categoryArrow}>→</span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* О магазине */}
            <section className={styles.about}>
                <div className={styles.container}>
                    <div className={styles.aboutGrid}>
                        <Reveal direction="left">
                            <div>
                                <p className={styles.heroEyebrow}>Наша история</p>
                                <h2 className={styles.sectionTitle}>
                                    Парфюмерия<br /><em>с душой</em>
                                </h2>
                                <p className={styles.aboutText}>
                                    Мы собираем лучшие ароматы мировых домов и привозим их в Абхазию.
                                    Каждый флакон — это путешествие: от цветущих альпийских лугов
                                    до восточных базаров.
                                </p>
                                <Link to="/about" className={styles.btnGhost}>Узнать больше →</Link>
                            </div>
                        </Reveal>

                        <Reveal direction="right" delay={200}>
                            <div className={styles.aboutStats}>
                                {STATS.map(s => (
                                    <div key={s.label} className={styles.stat}>
                                        <span className={styles.statNum}>{s.value}</span>
                                        <span className={styles.statLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

        </div>
    )
}