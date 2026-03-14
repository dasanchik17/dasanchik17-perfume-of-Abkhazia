import { useState, useEffect } from 'react'
import api from '../../api/index'
import styles from './AdminPage.module.css'

const EMPTY_FORM = {
    name: '', brand: '', price: '', gender: 'унисекс',
    category: '', volume: '', inStock: true, isNewProduct: false,
    image: '',
    notes: { top: '', heart: '', base: '' },
    description: '',
}

export default function AdminPage() {
    const [tab,           setTab]           = useState('products')
    const [orders,        setOrders]        = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [products,      setProducts]      = useState([])
    const [loading,       setLoading]       = useState(true)
    const [form,          setForm]          = useState(EMPTY_FORM)
    const [editId,        setEditId]        = useState(null)
    const [showForm,      setShowForm]      = useState(false)
    const [saving,        setSaving]        = useState(false)
    const [error,         setError]         = useState('')

    const [pageSlug,    setPageSlug]    = useState('about')
    const [pageData,    setPageData]    = useState(null)
    const [pageLoading, setPageLoading] = useState(false)
    const [pageSaving,  setPageSaving]  = useState(false)

    const loadPageContent = async (slug) => {
      setPageLoading(true)
      try {
        const { data } = await api.get(`/pages/${slug}`)
        setPageData(data.page)
      } catch {
        setPageData({ slug, title: '', subtitle: '', blocks: [] })
      } finally {
        setPageLoading(false)
      }
    }

    const savePageContent = async () => {
      setPageSaving(true)
      try {
        await api.put(`/pages/${pageData.slug}`, pageData)
        alert('Сохранено!')
      } catch {
        alert('Ошибка сохранения')
      } finally {
        setPageSaving(false)
      }
    }

    const updateBlock = (i, field, value) => {
      setPageData(p => ({
        ...p,
        blocks: p.blocks.map((b, idx) => idx === i ? { ...b, [field]: value } : b)
      }))
    }

    const addBlock = (type) => {
      setPageData(p => ({
        ...p,
        blocks: [...p.blocks, { type, content: '', label: '' }]
      }))
    }

    const removeBlock = (i) => {
      setPageData(p => ({
        ...p,
        blocks: p.blocks.filter((_, idx) => idx !== i)
      }))
    }

    const loadOrders = async () => {
        setOrdersLoading(true)
        try {
            const { data } = await api.get('/orders')
            setOrders(data.orders)
        } catch {
            console.error('Не удалось загрузить заказы')
        } finally {
            setOrdersLoading(false)
        }
    }

    const loadProducts = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/products')
            setProducts(data.products)
        } catch {
            setError('Не удалось загрузить товары')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadProducts() }, [])

    const openCreate = () => {
        setForm(EMPTY_FORM)
        setEditId(null)
        setShowForm(true)
        setError('')
    }

    const openEdit = (product) => {
        setForm({
            name:         product.name,
            brand:        product.brand,
            price:        product.price,
            gender:       product.gender,
            category:     product.category,
            volume:       product.volume.join(', '),
            inStock:      product.inStock,
            isNewProduct: product.isNewProduct,
            image:        product.image || '',
            description:  product.description || '',
            notes: {
                top:   product.notes?.top?.join(', ')   || '',
                heart: product.notes?.heart?.join(', ') || '',
                base:  product.notes?.base?.join(', ')  || '',
            },
        })
        setEditId(product._id)
        setShowForm(true)
        setError('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const closeForm = () => {
        setShowForm(false)
        setEditId(null)
        setForm(EMPTY_FORM)
        setError('')
    }

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm(f => ({ ...f, [field]: value }))
    }

    const handleNoteChange = (noteType) => (e) => {
        setForm(f => ({ ...f, notes: { ...f.notes, [noteType]: e.target.value } }))
    }

    const prepareData = () => ({
        name:         form.name.trim(),
        brand:        form.brand.trim(),
        price:        Number(form.price),
        gender:       form.gender,
        category:     form.category.trim().toLowerCase(),
        volume:       form.volume.split(',').map(v => v.trim()).filter(Boolean),
        inStock:      form.inStock,
        isNewProduct: form.isNewProduct,
        image:        form.image.trim() || null,
        description:  form.description.trim(),
        notes: {
            top:   form.notes.top.split(',').map(n => n.trim()).filter(Boolean),
            heart: form.notes.heart.split(',').map(n => n.trim()).filter(Boolean),
            base:  form.notes.base.split(',').map(n => n.trim()).filter(Boolean),
        },
    })

    const validate = () => {
        if (!form.name.trim())     return 'Введите название'
        if (!form.brand.trim())    return 'Введите бренд'
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            return 'Введите корректную цену'
        if (!form.category.trim()) return 'Введите категорию'
        if (!form.volume.trim())   return 'Введите объём (через запятую)'
        return null
    }

    const handleSave = async () => {
        const validationError = validate()
        if (validationError) { setError(validationError); return }

        setSaving(true)
        setError('')
        try {
            const body = prepareData()
            if (editId) {
                await api.put(`/products/${editId}`, body)
            } else {
                await api.post('/products', body)
            }
            await loadProducts()
            closeForm()
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка сохранения')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Удалить товар «${name}»?`)) return
        try {
            await api.delete(`/products/${id}`)
            setProducts(prev => prev.filter(p => p._id !== id))
        } catch {
            alert('Не удалось удалить товар')
        }
    }

    const handleStatusChange = async (orderId, status) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status })
            setOrders(prev => prev.map(o =>
                o._id === orderId ? { ...o, status } : o
            ))
        } catch {
            alert('Не удалось изменить статус')
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Заголовок */}
                <div className={styles.pageHeader}>
                    <div>
                        <p className={styles.eyebrow}>Управление</p>
                        <h1 className={styles.title}>Админпанель</h1>
                    </div>
                    {tab === 'products' && !showForm && (
                        <button className={styles.addBtn} onClick={openCreate}>
                            + Добавить товар
                        </button>
                    )}
                </div>

                {/* Вкладки */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${tab === 'products' ? styles.tabActive : ''}`}
                        onClick={() => setTab('products')}
                    >
                        Товары ({products.length})
                    </button>
                    <button
                        className={`${styles.tab} ${tab === 'orders' ? styles.tabActive : ''}`}
                        onClick={() => { setTab('orders'); loadOrders() }}
                    >
                        Заказы ({orders.length})
                    </button>
                    <button
  className={`${styles.tab} ${tab === 'pages' ? styles.tabActive : ''}`}
  onClick={() => { setTab('pages'); loadPageContent('about') }}
>
  Страницы
</button>
                </div>

                {/* ===== ВКЛАДКА ТОВАРЫ ===== */}
                {tab === 'products' && (
                    <>
                        {/* Форма */}
                        {showForm && (
                            <div className={styles.formWrap}>
                                <div className={styles.formHeader}>
                                    <h2 className={styles.formTitle}>
                                        {editId ? 'Редактировать товар' : 'Новый товар'}
                                    </h2>
                                    <button className={styles.closeBtn} onClick={closeForm}>✕</button>
                                </div>

                                <div className={styles.formGrid}>
                                    <FormField label="Название *">
                                        <input className={styles.input} value={form.name}
                                               onChange={handleChange('name')} placeholder="Oud Noir" />
                                    </FormField>
                                    <FormField label="Бренд *">
                                        <input className={styles.input} value={form.brand}
                                               onChange={handleChange('brand')} placeholder="Maison Abstrakt" />
                                    </FormField>
                                    <FormField label="Цена (₽) *">
                                        <input className={styles.input} type="number" value={form.price}
                                               onChange={handleChange('price')} placeholder="4200" />
                                    </FormField>
                                    <FormField label="Категория *">
                                        <input className={styles.input} value={form.category}
                                               onChange={handleChange('category')} placeholder="восточные" />
                                    </FormField>
                                    <FormField label="Объём * (через запятую)">
                                        <input className={styles.input} value={form.volume}
                                               onChange={handleChange('volume')} placeholder="30мл, 50мл, 100мл" />
                                    </FormField>
                                    <FormField label="Пол">
                                        <select className={styles.input} value={form.gender}
                                                onChange={handleChange('gender')}>
                                            <option value="муж">Мужской</option>
                                            <option value="жен">Женский</option>
                                            <option value="унисекс">Унисекс</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Ссылка на фото (URL)">
                                        <input className={styles.input} value={form.image}
                                               onChange={handleChange('image')} placeholder="https://..." />
                                    </FormField>
                                    <FormField label="Описание">
                    <textarea className={styles.textarea} value={form.description}
                              onChange={handleChange('description')}
                              placeholder="Краткое описание аромата..." rows={3} />
                                    </FormField>
                                    <FormField label="Верхние ноты (через запятую)">
                                        <input className={styles.input} value={form.notes.top}
                                               onChange={handleNoteChange('top')} placeholder="Бергамот, Шафран" />
                                    </FormField>
                                    <FormField label="Сердечные ноты (через запятую)">
                                        <input className={styles.input} value={form.notes.heart}
                                               onChange={handleNoteChange('heart')} placeholder="Уд, Роза" />
                                    </FormField>
                                    <FormField label="Базовые ноты (через запятую)">
                                        <input className={styles.input} value={form.notes.base}
                                               onChange={handleNoteChange('base')} placeholder="Амбра, Мускус" />
                                    </FormField>
                                </div>

                                <div className={styles.checkboxRow}>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" checked={form.inStock}
                                               onChange={handleChange('inStock')} />
                                        <span>В наличии</span>
                                    </label>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" checked={form.isNewProduct}
                                               onChange={handleChange('isNewProduct')} />
                                        <span>Новинка</span>
                                    </label>
                                </div>

                                {error && <p className={styles.error}>{error}</p>}

                                <div className={styles.formActions}>
                                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                        {saving ? 'Сохраняем...' : editId ? 'Сохранить изменения' : 'Создать товар'}
                                    </button>
                                    <button className={styles.cancelBtn} onClick={closeForm}>Отмена</button>
                                </div>
                            </div>
                        )}

                        {/* Таблица товаров */}
                        {loading
                            ? <div className={styles.stateBox}><div className={styles.spinner} /></div>
                            : (
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Бренд</th>
                                            <th>Цена</th>
                                            <th>Пол</th>
                                            <th>Категория</th>
                                            <th>Наличие</th>
                                            <th>Действия</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map(p => (
                                            <tr key={p._id} className={editId === p._id ? styles.editingRow : ''}>
                                                <td>
                                                    <span className={styles.productName}>{p.name}</span>
                                                    {p.isNewProduct && <span className={styles.newBadge}>new</span>}
                                                </td>
                                                <td className={styles.muted}>{p.brand}</td>
                                                <td>{p.price.toLocaleString('ru')} ₽</td>
                                                <td className={styles.muted}>{p.gender}</td>
                                                <td className={styles.muted}>{p.category}</td>
                                                <td>
                            <span className={p.inStock ? styles.inStock : styles.outStock}>
                              {p.inStock ? 'Да' : 'Нет'}
                            </span>
                                                </td>
                                                <td>
                                                    <div className={styles.rowActions}>
                                                        <button className={styles.editBtn} onClick={() => openEdit(p)}>
                                                            Изменить
                                                        </button>
                                                        <button className={styles.deleteBtn}
                                                                onClick={() => handleDelete(p._id, p.name)}>
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    {products.length === 0 && (
                                        <div className={styles.stateBox}>
                                            <p className={styles.muted}>Товаров пока нет</p>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </>
                )}

                {/* ===== ВКЛАДКА ЗАКАЗЫ ===== */}
                {tab === 'orders' && (
                    <div className={styles.tableWrap}>
                        {ordersLoading
                            ? <div className={styles.stateBox}><div className={styles.spinner} /></div>
                            : (
                                <>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Клиент</th>
                                            <th>Телефон</th>
                                            <th>Позиций</th>
                                            <th>Сумма</th>
                                            <th>Статус</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map(o => (
                                            <tr key={o._id}>
                                                <td className={styles.muted}>
                                                    {new Date(o.createdAt).toLocaleDateString('ru')}
                                                </td>
                                                <td>
                                                    <span>{o.contact?.name}</span><br />
                                                    <span className={styles.muted} style={{ fontSize: '11px' }}>
                              {o.contact?.email}
                            </span>
                                                </td>
                                                <td className={styles.muted}>{o.contact?.phone}</td>
                                                <td className={styles.muted}>{o.items?.length} поз.</td>
                                                <td>{o.total?.toLocaleString('ru')} ₽</td>
                                                <td>
                                                    <select
                                                        className={styles.statusSelect}
                                                        value={o.status}
                                                        onChange={e => handleStatusChange(o._id, e.target.value)}
                                                    >
                                                        <option value="новый">новый</option>
                                                        <option value="в обработке">в обработке</option>
                                                        <option value="выполнен">выполнен</option>
                                                        <option value="отменён">отменён</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    {orders.length === 0 && (
                                        <div className={styles.stateBox}>
                                            <p className={styles.muted}>Заказов пока нет</p>
                                        </div>
                                    )}
                                </>
                            )
                        }
                    </div>
                )}

                {tab === 'pages' && (
  <div className={styles.pagesEditor}>

    {/* Выбор страницы */}
    <div className={styles.pageSelector}>
      {['about', 'perfumery'].map(slug => (
        <button
          key={slug}
          className={`${styles.pageTab} ${pageSlug === slug ? styles.pageTabActive : ''}`}
          onClick={() => { setPageSlug(slug); loadPageContent(slug) }}
        >
          {slug === 'about' ? 'О нас' : 'О парфюмерии'}
        </button>
      ))}
    </div>

    {pageLoading
      ? <div className={styles.stateBox}><div className={styles.spinner} /></div>
      : pageData && (
        <div className={styles.pageForm}>

          <div className={styles.formGrid}>
            <FormField label="Заголовок страницы">
              <input className={styles.input} value={pageData.title}
                onChange={e => setPageData(p => ({ ...p, title: e.target.value }))} />
            </FormField>
            <FormField label="Подзаголовок">
              <input className={styles.input} value={pageData.subtitle}
                onChange={e => setPageData(p => ({ ...p, subtitle: e.target.value }))} />
            </FormField>
          </div>

          <h3 className={styles.blocksTitle}>Блоки контента</h3>

          {pageData.blocks.map((block, i) => (
            <div key={i} className={styles.blockRow}>
              <div className={styles.blockType}>{block.type}</div>
              <div className={styles.blockFields}>
                <textarea
                  className={styles.textarea}
                  value={block.content}
                  rows={block.type === 'text' ? 3 : 1}
                  onChange={e => updateBlock(i, 'content', e.target.value)}
                  placeholder={
                    block.type === 'text'  ? 'Текст параграфа...' :
                    block.type === 'quote' ? 'Цитата...' :
                    'Значение (напр. 200+)'
                  }
                />
                {block.type === 'stat' && (
                  <input
                    className={styles.input}
                    value={block.label}
                    onChange={e => updateBlock(i, 'label', e.target.value)}
                    placeholder="Подпись (напр. Ароматов)"
                    style={{ marginTop: 6 }}
                  />
                )}
              </div>
              <button className={styles.removeBlock} onClick={() => removeBlock(i)}>✕</button>
            </div>
          ))}

          <div className={styles.addBlockRow}>
            <span className={styles.muted}>Добавить блок:</span>
            <button className={styles.addBlockBtn} onClick={() => addBlock('text')}>+ Текст</button>
            <button className={styles.addBlockBtn} onClick={() => addBlock('quote')}>+ Цитата</button>
            <button className={styles.addBlockBtn} onClick={() => addBlock('stat')}>+ Статистика</button>
          </div>

          <button
            className={styles.saveBtn}
            onClick={savePageContent}
            disabled={pageSaving}
            style={{ marginTop: 24 }}
          >
            {pageSaving ? 'Сохраняем...' : 'Сохранить страницу'}
          </button>
        </div>
      )
    }
  </div>
)}

            </div>
        </div>
    )
}

function FormField({ label, children }) {
    return (
        <div className={styles.formField}>
            <label className={styles.formLabel}>{label}</label>
            {children}
        </div>
    )
}