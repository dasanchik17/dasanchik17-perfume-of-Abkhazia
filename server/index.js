const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Разрешаем любой localhost в режиме разработки
        if (!origin || origin.includes('localhost')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(express.json())

// Роуты
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/pages', require('./routes/pages'))

// Проверка что сервер живой
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Подключение к MongoDB и запуск
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB подключена')
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Сервер запущен на порту ${process.env.PORT}`)
        )
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к MongoDB:', err.message)
        process.exit(1)
    })