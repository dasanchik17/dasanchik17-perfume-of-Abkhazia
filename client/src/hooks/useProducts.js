import { useState, useEffect } from 'react'
import api from '../api/index'

export function useProducts(filters = {}) {
    const [products, setProducts] = useState([])
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            try {
                const params = {}
                if (filters.category && filters.category !== 'все') params.category = filters.category
                if (filters.gender   && filters.gender   !== 'все') params.gender   = filters.gender
                if (filters.search)  params.search = filters.search
                if (filters.sort && filters.sort !== 'default')     params.sort     = filters.sort

                const { data } = await api.get('/products', { params })
                setProducts(data.products)
            } catch (err) {
                setError('Не удалось загрузить товары')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [filters.category, filters.gender, filters.search, filters.sort])

    return { products, loading, error }
}

export function useProduct(id) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState(null)

    useEffect(() => {
        if (!id) return
        const fetchProduct = async () => {
            setLoading(true)
            setError(null)
            try {
                const { data } = await api.get(`/products/${id}`)
                setProduct(data.product)
            } catch (err) {
                setError('Товар не найден')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    return { product, loading, error }
}