import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/index'
import useCartStore from '../../store/cartStore'
import Reveal from '../../components/Reveal/Reveal'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const addToCart    = useCartStore(s => s.addToCart)

  const [product,    setProduct]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [selectedMl, setSelectedMl] = useState(null)
  const [added,      setAdded]      = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data.product))
      .finally(() => setLoading(false))
  }, [id])

  // После загрузки товара выбираем первый вариант
  useEffect(() => {
    if (product?.mlPrices?.length > 0) {
      setSelectedMl(product.mlPrices[0])
    }
  }, [product])

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  )

  if (!product) return (
    <div className={styles.loading}>
      <p>Товар не найден</p>
    </div>
  )

  const hasMlPrices = product?.mlPrices?.length > 0
  const displayPrice = hasMlPrices
    ? selectedMl?.price
    : product?.price

  const handleAdd = () => {
    addToCart({
      id:     product._id,
      name:   product.name,
      brand:  product.brand,
      price:  hasMlPrices ? selectedMl.price : product.price,
      volume: hasMlPrices ? `${selectedMl.ml} мл` : '',
      qty:    1,
      image:  product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Назад */}
        <button className={styles.back} onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <div className={styles.grid}>

          {/* Фото */}
          <Reveal direction="left">
            <div className={styles.imageWrap}>
              {product.image
                ? <img src={product.image} alt={product.name} className={styles.image} />
                : (
                  <div className={styles.imagePlaceholder}>
                    <span>عطر</span>
                  </div>
                )
              }
              {product.isNewProduct && (
                <span className={styles.badgeNew}>Новинка</span>
              )}
            </div>
          </Reveal>

          {/* Инфо */}
          <Reveal direction="right" delay={100}>
            <div className={styles.info}>

              <p className={styles.brand}>{product.brand}</p>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.gender}>{product.gender}</p>

              {/* Описание */}
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              {/* Калькулятор мл */}
              {hasMlPrices ? (
                <div className={styles.mlSection}>
                  <p className={styles.mlLabel}>Выберите объём</p>

                  <div className={styles.mlVariants}>
                    {product.mlPrices.map((variant, i) => (
                      <button
                        key={i}
                        className={`${styles.mlVariant} ${
                          selectedMl?.ml === variant.ml ? styles.mlVariantActive : ''
                        }`}
                        onClick={() => setSelectedMl(variant)}
                      >
                        <span className={styles.mlVariantMl}>{variant.ml} мл</span>
                        <span className={styles.mlVariantPrice}>
                          {variant.price.toLocaleString('ru')} ₽
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedMl && (
                    <div className={styles.totalPrice}>
                      <span className={styles.totalLabel}>Итого:</span>
                      <span className={styles.totalValue}>
                        {selectedMl.price.toLocaleString('ru')} ₽
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.priceWrap}>
                  <p className={styles.price}>
                    {product.price.toLocaleString('ru')} ₽
                  </p>
                </div>
              )}

              {/* Кнопка */}
              <button
                className={`${styles.addBtn} ${added ? styles.addBtnSuccess : ''}`}
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {!product.inStock
                  ? 'Нет в наличии'
                  : added
                    ? '✓ Добавлено'
                    : 'Добавить в корзину'
                }
              </button>

              {/* Ноты */}
              {(product.notes?.top?.length > 0 ||
                product.notes?.heart?.length > 0 ||
                product.notes?.base?.length > 0) && (
                <div className={styles.notes}>
                  <p className={styles.notesTitle}>Пирамида аромата</p>
                  <div className={styles.notesGrid}>
                    {product.notes?.top?.length > 0 && (
                      <div className={styles.noteRow}>
                        <span className={styles.noteLabel}>Верхние</span>
                        <span className={styles.noteValue}>
                          {product.notes.top.join(', ')}
                        </span>
                      </div>
                    )}
                    {product.notes?.heart?.length > 0 && (
                      <div className={styles.noteRow}>
                        <span className={styles.noteLabel}>Сердце</span>
                        <span className={styles.noteValue}>
                          {product.notes.heart.join(', ')}
                        </span>
                      </div>
                    )}
                    {product.notes?.base?.length > 0 && (
                      <div className={styles.noteRow}>
                        <span className={styles.noteLabel}>База</span>
                        <span className={styles.noteValue}>
                          {product.notes.base.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
