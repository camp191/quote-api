const mongoose = require('mongoose')

let Quote = mongoose.model('Quote', {
    quote: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    quoteBy: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        default: 'Anonymous'
    },
    type: {
        type: String,
        required: true
    },
    postAt: {
        type: Number
    }
})

module.exports = { Quote }