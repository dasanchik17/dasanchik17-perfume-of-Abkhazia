const Page = require('../models/Page')

exports.getPage = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug })
        if (!page) return res.status(404).json({ message: 'Страница не найдена' })
        res.json({ page })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

exports.upsertPage = async (req, res) => {
    try {
        const page = await Page.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, upsert: true, runValidators: true }
        )
        res.json({ page })
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера', error: err.message })
    }
}