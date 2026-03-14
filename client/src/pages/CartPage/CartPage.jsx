import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import styles from './CartPage.module.css'

export default function CartPage() {
    const items        = useCartStore(s => s.items)
    const removeItem   = useCartStore(s => s.removeItem)
    const decreaseItem = useCartStore(s => s.decreaseItem)
    const addItem      = useCartStore(s => s.addItem)
    const clearCart    = useCartStore(s => s.clearCart)
    const total        = useCartStore(s => s.total)

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyIcon}>عطر</p>
                <h2 className={styles.emptyTitle}>Корзина пуста</h2>
                <p className={styles.emptyText}>Добавьте ароматы из каталога</p>
                <Link to="/catalog" className={styles.btnPrimary}>Перейти в каталог</Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Заголовок */}
                <div className={styles.pageHeader}>
                    <div>
                        <p className={styles.eyebrow}>Ваш выбор</p>
                        <h1 className={styles.title}>Корзина</h1>
                    </div>
                    <button className={styles.clearBtn} onClick={clearCart}>
                        Очистить корзину
                    </button>
                </div>

                <div className={styles.grid}>

                    {/* Список товаров */}
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.key} className={styles.item}>

                                {/* Фото */}
                                <div className={styles.itemImage}>
                                    {item.image
                                        ? <img src={item.image} alt={item.name} />
                                        : <span>عطر</span>
                                    }
                                </div>

                                {/* Инфо */}
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemBrand}>{item.brand}</p>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemVolume}>{item.volume}</p>
                                </div>

                                {/* Количество */}
                                <div className={styles.itemQty}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => decreaseItem(item.key)}
                                    >−</button>
                                    <span className={styles.qtyNum}>{item.qty}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => addItem(
                                            { id: item.id, name: item.name, brand: item.brand,
                                                price: item.price, image: item.image },
                                            item.volume
                                        )}
                                    >+</button>
                                </div>

                                {/* Цена */}
                                <div className={styles.itemPrice}>
                                    {(item.price * item.qty).toLocaleString('ru')} ₽
                                </div>

                                {/* Удалить */}
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeItem(item.key)}
                                    title="Удалить"
                                >✕</button>

                            </div>
                        ))}
                    </div>

                    {/* Итого */}
                    <div className={styles.summary}>
                        <p className={styles.summaryTitle}>Итого</p>

                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Товары ({items.reduce((s, i) => s + i.qty, 0)} шт.)</span>
                                <span>{total().toLocaleString('ru')} ₽</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Доставка</span>
                                <span className={styles.free}>Бесплатно</span>
                            </div>
                        </div>

                        <div className={styles.summaryTotal}>
                            <span>К оплате</span>
                            <span>{total().toLocaleString('ru')} ₽</span>
                        </div>

                        <Link to="/order" className={styles.btnPrimary}>
                            Оформить заказ
                        </Link>

                        <Link to="/catalog" className={styles.btnGhost}>
                            ← Продолжить покупки
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}