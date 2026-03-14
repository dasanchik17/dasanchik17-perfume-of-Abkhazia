const Order = require('../models/Order')

// POST /api/orders — создать заказ
exports.create = async (req, res) => {
    try {
        const { items, total, contact } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста' })
        }

        const order = await Order.create({
            user: req.user.id,
            items,
            total,
            contact,
        })

        res.status(201).json({ order })
    } catch (err) {
        console.error('Order create error:', err.message)
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}

// GET /api/orders/my — мои заказы
exports.getMy = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
        res.json({ orders })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

// GET /api/orders — все заказы (только admin)
exports.getAll = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
        res.json({ orders })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

// PATCH /api/orders/:id/status — сменить статус (только admin)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!order) return res.status(404).json({ message: 'Заказ не найден' })
        res.json({ order })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}