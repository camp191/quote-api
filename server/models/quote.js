const mongoose = require('mongoose')

let Quote = mongoose.model('Quote', {
    quote: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = { Quote }