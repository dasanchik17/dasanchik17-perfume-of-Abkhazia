const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(400).json({ message: 'Email уже зарегистрирован' })
        }


        const user  = await User.create({ name, email, password })


        const token = signToken(user)
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        console.error('❌ Register error:', err.message)
        console.error('❌ Full:', err)
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        console.log('🔑 Login body:', req.body)

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' })
        }

        const token = signToken(user)
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        console.error('❌ Login error:', err.message)
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({ user })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}