import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Header.module.css'

const NAV_LINKS = [
    { to: '/',          label: 'Главная'      },
    { to: '/catalog',   label: 'Каталог'      },
    { to: '/perfumery', label: 'О парфюмерии' },
    { to: '/about',     label: 'О нас'        },
]

export default function Header() {
    const [scrolled,  setScrolled]  = useState(false)
    const [menuOpen,  setMenuOpen]  = useState(false)

    // ✅ Правильно — вызываем totalQty как функцию ПОСЛЕ получения из стора
    const totalQty = useCartStore(s => s.totalQty)
    const qty      = totalQty()

    const user   = useAuthStore(s => s.user)
    const logout = useAuthStore(s => s.logout)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>

                {/* Логотип */}
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoAr}>عطر</span>
                    <span className={styles.logoText}>AROMA<br /><em>Абхазия</em></span>
                </Link>

                {/* Навигация — десктоп */}
                <nav className={styles.nav}>
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Иконки справа */}
                <div className={styles.actions}>

                    {/* Пользователь */}
                    {user
                        ? <div className={styles.userMenu}>
                            <span className={styles.userName}>{user.name}</span>
                            {user.role === 'admin' && (
                                <Link to="/admin" className={styles.adminLink}>Админка</Link>
                            )}
                            <button className={styles.logoutBtn} onClick={logout}>Выйти</button>
                        </div>
                        : <Link to="/login" className={styles.iconBtn} title="Войти">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </Link>
                    }

                    {/* Корзина */}
                    <Link to="/cart" className={styles.iconBtn} title="Корзина">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        {qty > 0 && <span className={styles.cartBadge}>{qty}</span>}
                    </Link>

                    {/* Бургер — мобильный */}
                    <button
                        className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Меню"
                    >
                        <span /><span /><span />
                    </button>

                </div>
            </div>

            {/* Мобильное меню */}
            {menuOpen && (
                <nav className={styles.mobileMenu}>
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `${styles.mobileLink} ${isActive ? styles.active : ''}`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            )}
        </header>
    )
}