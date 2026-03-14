require('dotenv').config()
const mongoose = require('mongoose')
const Product  = require('./models/Product')

const products = [
    {
        name: 'Oud Noir', brand: 'Maison Abstrakt', price: 4200,
        volume: ['30мл', '50мл', '100мл'], gender: 'унисекс',
        category: 'восточные', inStock: true, isNewProduct: true,
        notes: { top: ['Бергамот', 'Шафран'], heart: ['Уд', 'Роза'], base: ['Амбра', 'Мускус'] }
    },
    {
        name: 'Fleur Blanche', brand: 'Lumière', price: 3600,
        volume: ['50мл', '100мл'], gender: 'жен',
        category: 'цветочные', inStock: true, isNewProduct: false,
        notes: { top: ['Жасмин', 'Груша'], heart: ['Пион', 'Магнолия'], base: ['Сандал', 'Ваниль'] }
    },
    {
        name: 'Cedar & Smoke', brand: 'Nordic Raw', price: 5100,
        volume: ['50мл'], gender: 'муж',
        category: 'древесные', inStock: true, isNewProduct: false,
        notes: { top: ['Кедр', 'Перец'], heart: ['Ветивер', 'Дым'], base: ['Пачули', 'Кожа'] }
    },
    {
        name: 'Rose Sauvage', brand: 'Atelier Sud', price: 3900,
        volume: ['30мл', '50мл', '100мл'], gender: 'жен',
        category: 'цветочные', inStock: false, isNewProduct: false,
        notes: { top: ['Роза', 'Малина'], heart: ['Пион', 'Личи'], base: ['Белый мускус'] }
    },
    {
        name: 'Ambre Nomade', brand: 'Maison Abstrakt', price: 4800,
        volume: ['100мл'], gender: 'унисекс',
        category: 'восточные', inStock: true, isNewProduct: true,
        notes: { top: ['Кардамон', 'Апельсин'], heart: ['Амбра', 'Ладан'], base: ['Сандал', 'Бобы тонка'] }
    },
    {
        name: 'Aqua Kaukazus', brand: 'Local Roots', price: 2900,
        volume: ['50мл', '100мл'], gender: 'муж',
        category: 'свежие', inStock: true, isNewProduct: true,
        notes: { top: ['Морской бриз', 'Лимон'], heart: ['Лаванда', 'Розмарин'], base: ['Дубовый мох', 'Кедр'] }
    },
]

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log('✅ Товары добавлены в базу!')
    process.exit(0)
}).catch(err => {
    console.error('❌ Ошибка:', err.message)
    process.exit(1)
})