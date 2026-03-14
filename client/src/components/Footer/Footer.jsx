import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const CONTACTS = {
    phone:    '+7 (940) 000-00-00',
    email:    'aroma.abkhazia@gmail.com',
    instagram:'@aroma_abkhazia',
    telegram: '@aroma_abkhazia',
    address:  'Абхазия, г. Сухум, ул. Примерная, 1',
    ip:       'ИП Иванов Иван Иванович, ИНН 123456789012',
}

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <div className={styles.container}>
                    <div className={styles.grid}>

                        {/* Бренд */}
                        <div className={styles.brand}>
                            <div className={styles.brandLogo}>
                                <span className={styles.logoAr}>عطر</span>
                                <div>
                                    <p className={styles.logoName}>AROMA</p>
                                    <p className={styles.logoSub}>Абхазия</p>
                                </div>
                            </div>
                            <p className={styles.brandDesc}>
                                Редкие парфюмерные композиции,<br />
                                вдохновлённые природой Кавказа
                            </p>
                        </div>

                        {/* Навигация */}
                        <div className={styles.nav}>
                            <p className={styles.navTitle}>Навигация</p>
                            <Link to="/catalog">Каталог</Link>
                            <Link to="/perfumery">О парфюмерии</Link>
                            <Link to="/about">О нас</Link>
                            <Link to="/cart">Корзина</Link>
                        </div>

                        {/* Контакты */}
                        <div className={styles.contacts}>
                            <p className={styles.navTitle}>Контакты</p>
                            <a href={`tel:${CONTACTS.phone}`} className={styles.contactItem}>
                                <span className={styles.contactIcon}>📞</span>
                                {CONTACTS.phone}
                            </a>
                            <a href={`mailto:${CONTACTS.email}`} className={styles.contactItem}>
                                <span className={styles.contactIcon}>✉️</span>
                                {CONTACTS.email}
                            </a>
                            <a href={`https://instagram.com/${CONTACTS.instagram.slice(1)}`}
                               target="_blank" rel="noreferrer" className={styles.contactItem}>
                                <span className={styles.contactIcon}>📷</span>
                                {CONTACTS.instagram}
                            </a>
                            <a href={`https://t.me/${CONTACTS.telegram.slice(1)}`}
                               target="_blank" rel="noreferrer" className={styles.contactItem}>
                                <span className={styles.contactIcon}>✈️</span>
                                {CONTACTS.telegram}
                            </a>
                        </div>

                        {/* Адрес */}
                        <div className={styles.address}>
                            <p className={styles.navTitle}>Адрес</p>
                            <p className={styles.addressText}>
                                <span className={styles.contactIcon}>📍</span>
                                {CONTACTS.address}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Нижняя полоска */}
            <div className={styles.bottom}>
                <div className={styles.container}>
                    <p className={styles.ip}>{CONTACTS.ip}</p>
                    <p className={styles.copy}>© {new Date().getFullYear()} Aroma Абхазия. Все права защищены.</p>
                </div>
            </div>
        </footer>
    )
}