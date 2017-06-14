const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://admin:1234@ds121622.mlab.com:21622/quote' || 'mongodb://localhost:27017/QuoteApp')

 

module.exports = {mongoose}