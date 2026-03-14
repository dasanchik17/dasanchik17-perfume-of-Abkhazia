require('dotenv').config()
const mongoose = require('mongoose')
const Page = require('./models/Page')

const pages = [
  {
    slug: 'about',
    title: 'О нас',
    subtitle: 'Мы привозим лучшие ароматы мира в Абхазию',
    blocks: [
      { type: 'text', content: 'Aroma Абхазия — это магазин селективной и нишевой парфюмерии. Мы работаем с 2022 года и за это время собрали коллекцию из более чем 200 ароматов от 50+ мировых брендов.' },
      { type: 'text', content: 'Наша миссия — сделать редкую парфюмерию доступной для жителей Абхазии. Мы работаем напрямую с поставщиками и гарантируем оригинальность каждого флакона.' },
      { type: 'quote', content: 'Аромат — это невидимый наряд, который остаётся в памяти навсегда.' },
      { type: 'stat', content: '200+', label: 'Ароматов в коллекции' },
      { type: 'stat', content: '50+',  label: 'Мировых брендов' },
      { type: 'stat', content: '3 г',  label: 'На рынке Абхазии' },
    ]
  },
  {
    slug: 'perfumery',
    title: 'О парфюмерии',
    subtitle: 'Всё что нужно знать о мире ароматов',
    blocks: [
      { type: 'text', content: 'Парфюмерия — это искусство создания ароматов с помощью натуральных и синтетических компонентов. Каждый аромат состоит из трёх уровней — пирамиды нот.' },
      { type: 'text', content: 'Верхние ноты — первое впечатление, улетают через 15–30 минут. Сердечные ноты — основа аромата, держатся 2–4 часа. Базовые ноты — финальный аккорд, остаётся на коже до 8 часов.' },
      { type: 'quote', content: 'Нишевая парфюмерия — это когда аромат создаётся не для масс, а для тех, кто ищет.' },
      { type: 'text', content: 'Концентрация парфюма влияет на стойкость: Eau de Cologne — 2–5%, Eau de Toilette — 5–15%, Eau de Parfum — 15–20%, Parfum — 20–40%.' },
    ]
  }
]

mongoose.connect(process.env.MONGO_URI).then(async () => {
  for (const p of pages) {
    await Page.findOneAndUpdate({ slug: p.slug }, p, { upsert: true })
    console.log(`✅ Страница "${p.slug}" создана`)
  }
  process.exit(0)
})