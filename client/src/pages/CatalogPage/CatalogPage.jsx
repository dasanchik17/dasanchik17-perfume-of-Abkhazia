import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './CatalogPage.module.css'

const CATEGORIES = ['все', 'цветочные', 'восточные', 'древесные', 'свежие']
const GENDERS    = ['все', 'муж', 'жен', 'унисекс']

export default function CatalogPage() {
    const [search,   setSearch]   = useState('')
    const [category, setCategory] = useState('все')
    const [gender,   setGender]   = useState('все')
    const [sort,     setSort]     = useState('default')

    // Загружаем с сервера
    const { products, loading, error } = useProducts({ search, category, gender, sort })

    const resetFilters = () => {
        setSearch(''); setCategory('все'); setGender('все'); setSort('default')
    }

    const hasFilters = search || category !== 'все' || gender !== 'все'

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Заголовок */}
                <div className={styles.pageHeader}>
                    <div>
                        <p className={styles.eyebrow}>Весь ассортимент</p>
                        <h1 className={styles.title}>Каталог</h1>
                    </div>
                    {!loading && (
                        <p className={styles.count}>{products.length} ароматов</p>
                    )}
                </div>

                {/* Фильтры */}
                <div className={styles.filters}>
                    <div className={styles.searchWrap}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            className={styles.search}
                            type="text"
                            placeholder="Поиск по названию или бренду..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
                        )}
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Тип:</span>
                        <div className={styles.filterBtns}>
                            {CATEGORIES.map(c => (
                                <button
                                    key={c}
                                    className={`${styles.filterBtn} ${category === c ? styles.active : ''}`}
                                    onClick={() => setCategory(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Для:</span>
                        <div className={styles.filterBtns}>
                            {GENDERS.map(g => (
                                <button
                                    key={g}
                                    className={`${styles.filterBtn} ${gender === g ? styles.active : ''}`}
                                    onClick={() => setGender(g)}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sortRow}>
                        <select
                            className={styles.select}
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            <option value="default">По умолчанию</option>
                            <option value="price-asc">Сначала дешевле</option>
                            <option value="price-desc">Сначала дороже</option>
                            <option value="new">Сначала новинки</option>
                        </select>
                        {hasFilters && (
                            <button className={styles.resetBtn} onClick={resetFilters}>
                                Сбросить фильтры
                            </button>
                        )}
                    </div>
                </div>

                {/* Состояния загрузки / ошибки / пусто */}
                {loading && (
                    <div className={styles.stateBox}>
                        <div className={styles.spinner} />
                        <p>Загружаем ароматы...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className={styles.stateBox}>
                        <p className={styles.errorText}>{error}</p>
                        <p className={styles.errorSub}>Проверьте что сервер запущен на порту 5000</p>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className={styles.empty}>
                        <p>Ничего не найдено</p>
                        <button className={styles.resetBtn} onClick={resetFilters}>
                            Сбросить фильтры
                        </button>
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className={styles.grid}>
                        {products.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}

            </div>
        </div>
    )
}