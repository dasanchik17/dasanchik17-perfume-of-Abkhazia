const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:    { type: String, required: true },
    brand:   { type: String, required: true },
    price:   { type: Number, required: true },
    volume:  { type: String, required: true },
    qty:     { type: Number, required: true, min: 1 },
})

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items:    { type: [orderItemSchema], required: true },
    total:    { type: Number, required: true },

    // Контактные данные
    contact: {
        name:    { type: String, required: true },
        phone:   { type: String, required: true },
        email:   { type: String, required: true },
        comment: { type: String, default: '' },
    },

    status: {
        type: String,
        enum: ['новый', 'в обработке', 'выполнен', 'отменён'],
        default: 'новый',
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)