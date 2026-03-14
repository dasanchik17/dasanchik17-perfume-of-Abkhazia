const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    brand:       { type: String, required: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true },
    volume:      { type: [String], default: [] },
    gender:      { type: String, enum: ['муж', 'жен', 'унисекс'], required: true },
    category:    { type: String, required: true },
    image:       { type: String, default: null },
    inStock:     { type: Boolean, default: true },
    isNewProduct:       { type: Boolean, default: false },
    notes: {
        top:   { type: [String], default: [] },
        heart: { type: [String], default: [] },
        base:  { type: [String], default: [] },
    },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)