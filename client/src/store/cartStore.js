import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            // Добавить товар (или увеличить кол-во)
            addItem: (product, volume) => {
                const key = `${product.id}-${volume}`
                const items = get().items
                const existing = items.find(i => i.key === key)

                if (existing) {
                    set({
                        items: items.map(i =>
                            i.key === key ? { ...i, qty: i.qty + 1 } : i
                        )
                    })
                } else {
                    set({
                        items: [...items, {
                            key,
                            id:     product.id,
                            name:   product.name,
                            brand:  product.brand,
                            price:  product.price,
                            image:  product.image,
                            volume,
                            qty: 1,
                        }]
                    })
                }
            },

            // Убрать одну единицу
            decreaseItem: (key) => {
                const items = get().items
                const item = items.find(i => i.key === key)
                if (!item) return
                if (item.qty === 1) {
                    set({ items: items.filter(i => i.key !== key) })
                } else {
                    set({ items: items.map(i => i.key === key ? { ...i, qty: i.qty - 1 } : i) })
                }
            },

            // Удалить позицию полностью
            removeItem: (key) => set({ items: get().items.filter(i => i.key !== key) }),

            // Очистить корзину
            clearCart: () => set({ items: [] }),

            // Итого
            total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

            // Кол-во позиций для бейджа
            totalQty: () => get().items.reduce((sum, i) => sum + i.qty, 0),
        }),
        { name: 'cart' } // сохраняется в localStorage
    )
)

export default useCartStore