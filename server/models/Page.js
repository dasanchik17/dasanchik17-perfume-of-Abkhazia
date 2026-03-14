const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
    slug:    { type: String, required: true, unique: true }, // 'about' | 'perfumery'
    title:   { type: String, required: true },
    subtitle:{ type: String, default: '' },
    blocks:  [
        {
            type:    { type: String, enum: ['text', 'stat', 'quote'] },
            content: { type: String, default: '' },
            label:   { type: String, default: '' },
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('Page', pageSchema)