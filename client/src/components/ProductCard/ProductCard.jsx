import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
    const { _id, name, brand, price, gender, isNewProduct, inStock, image, volume } = product

    return (
        <Link to={`/catalog/${_id}`} className={styles.card}>
            <div className={styles.badges}>
                {isNewProduct && <span className={styles.badgeNew}>Новинка</span>}
                {!inStock && <span className={styles.badgeOut}>Нет в наличии</span>}
            </div>

            <div className={styles.imageWrap}>
                {image
                    ? <img src={image} alt={name} className={styles.image} />
                    : <div className={styles.imagePlaceholder}>
                        <span>عطر</span>
                    </div>
                }
                <div className={styles.imageOverlay}>
                    <span className={styles.overlayText}>Подробнее</span>
                </div>
            </div>

            <div className={styles.info}>
                <p className={styles.brand}>{brand}</p>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.bottom}>
                    <span className={styles.price}>{price.toLocaleString('ru')} ₽</span>
                    <span className={styles.gender}>{gender}</span>
                </div>
                <div className={styles.volumes}>
                    {volume.map(v => (
                        <span key={v} className={styles.volume}>{v}</span>
                    ))}
                </div>
            </div>
        </Link>
    )
}