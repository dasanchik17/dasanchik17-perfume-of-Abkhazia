const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Разрешаем запросы без origin (например, мобильные приложения, Postman)
        // Разрешаем localhost в разработке
        // Разрешаем ваш конкретный фронтенд на Vercel
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://dasanchik17-perfume-abkhazia.vercel.app',
            'https://perfume-abkhazia.vercel.app'
        ];

        // Если origin нет в списке разрешённых, но это не браузер (например, запрос от сервера)
        if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
            callback(null, true);
        } else {
            console.log('CORS заблокировал origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}))

// Для отладки - логировать все входящие запросы (можно убрать после отладки)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    next();
});

app.use(express.json())

// Роуты
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/pages',    require('./routes/pages'))

// Проверка что сервер живой
app.get('/api/health', (req, res) => res.json({ ok: true, message: 'Server is running' }))

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