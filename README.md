# 🌹 Aroma Абхазия — Интернет-магазин парфюмерии

Интернет-магазин селективной и нишевой парфюмерии с доставкой по Абхазии.

## 🚀 Стек технологий

**Frontend:**
- React + Vite
- react-router-dom
- Zustand (persist)
- Axios
- CSS Modules

**Backend:**
- Node.js + Express 4
- MongoDB + Mongoose
- JWT авторизация
- bcryptjs

**Инфраструктура:**
- MongoDB Atlas
- Vercel (frontend)
- Railway (backend)

## 📁 Структура проекта
```
parfum-abkhazia/
├── client/          # React фронтенд
│   ├── src/
│   │   ├── api/         # axios instance
│   │   ├── components/  # переиспользуемые компоненты
│   │   ├── hooks/       # кастомные хуки
│   │   ├── pages/       # страницы
│   │   └── store/       # zustand сторы
└── server/          # Express бэкенд
    ├── controllers/ # логика обработки запросов
    ├── middleware/  # JWT и admin проверки
    ├── models/      # mongoose модели
    └── routes/      # API маршруты
```

## ⚙️ Запуск локально

**Бэкенд:**
```bash
cd server
npm install
node index.js
```

**Фронтенд:**
```bash
cd client
npm install
npm run dev
```

## 🔑 Переменные окружения

Создай `server/.env` по образцу `server/.env.example`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## 📱 Функционал

- 🛍️ Каталог с фильтрами (поиск, категория, пол, сортировка)
- 🛒 Корзина с сохранением в localStorage
- 📦 Оформление заказов
- 👤 Регистрация и авторизация
- 🔐 Админпанель (товары, заказы, контент страниц)
- ✨ Анимации: частицы, parallax, text scramble, scroll reveal
- 📱 Адаптивный дизайн

## 👨‍💻 Разработка

Ветки:
- `main` — стабильный продакшн
- `develop` — основная разработка
- `feature/*` — новый функционал
- `fix/*` — исправления багов