const Product = require('../models/Product')

// GET /api/products
exports.getAll = async (req, res) => {
    try {
        const { category, gender, search, sort } = req.query
        const filter = {}

        if (category && category !== 'все') filter.category = category
        if (gender   && gender   !== 'все') filter.gender   = gender
        if (search) {
            filter.$or = [
                { name:  { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ]
        }

        let query = Product.find(filter)

        if (sort === 'price-asc')  query = query.sort({ price:  1 })
        if (sort === 'price-desc') query = query.sort({ price: -1 })
        if (sort === 'new')        query = query.sort({ isNew: -1 })

        const products = await query.exec()
        res.json({ products })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}

// GET /api/products/:id
exports.getOne = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Товар не найден' })
        res.json({ product })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

// POST /api/products  (только admin)
exports.create = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ product })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}

// PUT /api/products/:id  (только admin)
exports.update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!product) return res.status(404).json({ message: 'Товар не найден' })
        res.json({ product })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

// DELETE /api/products/:id  (только admin)
exports.remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: 'Товар не найден' })
        res.json({ message: 'Товар удалён' })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}