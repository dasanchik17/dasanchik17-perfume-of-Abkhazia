import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../../hooks/useProducts'
import useCartStore from '../../store/cartStore'
import styles from './ProductPage.module.css'

export default function ProductPage() {
    const { id }     = useParams()
    const navigate   = useNavigate()
    const { product, loading, error } = useProduct(id)

    const [selectedVolume, setSelectedVolume] = useState(null)
    const [added,          setAdded]          = useState(false)
    const addItem = useCartStore(s => s.addItem)

    if (loading) return (
        <div className={styles.stateBox}>
            <div className={styles.spinner} />
        </div>
    )

    if (error || !product) return (
        <div className={styles.notFound}>
            <p>Товар не найден</p>
            <Link to="/catalog" className={styles.backLink}>← Вернуться в каталог</Link>
        </div>
    )

    const { _id, name, brand, price, volume, gender,
        category, inStock, isNewProduct, image, notes } = product

    const handleAddToCart = () => {
        if (!selectedVolume) return
        addItem(
            { id: _id, name, brand, price, image },
            selectedVolume
        )
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <nav className={styles.breadcrumb}>
                    <Link to="/">Главная</Link>
                    <span>→</span>
                    <Link to="/catalog">Каталог</Link>
                    <span>→</span>
                    <span>{name}</span>
                </nav>

                <div className={styles.grid}>

                    {/* Фото */}
                    <div className={styles.imageCol}>
                        <div className={styles.imageWrap}>
                            {isNewProduct && <span className={styles.badge}>Новинка</span>}
                            {image
                                ? <img src={image} alt={name} className={styles.image} />
                                : <div className={styles.imagePlaceholder}><span>عطر</span></div>
                            }
                        </div>
                    </div>

                    {/* Инфо */}
                    <div className={styles.infoCol}>
                        <p className={styles.brand}>{brand}</p>
                        <h1 className={styles.name}>{name}</h1>

                        <div className={styles.meta}>
                            <span className={styles.metaTag}>{gender}</span>
                            <span className={styles.metaTag}>{category}</span>
                            {!inStock && <span className={styles.metaTagOut}>Нет в наличии</span>}
                        </div>

                        <p className={styles.price}>{price.toLocaleString('ru')} ₽</p>

                        {/* Объём */}
                        <div className={styles.section}>
                            <p className={styles.sectionLabel}>Объём</p>
                            <div className={styles.volumes}>
                                {volume.map(v => (
                                    <button
                                        key={v}
                                        className={`${styles.volumeBtn} ${selectedVolume === v ? styles.selected : ''}`}
                                        onClick={() => setSelectedVolume(v)}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            {!selectedVolume && <p className={styles.hint}>Выберите объём</p>}
                        </div>

                        <button
                            className={`${styles.addBtn} ${!inStock ? styles.disabled : ''} ${added ? styles.success : ''}`}
                            onClick={handleAddToCart}
                            disabled={!inStock || !selectedVolume}
                        >
                            {added ? '✓ Добавлено в корзину' : !inStock ? 'Нет в наличии' : 'Добавить в корзину'}
                        </button>

                        <button className={styles.backBtn} onClick={() => navigate(-1)}>
                            ← Назад
                        </button>

                        {/* Пирамида нот */}
                        {notes && (
                            <div className={styles.pyramid}>
                                <p className={styles.pyramidTitle}>Пирамида аромата</p>
                                <div className={styles.pyramidLevels}>
                                    {[
                                        { label: 'Верхние ноты',    color: '#c9a96e', items: notes.top   },
                                        { label: 'Сердечные ноты',  color: '#8a6f47', items: notes.heart },
                                        { label: 'Базовые ноты',    color: '#4a3a27', items: notes.base  },
                                    ].map(({ label, color, items }) => (
                                        <div key={label} className={styles.level}>
                                            <div className={styles.levelHeader}>
                                                <span className={styles.levelDot} style={{ background: color }} />
                                                <span className={styles.levelName}>{label}</span>
                                            </div>
                                            <p className={styles.levelNotes}>{items?.join(', ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}