import api from '../../api/index'
import useAuthStore from '../../store/authStore'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AuthPage.module.css'

export default function LoginPage() {
    const navigate = useNavigate()

    const [form,    setForm]    = useState({ email: '', password: '' })
    const [errors,  setErrors]  = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const e = {}
        if (!form.email)    e.email    = 'Введите email'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Некорректный email'
        if (!form.password) e.password = 'Введите пароль'
        return e
    }

    const handleChange = (field) => (ev) => {
        setForm(f => ({ ...f, [field]: ev.target.value }))
        setErrors(e => ({ ...e, [field]: '' }))
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', {
                email:    form.email,
                password: form.password,
            })
            useAuthStore.getState().setAuth(data.user, data.token)
            // Небольшая задержка чтобы store успел сохраниться
            setTimeout(() => navigate('/'), 100)
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Ошибка входа' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <span className={styles.logo}>عطر</span>
                    <h1 className={styles.title}>Войти</h1>
                    <p className={styles.sub}>Введите данные вашего аккаунта</p>
                </div>

                <div className={styles.form}>
                    <Field
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={errors.email}
                        placeholder="your@email.com"
                    />
                    <Field
                        label="Пароль"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        error={errors.password}
                        placeholder="••••••••"
                    />

                    {/* ✅ Общая ошибка — здесь, не внутри Field */}
                    {errors.general && (
                        <p className={styles.error}>{errors.general}</p>
                    )}

                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <span className={styles.spinner} /> : 'Войти'}
                    </button>
                </div>

                <p className={styles.switch}>
                    Нет аккаунта?{' '}
                    <Link to="/register" className={styles.switchLink}>Зарегистрироваться</Link>
                </p>

            </div>
        </div>
    )
}

// Field не знает про errors — только про свою одну ошибку через проп error
function Field({ label, type, value, onChange, error, placeholder }) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputWrap}>
                <input
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    type={isPassword && show ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShow(s => !s)}
                    >
                        {show ? '🙈' : '👁'}
                    </button>
                )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}