import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import api from '../../api/index'
import styles from './OrderPage.module.css'

export default function OrderPage() {
    const navigate  = useNavigate()
    const items     = useCartStore(s => s.items)
    const total     = useCartStore(s => s.total)
    const clearCart = useCartStore(s => s.clearCart)
    const user      = useAuthStore(s => s.user)

    const [form, setForm] = useState({
        name:    user?.name || '',
        phone:   '',
        email:   user?.email || '',
        comment: '',
    })
    const [errors,  setErrors]  = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Если корзина пуста
    if (items.length === 0 && !success) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyIcon}>عطر</p>
                <h2 className={styles.emptyTitle}>Корзина пуста</h2>
                <Link to="/catalog" className={styles.btnPrimary}>Перейти в каталог</Link>
            </div>
        )
    }

    // Если не залогинен
    if (!user) {
        return (
            <div className={styles.empty}>
                <h2 className={styles.emptyTitle}>Войдите чтобы оформить заказ</h2>
                <Link to="/login" className={styles.btnPrimary}>Войти</Link>
            </div>
        )
    }

    const validate = () => {
        const e = {}
        if (!form.name.trim())  e.name  = 'Введите имя'
        if (!form.phone.trim()) e.phone = 'Введите телефон'
        if (!form.email.trim()) e.email = 'Введите email'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Некорректный email'
        return e
    }

    const handleChange = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }))
        setErrors(er => ({ ...er, [field]: '' }))
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setLoading(true)
        try {
            await api.post('/orders', {
                items: items.map(i => ({
                    product: i.id,
                    name:    i.name,
                    brand:   i.brand,
                    price:   i.price,
                    volume:  i.volume,
                    qty:     i.qty,
                })),
                total:   total(),
                contact: form,
            })
            clearCart()
            setSuccess(true)
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Ошибка оформления заказа' })
        } finally {
            setLoading(false)
        }
    }

    // Успешное оформление
    if (success) {
        return (
            <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>Заказ оформлен!</h2>
                <p className={styles.successText}>
                    Мы свяжемся с вами по телефону или email для подтверждения.
                </p>
                <div className={styles.successActions}>
                    <Link to="/catalog" className={styles.btnPrimary}>Продолжить покупки</Link>
                    <Link to="/" className={styles.btnGhost}>На главную</Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.pageHeader}>
                    <p className={styles.eyebrow}>Последний шаг</p>
                    <h1 className={styles.title}>Оформление заказа</h1>
                </div>

                <div className={styles.grid}>

                    {/* Форма */}
                    <div className={styles.formCol}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Контактные данные</h2>

                            <div className={styles.fields}>
                                <Field label="Имя *" value={form.name}
                                       onChange={handleChange('name')} error={errors.name}
                                       placeholder="Ваше имя" />
                                <Field label="Телефон *" value={form.phone}
                                       onChange={handleChange('phone')} error={errors.phone}
                                       placeholder="+7 (999) 000-00-00" />
                                <Field label="Email *" value={form.email}
                                       onChange={handleChange('email')} error={errors.email}
                                       placeholder="your@email.com" />
                                <div className={styles.field}>
                                    <label className={styles.label}>Комментарий к заказу</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={form.comment}
                                        onChange={handleChange('comment')}
                                        placeholder="Пожелания, удобное время для звонка..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.notice}>
                            <p>💬 Оплата при получении — менеджер свяжется с вами для подтверждения заказа.</p>
                        </div>

                        {errors.general && <p className={styles.error}>{errors.general}</p>}

                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <span className={styles.spinner} /> : 'Подтвердить заказ'}
                        </button>
                    </div>

                    {/* Сводка заказа */}
                    <div className={styles.summaryCol}>
                        <h2 className={styles.sectionTitle}>Ваш заказ</h2>
                        <div className={styles.orderItems}>
                            {items.map(item => (
                                <div key={item.key} className={styles.orderItem}>
                                    <div className={styles.orderItemImage}>
                                        {item.image
                                            ? <img src={item.image} alt={item.name} />
                                            : <span>عطر</span>
                                        }
                                    </div>
                                    <div className={styles.orderItemInfo}>
                                        <p className={styles.orderItemBrand}>{item.brand}</p>
                                        <p className={styles.orderItemName}>{item.name}</p>
                                        <p className={styles.orderItemMeta}>{item.volume} · {item.qty} шт.</p>
                                    </div>
                                    <p className={styles.orderItemPrice}>
                                        {(item.price * item.qty).toLocaleString('ru')} ₽
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderTotal}>
                            <span>Итого</span>
                            <span className={styles.totalPrice}>{total().toLocaleString('ru')} ₽</span>
                        </div>

                        <Link to="/cart" className={styles.editCart}>← Изменить корзину</Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

function Field({ label, value, onChange, error, placeholder }) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}